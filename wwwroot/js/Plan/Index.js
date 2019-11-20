
$(document).ready(function () {
    window.webFn.planFn = {
        //<-- get initial data from server.
        getAsync: function () {
            return new Promise(function (resolve, reject) {
                if (window.webFn.plans)
                    resolve(window.webFn.plans)
                else
                    $.ajax({
                        url: SV.host + 'plan/getPlans',
                        success: function (response) {
                            window.webFn.plans = response;
                            resolve(response);
                        }
                    });
            });
        },
        activeMenu: function () {
            oak.activemenu({
                buttons: '.content-sub-menu label',
                activecss: 'active'
            });
        },
        addInputEvent: function () {

            $(chkOnlyActive).checkboxes({
                source: [{ text: 'แสดงเฉพาะแผนประกันที่ยังขายอยู่' }],
                onchange: function () {
                    window.webFn.planFn.ddlPlanSearch();
                    $(ddlFindPlans).trigger('focus');
                }
            });

            $(btnClearPlanSearch).on('click', function () {
                ddlFindPlans.value = '';
                var e = jQuery.Event("keydown", { keyCode: 20 });
                $(ddlFindPlans).trigger(e);
                window.webFn.planFn.reset();
            });



        },
        //<-- set data and "change event" to searching plan ddl(the large DDL top of page)
        ddlPlanSearch: function (data) {
            if (!data)
                data = window.webFn.plans;

            if ($(chkOnlyActive).checkboxes('get').all[0].checked) {
                data = data.filter(function (item) {
                    return item.planShortNameTh.indexOf('error_msg') === -1;
                });
            };

            $(ddlFindPlans)
                .dropdown({
                    source: data,
                    height: '500px',
                    width: '563px',
                    groupby: 'prodGrpNameTh',
                    fixposition: true
                })
                .on('change', function (e) {
                    if (e.bubbles) return;

                    divContent.style.display = '';
                    window.webFn.planFn.reset();
                    window.webFn.planFn.divPdfViewer();
                    window.webFn.planFn.divCommRate.prototype.renderGridAndInput();
                });
        },
        //<-- display PNG/PDF when chosen item in searching plan ddl 
        //<-- menu ข้อมูลแบบประกัน
        divPdfViewer: function () {
            this.render = function () {
                window.webFn.planFn.divPdfViewer.prototype.getPlanDocsAsync().then(function (response) {
                    if (!response || !response.docFile)
                        return $(divPdfViewer).empty().append(sharedFn.warningBox());

                    var content;
                    var getFileExtension = function (response) {
                        return response.docFile.split('.').pop();
                    }(response);

                    response.docFile = encodeURI(response.docFile);
                    response.docFile = response.docFile.replace('+', '@@_push_@@')

                    if (getFileExtension == "pdf")
                        content = '<embed id="ifrPdfviewer" class="pdf-inline" src="' + SV.host + 'Plan/DownloadDocByPlanCode?filename=' + response.docFile + '#toolbar=0"/>';
                    else
                        content = '<img id="ifrPdfviewer"  class="pdf-inline" src="' + SV.host + 'Plan/DownloadDocByPlanCode?filename=' + response.docFile + '"/>';


                    lblPdffullscr.style.display = '';
                    var contaninerHeight = divContainer.getBoundingClientRect().height;
                    var contentHeight = 225;
                    var pdfHeight = contaninerHeight - contentHeight;

                    $(divPdfViewer).empty().append(content);

                    ifrPdfviewer.style.height = getFileExtension != "pdf" ? "auto" : pdfHeight + 'px';

                    $(lblPdffullscr).off('click').on('click', function () {
                        window.open(SV.host + 'Plan/DownloadDocByPlanCode?filename=' + response.docFile, '_blank');
                    });


                });
            };
            this.divPdfViewer.prototype.getPlanDocsAsync = function () {
                return new Promise(function (resolve) {
                    if (!ddlFindPlans.dataset.myvalue)
                        // if (!ddlFindPlans.value)
                        return resolve();

                    $.ajax({
                        url: SV.host + "plan/GetFileNameByPlanCode",
                        data: { planCode: ddlFindPlans.dataset.myvalue },
                        // data: { planCode: ddlFindPlans.value },
                        success: function (response) {
                            resolve(response)
                        }
                    });
                });
            };

            this.render();
        },
        //<-- display data grid when chosen item in searching plan ddl and fill txtPovAge ,ddlPovGender ,txtEndYear
        //<-- ตารางมูลค่ากรมธรรม์
        divPolicyValue: function () {
            this.setupInputs = function () {
                var renderGrid = this.renderGrid;
                var male = function () {
                    var i = $('<i>').addClass('fas fa-male pr-2').css('color', '#f1af1f');
                    var label = $('<label> ชาย</label>');

                    label.prepend(i);
                    return label[0].outerHTML;
                };
                var female = function () {
                    var i = $('<i>').addClass('fas fa-female pr-2').css('color', 'rgb(68, 144, 206)');
                    var label = $('<label> หญิง</label>');

                    label.prepend(i);
                    return label[0].outerHTML;
                };

                $(txtPovAge).on('input', renderGrid);
                $(txtPovAge).on('keyup', function (e) { e.which === 13 && this.blur() });

                $(ddlPovGender).dropdown({
                    source: [{ value: 'M', text: male() }, { value: 'F', text: female() }],
                    placeholder: '',
                    showsearchbox: false,
                    fixposition: true

                }).on('change', function () { renderGrid({ ignoreGetDataFromSV: true }) });

                $(txtEndYear).on('input', function () {
                    renderGrid({ ignoreGetDataFromSV: true })
                });
                $(txtEndYear).on('keyup', function (e) { e.which === 13 && this.blur() });
            }
            this.renderGrid = function (args) {
                window.webFn.planFn.divPolicyValue.prototype.getCVRateAsync(args).then(function (response) {

                    response = response.filter(function (item) {
                        return item.insuresex === ddlPovGender.value;
                    });

                    if (txtEndYear.value) {
                        var endYearInt = parseInt(txtEndYear.value);
                        response = response.filter(function (item) { return item.endyear === endYearInt });
                    }

                    $(divPolicyValue).grid({
                        source: response,
                        hideinternalsearch: true,
                        gridcss: 'align-s-start',
                        fields: [{
                            fieldname: 'insuresex', css: 'p-0', itemTemplate: function (value) {
                                return $('<i class="pl-4">')
                                    .addClass(value === 'M' ? 'fas fa-male' : 'fas fa-female')
                                    .css('color', value === 'M' ? '#f1af1f' : 'rgb(68, 144, 206)')
                                    .css('font-size', '1.7rem');
                            }
                        }],
                    });
                });

            };
            this.divPolicyValue.prototype.getCVRateAsync = function (args) {
                args = args || {};

                return new Promise(function (resolve) {
                    if (!ddlFindPlans.dataset.myvalue || txtPovAge.value == '' || args.ignoreGetDataFromSV)
                        return resolve(divPolicyValue.data);

                    $.ajax({
                        url: SV.host + "plan/getCVRate",
                        contentType: 'application/json',
                        data: {
                            prdplan: ddlFindPlans.dataset.myvalue,
                            insureage: parseInt(txtPovAge.value)
                        },
                        success: function (response) {
                            divPolicyValue.data = response;
                            return resolve(response)
                        }
                    });
                });
            };
            this.setupInputs();
        },
        //<-- display data grid when chosen item in searching plan ddl
        //<-- ตารางมูลค่าคอมมิชชั่น
        divCommRate: function () {
            this.divCommRate.prototype.renderGridAndInput = function (args) {
                window.webFn.planFn.divCommRate.prototype.getCommRateAsync(args).then(function (response) {
                    //    var data = divCommRate.data;
                    //var filterByInput = function () {
                    //    var suma = txtSumAssured.value;
                    //    var entry = txtEntryAge.value;
                    //    var year = txtTotalYear.value;

                    //    if (suma !== '')
                    //        data = data.filter(function (item) {
                    //            return item['ทุนประกันภัย'] == suma
                    //        });

                    //    if (entry !== '')
                    //        data = data.filter(function (item) {
                    //            return item['อายุผู้เอาประกัน'] == entry
                    //        });

                    //    if (year !== '')
                    //        data = data.filter(function (item) {
                    //            return item['ระยะชำระเบี้ย(ปี)'] == year
                    //        });

                    //};
                    //var renderGrid = function () {
                    //    //<-- add data to Grid --<<                    
                    //    $(divCommRate).grid({
                    //        source: data,
                    //        hideinternalsearch: true,
                    //        gridcss: 'align-s-start',
                    //        fields: [{
                    //            fieldname: 'รหัสแบบประกันภัย', hide: true
                    //        },
                    //        {
                    //            fieldname: 'ทุนประกันภัย', width: 150
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 1', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 2', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 3', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 4', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 5', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 6', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 7', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 8', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 9', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 10', width: 70
                    //        },
                    //        {
                    //            fieldname: 'ปีที่ 11+', width: 70
                    //        },]
                    //    });
                    //};
                    var isEmptyData = function () {
                        if (!response || !response.length) {
                            $(divCommRate).empty().append(sharedFn.warningBox());
                            return true;
                        }

                    };

                    if (isEmptyData())
                        return;

                    //<-- add unique data to input autocomplete (sumAssured) --<<
                    var sumAssured = response.map(function (item) {
                        return item['ทุนประกันภัย']
                    });
                    var uniqueSumAssured = sumAssured.filter(function (item, i, ar) {
                        return ar.indexOf(item) === i;
                    });
                    uniqueSumAssured.push("-- ทั้งหมด --");


                    $(txtSumAssured).dropdown({
                        source: uniqueSumAssured,
                        fixposition: true,
                        showsearchbox: false,
                        value: '-- ทั้งหมด --'
                    });

                    //<-- add unique data to input autocomplete (entryAge) --<<
                    var entryAge = response.map(function (item) {
                        return item['อายุผู้เอาประกัน'];
                    });
                    var uniqueEntryAge = entryAge.filter(function (item, i, ar) {
                        return ar.indexOf(item) === i
                    });
                    uniqueEntryAge.push("-- ทั้งหมด --");
                    $(txtEntryAge).dropdown({
                        source: uniqueEntryAge,
                        fixposition: true,
                        showsearchbox: false,
                        value: '-- ทั้งหมด --'
                    });


                    //<-- add unique data to input autocomplete (totalYear) --<<
                    var totalYear = response.map(function (item) {
                        return item['ระยะชำระเบี้ย(ปี)'];
                    });
                    var uniqueTotalYear = totalYear.filter(function (item, i, ar) {
                        return ar.indexOf(item) === i
                    });
                    uniqueTotalYear.push("-- ทั้งหมด --");
                    $(txtTotalYear).dropdown({
                        source: uniqueTotalYear,
                        fixposition: true,
                        showsearchbox: false,
                        value: '-- ทั้งหมด --'
                    });



                    //<-- add data to Grid --<<
                    //filterByInput();
                    window.webFn.planFn.divCommRate.prototype.renderGrid();
                });
            };
            this.divCommRate.prototype.getCommRateAsync = function (args) {
                args = args || {};

                return new Promise(function (resolve) {
                    if (!ddlFindPlans.dataset.myvalue || args.ignoreGetDataFromSV)
                        return resolve(divCommRate.data);

                    $.ajax({
                        url: SV.host + "plan/GetCommRate",
                        data: { planCode: ddlFindPlans.dataset.myvalue },
                        success: function (response) {
                            divCommRate.data = response;
                            return resolve(response)
                        }
                    });
                });
            };
            this.divCommRate.prototype.renderGrid = function () {
                var data = divCommRate.data;
                var suma = txtSumAssured.value;
                var entry = txtEntryAge.value;
                var year = txtTotalYear.value;

                if (suma !== '-- ทั้งหมด --')
                    data = data.filter(function (item) {
                        return item['ทุนประกันภัย'] == suma
                    });

                if (entry !== '-- ทั้งหมด --')
                    data = data.filter(function (item) {
                        return item['อายุผู้เอาประกัน'] == entry
                    });

                if (year !== '-- ทั้งหมด --')
                    data = data.filter(function (item) {
                        return item['ระยะชำระเบี้ย(ปี)'] == year
                    });
                //<-- add data to Grid --<<                    
                $(divCommRate).grid({
                    source: data,
                    hideinternalsearch: true,
                    gridcss: 'align-s-start',
                    fields: [{
                        fieldname: 'รหัสแบบประกันภัย', hide: true
                    },
                    {
                        fieldname: 'ทุนประกันภัย', width: 150
                    },
                    {
                        fieldname: 'ปีที่ 1', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 2', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 3', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 4', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 5', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 6', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 7', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 8', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 9', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 10', width: 70
                    },
                    {
                        fieldname: 'ปีที่ 11+', width: 70
                    },]
                });
            };
            this.setupInputs = function () {
                $('#txtSumAssured,#txtEntryAge,#txtTotalYear').on('change', function () {
                    window.webFn.planFn.divCommRate.prototype.renderGrid();
                    // window.webFn.planFn.divCommRate.prototype.renderGridAndInput({ ignoreGetDataFromSV: true });
                });



                //$('#txtSumAssured,#txtEntryAge,#txtTotalYear').on('keyup', function () {
                //    e.which === 13 && this.blur();
                //});

            };

            this.setupInputs();
        },
        //<-- Reset all elements's value, This will active before user chosen another one item in searching plan DDL       
        reset: function () {
            divPdfViewer.innerHTML = '';
            divPolicyValue.innerHTML = '';
            divPdfViewer.innerHTML = '';
            divCommRate.innerHTML = '';

            txtPovAge.value = '';
            ddlPovGender.value = '';
            txtSumAssured.value = '';
            txtEntryAge.value = '';
            txtTotalYear.value = '';
        },
        //<-- Lanuch first fo all ,When page stared.
        launch: function () {
            this.getAsync().then(function (response) {
                window.webFn.planFn.activeMenu();
                window.webFn.planFn.addInputEvent();
                window.webFn.planFn.ddlPlanSearch(response);
                window.webFn.planFn.divPolicyValue();
                window.webFn.planFn.divCommRate();
            });


        }
    }
});

