$(document).ready(function () {

    window.webFn.uploaddataFn = {
        activeMenu: function () {
            oak.activemenu({
                buttons: '.content-sub-menu label',
                activecss: 'active'
            });
        },
        commRate: function () {
            this.setupButton = function () {
                updCommRate.addEventListener('click', function () {
                    oak.excelimport({
                        importto: 'uploadData/UploadCommRate',
                        onsuccess: function (resp) {
                            $(divCommValidateResult).grid({
                                source: resp,
                                excelbutton: true,
                                gridcss: 'align-s-start',
                                fields: [{
                                    fieldname: 'import Result', width: 250, css: 'error_label'
                                }, {
                                    fieldname: 'runNumber', hide: true
                                }]
                            });
                        },
                        onerror: function () {
                            oak.minidialog({ value: oakdef.import_error, icon: 'error' });
                        }
                    });

                });
                btnComRateTemplate.addEventListener('click', function () {
                    oak.ajaxget.redirect({
                        url: SV.host + 'uploadData/DownloadCommRate',
                        isTemplate: true
                    });
                });
                btnComRateDownload.addEventListener('click', function () {
                    oak.ajaxget.redirect({
                        url: SV.host + 'uploadData/DownloadCommRate'
                    });
                });
            }
            this.setupButton();
        },
        planInfo: function () {
            this.setupInput = function () {
                var fileNameValidation = function (item) {
                    var isPass = true;

                    if (item.files[0].type !== 'application/pdf') {
                        oak.minidialog({ icon: 'error', value: 'อัพโหลดได้เฉพาะไฟล์ PDF เท่านั้น' });
                        isPass = false;
                    };

                    if (!item.files[0].name.includes('_')) {
                        oak.minidialog({ icon: 'error', value: 'ชื่อไฟล์ไม่ถูกต้อง' });
                        isPass = false;
                    } else if (item.files[0].name.split('_')[0].length === 0) {
                        oak.minidialog({ icon: 'error', value: 'ชื่อไฟล์ไม่ถูกต้อง' });
                        isPass = false;
                    };

                    return isPass;
                };
                var upload = function (item) {
                    var formdata = new FormData();
                    var filename = item.files[0].name;
                    formdata.append('file', item.files[0]);
                    $.ajax({
                        url: SV.host + 'uploaddata/UploadPlanDocs',
                        data: formdata,
                        contentType: false,
                        processData: false,
                        method: 'POST',
                        success: function (response) {

                            oak.minidialog({ value: 'อัพโหลดไฟล์ ' + filename + ' สำเร็จ', icon: 'success' });
                            $(divPlanDocsList).grid({
                                source: response,
                                paging: false,
                                excelbutton: true,
                                fields: [{
                                    fieldname: 'ชื่อไฟล์', width: 500, itemTemplate: function (value) {
                                        var div = $('<div>');
                                        var i = $('<i>').addClass('fas fa-folder-open mr10');
                                        return div.append(i).append(value);
                                    }
                                },
                                {
                                    fieldname: 'errors', forhide: true
                                }],
                                onrowclick: function (item) {
                                    window.open(SV.host + 'Plan/GetDocsNameByID?id=' + item.data.id, '_blank');
                                },
                            });
                        }
                    });
                };
                var getAsync = function () {
                    return new Promise(function (resolve, reject) {
                        $.ajax({
                            url: SV.host + "plan/GetDocByID",
                            data: { plancode: 'All' },
                            success: function (response) {
                                resolve(response)
                            }
                        });
                    });
                };
                var remover = function (item) {
                    $.ajax({
                        url: SV.host + "plan/DeleteDocs",
                        data: { id: item.id },
                        success: function (response) {
                            item.resolve();
                        }
                    });
                };
                var renderGird = function () {
                    getAsync().then(function (response) {
                        $(divPlanDocsList).grid({
                            source: response,
                            excelbutton: true,
                            fields: [{
                                fieldname: 'ชื่อไฟล์', width: 500, itemTemplate: function (value) {
                                    var div = $('<div>');
                                    var i = $('<i>').addClass('fas fa-folder-open mr10');
                                    return div.append(i).append(value);
                                }
                            },
                            {
                                fieldname: 'errors', hide: true
                            }],
                            remover: {
                                onsave: function (item) {
                                    remover(item);
                                }
                            },
                            onrowclick: function (item) {
                                window.open(SV.host + 'Plan/GetDocsNameByID?id=' + item.data.id, '_blank');
                            }

                        });
                    });
                };

                //<-- Add oak.upload function to button:updPlanDoc
                $(updPlanDoc).upload({
                    onchange: function (item) {
                        if (fileNameValidation(item)) upload(item);
                    }
                });

                //<-- Add clickevent to button:btnPlanDocDownload
                btnPlanDocDownload.addEventListener('click', renderGird);
            };

            this.setupInput();
        },
        announceMath: function () {
            this.setupInput = function () {
                var upload = function (item) {
                    if (!item.files || item.files.length === 0)
                        return;

                    var formdata = new FormData();
                    var filename = item.files[0].name;
                    var docsGroupName = 'คณิตศาสตร์ประกันภัย';

                    formdata.append('file', item.files[0]);
                    formdata.append('docsGroupName', docsGroupName);
                    formdata.append('DocsName', filename);
                    $.ajax({
                        url: SV.host + 'uploaddata/uploadAnnounceMathDocs',
                        data: formdata,
                        contentType: false,
                        processData: false,
                        method: 'POST',
                        success: function (response) {
                            oak.minidialog({ value: 'อัพโหลดไฟล์ ' + filename + ' สำเร็จ', icon: 'success' });
                        }
                    });
                };
                var getAsync = function () {
                    return new Promise(function (resolve, reject) {
                        $.ajax({
                            url: SV.host + "announce/GetAnnounceMathDocs",
                            success: function (response) {
                                resolve(response)
                            }
                        });
                    });
                };
                var remover = function (item) {
                    $.ajax({
                        url: SV.host + "announce/DeleteAnnounceMathDocs",
                        data: { id: item.id },
                        success: function () {
                            item.resolve();
                        }
                    });
                };

                var renderGird = function () {
                    getAsync().then(function (response) {
                        $(divMathList).grid({
                            source: response,
                            excelbutton: true,
                            fields: [{
                                fieldname: 'ชื่อไฟล์', width: 500, itemTemplate: function (value) {
                                    var div = $('<div>');
                                    var i = $('<i>').addClass('fas fa-folder-open mr10');
                                    return div.append(i).append(value);
                                }
                            },
                            {
                                fieldname: 'errors', hide: true
                            }],
                            remover: {
                                onsave: function (item) {
                                    remover(item);
                                }
                            },
                            onrowclick: function (item) {
                                oak.ajaxpost.redirect({
                                    url: SV.host + 'announce/DownLoadAnnounceMathDocsByDocsName',
                                    DocsName: item.data["ชื่อไฟล์"]
                                })
                            }

                        });
                    });
                };

                //<-- Add oak.upload function to button:updPlanDoc
                $(updAnnounceMathDocs).upload({
                    onchange: function (item) {
                        upload(item);
                    }
                });

                //<-- Add clickevent to button:btnShowAnnounceMathDocs
                btnShowAnnounceMathDocs.addEventListener('click', renderGird);
            };

            this.setupInput();
        },
        launch: function () {
            window.webFn.uploaddataFn.activeMenu();
            window.webFn.uploaddataFn.commRate();
            window.webFn.uploaddataFn.planInfo();
            window.webFn.uploaddataFn.announceMath();
        }
    }
});