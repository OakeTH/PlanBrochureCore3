//<---------------------------------------------------------------------------------------<<
//<---------------------------------- v.3.4 ----------------------------------------------<<
//<---------------------------------------------------------------------------------------<<
window.oak = $();
window.host = window.location.protocol + "//" + window.location.host + "/";
window.SV = {
    Standardfn: 'Ajax/Standardfn',
    StandardfnPost: 'Ajax/StandardfnPost',
    Gridfn: 'Ajax/Gridfn',
    DDLfn: 'Ajax/DDLfn',
    DownloadExcelFromDTfn: 'Download/DownloadExcelFromDBfn',
    DownloadExcelFromJsonfn: 'Download/DownloadExcelFromJsonfn',
    Downloadfilefn: 'Download/Downloadfilefn',
    SharedPages: 'PDF/GetHTMPTemplate?templatepath=',
    DownloadPDFfn: 'PDF/DownloadPDF',
    FilterParamsfn: 'Ajax/FilterParamsfn',
    Uploadfn: 'Upload/Uploadfn',
    Emailingfn: 'Email/Emailing',
    jsonTHF_Path: 'JsonFile/thaiaddress.json',
    OneSignalGetAppID: 'OneSignal/GetAppID',
    DependencyRootPath: '/oak/libraries/',
    ALIAS: window.myALIAS || '',
    host: ''
};

var oakdef = {
    isBE: false,
    ddlheight: 300,
    topicwidth: 120,
    dialogwidth: 600,
    pagesize: 10,
    gridcolumnwidth: 120,
    griddelete_title: 'ลบ',
    griddelete_confirm: 'ยืนยัน',
    griddelete_cancel: 'ยกเลิก',
    gridinserter_buttontext: 'เพิ่มข้อมูลใหม่',
    griddelete_top: -50,
    griddelete_right: 180,
    griddelete_errormessage: 'ลบข้อมูลไม่สำเร็จ',
    griddelete_dialog_title: 'ยืนยันการลบข้อมูล',
    gridempty_data: 'ไม่พบข้อมูล',
    upload_height: 80,
    upload_maxfile_amount: 1,
    upload_maxfile_size: 20000000,
    upload_placeholder: 'คลิ้ก หรือ ลาก ไฟล์ที่ต้องการอัพโหลดมาวางที่นี้',
    upload_empty: 'ไม่พบไฟล์',
    dropdown_width: 190,
    dialog_effect: 'modal-slidedown',
    dialog_icon: 'success',
    dialog_hideafter: 5000,
    dialog_position: 'bottom-center',
    excelimport_choose_sheet_msg: '--- เลือก Sheet ที่ต้องการ ---',
    save_error: 'เกิดข้อผิดพลาด ไม่สามารถบันทึกข้อมูลได้',
    import_error: 'เกิดข้อผิดพลาด ไม่สามารถ Import ไฟล์ดังกล่าวได้',
    processingButton_value: 'กำลังทำงาน...',
    processingButton_loadingTime: 3000,
    processingButton_timeOut: 30000,
    processingButton_theme: "ILPYellow"
};
SV.host = window.location.origin + '/' + (SV.ALIAS ? SV.ALIAS + '/' : '');

//<--- Add prototypes
String.prototype.startsWith || (String.prototype.startsWith = function (t, r) { return this.substr(!r || r < 0 ? 0 : +r, t.length) === t; });
String.prototype.endsWith || (String.prototype.endsWith = function (t, n) { return (void 0 === n || n > this.length) && (n = this.length), this.substring(n - t.length, n) === t; });
Element.prototype.remove || (Element.prototype.remove = function () { this.parentElement.removeChild(this); });
Date.prototype.addDays = function (t) { var e = new Date(this.valueOf()); return e.setDate(e.getDate() + t), e };

Array.prototype.distinct = function () {
    var newArray = [];
    $.each(this, function (key, value) {
        var exists = false;
        $.each(newArray, function (k, val2) {
            if (value.id == val2.id) { exists = true };
        });
        if (exists == false && value.id != "") { newArray.push(value); }
    });

    return newArray;
}

var oakfn = {},
    substr = function (a, b, c) { b = b === '' ? 0 : a.indexOf(b) + 1; var d = a.indexOf(c, b); return -1 < d ? a.substring(b, d) : a.split(c).pop(); },
    querystr = function () {
        for (
            var c = [], a, d = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&'), b = 0; b < d.length; b++
        )
            a = d[b].split('='), c[a[0]] = a[1];
        return c || [];
    },
    objtoquerystr = function (obj, encd) {
        let str = '';
        $.each(obj, function (r, c) {
            if (encd) {
                let spl = c.toString().split('');
                let splStr = '';
                for (i = 0; i < spl.length; i++) {
                    splStr += spl[i] + ' ';
                }
                c = encodeURIComponent(splStr);
            }
            str += r + "=" + c + "&";
        });
        return '?' + str.slice(0, -1);
    },
    getDate = function (separated, dateAdd) {
        let isBE = oakdef.isBE ? 543 : 0;
        let sepa = separated || '/';
        let now;

        if (dateAdd)
            dateAdd = parseInt(dateAdd);

        if (dateAdd > 1000000)
            now = new Date(dateAdd);
        else if (separated && separated.length > 8) {//<-- like 01/05/2532. it will convert string to Date
            let parts;
            let dateStr = separated;
            if (dateStr.indexOf('/') > -1) {
                parts = dateStr.split('/');
                sepa = '/';
            }
            else if ((dateStr.indexOf('-') > -1) > -1) {
                parts = dateStr.split('-');
                sepa = '-';
            }
            else {
                parts = [];
                parts.push(dateStr.substring(0, 2));
                parts.push(dateStr.substring(2, 2));
                parts.push(dateStr.substring(4, 2));

            }
            parts[2] = parts[2].substring(0, 4);
            now = new Date(parts[2], parts[1] - 1, parts[0]);
            dateAdd && now.setDate(now.getDate() + dateAdd);
            isBE = 0;
        }
        else if (dateAdd) {
            now = new Date();
            now.setDate(now.getDate() + dateAdd);
        }
        else
            now = new Date;

        let year = now.getFullYear() + isBE;
        let month = now.getMonth() + 1;
        let day = now.getDate();
        // <-- Now to use now let hour = now.getHours();
        //  let min = now.getMinutes();
        //  let sec = now.getSeconds();
        let fulldate = add0(day, 2) + sepa + add0(month, 2) + sepa + year;
        return {
            fulldate: fulldate,
            date: day,
            month: month,
            year: year,
            //  hour: hour,
            //  min: min,
            //  sec: sec,
            //  fulldatetime: fulldate + ' ' + hour + ':' + min + ':' + sec
        };
    },
    dateDiff = function (date1, date2) {
        if (!date1 || !date2)
            return null;

        date1 = date1.split('/');
        date2 = date2.split('/');
        cDate1 = new Date(date1[2] + '-' + date1[1] + '-' + date1[0]);
        cDate2 = new Date(date2[2] + '-' + date2[1] + '-' + date2[0]);
        cDate1 = Date.UTC(cDate1.getFullYear(), cDate1.getMonth(), cDate1.getDate());
        cDate2 = Date.UTC(cDate2.getFullYear(), cDate2.getMonth(), cDate2.getDate());
        return Math.floor((cDate2 - cDate1) / (1000 * 60 * 60 * 24));
    },
    addcomma = function (x) { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); },
    add0 = function (str, max) { str = str.toString(); return str.length < max ? add0("0" + str, max) : str; },
    randomstring = function () { return Math.random().toString(36).split(".")[1] + Math.random().toString(36).split(".")[1] },
    toFileSizeFormat = function (S) {
        return S < 1e3 ? S + " B" : S < 1e6 ? Math.round(S / 1e3) + " KB" : Math.round(S / 1e6) + " MB"
    },
    isEmail = function (email) {
        if (!email) return false;
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

$.fn.window = function (selector, elementtype) {
    elementtype = elementtype || 'input,label,select,span,div';

    $(selector).find(elementtype).addBack().each(function () {
        if (!this.id) return !0;

        window[this.id] = $(this);
        if (this.type && this.type === "date") {
            window[this.id].datebox({ startview: this.dataset.startview });
        }
    });
};

$.fn.scrollTo = function (args) {
    if (!args) args = {}

    var paddingtop = args.paddingtop || 0;
    var duration = args.duration || 1000;
    //<-- !!New use top instead  of paddingtop --<<
    var top = args.top || 0;
    $('html, body').animate({ scrollTop: $(this).offset().top + paddingtop - top }, duration);
};

$.fn.ajaxpost = function (args) {
    let data = null,
        url = SV.host,
        datatype = 'json',
        contenttype = false,
        processdata = false,
        headers = null;

    if (args.ajaxconfig) {
        datatype = args.ajaxconfig.datatype !== undefined ? args.ajaxconfig.datatype : datatype;
        processdata = args.ajaxconfig.processdata !== undefined ? args.ajaxconfig.processdata : processdata;
        contenttype = args.ajaxconfig.contenttype !== undefined ? args.ajaxconfig.contenttype : contenttype;
        headers = args.ajaxconfig.header !== undefined ? args.ajaxconfig.header : headers;
        delete args.ajaxconfig;
    }

    if (contenttype == 'application/json') {
        data = {}
        $.each(args, function (key, value) {
            if (key != 'url' && typeof value !== "function") {
                data[key] = value
            }
        });
        data = JSON.stringify(data);
    } else {
        let argsName = Object.keys(args);
        for (N = 0; N < argsName.length; N++) {
            if (args[argsName[N]] instanceof FormData)
                data = args[argsName[N]]
        }
        if (!data)
            data = new FormData();

        $.each(args, function (key, value) {
            if (value === undefined)
                return true;

            else if (key != 'url' && typeof value !== "function")
                data.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
            else if (key == 'url' && value.indexOf('/') == -1)
                data.append(key, typeof value === 'object' ? JSON.stringify(value) : value);

        });
    }

    if (args.url) {
        usecustomurl = args.url.indexOf('/') === -1 ? false : true;
    }
    if (usecustomurl) {
        if (args.url.startsWith('http')) {
            url = args.url;
            if (!args.url.startsWith(window.host)) {
                datatype = false;
                contenttype = false;
            }
        } else
            url += args.url;

    }
    else {
        if (args.Emailingfn) { url += SV.Emailingfn; }
        else { url += SV.StandardfnPost; }
    }

    if (args.onsuccess || args.onerror)
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            headers: headers,
            contentType: contenttype,
            processData: processdata,
            dataType: datatype,
            success: function (data) { args.onsuccess && args.onsuccess(data); },
            error: function (a, b, c) { args.onerror && args.onerror(a, b, c); }
        });
    else
        return new Promise(function (resolve) {
            resolve(
                $.ajax({
                    type: "POST",
                    url: url,
                    data: data,
                    headers: headers,
                    contentType: contenttype,
                    processData: processdata
                })
            );
        });

};
$.fn.ajaxpost.redirect = function (args, newpage) {
    if (!args.url.startsWith('http'))
        args.url = SV.host + args.url;

    var form = $('<form></form>')
        .attr('action', args.url)
        .attr('target', newpage ? '_blank' : '')
        .attr('method', 'post');

    $.each(args, function (key, value) {
        if (typeof value === "object")
            value = JSON.stringify(value);

        if (typeof value === "function")
            return true;

        key !== 'url' &&
            $('<input />', {
                'type': 'hidden',
                'name': key,
                'value': value
            }).appendTo(form);
    });

    let submit = function () {
        return new Promise(function (resolve) {
            resolve(
                form.appendTo('body')
                    .submit()
                    .remove()
            );
        });
    };
    submit().then(function () {
        args.onsuccess && args.onsuccess();
    });

};
$.fn.ajaxpost.redirect.newpage = function (args) {
    oak.ajaxpost.redirect(args, true);
};

$.fn.ajaxget = function (args) {
    var url = SV.host,
        datatype = 'json',
        contenttype = false,
        processdata = false,
        headers = null;

    if (args.url) {
        usecustomurl = args.url.indexOf('/') === -1 ? false : true;
    }
    if (usecustomurl) {
        if (args.url.startsWith('http')) {
            url = args.url;

            if (!args.url.startsWith(window.host)) {
                datatype = false;
                contenttype = false;
            }

        } else {
            url += args.url;
        }
        delete args.url;
    } else {
        if (args.Gridfn) { url += SV.Gridfn; }
        else if (args.DDLfn) { url += SV.DDLfn; }
        else if (args.FilterParamsfn) { url += SV.FilterParamsfn; }
        else if (args.Emailingfn) { url += SV.Emailingfn; }
        else url += SV.Standardfn;
        $.each(SV, function (key) { delete args[key]; });
    }

    if (args.ajaxconfig) {
        datatype = args.ajaxconfig.datatype !== undefined ? args.ajaxconfig.datatype : datatype;
        processdata = args.ajaxconfig.processdata !== undefined ? args.ajaxconfig.processdata : processdata;
        contenttype = args.ajaxconfig.contenttype !== undefined ? args.ajaxconfig.contenttype : contenttype;
        headers = args.ajaxconfig.header !== undefined ? args.ajaxconfig.header : headers;
        delete args.ajaxconfig;
    }

    var _args = {};
    $.each(args, function (key, item) {
        typeof item !== "function" && (_args[key] = item);
    });

    if (args.async === false) {
        delete args.async;
        if (b = $.ajax({
            type: 'GET',
            contentType: contenttype,
            data: usecustomurl ? _args : { Keys: JSON.stringify(args) },
            url: url,
            dataType: datatype,
            async: !1
        }), b.responseJSON) {
            return b.responseJSON;
        }
    } else if (args.onsuccess || args.onerror) {
        $.ajax({
            type: 'GET',
            contentType: contenttype,
            data: usecustomurl ? _args : { Keys: JSON.stringify(args) },
            url: url,
            dataType: datatype,
            headers: headers,
            success: function (b) { args.onsuccess && args.onsuccess(b); },
            error: function (b, c, d) { args.onerror && args.onerror(b, c, d); }
        });

    } else {
        return new Promise(function (resolve) {
            resolve(
                $.ajax({
                    type: 'GET',
                    contentType: contenttype,
                    data: usecustomurl ? _args : { Keys: JSON.stringify(args) },
                    url: url,
                    dataType: datatype,
                    headers: headers
                })
            );

        });
    }
};
$.fn.ajaxget.redirect = function (args) {
    var arryArgs = Object.keys(args);

    querystring = {};
    for (i = 0; i < arryArgs.length; i++) {
        if (arryArgs[i] !== 'url')
            querystring[arryArgs[i]] = args[arryArgs[i]]
    };

    if (!$.isEmptyObject(querystring))
        querystring = objtoquerystr(querystring);
    else
        querystring = '';

    if (args.url.startsWith('http'))
        window.location.href = args.url + querystring
    else
        window.location.href = SV.host + args.url + querystring;

};
$.fn.ajaxget.redirect.newpage = function (args) {
    var hostname = args.url.startsWith('http') ? args.url : SV.host + args.url;
    var querystr = '';
    if (args.querystring)
        querystr = objtoquerystr(args.querystring);

    window.open(hostname + querystr, '_blank');
};

$.fn.dropdown = function (args) {
    if (!args)
        args = {};

    args.me = this;
    oak.dropdown.get_source(args.source, args.me[0]).then(function (source) {
        args.source = source;
        args.me.dropdown.then(args);
    });
    return this;
};
oak.dropdown.source = [];
oak.dropdown.get_source = function (source, me) {
    return new Promise(function (resolve) {
        if (source === undefined)
            resolve(undefined);

        else if (source === 'thai address') {
            if (!oak.dropdown.thaiaddress)
                resolve(
                    $.getJSON(SV.host + SV.DependencyRootPath + SV.jsonTHF_Path, function (json) {
                        oak.dropdown.thaiaddress = json;

                    }));
            else
                resolve();
        }
        else if (source.url) {
            let clint_onsucess = source.onsuccess || $.noop;

            source.DDLfn = true;
            source.onsuccess = function (response) {
                clint_onsucess(response);
                oak.dropdown.add_select_options(response, me)
                resolve(response);
            }

            oak.ajaxget(source);
        }
        else if (source === 'myoptions')//<-- Get source from own select:options ---<<
        {
            source = [];
            for (i = 0; i < me.options.length; i++) {
                source.push({
                    value: me.options[i].value,
                    text: me.options[i].innerHTML
                });
            }
            resolve(source);
        }
        else {//<-- source is array[]--<<
            oak.dropdown.add_select_options(source, me)
            resolve(source);
        }
    });
};
oak.dropdown.add_select_options = function (source, me) {
    if (!source && !source.length) return;
    if (me.tagName === 'INPUT') return;

    //<-- Remove previous options(if exists)--<<
    for (i = me.options.length - 1; i >= 0; i--) {
        me.remove(i);
    }
    //<--add items to options's tag (if this elemen is SELECT)
    if (source[0].constructor.name !== 'Object')
        for (i = 0; i < source.length; i++) {
            let opt = document.createElement("option");
            opt.value = source[i];
            opt.innerHTML = source[i];
            me.add(opt);
        }
    else {
        let firstkey = Object.keys(source[0])[0];
        let secondkey = Object.keys(source[0])[1] || firstkey;
        for (i = 0; i < source.length; i++) {
            let opt = document.createElement("option");
            opt.value = source[i][firstkey];
            opt.innerHTML = source[i][secondkey];
            me.add(opt);
        }
    }
};
oak.dropdown.get_source_objectname = function (args) {
    if (!args.source.length)
        return;

    if (args.source[0].constructor !== Object) {
        for (i = 0; i < args.source.length; i++) {
            args.source[i] = {
                firstkey: args.source[i],
                secondkey: args.source[i]
            }
        }
    };

    let me_id = args.me[0].id;
    firstkey = Object.keys(args.source[0])[0];
    secondkey = Object.keys(args.source[0])[1] || firstkey;

    oak.dropdown.source[me_id].objectname = {
        firstkey: firstkey,
        secondkey: secondkey,
        groupBy: null,
        uniqueGroup: []
    };

    if (args.groupby) {
        var useItem = args.source.map(function (item) {
            return item[args.groupby]
        });

        var uniqueGroup = useItem.filter(function (item, i, ar) {
            return ar.indexOf(item) === i
        });

        oak.dropdown.source[me_id].objectname.groupBy = args.groupby;
        oak.dropdown.source[me_id].objectname.uniqueGroup = uniqueGroup;
    }

};
oak.dropdown.then = function (args) {
    if (args.province || args.zipcode) {
        if (!oak.dropdown.addressbox)
            oak.ajaxget({
                url: SV.host + 'oak/oak.address_box.min.js',
                async: false,
                ajaxconfig: { datatype: 'script' }
            });

        args.me.dropdown.addressbox(args);
        return args.me;
    }

    if (!isNaN(args.width))
        args.width += 'px';

    if (!args.height)
        args.height = oakdef.ddlheight;

    if (!isNaN(args.height))
        args.height += 'px';

    if (!args.placeholder)
        args.placeholder = args.me[0].placeholder || '';

    if (args.me[0].tagName === 'INPUT')
        args.elementtype = 'textbox';
    else
        args.elementtype = 'dropdown';

    if (!args.minlength)
        args.minlength = 0;

    if (!args.required && !args.me[0].required)
        args.required = false;
    else
        args.required = true;

    if (!args.onselected)
        args.onselected = null;

    if (!args.fixposition)
        args.fixposition = false;

    if (!args.flexdisplay)
        args.flexdisplay = false;

    args.me.dropdown.core(args);
};
oak.dropdown.core = function (args) {
    let create = function () {
        this.me = args.me;
        this.id = args.me[0].id;
        this.height = args.height;
        this.width = args.width;
        this.onselected = args.onselected;
        this.placeholder = args.placeholder;
        this.value = args.value;
        this.elementtype = args.elementtype;
        this.minlength = args.minlength;
        this.required = args.required;
        this.fixposition = args.fixposition;
        this.flexdisplay = args.flexdisplay;

        this.options_ddl_mtop = '1cm';
        this.options_autoc_mtop = '0px';

        if (args.source) {
            this.options_ul_clear();

            if (!this.id) {
                let newid = Math.random().toString(36).substring(2);
                this.me[0].id = newid;
                this.id = newid;
            }

            oak.dropdown.source[this.id] = {};
            oak.dropdown.source[this.id].data = args.source;
            oak.dropdown.get_source_objectname(args);
        }

        if (this.elementtype === 'dropdown' && !this.me.refer('is_created')) {
            this.options_ul = this.options_ul_create();
            this.searchbox = this.searchbox_create();
            //let span = $('<span style="position:relative">');
            //span.append(this.options_ul);
            //span.append(this.searchbox);
            //this.me.after(span);

            this.me.after(this.options_ul);
            this.me.after(this.searchbox);
            this.ddl_tags_add();
            this.me.refer('is_created', true);
        }
        else if (this.elementtype === 'textbox' && !this.me.refer('is_created')) {
            this.options_ul = this.options_ul_create();
            this.me.after(this.options_ul);
            this.txt_tags_add();
            this.me.refer('is_created', true);
        };

        if (this.value) {
            this.me.val(this.value).trigger('change')
            this.me[0].text = this.me[0].options[this.me[0].selectedIndex].innerHTML;
        };
        //if (this.showoptions)
        //    this.me[0].my_options_ul.classList.remove('hide');

        this.placeholder_create();

    }
    create.prototype = {
        input_width: function () { return this.width || this.me.outerWidth() || oakdef.dropdown_width },
        searchbox_keyup: function () {
            oak.dropdown.ul_items_create({
                ul: this.my_options_ul,
                owner_id: this.owner_id,
                filtertext: this.value
            });
            if (this.my_options_ul.childNodes.length == 1) {
                let li_first = this.my_options_ul.childNodes[0];
                let click = document.createEvent('MouseEvents');
                click.initEvent('mousedown', true, true);
                li_first.dispatchEvent(click);
            }
        },
        searchbox_click: function (e) {
            this.classList.remove('hide');
            this.my_options_ul.classList.remove('hide');
            this.my_options_ul.children.length === 0 &&
                oak.dropdown.ul_items_create({
                    ul: this.my_options_ul,
                    owner_id: this.owner_id
                });
        },
        searchbox_create: function () {
            let fix = args.fixposition ? ' fix' : '';

            return $('<input type="search">')
                .addClass('oak-ddl-searchbox hide' + fix)
                .css('width', this.input_width())
                .attr('placeholder', 'Search')
                .refer('owner_id', this.id)
                .refer('fixposition', this.fixposition)
                .refer('flexdisplay', this.flexdisplay)
                .refer('my_options_ul', this.options_ul)
                .referTo('my_searchbox', this.options_ul)
                .on('keyup', this.searchbox_keyup)
                .on('click', this.searchbox_click)
                .on('focusout', function (e) {
                    this.classList.add('hide');
                    this.my_options_ul.classList.add('hide');
                });
        },
        options_ul_create: function () {
            let options_ul = $('<ul>')
                .refer('elementtype', this.elementtype);

            this.options_ul_style(options_ul);
            return options_ul;
        },
        options_ul_style: function (options_ul) {
            let margintop = this.elementtype === 'dropdown' ? this.options_ddl_mtop : this.options_autoc_mtop;
            let effect = this.elementtype === 'dropdown' ? 'show' : '';
            let fix = args.fixposition ? ' fix' : '';
            options_ul
                .css('width', this.input_width())
                .css('max-height', this.height)
                .css('margin-top', margintop)
                .addClass('oak-ddl-options hide' + fix)
                .addClass(effect);
        },
        options_ul_clear: function () {
            let ul = this.me.refer('my_options_ul');
            if (ul)
                while (ul.firstChild) {
                    ul.removeChild(ul.firstChild);
                }
        },
        ddl_click: function (evt) {
            if (evt.button == 2) {//<--Right click--<<//
                var input = document.createElement('input');
                input.type = 'text';
                input.value = this.options[this.selectedIndex].innerHTML;
                document.body.appendChild(input);
                input.select();
                document.execCommand('copy');
                document.body.removeChild(input);
                oak.minidialog('คัดลอกข้อความ');
                evt.preventDefault();
            } else {

                let searchbox = this.my_searchbox;
                let me_offset = this.getBoundingClientRect();
                let scollheight = 0;

                if (!searchbox.fixposition)
                    scollheight = window.pageYOffset || document.documentElement.scrollTop;

                if (!searchbox.flexdisplay) {
                    searchbox.style.left = me_offset.left + 'px';
                    searchbox.style.top = (me_offset.top + me_offset.height + scollheight) + 'px';
                    searchbox.my_options_ul.style.left = me_offset.left + 'px';
                    searchbox.my_options_ul.style.top = (me_offset.top + me_offset.height + scollheight) + 'px';
                }
                searchbox.my_options_ul.classList.remove('hide');
                searchbox.classList.remove('hide');

                searchbox.focus();
                searchbox.click();
                evt.preventDefault();
            }

        },
        ddl_tags_add: function () {
            this.me
                .refer('text', '')
                .refer('options_ddl_mtop', this.options_ddl_mtop)
                .refer('my_options_ul', this.options_ul)
                .refer('my_searchbox', this.searchbox)
                .referTo('my_input', this.options_ul)
                .on('mousedown', this.ddl_click);

            this.me[0].required = this.required;

        },
        txt_keyup: function (evt) {
            if (this.value.length < this.minlength)
                return;

            this.my_options_ul.classList.remove('hide');
            oak.dropdown.ul_items_create({
                ul: this.my_options_ul,
                owner_id: this.id,
                filtertext: this.value
            });

            if (this.my_options_ul.childNodes.length == 1 && evt.keyCode != 8) {//<-- 8 = backspace
                let li_first = this.my_options_ul.childNodes[0];
                let click = document.createEvent('MouseEvents');
                click.initEvent('mousedown', true, true);
                li_first.dispatchEvent(click);
            }

        },
        txt_click: function (evt) {
            if (evt.button == 2) {//<--Right click--<<//
                this.select();
                return false;
            };

            let scollheight = 0;
            let me_offset = this.getBoundingClientRect();
            if (!this.fixposition) {
                scollheight = window.pageYOffset || document.documentElement.scrollTop;
            }

            this.my_options_ul.style.left = me_offset.left + 'px';
            this.my_options_ul.style.top = (me_offset.top + me_offset.height + scollheight) + 'px';

            if (this.value.length < this.minlength)
                return;

            this.my_options_ul.classList.remove('hide');
            if (this.my_options_ul.children.length === 0)
                oak.dropdown.ul_items_create({
                    ul: this.my_options_ul,
                    owner_id: this.id,
                    filtertext: this.value
                });
        },
        txt_tags_add: function () {
            this.me
                .refer('my_options_ul', this.options_ul)
                .refer('minlength', this.minlength)
                .refer('onselected', this.onselected)
                .referTo('my_input', this.options_ul)
                .attr('placeholder', this.placeholder)
                .attr('autocomplete', 'off')
                .on('keyup', this.txt_keyup)
                .on('mousedown', this.txt_click)
                .on('focusout', function (e) {
                    this.my_options_ul.classList.add('hide');
                });
        },
        placeholder_create: function () {
            if (!this.placeholder)
                return;

            if (this.elementtype === 'dropdown') {
                let last = this.me[0].options.length - 1;
                let lastOption = this.me[0].options[last]
                if (lastOption && lastOption.disabled)
                    this.me[0].remove(lastOption);

                let opt = document.createElement("option");
                opt.innerHTML = this.placeholder
                opt.value = '';
                opt.disabled = true;
                this.me[0].add(opt);

                if (this.placeholder || this.value === '') {
                    this.me[0].value = '';
                    this.me[0].text = '';
                }

                //if (this.value)
                //    this.me[0].text = this.me[0].options[this.me[0].selectedIndex].innerHTML;

            } else
                this.me[0].placeholder = this.placeholder

        }
    };

    new create();
};
oak.dropdown.apply_value_to_owner = function () {
    let input = this.parentNode.my_input;  //previousSibling.previousSibling;
    let elementtype = this.parentNode.elementtype;

    if (input.onselected)
        input.onselected({ oldvalue: input.value, newvalue: this.innerText });


    if (elementtype === 'textbox') {
        let oldvalue = input.value;
        input.value = this.innerText
        input.dataset.myvalue = this.firstkey
        input.my_options_ul.classList.add('hide');

        if (input.value != oldvalue) {
            $(input).trigger('change')
            //var event = new Event('change', {
            //    'bubbles': true,
            //    'cancelable': true
            //});
            //input.dispatchEvent(event);
        }
        input.blur();


    }
    else {//<--- elementtype === 'dropdown' ---<<

        let ul = this.parentNode;
        let prev_value = ul.my_input.value;
        ul.classList.add('hide');
        ul.my_searchbox.classList.add('hide');
        ul.my_input.value = this.firstkey;
        ul.my_input.text = this.innerHTML;

        if (prev_value != this.firstkey) {
            var event = new Event('change');
            ul.my_input.dispatchEvent(event);
            ul.my_input.blur();
        }
    }
};
oak.dropdown.ul_items_create = function (p) {
    //if (!oak.dropdown.source[p.owner_id])
    //    return;

    let data = oak.dropdown.source[p.owner_id].data;
    if (!data.length)
        return;

    // let type = data.length ? data[0].constructor.name : null;
    let objectname = oak.dropdown.source[p.owner_id].objectname;
    p.filtertext && (data = oak.dropdown.filter_data(data, p.filtertext, objectname.secondkey));

    //<-- Remove Previous ul.
    while (p.ul.firstChild) { p.ul.removeChild(p.ul.firstChild); }

    if (!data.length)
        return;

    if (objectname.groupBy) {
        for (i = 0; i < objectname.uniqueGroup.length; i++) {
            var myGroup = objectname.uniqueGroup[i];
            var dataInGroup = oak.dropdown.filter_data(data, myGroup, objectname.groupBy);

            if (dataInGroup.length === 0)
                continue;

            let li = document.createElement("li");
            li.innerHTML = myGroup;
            li.firstkey = myGroup;
            li.classList.add('group-topic')
            li.addEventListener('mousedown', function (evt) { evt.preventDefault(); });
            p.ul.appendChild(li);

            for (ii = 0; ii < dataInGroup.length; ii++) {
                let li = document.createElement("li");
                li.innerHTML = dataInGroup[ii][objectname.secondkey];
                li.firstkey = dataInGroup[ii][objectname.firstkey];
                li.addEventListener('mousedown', oak.dropdown.apply_value_to_owner);
                li.classList.add('pl-4')
                p.ul.appendChild(li);
            }
        }
    } else
        for (i = 0; i < data.length; i++) {
            let li = document.createElement("li");
            li.innerHTML = data[i][objectname.secondkey];
            li.firstkey = data[i][objectname.firstkey];
            li.addEventListener('mousedown', oak.dropdown.apply_value_to_owner);
            p.ul.appendChild(li);
        }

};
oak.dropdown.filter_data = function (data, filtertext, key) {
    if (data[0][key].constructor === Number)
        return data.filter(function (object) {
            return object[key] == filtertext
        });
    else
        return data.filter(function (object) {
            return object[key].indexOf(filtertext) > -1
        });
    // }

}

$.fn.downloadexcel = function (args) {
    args.Source_SP = JSON.stringify(args.source);

    if (args.excelsheetsname && args.excelsheetsname instanceof Array)
        args.excelsheetsname += '';

    if (args.lastrowissummary && args.lastrowissummary instanceof Array)
        args.lastrowissummary += '';
    window.location.href = SV.host + SV.DownloadExcelFromDTfn + objtoquerystr(args);
};
$.fn.downloadfile = function (args) {
    oak.minidialog({ value: "กำลังค้นหาไฟล์... " });
    var obj = {};
    obj.source = JSON.stringify(args.source);
    obj.downloadfrom = args.downloadfrom;
    obj.containername = args.containername || '';
    window.location.href = SV.host + SV.Downloadfilefn + objtoquerystr(obj);
};
//<-- Legacy--<<//
$.fn.downloadpdf = function (args) {
    let title = args.title || 'PDF Preview';
    let islandscape = args.islandscape || false;
    let isgrayscale = args.isgrayscale || false;
    let _css = args.css;
    let size = args.size || 'A4';
    let filename = args.filename || 'PDF ' + getDate().fulldate;
    let css = [];
    let html = args.html;
    let onsuccess = args.onsuccess || $.noop;
    let onerror = args.onerror || $.noop;
    if (typeof _css === 'string') css.push(_css)
    else if (_css instanceof Array) css = _css;

    if (!html)
        return;

    if (html instanceof Element)
        html = html.innerHTML

    else if (html instanceof jQuery)
        html = html[0].innerHTML

    if (filename && filename.endsWith !== '.pdf')
        filename += '.pdf'

    for (i = 0; i < css.length; i++) {
        if (!css[i].startsWith('http'))
            css[i] = window.host + css[i]
    }

    let options = {
        url: SV.DownloadPDFfn,
        html: html,
        title: title,
        size: size,
        islandscape: islandscape,
        isgrayscale: isgrayscale,
        css: css,
        filename: filename,
        onsuccess: onsuccess,
        onerror: onerror
    };

    oak.downloadpdf.rotativaCaller(options);

};
//<-- Legacy--<<//
oak.downloadpdf.rotativaCaller = function (options) {
    let prm = new Promise(function (resolve) {
        oak.ajaxpost.redirect(options);
        resolve();
    });

    prm.then(function (a) { options.onsuccess(a); })

}
//<--New---<<//
oak.pdftemplate = SV.host + 'PDF/GetHTMPTemplate?templatepath=';

$.fn.minidialog = function (args) {
    if (!$.toast)
        oak.ajaxget({
            url: SV.host + SV.DependencyRootPath + 'Toast/jquery.toast.min.js',
            async: false,
            ajaxconfig: { datatype: 'script' }
        });

    oak.minidialog.then(args);
};
oak.minidialog.then = function (args) {
    if (args === false)
        return $.toast().reset('all');

    if (!args) return false;

    let Arr = [];
    let delayPlus = 0;
    // let fnOptions = ['icon', 'value', 'hideafter', 'delay', 'position', 'bgcolor'];
    if (args.constructor === Array) Arr = args;
    else Arr.push(args);

    //<-- If there are least 1 option that is not fnOptions, return true
    //let argsNotFnOptions = function () {
    //    if (Arr[0].constructor !== Object)
    //        return;

    //    let key = Object.keys(Arr[0]);
    //    for (i = 0; i < key.length; i++) {
    //        let k = key[i]
    //        if (fnOptions.indexOf(k) > -1 || !Arr[0][k])
    //            continue;

    //        if (k.toLowerCase().indexOf('error') === -1)
    //            Arr.push(Arr[0][k]);
    //        else
    //            Arr.push({ value: Arr[0][k], icon: 'error' });
    //    };
    //}();

    for (i = 0; i < Arr.length; i++) {
        if (typeof Arr[i] !== 'object')
            Arr[i] = { value: Arr[i] };

        if (Arr[i].value === undefined || Arr[i].value.constructor === Boolean)
            continue;

        if (!Arr[i].bgcolor)
            Arr[i].bgcolor = null;

        if (Arr[i].icon === undefined)//<-- success /info /error /warning  --<<
            Arr[i].icon = oakdef.dialog_icon;

        if (!Arr[i].hideafter)
            Arr[i].hideafter = oakdef.dialog_hideafter;

        if (!Arr[i].position)
            Arr[i].position = oakdef.dialog_position;

        if (!Arr[i].showhidetransition)
            Arr[i].showhidetransition = 'slide'

        if (Arr[i].allowtoastclose === undefined)
            Arr[i].allowtoastclose = true;

        if (!Arr[i].delay)
            Arr[i].delay = delayPlus;
        else
            Arr[i].delay += delayPlus;

        delayPlus += 500; //<-- Increase delay for next dialog .5sec--<<
        oak.minidialog.core(Arr[i]);
    };
};
oak.minidialog.core = function (args) {
    window.setTimeout(function () {
        $.toast({
            text: args.value,
            icon: args.icon,
            bgColor: args.bgcolor,
            hideAfter: args.hideafter,
            showHideTransition: args.showhidetransition,
            allowToastClose: args.allowtoastclose,
            position: args.position,
            loader: true
        });
    }, args.delay);
};
oak.minidialog.reset = function () {
    return $.toast().reset('all');
}

$.gridSetup = function (args) {
    oakdef.gridSetup = {};
    $.extend(oakdef.gridSetup, args);
}

$.fn.grid = function (args) {
    if (!oak.jsGrid)
        oak.ajaxget({
            url: SV.host + SV.DependencyRootPath + 'JsGrid/jsgrid.oak.min.js',
            async: false,
            ajaxconfig: { datatype: 'script' }
        });

    if (oakdef.gridSetup) {
        var tempArgs = {};
        $.extend(true, tempArgs, oakdef.gridSetup, args);
        args = tempArgs;

        return this.grid_then(args);
    }
    else
        return this.grid_then(args);
};
$.fn.grid_then = function (args) {
    var this_id = this[0].id,
        DS = {},               //<--- Collect source fetched from server or args.source, Contains 2 constructor(Scheme,Data)---<<
        CONF = {},             //<--- Grid configuration ---<<
        autocomplete_list = [];//<--- Collect  column's name for create textbox autocomplete in grid finder --> '.jsgrid-filter-row' ----<<

    if (!args.fields)
        args.fields = [];

    if (!args.fieldsADJ)
        args.fieldsADJ = [];

    if (!args.source) {
        oak.minidialog(oak.minidialog({ icon: 'error', value: 'ไม่พบ Data Source' }));
        return false;
    }
    else if (args.source.url) {
        args.source.async = false;
        args.source.Gridfn = 1;
        DS = oak.ajaxget(con.source);
    }
    else if (args.source && !DS.Data) {

        if (args.source.table)
            args.source = args.source.table;
        else if (args.source instanceof Object && !(args.source instanceof Array)) {
            var arry = [];
            arry.push(args.source)
            args.source = arry;
        }

        var index = 0, index_sub = 0;
        DS = {};
        DS.Scheme = [];
        DS.Scheme[0] = {};
        DS.Data = [];
        $.each(args.source[0], function (key, val) {
            DS.Scheme[0][index] = key;
            index += 1;
        });
        index = 0;
        $.each(args.source, function (key, val) {
            index_sub = 0;
            DS.Data[key] = {};
            $.each(args.source[key], function (key2, val2) {
                DS.Data[key][index_sub] = val2;
                index_sub += 1;
            });
        });
    }

    if (!DS) return false;
    if (!DS.Data) return false;
    if (!DS.Scheme.length) return false;
    if (!DS.Data.length && !DS.Scheme.length) return false;
    if ($.isEmptyObject(DS.Scheme[0]))
        args.onemptydata && args.onemptydata(this[0], args);
    else
        this[0].style.display = '';


    let getColType = function (value, key) {
        if (-1 < value.indexOf(',chk'))
            return 'checkbox';
        else if (-1 < value.indexOf(',num'))
            return 'number';
        else if (-1 < value.indexOf(',date'))
            return 'date';
        else if (typeof DS.Data[0][key] === "number")
            return 'number';
        else
            return 'text';

    };
    let getColWidth = function (a, b) {
        return -1 < a.indexOf(",w") ? substr(a, ",w", ",").replace("w", "") : -1 < a.indexOf(",chk") ? "80" : b ? b : oakdef.gridcolumnwidth
    };
    let getColAlign = function (a) {
        return -1 < a.indexOf(',cen') ? 'center' : -1 < a.indexOf(',chk') ? 'center' : -1 < a.indexOf(',right') ? 'right' : 'left';
    };
    let getCSS = function (a) {
        if (-1 < a.indexOf(',.')) return substr(a, ',.', ',').replace('.', '');
    };
    let extendFieldsADJ = function (e) {
        for (i = 0; i < args.fieldsADJ.length; i++) {
            var ajd = args.fieldsADJ[i];

            for (ii = 0; ii < args.fields.length; ii++) {
                var field = args.fields[ii];
                if (ajd.title == field.fieldname) {
                    if (field.hide || field.forhide) {
                        field.forhide = true;
                        field.css = 'hide';
                        field.headercss = 'hide';
                    }
                    $.extend(ajd, field)
                }
            };
        };
    };
    // <--- Add all field(DS.Scheme) to main SCHEME object (CN) ---<<
    $.each(DS.Scheme[0], function (key, val) {
        var i = {};
        var usefor = val.split('^')[1] || val;
        i.name = key;
        i.title = val.split('^')[0];
        i.forupdate = usefor.indexOf(',update') > -1 ? true : false;
        i.forinsert = usefor.indexOf(',insert') > -1 ? true : false;
        i.forhide = usefor.indexOf(',hide') > -1 ? true : false;
        i.forread = usefor.indexOf(',read') > -1 ? true : false;
        i.required = usefor.indexOf(',required') > -1 ? true : false;
        i.filter = usefor.indexOf(',filter') > -1 ? true : false;
        i.topics = val.indexOf(',#') > -1 ? substr(val, ",#", ",").replace("#", "") : i.title;
        if (val.toLowerCase() === 'id') { i.forhide = true, i.css = 'hide', i.headercss = 'hide' };
        if (val.indexOf(',hide') > -1) { i.forhide = true, i.css = 'hide', i.headercss = 'hide' };
        if (val.indexOf(',filter') > -1) { autocomplete_list.push(i); }

        i.type = getColType(val, key);
        i.width = getColWidth(val, args.defaulfeildwidth);
        var align = getColAlign(val);
        align !== 'left' && (i.align = align);
        val.indexOf(',.') > -1 && (i.css = getCSS(val), i.headercss = '');
        args.fieldsADJ.push(i);
    });
    extendFieldsADJ(args.fields);

    //<--- Set items(unique) in textbox filter ----------<<
    CONF.paging = args.paging === undefined ? true : args.paging;
    CONF.excelbutton = args.excelbutton === undefined ? true : args.excelbutton;
    CONF.primaryKey = args.primarykey || null;
    CONF.fields = args.fieldsADJ;
    CONF.pageSize = args.pagesize || oakdef.pagesize;

    if (args.updater) {
        oak.grid_update({ config: CONF, updater: args.updater, grid: this[0] });
        CONF.rowClick = function (rowitemArray) {
            if (rowitemArray.event.target.type == 'button' ||
                rowitemArray.event.target.tagName == 'A' ||
                rowitemArray.event.target.tagName == 'BUTTON')
                return false;

            this.referFn.thisrow = rowitemArray.event.target.parentElement;
            let item = this.getcolumnname(rowitemArray.item);
            rowitemArray.fields = this.fields
            this.referFn.rowclick(item, rowitemArray);
        }
    }

    args.inserter && oak.grid_inserter({ config: CONF, inserter: args.inserter, grid: this[0] });
    args.remover && oak.grid_remover({ config: CONF, remover: args.remover });
    args.onrowclick && (CONF.rowClick = function (i, a, b) {
        if (i.event.target.tagName === 'INPUT') return;
        else if (i.event.target.tagName === 'BUTTON') return;
        else if (i.event.target.tagName === 'A') return;

        i.data = this.getcolumnname(i.item)
        args.onrowclick(i);
    });

    CONF.getcolumnname = function (item) {
        let newcolumn = {};
        for (i = 0; i < this.fields.length; i++) {
            let me = this.fields[i].title;
            if (me)
                newcolumn[me] = item[i]

        }
        return newcolumn;
    }
    CONF.controller = oak.grid.gridcontroller;
    CONF.controller.id = this_id;

    if (!jsGrid.oakfn) jsGrid.oakfn = {};
    jsGrid.oakfn[this_id] = {}
    jsGrid.oakfn[this_id].data = DS.Data;
    jsGrid.oakfn[this_id].fields = CONF.fields;
    jsGrid.oakfn[this_id].autocomplete = oakfn.set_grid_filter_autocomplete(DS.Data, autocomplete_list);
    jsGrid.oakfn[this_id].autocomplete_rank = Object.keys(jsGrid.oakfn[this_id].autocomplete);

    if (args.useexternalsearch) {
        args.useexternalsearch.getsourcefrom = this[0];
        CONF.onHeaderRendered = function () {
            oak.grid.useExternalSearch(args.useexternalsearch);
        }
    }
    if (args.hideinternalsearch)
        CONF.hideInternalSearch = true;

    if (args.theme)
        CONF.theme = args.theme;

    if (args.gridcss)
        CONF.gridcss = args.gridcss;

    return this.jsGrid(CONF);
};
oak.grid_inserter = function (args) {

    let createFn = function () {
        this.userconf = args.inserter;
        this.gridconf = args.config;
        this.grid = args.grid;
        this.topicwidth = this.userconf.topicwidth || oakdef.topicwidth;
        this.dialogwidth = this.userconf.dialogwidth || oakdef.dialogwidth;
        this.addRefer();
        this.splitColumnsPerType(); //<-- column.insert// column.read --<<       
        this.btnopen = this.createBtnOpen();
        this.construction();
    }
    createFn.prototype = {
        addRefer: function () {
            this.referFn = {};
            this.referFn.inputfileds = [];
            this.referFn.openDialog = this.openDialog;
            this.referFn.userconf = this.userconf;
            this.referFn.checkRequiredInputs = this.checkRequiredInputs;
            this.referFn.createErrorMsg = this.createErrorMsg;
            this.referFn.grid = this.grid;
            this.referFn.fields = this.gridconf.fields;
        },
        createBtnOpen: function () {
            let btn;
            if (this.userconf.inserterbutton)
                btn = oak.pureHtml(this.userconf.inserterbutton);

            else {


                btn = document.createElement('input');
                btn.type = 'button';
                btn.value = this.userconf.inserterbuttontext || oakdef.gridinserter_buttontext;
                btn.classList.add('btn-insert-opendialog');
                $(btn).insertBefore(this.grid);
            }

            btn.referFn = this.referFn;
            btn.addEventListener('click', function () {
                $(this.referFn.dialog).dialog({ show: true, title: 'เพิ่มข้อมูล' });
            });
        },
        splitColumnsPerType: function () {
            let insertcols = this.gridconf.fields.filter(function (item) {
                return item.forinsert === true;
            });

            this.columns = { insertcols: insertcols };
        },
        createDialog: function () {
            let dialog = document.createElement('div');
            let width = this.dialogwidth;
            dialog.style.width = width + 'px';
            dialog.style.background = '#fff';
            dialog.classList.add('outline');

            this.referFn.dialog = dialog;
            return dialog;
        },
        creatLine: function () {
            let line = document.createElement('div');
            line.classList.add('line');
            line.classList.add('txt-2');
            return line;
        },
        createTopic: function (column) {
            let topic = document.createElement('label');
            topic.innerHTML = column.title;
            topic.style.width = this.topicwidth + 'px';
            topic.classList.add('topic');
            return topic;
        },
        createTxtediter: function (column, templ) {
            let edit = document.createElement('input');
            edit.type = 'search';
            edit.my_data = column;
            edit.classList.add('textbox');

            let arry = [];
            templ && (arry = Object.keys(templ));

            for (i = 0; i < arry.length; i++) {
                let key = arry[i];
                let item = templ[arry[i]];

                if (key == 'field')
                    continue;

                if (key === 'source')
                    $(edit).dropdown({
                        source: item,
                        width: this.dialogwidth - this.topicwidth - 20
                    });
                else if (key.startsWith('on'))
                    edit.addEventListener(key.replace('on', ''), item);
                else if (key == 'css')
                    edit.classList.add(item)
                else
                    edit[key] = item;
            }
            return edit;
        },
        createDllediter: function (column, templ) {
            let edit = document.createElement('select');
            edit.my_data = column;
            edit.classList.add('select-2');
            if (!templ.width) {
                edit.style.width = '100%';
                templ.width = this.dialogwidth - this.topicwidth - 20;
            }

            if (templ.value === undefined)
                templ.value = '';

            templ.fixposition = true;

            $(edit).dropdown(templ);
            return edit;
        },
        createChkediter: function (column, templ) {
            let edit = document.createElement('input');
            edit.type = 'checkbox';
            edit.my_data = column;
            edit.value = false;
            edit.text = false;
            edit.addEventListener('change', function () {
                this.value = this.checked;
                this.text = this.checked;
            });

            let arry = [];
            templ && (arry = Object.keys(templ));
            for (i = 0; i < arry.length; i++) {
                let key = arry[i];
                let item = templ[arry[i]];
                if (key === 'field')
                    continue;

                if (key === 'value') {
                    edit.value = item;
                    edit.text = item;
                }

                edit[key] = item;
            };

            return edit;
        },
        getItemTemplate: function (column) {
            let mytempl = [];
            if (this.userconf.itemtemplate)
                mytempl = this.userconf.itemtemplate.filter(function (item) {
                    return column.name == item.field || column.title == item.field;
                });

            if (!mytempl.length)
                mytempl.push({});

            if (column.required)
                mytempl[0].required = true;

            if (column.type === 'checkbox')
                return this.createChkediter(column, mytempl[0]);
            else if (mytempl[0].type === 'dropdown')
                return this.createDllediter(column, mytempl[0]);
            else if (mytempl[0].type !== 'dropdown')
                return this.createTxtediter(column, mytempl[0]);
        },
        createBtnsave: function () {
            let save = document.createElement('input');
            save.classList.add('jsgrid-btnSave');
            save.classList.add('btn-blue');
            save.type = 'button';
            save.style.marginTop = '20px';
            save.referFn = this.referFn;
            save.addEventListener('click', this.onBtnsaveClicked);

            save.value = 'บันทึก';
            return save;
        },
        onBtnsaveClicked: function () {
            let objsInputs = {};
            let grid = this.referFn.grid;
            let dialog = this.referFn.dialog;
            let fields = this.referFn.fields

            let emptyInputs = this.referFn.checkRequiredInputs();
            if (emptyInputs.length)
                return this.referFn.createErrorMsg(emptyInputs);

            //<-- Get all input fields ----<<
            for (i = 0; i < this.referFn.inputfileds.length; i++) {
                let me = this.referFn.inputfileds[i]
                let my_data = me.my_data;

                my_data.value = me.value;
                my_data.text = me.text === undefined ? me.value : me.text;

                //<-- Only Checkbox--<<
                if (my_data.text === true)
                    my_data.value = true;
                else if (my_data.text === false)
                    my_data.value = false;

                objsInputs[my_data.topics] = my_data.value;

                for (f = 0; f < fields.length; f++) {
                    if (fields[f].name === my_data.name) {
                        fields[f].value = my_data.value;
                        fields[f].text = my_data.text;
                        break;
                    };
                };
            };

            //<-- Get all label fields ----<<
            if (this.referFn.labelfileds)
                for (i = 0; i < this.referFn.labelfileds.length; i++) {
                    let me = this.referFn.labelfileds[i]
                    let my_data = me.my_data;
                    objsInputs[my_data.topics] = me.innerHTML;
                };

            //<-- Get all hide fields ----<<
            if (this.referFn.hidefileds)
                for (i = 0; i < this.referFn.hidefileds.length; i++) {
                    let me = this.referFn.hidefileds[i];
                    objsInputs[me.topics] = me.value;
                };

            let onsave = this.referFn.userconf.onsave;
            userSaveFn = function () {
                return new Promise(function (resolve, reject) {
                    objsInputs.resolve = resolve;
                    objsInputs.reject = reject;
                    onsave(objsInputs, fields);
                });
            };

            userSaveFn().then(function (resp) {
                resp = objsInputs

                let Arr = [];

                if (!resp) Arr.push({});
                else if (resp.constructor === Array) Arr = resp;
                else Arr.push(resp);

                let keys = Object.keys(Arr[0]);
                for (i = 0; i < keys.length; i++) {
                    let key = keys[i];

                    if (typeof objsInputs[key] === "function")
                        continue;

                    if (key.toLowerCase().indexOf('error') > -1) {
                        oak.minidialog(resp)
                        return false
                    }

                    for (f = 0; f < fields.length; f++) {
                        if (fields[f].title === key || fields[f].topics === key) {
                            fields[f].value = Arr[0][key];
                            fields[f].text = Arr[0][key];
                            Arr[0][key] = '';
                            break;
                        };
                    };
                };

                let newItem = {};
                for (i = 0; i < fields.length; i++) {
                    if (fields[i].text !== undefined)
                        newItem[fields[i].name] = fields[i].text
                };

                let $grid = $(grid);
                $grid.jsGrid('insertItem', newItem)//<-- this fn not return 'this' ---<<
                $grid.find('.jsgrid-grid-body tr:first-child').addClass('rowupdated');

                $(dialog).dialog('close');
                oak.minidialog(resp);
            });
        },
        checkRequiredInputs: function () {
            let requiredFileds = [];
            for (i = 0; i < this.inputfileds.length; i++) {
                if (this.inputfileds[i].required && this.inputfileds[i].value == '')
                    requiredFileds.push(this.inputfileds[i]);
            }
            return requiredFileds;
        },
        createErrorMsg: function (inputs) {
            oak.minidialog({ icon: 'error', value: 'กรอกข้อมูลไม่ครบ' });

            for (i = 0; i < inputs.length; i++) {
                inputs[i].classList.add('input-error');
            };

            window.setTimeout(function () {
                for (i = 0; i < inputs.length; i++) {
                    inputs[i].classList.remove('input-error');
                };
            }, 9000);
        },
        construction: function () {
            let dialog = this.createDialog();

            for (cl = 0; cl < this.columns.insertcols.length; cl++) {
                let line = this.creatLine();
                let me = this.columns.insertcols[cl];
                let topic = this.createTopic(me);
                let input = this.getItemTemplate(me);

                line.appendChild(topic);
                line.appendChild(input);
                dialog.appendChild(line);
                this.referFn.inputfileds.push(input);//<-- use at save process --<<
            }

            let btnsave = this.createBtnsave();
            dialog.appendChild(btnsave);
        }
    };
    new createFn();
};
oak.grid_update = function (args) {

    let createFn = function () {
        this.userconf = args.updater;
        this.gridconf = args.config;
        this.grid = args.grid;
        this.topicwidth = this.userconf.topicwidth || oakdef.topicwidth;
        this.dialogwidth = this.userconf.dialogwidth || oakdef.dialogwidth;
        this.addRefer();
        this.splitColumnsPerType(); //<-- column.insert// column.read --<<       
        this.construction();
    }
    createFn.prototype = {
        addRefer: function () {
            this.referFn = {};
            this.referFn.openDialog = this.openDialog;
            this.referFn.inputfileds = [];
            this.referFn.labelfileds = [];
            this.referFn.hidefileds = [];
            this.referFn.userconf = this.userconf;
            this.referFn.rowclick = this.onRowclick;
            this.referFn.checkRequiredInputs = this.checkRequiredInputs;
            this.referFn.createErrorMsg = this.createErrorMsg;
            this.referFn.grid = this.grid;

            this.gridconf.referFn = this.referFn;
        },
        onRowclick: function (item, rowItemArray) {

            let rowItem = rowItemArray.item;
            for (input = 0; input < this.inputfileds.length; input++) {
                let tagName = this.inputfileds[input].tagName;
                let inputName = this.inputfileds[input].my_data.name;
                let inputEle = this.inputfileds[input];

                //<-- record origin value to prev_value ---<<
                inputEle.my_data.prev_value = rowItem[inputName];

                if (tagName === 'INPUT' && inputEle.type === 'checkbox') {
                    inputEle.checked = rowItem[inputName];
                    inputEle.value = rowItem[inputName];
                }


                if (tagName === 'INPUT') {
                    inputEle.value = rowItem[inputName];
                }
                else if (tagName === 'SELECT') {
                    for (var i = 0; i < inputEle.options.length; i++) {
                        if (inputEle.options[i].text === rowItem[inputName]) {
                            inputEle.selectedIndex = i;
                            inputEle.text = rowItem[inputName];
                            break;
                        }
                    }
                    var event = new Event('change');
                    this.inputfileds[input].dispatchEvent(event);
                }
            };

            for (label = 0; label < this.labelfileds.length; label++) {
                let labelName = this.labelfileds[label].my_data.name;
                this.labelfileds[label].innerHTML = rowItem[labelName];
            };

            for (hide = 0; hide < this.hidefileds.length; hide++) {
                let hideName = this.hidefileds[hide].name;
                this.hidefileds[hide].value = rowItem[hideName];
            };

            this.fields = rowItemArray.fields;
            this.dialog.dialog({ show: true, title: 'แก้ไขข้อมูล' });

        },
        splitColumnsPerType: function () {
            let updatecols = this.gridconf.fields.filter(function (item) {
                return item.forupdate === true;
            });

            let readcols = this.gridconf.fields.filter(function (item) {
                return item.forread === true;
            });

            let hidecols = this.gridconf.fields.filter(function (item) {
                return item.forhide === true;
            });
            this.columns = { updatecols: updatecols, readcols: readcols, hidecols: hidecols };
        },
        createDialog: function () {
            let dialog = document.createElement('div');
            let width = this.dialogwidth;
            dialog.style.width = width + 'px';
            dialog.style.background = '#fff';
            dialog.classList.add('outline');

            this.referFn.dialog = $(dialog);
            return dialog;
        },
        creatLine: function () {
            let line = document.createElement('div');
            line.classList.add('line');
            line.classList.add('txt-2');
            return line;
        },
        createTopic: function (column) {
            let topic = document.createElement('label');
            topic.innerHTML = column.title;
            topic.style.width = this.topicwidth + 'px';
            topic.classList.add('topic');
            return topic;
        },
        createTxtediter: function (column, templ) {
            let edit = document.createElement('input');
            edit.type = templ.type || 'search';
            edit.my_data = column;
            edit.classList.add('textbox');

            let arry = [];
            templ && (arry = Object.keys(templ));

            for (i = 0; i < arry.length; i++) {
                let key = arry[i];
                let item = templ[arry[i]];

                if (key == 'field')
                    continue;

                if (key === 'source')
                    $(edit).dropdown({
                        source: item,
                        width: this.dialogwidth - this.topicwidth - 20
                    });
                else if (key.startsWith('on'))
                    edit.addEventListener(key.replace('on', ''), item);
                else if (key == 'css')
                    edit.classList.add(item)
                else
                    edit[key] = item;
            }
            return edit;
        },
        createDllediter: function (column, templ) {
            let edit = document.createElement('select');
            edit.my_data = column;
            edit.classList.add('select-2');

            if (templ.required)
                edit.required = true;

            if (!templ.width) {
                edit.style.width = '100%';
                templ.width = this.dialogwidth - this.topicwidth - 20;
            }
            templ.fixposition = true;

            $(edit).dropdown(templ);
            return edit;
        },
        createChkediter: function (column, templ) {
            let edit = document.createElement('input');
            edit.type = 'checkbox';
            edit.my_data = column;
            edit.value = false;
            edit.text = false;
            edit.addEventListener('change', function () {
                this.value = this.checked;
                this.text = this.checked;
            });

            let arry = [];
            templ && (arry = Object.keys(templ));
            for (i = 0; i < arry.length; i++) {
                let key = arry[i];
                let item = templ[arry[i]];
                if (key === 'field')
                    continue;

                if (key === 'value') {
                    edit.value = item;
                    edit.text = item;
                }

                edit[key] = item;
            };

            return edit;
        },
        createlbl: function (column) {
            let readonly = document.createElement('label');
            readonly.classList.add('read');
            readonly.my_data = column;
            readonly.style.width = '100%';
            return readonly;
        },
        getItemTemplate: function (column) {
            let mytempl = [];
            if (this.userconf.itemtemplate)
                mytempl = this.userconf.itemtemplate.filter(function (item) {
                    return column.name == item.field || column.title == item.field;
                });

            if (!mytempl.length)
                mytempl.push({});

            if (column.required)
                mytempl[0].required = true;

            if (column.type === 'checkbox')
                return this.createChkediter(column, mytempl[0]);
            else if (mytempl[0].type === 'dropdown')
                return this.createDllediter(column, mytempl[0]);
            else if (mytempl[0].type !== 'dropdown')
                return this.createTxtediter(column, mytempl[0]);
        },
        createBtnclose: function () {
            let save = document.createElement('input');
            save.classList.add('jsgrid-btnSave');
            save.classList.add('btn-blue');
            save.type = 'button';

            save.referFn = this.referFn;
            save.addEventListener('click', function () {
                $(this.referFn.dialog).dialog('close');
            });

            save.value = 'ปิด';
            return save;
        },
        createBtnsave: function () {
            let save = document.createElement('input');
            save.classList.add('jsgrid-btnSave');
            save.classList.add('btn-blue');
            save.type = 'button';
            save.referFn = this.referFn;
            save.addEventListener('click', this.onBtnsaveClicked);

            save.value = 'บันทึก';
            return save;
        },
        onBtnsaveClicked: function () {
            let objsInputs = {};
            let grid = this.referFn.grid;
            let dialog = this.referFn.dialog;
            let fields = this.referFn.fields

            let emptyInputs = this.referFn.checkRequiredInputs();
            if (emptyInputs.length)
                return this.referFn.createErrorMsg(emptyInputs);

            //<-- Get all input fields ----<<
            for (i = 0; i < this.referFn.inputfileds.length; i++) {
                let me = this.referFn.inputfileds[i]
                let my_data = me.my_data;

                my_data.value = me.value;
                my_data.text = me.text === undefined ? me.value : me.text;

                //<-- Only Checkbox--<<
                if (my_data.text === true)
                    my_data.value = true;
                else if (my_data.text === false)
                    my_data.value = false;

                objsInputs[my_data.topics] = my_data.value;

                for (f = 0; f < fields.length; f++) {
                    if (fields[f].name === my_data.name) {
                        fields[f].value = my_data.value;
                        fields[f].text = my_data.text;
                        break;
                    };
                };
            };

            //<-- Get all label fields ----<<
            if (this.referFn.labelfileds)
                for (i = 0; i < this.referFn.labelfileds.length; i++) {
                    let me = this.referFn.labelfileds[i]
                    let my_data = me.my_data;
                    objsInputs[my_data.topics] = me.innerHTML;
                };

            //<-- Get all hide fields ----<<
            if (this.referFn.hidefileds)
                for (i = 0; i < this.referFn.hidefileds.length; i++) {
                    let me = this.referFn.hidefileds[i];
                    objsInputs[me.topics] = me.value;
                };

            let thisrow = this.referFn.thisrow;
            let onsave = this.referFn.userconf.onsave;
            userSaveFn = function () {
                return new Promise(function (resolve, reject) {
                    objsInputs.resolve = resolve;
                    objsInputs.reject = reject;
                    onsave(objsInputs, fields);
                });
            };

            userSaveFn().then(function (resp) {
                let Arr = [];
                if (!resp) Arr.push({});
                else if (resp.constructor === Array) Arr = resp;
                else Arr.push(resp);

                let keys = Object.keys(Arr[0]);
                for (i = 0; i < keys.length; i++) {
                    let key = keys[i]
                    if (key.toLowerCase().indexOf('error') > -1) {
                        oak.minidialog(resp)
                        return false
                    }

                    for (f = 0; f < fields.length; f++) {
                        if (fields[f].title === key) {
                            fields[f].value = Arr[0][key]
                            fields[f].text = Arr[0][key]
                            break;
                        };
                    };
                };

                let newItem = {};
                for (i = 0; i < fields.length; i++) {
                    if (fields[i].text !== undefined)
                        newItem[fields[i].name] = fields[i].text

                };

                //oak.minidialog(resp);
                $(grid).jsGrid('updateItem', thisrow, newItem);
                $(dialog).dialog('close');

            }).catch(function (resp) {
                let prevDialog_icon = oakdef.dialog_icon;
                oakdef.dialog_icon = 'error';
                oak.minidialog(resp);

                //<-- Reset oakdef.dialog_icon to the original --<<
                oakdef.dialog_icon = prevDialog_icon;
            });

        },
        checkRequiredInputs: function () {
            let requiredFileds = [];
            for (i = 0; i < this.inputfileds.length; i++) {
                if (this.inputfileds[i].required && this.inputfileds[i].value == '')
                    requiredFileds.push(this.inputfileds[i]);
            }
            return requiredFileds;
        },
        createErrorMsg: function (inputs) {
            oak.minidialog({ icon: 'error', value: 'กรอกข้อมูลไม่ครบ' });
            for (i = 0; i < inputs.length; i++) {
                inputs[i].classList.add('input-error');
            };

            window.setTimeout(function () {
                for (i = 0; i < inputs.length; i++) {
                    inputs[i].classList.remove('input-error');
                };
            }, 9000);
        },
        construction: function () {
            let dialog = this.createDialog();
            let btnsave = this.userconf.onsave ?
                this.createBtnsave() : this.createBtnclose();

            for (cl = 0; cl < this.columns.readcols.length; cl++) {
                let line = this.creatLine();
                let me = this.columns.readcols[cl];
                let topic = this.createTopic(me);
                let label = this.createlbl(me);

                line.appendChild(topic);
                line.appendChild(label);
                dialog.appendChild(line);
                this.referFn.labelfileds.push(label);
            }
            for (cl = 0; cl < this.columns.updatecols.length; cl++) {
                let line = this.creatLine();
                let me = this.columns.updatecols[cl];
                let topic = this.createTopic(me);
                let input = this.getItemTemplate(me);

                line.appendChild(topic);
                line.appendChild(input);
                dialog.appendChild(line);
                this.referFn.inputfileds.push(input);
            }

            for (cl = 0; cl < this.columns.hidecols.length; cl++) {
                this.referFn.hidefileds.push(this.columns.hidecols[cl]);
            }

            dialog.appendChild(btnsave);

        }
    };
    new createFn();
};
oak.grid_remover = function (args) {
    let fields = args.config.fields;
    fields[fields.length] = { type: "control", modeSwitchButton: true, editButton: false, width: '50', align: "left" };
    args.config.onsave_delete = args.remover.onsave;
};

oakfn.set_grid_filter_autocomplete = function (data, autocomplete_list) {
    let list = {};
    $.each(autocomplete_list, function (key, val) {
        list[val.name] = data.reduce(function (memo, e1) {
            var matches = memo.filter(function (e2) {
                return e1[val.name] === e2;
            });
            if (!matches.length) memo.push(e1[val.name]);
            return memo;
        }, []);
    });
    return list;
};
oak.grid.gridcontroller = {
    loadData: function (source) {
        if (!source)
            return jsGrid.oakfn[this.id].data
        else {
            STR = 'jsGrid.oakfn[this.id].data.filter(function (e) { return ';
            $.each(source, function (i, v) {
                STR += 'number' === typeof v ? "e[" + i + "] == " + v
                    : 'boolean' === typeof v ? "e[" + i + "] == " + v
                        : "-1 < e[" + i + "].indexOf('" + v + "')";
                STR += " && ";
            });
            STR = STR.slice(0, -4);
            STR += ' }); ';

            return eval(STR);
        }
    }
};

oak.grid.useExternalSearch = function (args) {
    var gridSearchfields = function (args) {
        if (args.at) args.at = oak.pureHtml(args.at);
        else args.at = this;
        if (!args.at === undefined) return false;
        if (!args.getsourcefrom) return this;
        if (!args.linecss) args.linecss = 'txt-2';
        if (!args.fieldcss) args.fieldcss = '';
        if (!args.subfieldcss) args.subfieldcss = '';
        if (!args.fieldsperrow) args.fieldsperrow = 2;
        if (!args.topicminwidth) args.topicminwidth = '120px';

        this.getFieldsPerRow(args);
        this.getGridSearchColumn();
        this.getSource(args);
        this.renderFields(args);
    };
    gridSearchfields.prototype = {
        source: [],
        gridSearchColumns: [],
        getSource: function (args) {
            if (!args || !args.getsourcefrom)
                return;

            if (args.getsourcefrom.constructor === Array)
                this.source = Object.keys(args.getsourcefrom[0]);

            if (args.getsourcefrom instanceof HTMLElement || args.getsourcefrom.id)
                this.source = jsGrid.oakfn[args.getsourcefrom.id].fields;

            if (args.fields)
                this.avaliablefields = args.fields;

        },
        renderFields: function (args) {
            this.createLine = function () {
                var line = document.createElement('div');
                line.classList.add('row');
                $(line).addClass(args.linecss);
                return line;
            }
            this.createSubLine = function (i) {
                var sub = document.createElement('div');
                var stdcss = ' bar pr-3';
                $(sub).addClass(args.subfieldcss + stdcss);
                return sub;
            }
            this.createField = function (item) {
                var eleType = item.type || 'text';
                var field = document.createElement('input');
                field.classList.add('flex-grow');
                field.type = eleType;
                field.myGridSearchColumn = this.gridSearchColumns[item.name];
                field.addEventListener('blur', function () {
                    if (this.value.length > 0)
                        this.myTopic.classList.add('fill');
                    else
                        this.myTopic.classList.remove('fill');
                });
                field.addEventListener('keyup', function () {
                    if (this.value.length > 0)
                        this.myTopic.classList.add('fill');
                    else
                        this.myTopic.classList.remove('fill');

                    this.myGridSearchColumn.value = this.value;
                    $(this.myGridSearchColumn).trigger('input');
                });

                if (item.filter) {
                    var setSelectSource = function () {
                        var itemIndex = item.name;
                        var useItem = jsGrid.oakfn[args.getsourcefrom.id].data.map(function (item) {
                            return item[itemIndex]
                        });
                        var uniqueItem = useItem.filter(function (item, i, ar) {
                            return ar.indexOf(item) === i
                        });

                        $(field).dropdown({
                            source: uniqueItem,
                            fixposition: true,
                            onselected: function (evt) {
                                this.myGridSearchColumn.value = evt.newvalue;
                                $(this.myGridSearchColumn).trigger('input');
                            }
                        });
                    }();
                }

                $(field).addClass(args.fieldcss);
                return field;
            };
            this.createField.addRefer = function (me, myRefer) {
                me.myTopic = myRefer;
            };
            this.createTopic = function (item) {
                var label = document.createElement('label');
                label.innerHTML = item.topics;
                label.classList.add('oak-searchf-topic')
                label.style.minWidth = args.topicminwidth;

                return label;
            };
            this.build = function () {
                var line = this.createLine();

                for (i = 0; i < this.source.length; i++) {
                    if (this.source[i].forhide)
                        continue;

                    if (this.avaliablefields && this.avaliablefields.indexOf(this.source[i].topics) === -1 && this.avaliablefields.indexOf(this.source[i].name) === -1)
                        continue;

                    var feild = this.createField(this.source[i]);
                    var label = this.createTopic(this.source[i]);
                    var sub = this.createSubLine(i);

                    this.createField.addRefer(feild, label);

                    sub.appendChild(label);
                    sub.appendChild(feild);
                    line.appendChild(sub);

                }

                args.at.appendChild(line);
            }
            //<-- Launch --<<
            this.build();
        },
        getFieldsPerRow: function (args) {
            if (args.fieldsperrow === 1)
                args.subfieldcss += ' col-12';
            else if (args.fieldsperrow === 2)
                args.subfieldcss += ' col-6';
            else if (args.fieldsperrow === 3)
                args.subfieldcss += ' col-4';
            else if (args.fieldsperrow === 4)
                args.subfieldcss += ' col-3';
            else if (args.fieldsperrow === 5)
                args.subfieldcss += ' col-2';
            else
                args.fieldcss += ' col-1';
        },
        getGridSearchColumn: function () {
            this.gridSearchColumns = $(args.getsourcefrom).find('.jsgrid-filter-row>td>input');
        }
    };

    new gridSearchfields(args);
}

$.fn.upload = function (args, event) {
    oak.upload.core(this[0], args);

    if (typeof args === 'string') {
        if (args === 'uploading')
            this[0].uploadFn.uploading(event);
        else if (args === 'deletefile')
            this[0].uploadFn.deleteUploadedFile(event);
        else if (args === 'clear') {
            this[0].uploadFn.clearLayout();
            this[0].uploadFn.clearFiles();
        }
        else if (args === 'setfilesinfo')
            this[0].uploadFn.setfilesinfo(event);
        else if (args === 'getfilesinfo')
            return this[0].files;
        else if (args === 'getfileschanged')
            return this[0].uploadFn.getFilesChanged(event);
    }
    else if (typeof args === 'object') {
        this[0].uploadFn.createUploader();
        this[0].uploadFn.createFilesLayout();
    };
    return this;
};
oak.upload.core = function (me, args) {
    //<--me.displayfileinfo     = Files Layout --<<
    //<--me.myuploadEle         = Files Input ---<<
    //<--me.myuploadEle.myfiles = Files Collection(Form Data) ---<<
    //<--me._files               = Files Collection(Info) --<<
    if (me.uploadFn) return;

    let onsuccess = args.onsuccess || $.noop;
    let onerror = args.onerror || $.noop;
    let source = args.source || '';
    let accept = args.accept || null;
    let myfunction = { onsuccess: onsuccess, onerror: onerror, source: source }
    let responseto = oak.pureHtml(args.responseto);
    let createFormData = function () {
        formData = new FormData();
        let myuploadEle = me.myuploadEle.myfiles;
        for (i = 0; i < myuploadEle.length; i++) {
            formData.append(
                myuploadEle[i].name,
                myuploadEle[i]);
        }
        return formData;
    };
    let setDisplayFileInfo = function (data) {
        data.type = data.type ? data.type.replace('application/', '') : '';

        let extension = data.name.split('.').pop().toLowerCase();

        if (extension.indexOf('xls') > -1)
            data.type = 'Excel';
        else if (extension.indexOf('doc') > -1)
            data.type = 'Word';
        else if (extension.indexOf('ppt') > -1)
            data.type = 'Power Point';
        else if (data.type.startsWith('image/'))
            data.type = 'Picture';
        else if (['rar', 'zip', '7z'].indexOf(extension) > -1)
            data.type = 'Compressed File';
        else if (!data.type)
            data.type = 'N/A';

        let line = document.createElement('div');
        line.classList.add('line');

        //<-- Incase,  readonly mod, me._files be undefined --<<
        let removebtn = null;
        if (!me.args.readonly) {
            removebtn = document.createElement('label');
            removebtn.innerText = 'ลบ';
            removebtn.classList.add('removebtn');
            removebtn.myuploadEle = me.myuploadEle;
            removebtn.onremove = me.uploadFn.onremove;
            removebtn.filename = data.name;
            removebtn.me = me;
            removebtn.addEventListener('click', function () {
                let btn = this;
                let remove = function () {
                    //  for (i = 0; i < me._files.length; i++) {
                    // if (me._files[i].name === btn.filename) {
                    btn.onremove(me._files[i]).then(function (result) {
                        if (result && result.errormessage)
                            return oak.minidialog({ icon: 'error', value: result.errormessage });

                        btn.parentNode.parentNode.removeChild(btn.parentNode);

                        if (btn.myuploadEle.myfiles.length)
                            btn.myuploadEle.myfiles = btn.myuploadEle.myfiles.filter(function (item) {
                                return item.name != btn.filename;
                            });

                        me.filesName = me.filesName.filter(function (name) {
                            return name != btn.filename;
                        });
                        me._files = me._files.filter(function (item) {
                            return item.name != btn.filename;
                        });
                    });

                };
                $(this).confirm({
                    title: 'ยืนยันการลบไฟล์',
                    position: { margin_top: -25, margin_left: -130 },
                    buttons: [{
                        text: 'ลบเลย',
                        css: 'btn-red btn-mid-size',
                        onclick: remove
                    },
                    {
                        text: 'ไม่ลบ',
                        css: 'btn-blue btn-mid-size'
                    }]
                });
            });
        }

        let filename = document.createElement('label');
        filename.innerHTML = data.name;
        filename.classList.add('filename');

        if (data.allowdownload) {
            filename.classList.add('download');
            filename.addEventListener('click', function () {
                let data = this.downloadInfo;

                if (data.path && (!data.uploadto || !data.containername)) {
                    let startofUploadto = data.path.indexOf('/');
                    let endofUploadto = data.path.lastIndexOf('/');

                    data.containername = data.path.substring(0, startofUploadto);
                    data.uploadto = data.path.substring(startofUploadto + 1, endofUploadto);
                    data.name = data.path.substring(endofUploadto + 1, data.path.length);
                }

                if (!data.uploadto && !data.name)
                    return { errormessage: '"name" and "uploadto" cannot be empty', error: 1 }

                oak.downloadfile({
                    containername: this.downloadInfo.containername,
                    downloadfrom: this.downloadInfo.uploadto + '/' + this.downloadInfo.name
                })

            });
        }
        else {
            filename.style.pointerEvents = 'none';
            data.allowdownload = false;
        }

        let size = document.createElement('label');
        size.classList.add('size');
        size.innerHTML = data.size ? toFileSizeFormat(data.size) : '';

        let type = document.createElement('label');
        type.classList.add('type');
        type.innerHTML = data.type;

        line.appendChild(filename);
        line.appendChild(size);
        line.appendChild(type);
        me._files && line.appendChild(removebtn);

        me.displayfileinfo.append(line);
        if (me.args && me.args.containername)
            data.containername = me.args.containername;

        if (me.args && me.args.uploadto)
            data.uploadto = me.args.uploadto;

        data.path = data.containername + '/' + data.uploadto + '/' + data.name;

        me._files && me._files.push(data);
        me.filesName && me.filesName.push(data.name);
        //<-- use to indicates the URL( for Downloading) when click on a File's Name --<<      
        filename.downloadInfo = data;
    };
    let setDisplayEmpty = function () {

        let line = document.createElement('div');
        let message = document.createElement('lable');
        line.classList.add('bar');
        line.classList.add('empty');
        if (me.args.readonly)
            line.style.justifyContent = 'inherit';

        message.innerHTML = oakdef.upload_empty;
        line.appendChild(message);
        me.displayfileinfo.append(line);
        me.isEmptyFile = true;
    }
    let isDuplicateFile = function (newFilename) {
        return me.filesName.filter(function (i) {
            return i === newFilename
        });
    };
    let createDiscription = function () {
        let maxfile = args.maxfileamount || oakdef.upload_maxfile_amount;
        let maxsize = args.maxfilesize || oakdef.upload_maxfile_size
        let div = document.createElement('div');
        div.classList.add('discription');
        div.innerHTML = 'อัพโหลดได้ ' + maxfile + ' ไฟล์ | ไฟล์ละไม่เกิน ' + toFileSizeFormat(maxsize);
        return div;
    };

    me.uploadFn = {};
    me.onchange = args.onchange || $.noop;
    me.uploadFn.createFilesLayout = function () {
        if (!responseto) {
            responseto = document.createElement('div');
            let witdh = me.args.width || me.getBoundingClientRect().width;
            responseto.style.width = witdh + 'px';
            responseto.style.marginTop = '2px';
            $(responseto).insertAfter(me);
        };

        responseto.classList.add('upload-filesLayout');
        responseto.classList.add('bar');
        me.displayfileinfo = responseto;

        if (me.tagName === 'DIV') {
            if (args.width) {
                if (!isNaN(args.width)) args.width += 'px'
                me.style.width = args.width;
                me.displayfileinfo.style.width = args.width;
            } else args.width = '100%';
            if (args.height) {
                if (!isNaN(args.height)) args.height += 'px';
                me.style.height = args.height;
            } else me.style.height = oakdef.upload_height + 'px';
        } else
            me.displayfileinfo.style.display = 'none';
    };
    me.uploadFn.createUploader = function () {
        me.args = args;

        if (me.fnAlreadyExists)
            return;

        if (me.args.readonly) {
            me.style.display = 'none';
            return;
        }

        let inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = accept;
        inputFile.myfunction = myfunction;
        inputFile.myfiles = [];
        inputFile.maxFilesAmount = me.args.maxfileamount || oakdef.upload_maxfile_amount;
        inputFile.maxFilesSize = (me.args.maxfilesize || oakdef.upload_maxfile_size);
        inputFile.addEventListener('change', function () {
            if (!this.value) {
                this.value = "";
                return oak.minidialog({ icon: 'error', value: 'ไม่สามารถเข้าถึงไฟล์ดังกล่าว' });
            }
            me.onchange(this);
            if (me.tagName !== 'DIV') {
                this.value = "";
                return;
            }

            if (isDuplicateFile(this.files[0].name).length) {
                this.value = "";
                return oak.minidialog({ icon: 'error', value: 'ไม่สามารถอัพโหลดไฟล์ชื่อซ้ำกัน' });
            }

            if (this.myfiles.length >= this.maxFilesAmount) {
                this.value = "";
                return oak.minidialog({ icon: 'error', value: 'อัพโหลดได้สูงสุดไม่เกิน ' + this.maxFilesAmount + ' ไฟล์' });
            }

            if (this.files[0].size > this.maxFilesSize) {
                this.value = "";
                return oak.minidialog({ icon: 'error', value: 'ขนาดไฟล์ห้ามเกิน ' + toFileSizeFormat(this.maxFilesSize) });
            }

            if (me.isEmptyFile) {
                me.displayfileinfo.innerHTML = '';
                me.isEmptyFile = false;
            };

            this.myfiles.push(this.files[0]);
            setDisplayFileInfo({
                name: this.files[0].name,
                size: this.files[0].size,
                type: this.files[0].type
            });

            this.value = "";
        });
        inputFile.style.display = 'none';


        me.myuploadEle = inputFile;
        me.tagName === 'DIV' && me.classList.add('uploadinput');
        me.tagName === 'DIV' && me.classList.add('bar-item');
        me.addEventListener('click', function () { this.myuploadEle.click() });
        me.tagName === 'DIV' && (me.innerHTML = me.args.placeholder || oakdef.upload_placeholder);
        me._files = [];
        me.filesName = [];
        me.filesAsStart = [];
        me.filesNameAsStart = [];
        me.filesChange = [];
        me.fnAlreadyExists = true;
        me.tagName === 'DIV' && me.appendChild(createDiscription());

        let dragover = function (e) {
            this.classList.add('uploadinput-dragover');
            e.preventDefault();
        };
        let dragenter = function (e) {
            e.preventDefault();
        };
        let dragleave = function (e) {
            this.classList.remove('uploadinput-dragover');
            e.preventDefault();
        };
        let drop = function (e) {
            this.classList.remove('uploadinput-dragover');
            if (e.dataTransfer.files[0]) {
                this.myuploadEle.myfiles.push(e.dataTransfer.files[0]);
                setDisplayFileInfo({
                    name: e.dataTransfer.files[0].name,
                    size: e.dataTransfer.files[0].size,
                    type: e.dataTransfer.files[0].type
                });
            }
            else
                oak.minidialog({ icon: 'error', value: 'ไม่สามารถเข้าถึงไฟล์ได้' });

            e.preventDefault();
        };

        me.addEventListener("dragleave", dragleave);
        me.addEventListener("dragover", dragover);
        me.addEventListener("dragenter", dragenter);
        me.addEventListener("drop", drop);
        me.parentNode.insertBefore(inputFile, me.nextSibling);
    };
    me.uploadFn.clearLayout = function () {
        me.displayfileinfo.innerHTML = '';
    };
    me.uploadFn.clearFiles = function () {
        if (!me.myuploadEle)
            return;
        me.myuploadEle.myfiles = [];
        me.filesName = [];
        me._files = [];
    };
    me.uploadFn.uploading = function (event) {
        let params = {};
        let onuploaded = me.args.onuploaded || event.onuploaded;
        let deletefiles = function () {
            let file = me.uploadFn.getFilesChanged().deletedfiles;
            return $.map(file, function (item) {
                return item.path
            });
        };
        params.url = WEBAPI.host + WEBAPI.Uploadfn;
        params.files = createFormData();
        params.deletefiles = deletefiles() || [];
        params.uploadto = me.args.uploadto || event.uploadto;
        params.containername = me.args.containername || event.containername;
        params.server = me.args.server || event.server || '';
        params.onsuccess = function (resp) {
            if (resp.success) {
                let item = $.extend(me.uploadFn.getFilesChanged(), resp);
                onuploaded(item);

                me.uploadFn.setfilesinfo({
                    source: item.currentfiles,
                    allowdownload: true
                });
            }
        }
        params.onerror = me.args.onuploadfailed || event.onuploadfailed;

        if (me.myuploadEle.myfiles.length === 0 && params.deletefiles.length === 0)
            return onuploaded($.extend(me.uploadFn.getFilesChanged(), { filesnotchanged: true }));

        if (event.uploadto || event.containername) {
            for (i = 0; i < me._files.length; i++) {
                me._files[i].containername = event.containername;
                me._files[i].uploadto = event.uploadto;
                me._files[i].path = me._files[i].containername + '/' + me._files[i].uploadto + '/' + me._files[i].name;
            }
        }
        oak.ajaxpost(params);
    };
    me.uploadFn.setfilesinfo = function (data) {
        //<-- clear previous data and layout --<<
        me.uploadFn.clearLayout();
        me.uploadFn.clearFiles();

        let source = data.source;
        me.filesAsStart = [];
        me.filesNameAsStart = [];

        if (!source || !source.length)
            setDisplayEmpty();
        else
            for (i = 0; i < source.length; i++) {
                let I = source[i];

                if (!I.path)
                    I.path = I.containername + '/' + I.uploadto + '/' + I.name;

                else if (I.path && (!I.containername || !I.uploadto)) {
                    let startofUploadto = I.path.indexOf('/');
                    let endofUploadto = I.path.lastIndexOf('/');

                    I.containername = I.path.substring(0, startofUploadto);
                    I.uploadto = I.path.substring(startofUploadto + 1, endofUploadto);
                    I.name = I.path.substring(endofUploadto + 1, I.path.length);
                }

                me.filesNameAsStart.push(I.name);
                me.filesAsStart.push(I);
                I.allowdownload = data.allowdownload;
                setDisplayFileInfo(I);
            }
    }
    me.uploadFn.onremove = function (item) {
        let params = {};
        params.onremoved = me.args.onremoved || $.noop;
        params.onremovefaild = me.args.onremovefaild || $.noop;

        params.onremoving = function () {
            return new Promise(function (resolve) {
                let fn = me.args.onremoving || function (item) { return item }
                resolve(fn(item));
            });
        };

        return new Promise(function (resolve) {
            params.onremoving(item)
                .then(function (result) {
                    resolve(params.onremoved(result));
                })
                .catch(function (result) {
                    resolve(params.onremovefaild(result));
                });
        });
    };
    me.uploadFn.deleteUploadedFile = function (event) {
        let params = {};
        params.url = WEBAPI.host + WEBAPI.Uploadfn;
        params.deletepath = me.args.deletepath || event.deletepath;
        params.containername = me.args.containername || event.containername;

        params.onsuccess = function (result) {
            (me.args.ondeleted || event.ondeleted)(result);
        }
        oak.ajaxpost(params);

        if (event.uploadto || event.containername) {
            for (i = 0; i < me._files.length; i++) {
                let curr = me._files[i];
                curr.containername = event.containername;
                curr.uploadto = event.uploadto;
                curr.path = curr.containername + '/' + curr.uploadto + '/' + curr.name
            }

        }

    };
    me.uploadFn.getFilesChanged = function () {
        let oldf = me.filesNameAsStart;
        let newf = me.filesName;

        // let deletedfilesname = oldf.filter(x => !newf.includes(x));
        let deletedfilesname = oldf.filter(function (item) {
            return !newf.includes(item)
        });

        //let newfilesname = newf.filter(x => !oldf.includes(x));
        let newfilesname = newf.filter(function (item) {
            return !oldf.includes(item)
        })


        let newuploadfiles = $.map(me.myuploadEle.myfiles, function (item) {
            return item.name;
        });

        //let reuploadfilesname = newuploadfiles.filter(x => !newfilesname.includes(x));

        let reuploadfilesname = newuploadfiles.filter(function (item) {
            return !newfilesname.includes(item)
        });

        if (reuploadfilesname.length) {
            deletedfilesname = deletedfilesname.concat(reuploadfilesname);
            newfilesname = newfilesname.concat(reuploadfilesname);
        };

        let deletedfiles = me.filesAsStart.filter(function (item) {
            return deletedfilesname.indexOf(item.name) > -1
        });
        let newfiles = me._files.filter(function (item) {
            return newuploadfiles.indexOf(item.name) > -1
        });
        let currentfiles = me._files;
        let logs = function () {
            if (deletedfiles.length)
                for (i = 0; i < deletedfiles.length; i++) { deletedfiles[i].event = 'delete'; }

            if (newfiles.length)
                for (i = 0; i < newfiles.length; i++) { newfiles[i].event = 'new'; }

            return deletedfiles.concat(newfiles);
        }();

        return {
            deletedfilesname: deletedfilesname,
            newfilesname: newfilesname,
            deletedfiles: deletedfiles,
            newfiles: newfiles,
            currentfiles: currentfiles,
            logs: logs
        }
    };
};

$.fn.excelimport = function (args) {
    if (!args)
        args = {}
    if (!args.onsuccess)
        args.onsuccess = $.noop;

    if (!args.onerror)
        args.onerror = $.noop;

    if (!args.imported)
        args.imported = '';

    if (args.casttostring === undefined)
        args.casttostring = true

    if (!window.JSZip)
        oak.ajaxget({
            url: SV.host + SV.DependencyRootPath + 'JSZip/jszip.min.js',
            async: false,
            ajaxconfig: { datatype: 'script' }
        });

    oak.excelimport.core(args);
};
oak.excelimport.core = function (args) {
    let coreFN = function () {
        this.args = args;
        this.clearRefer();
        this.createFileInputer();
        this.createDialog();
        this.Launching();
    }

    coreFN.prototype = {
        clearRefer: function () {
            if (!window.excelimport)
                window.excelimport = {};

            //<-- Clear previous excel file(if exists)--<<
            if (window.excelimport.fileInput)
                window.excelimport.fileInput.value = '';

            //<-- Reset args ---<<
            window.excelimport.args = this.args;

        },
        createFileInputer: function () {
            if (window.excelimport.createFileInputer)
                return;

            let input = document.createElement('input');
            input.type = 'file';
            input.style.display = 'none';
            input.accept = ',.xls,.xlsx,.csv';
            input.addEventListener('change', this.onChange);

            document.body.appendChild(input);
            window.excelimport.fileInput = input;

            window.excelimport.createFileInputer = true;

        },
        createDialog: function () {
            if (window.excelimport.createDialog)
                return;

            let dialog = document.createElement('div');
            let select = document.createElement('select');
            let message = document.createElement('div');

            message.innerHTML = 'เลือก Sheet ที่ต้องการ';
            message.classList.add('mb10');
            message.style.fontSize = '.8em';
            message.style.color = 'var(--error-c)';

            dialog.classList.add('p10')
            select.classList.add('select-2');
            select.style.width = '350px';
            select.addEventListener('change', function () {
                window.excelimport.dialogChooseSheet.dialog('hide');
                window.excelimport.args.sheet = this.value;

                let evt = document.createEvent("HTMLEvents");
                evt.initEvent("change", false, true);
                window.excelimport.fileInput.dispatchEvent(evt);
                window.excelimport.fileInput.value = '';
            });

            dialog.appendChild(message);
            dialog.appendChild(select);

            window.excelimport.dialogChooseSheet = $(dialog).dialog({ show: false });
            window.excelimport.selectChooseSheet = $(select);
            window.excelimport.setDialogContent = this.setDialogContent;
            window.excelimport.getExcelSheets = this.getExcelSheets;

            window.excelimport.createDialog = true;
        },
        setDialogContent: function (source) {
            window.excelimport.selectChooseSheet
                .dropdown({
                    source: source,
                    placeholder: oakdef.excelimport_choose_sheet_msg,
                    fixposition: true
                });

            window.excelimport.dialogChooseSheet.dialog('show');
        },
        getExcelSheets: function (excelFile, sheetName) {
            return new Promise(function (resolve) {
                if (sheetName)
                    return resolve([sheetName]);
                if (excelFile.name.toLowerCase().indexOf('.xlsx') === 0)
                    return resolve([]);

                let result = [];
                let sheets;
                let zip = new JSZip();
                zip.loadAsync(excelFile, { base64: true }).then(function (zip) {
                    let xlsx = zip.file('xl/workbook.xml')
                    if (!xlsx) return resolve([]);

                    xlsx.async("string")
                        .then(function (data) {
                            sheets = data.split('name=');
                            for (sheet = 1; sheet < sheets.length; sheet++) {
                                let name = sheets[sheet].split(' sheetId')[0].replace(/["']/g, "")
                                result.push(name);
                            }
                            return resolve(result);
                        }).catch(function () { return resolve(result); });
                });
            });
        },
        onChange: function () {
            let args = window.excelimport.args;
            let file;

            if (!this.value)
                return false;

            if (!this.files || !this.files[0])
                return false
            else
                file = this.files[0];

            window.excelimport
                .getExcelSheets(file, args.sheet)
                .then(function (sheet) {


                    if (sheet.constructor === Array) {
                        if (sheet.length === 0)//<-- If JSZip.js cannot read the excel file--<<
                            args.sheet = ''
                        else {
                            sheet = sheet.filter(function (item) {
                                if (!item.includes('</'))
                                    return item;
                            })

                            if (sheet.length > 1)//<--- If the excel file had only one sheet---<<
                                return window.excelimport.setDialogContent(sheet);
                            else
                                args.sheet = sheet[0];//<-- If user defined specific 'sheetname or sheet index' // {sheet: 'Sheet1'}

                        }
                    };

                    let formData = new FormData();
                    formData.append("filename", file.name);
                    formData.append("excelsheetname", args.sheet || args.excelsheetname);
                    formData.append("casttostring", args.casttostring);
                    formData.append("file", file);

                    $.ajax({
                        type: 'post',
                        url: SV.host + args.importto,
                        processData: false,
                        contentType: false,
                        data: formData,
                        success: args.onsuccess || $.noop,
                        error: args.onerror || $.noop
                    });

                });
        },
        Launching: function () {
            window.excelimport.fileInput.click();
        }
    }
    new coreFN();
}

$.fn.emailing = function (args) {
    args.Emailingfn = true;

    let objectToArry = function (obj) {
        if (!obj) return '';

        if (obj[0] && typeof obj[0] === 'object') {
            let key = Object.keys(obj[0])[0]
            let arry = [];
            for (i = 0; i < obj.length; i++) {
                arry.push(obj[i][key])
            }
            return arry + '';
        }
        else return obj += '';
    };

    if (args.config && args.config.emailto)
        args.config.emailto = objectToArry(args.config.emailto);

    if (args.config && args.config.emailcc)
        args.config.emailcc = objectToArry(args.config.emailcc);

    oak.ajaxpost(args);
};

$.fn.browser = function () {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/);
        if (tem !== null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
};

$.fn.datebox = function (args) {
    if (this[0].dataset.layout && this[0].dataset.layout === 'inline')
        return this.dateboxinline(args);

    if (!oak.datepicker) {
        oak.ajaxget({
            url: SV.host + SV.DependencyRootPath + 'Bootstrap-Datepicker/bootstrap-datepicker.oak.min.js',
            async: false,
            ajaxconfig: { datatype: 'script' }
        });
        $(document).off('.datepicker.data-api');
    }

    if (!args) args = {};

    if (this[0].dataset.startview)
        args.startview = this[0].dataset.startview;
    else if (!args.startview)
        args.startview = 0;

    if (!isNaN(args.startview))
        args.startview = parseInt(args.startview)

    let getdate = {};
    if (!args.defaultViewDate) {
        let x = getDate();
        getdate.day = x.date
        getdate.month = x.month
        getdate.year = x.year
    } else
        getdate = args.defaultViewDate;


    this[0].type = "text";
    this[0].autocomplete = "off";
    return this.datepicker({
        daysOfWeekHighlighted: [0, 6],
        todayBtn: true,
        todayHighlight: true,
        format: 'dd/mm/yyyy',
        language: 'th',
        autoclose: true,
        weekStart: 1,
        thaiyear: true,
        startView: args.startview
    });


};
$.fn.dateboxinline = function (args) {
    this[0].type = "text";
    this[0].autocomplete = "off";
    this[0].addEventListener('keydown', function (evt) {
        if ([8, 9, 37, 39].indexOf(evt.which) > - 1)
            return true;


        if (isNaN(evt.key) || this.value.length === 10)
            evt.preventDefault();

    });
    this[0].addEventListener('keyup', function (evt) {
        if (this.value.length === 2 && evt.which !== 8)
            this.value += '/';
        else if (this.value.length === 5 && evt.which !== 8)
            this.value += '/';

        else if (this.value.length >= 10) {
            let iserror = 0;
            let BE = oakdef.isBE ? 500 : 0
            let i = this.value.split('/');
            i[0] > 31 && (iserror = 1)
            i[1] > 12 && (iserror = 1)
            i[2] < 1800 + BE && (iserror = 1)
            i[2] > 2200 + BE && (iserror = 1)

            if (iserror === 1 && this.value.length) {
                this.classList.add('error_msg')
                this.iserror = 1;
            }
            else {
                this.classList.remove('error_msg');
                this.iserror = 0;
            }
        }
    });
    this[0].addEventListener('focusout', function () {
        if (this.value.length === 8 || this.value.length === 9) {
            let i = this.value.split('/');
            i[0].length === 1 && i[0] > 0 && (i[0] = '0' + i[0]);
            i[1].length === 1 && i[1] > 0 && (i[1] = '0' + i[1]);
            this.value = i[0] + '/' + i[1] + '/' + i[2];
        }

        if (this.value.length > 0 && this.value.length != 10)
            this.classList.add('error_msg');
        else if (this.iserror)
            this.classList.add('error_msg');
        else
            this.classList.remove('error_msg');
    });
};

$.fn.refer = function (refername, source) {
    if (source === undefined)
        return this[0][refername];

    if (source instanceof jQuery)
        this[0][refername] = source[0]
    else
        this[0][refername] = source

    return this;
};
$.fn.referTo = function (refername, destination) {
    if (destination[0])
        destination[0][refername] = this[0];
    else
        destination[refername] = this[0];

    return this;
};

$.fn.dialog = function (args) {
    let me = this;
    let create = function () {
        this.get_Bootstrap_modal();
        this.args = args || {};
        this.me = me;
        this.dataset = this.me[0].dataset
        this.validate_parameters();
        this.construction();
    }

    create.prototype = {
        validate_parameters: function () {
            // <-- parametor is string --<<
            if (typeof this.args == 'string') {
                this.modal_string_method();
                return;
            };

            // <-- draggable --<<
            if (this.dataset.draggable !== undefined)
                this.draggable = this.dataset.draggable;
            else if (this.me.draggable === true)
                this.draggable = true;
            else if (this.args.draggable === undefined)
                this.draggable = true;
            else
                this.draggable = this.args.draggable;

            // <-- backdrop --<<
            if (this.dataset.backdrop !== undefined)
                this.backdrop = this.dataset.backdrop;
            else if (this.args.backdrop !== undefined)
                this.backdrop = this.args.backdrop;
            else
                this.backdrop = false;

            // <-- show --<<
            if (this.args.show !== undefined) {
                if (this.args.show === 'toggle') {
                    if (this.me[0].dataset.show = 'true') this.show = false;
                    else this.show = true;
                }
                else
                    this.show = this.args.show
            }
            else if (this.show === undefined)
                this.show = false;

            // <-- position--<<
            if (this.args.position)
                this.position = this.args.position
            else
                this.position = { x: 'center', y: 'top', margin_top: '50' };

            this.draggable === 'true' && (this.draggable = true);
            this.draggable === 'false' && (this.draggable = false);
            this.backdrop === 'true' && (this.backdrop = true);
            this.backdrop === 'false' && (this.backdrop = false);

            // <-- title --<<
            this.title = this.args.title || this.me[0].title || '';
        },
        get_Bootstrap_modal: function () {
            if (!oak.modal)
                oak.ajaxget({
                    url: SV.host + SV.DependencyRootPath + '/Modal/modal.min.js',
                    async: false,
                    ajaxconfig: { datatype: 'script' }
                });
        },
        modal_string_method: function () {
            if (this.args === 'open')//<-- for older version --<<
                this.args = 'show';
            else if (this.args === 'close')//<-- for older version --<<
                this.args = 'hide';

            if (this.args === 'dispose') {
                let outline = $(this.me[0].my_outline)
                outline.modal('hide');
                outline.modal('dispose');
                outline.remove();
            } else
                $(this.me[0].my_outline).modal(this.args);


        },
        outline_create: function () {
            let div = document.createElement("div");
            div.classList.add('modal');
            div.classList.add(this.args.effect || oakdef.dialog_effect);
            return div;
        },
        outline_position: function () {
            outline = this.me[0].my_outline;
            let x = this.position.x;
            let y = this.position.y;

            let mar_top = this.position.margin_top;
            let mar_bottom = this.position.margin_bottom;
            let mar_left = this.position.margin_left;
            let mar_right = this.position.margin_right;
            let scr_w = document.documentElement.clientWidth;
            let scr_h = document.documentElement.clientHeight;
            let rect = outline.getBoundingClientRect();
            if (!isNaN(x)) x = parseInt(x);
            if (!isNaN(y)) y = parseInt(y);

            if (this.position.at) {
                let bind = oak.pureHtml(this.position.at);
                let rect = bind.getBoundingClientRect();
                x = rect.left;
                y = rect.top;
            }

            if (x === 'left') x = 0;
            else if (x === 'center') x = (scr_w / 2) - (rect.width / 2);
            else if (x === 'right') x = scr_w - rect.width;

            if (y === 'top') y = 0;
            else if (y === 'center') y = (scr_h / 2) - (rect.height / 2);
            else if (y === 'bottom') y = scr_h - rect.height;

            if (mar_left) x += parseInt(mar_left);
            else if (mar_right) x -= parseInt(mar_right);

            if (mar_top) y += parseInt(mar_top);
            else if (mar_bottom) y -= parseInt(mar_bottom);

            scollheight = window.pageYOffset || document.documentElement.scrollTop;

            outline.style.left = x + 'px';
            outline.style.top = y + scollheight + 'px';
        },
        dialog_create: function () {
            let div = document.createElement("div");
            //div.classList.add('modal-dialog');
            return div;
        },
        content_create: function () {
            let div = document.createElement("div");
            div.classList.add('modal-content');
            div.style.display = ' table-cell'
            return div;
        },
        header_create: function () {
            let header = document.createElement("div");
            header.classList.add('modal-header');

            let h4 = document.createElement("h3");
            h4.classList.add('modal-title');
            h4.innerHTML = this.title;

            let button = document.createElement("input");
            button.type = 'button'
            button.classList.add('close')
            button.setAttribute('data-dismiss', 'modal');
            button.style.cursor = 'pointer';

            header.appendChild(h4);
            header.appendChild(button);

            return header;
        },
        body_create: function () {
            let body = document.createElement("div");
            body.classList.add('modal-body');
            return body;
        },
        me_prepare: function () {
            this.me[0].alreadyhandle = true;
            this.me[0].style.display = null;
            this.me[0].dataset.draggable = this.draggable;
            this.me[0].dataset.backdrop = this.backdrop;
            this.me[0].dataset.show = this.show;
            this.me[0].outline_position = this.outline_position;
        },
        me_modal: function (outline) {
            let $outline = $(outline);
            $outline
                .modal({
                    show: this.show,
                    backdrop: this.backdrop
                });

            if (this.draggable)
                $outline.drag({ drawer: outline.drawer });
        },
        construction: function () {
            if (typeof this.args == 'string')
                return;

            if (!this.me[0].alreadyhandle) {
                let body = this.body_create();
                body.appendChild(this.me[0]);

                let head = this.header_create();

                let content = this.content_create();
                content.appendChild(head);
                content.appendChild(body);

                let dialog = this.dialog_create();
                dialog.appendChild(content);

                let outline = this.outline_create();
                outline.drawer = head;
                outline.appendChild(dialog);

                this.me[0].my_outline = outline;
            }
            this.me_prepare();
            this.me_modal(this.me[0].my_outline);
            this.outline_position();
        }
    };
    new create();
    return me;
};

$.fn.drag = function (args) {
    if (!args.drawer)
        return;

    if (args.drawer.drag_added)//<-- incase this ele have already been added drag's function--<<
        return;

    let dragged;
    if (args.dragged)
        dragged = oak.pureHtml(args.dragged);
    else
        dragged = this[0];

    let drawer = args.drawer;

    drawer.my_target = dragged;
    drawer.draggable = true;
    drawer.drag_added = true;
    drawer.style.cursor = 'move';
    drawer.origin_transitionDuration = drawer.style.transitionDuration;
    drawer.addEventListener('mousedown', function (e) {
        let rect = this.getBoundingClientRect();
        this.rect_h = rect.height;
        this.rect_w = rect.width;
        this.posi_y = rect.top + rect.height - e.pageY;
        this.posi_x = rect.left + rect.width - e.pageX;
        this.my_target.classList.add('move');

    });

    drawer.addEventListener('drag', function (e) {

        if (e.pageY < 1 || e.pageX < 1) return;

        let scollheight = window.pageYOffset || document.documentElement.scrollTop;

        this.my_target.style.top = (scollheight + e.pageY + this.posi_y - this.rect_h) + 'px';
        this.my_target.style.left = (e.pageX + this.posi_x - this.rect_w) + 'px';


    });

    drawer.addEventListener('dragend', function (e) {
        this.my_target.classList.remove('move');
    });
    drawer.addEventListener('mouseup', function (e) {
        this.my_target.classList.remove('move');
    });

    return $(dragged);
};

$.fn.pureHtml = function (element) {
    if (!element)
        return undefined
    else if (typeof element === 'string')
        return $(element)[0]
    else if (element instanceof jQuery)
        return element[0]
    else
        return element
};

$.fn.confirm = function (args) {
    if (!args || !args.buttons)
        return;

    let buttons;
    let defConfirmTxt = 'ยืนยัน';
    let defCancelTxt = 'ยกเลิก';
    let defTitle = '';
    let defBackdrop = true;
    let defdraggable = false;


    if (!args.position) {
        args.position = {}
        args.position.at = this;
    }

    if (args.position && (!args.position.x || !args.position.y))
        args.position.at = this;

    if (!args.buttons instanceof Array) {
        buttons.push(args.buttons);
    } else
        buttons = args.buttons;

    let layout = document.createElement('div');
    layout.classList.add('p5')

    for (i = 0; i < buttons.length; i++) {
        let btn = document.createElement('input');

        if (buttons[i].css) {
            let CSSs = buttons[i].css.split(' ');
            for (a = 0; a < CSSs.length; a++) {
                btn.classList.add(CSSs[a]);
            }
        }

        if (i < buttons.length - 1)
            btn.classList.add('mr5');

        btn.type = 'button';
        btn.value = buttons[i].text;
        btn.clickEvent = buttons[i].onclick;
        btn.onclick = function () {
            if (this.clickEvent)
                this.clickEvent();

            $(layout).dialog('dispose');
        }

        if (i === 0 && !btn.text) btn.text = defConfirmTxt;
        else if (i === 1 && !btn.text) btn.text = defCancelTxt;

        layout.appendChild(btn);
    }

    $(layout).dialog({
        show: true,
        backdrop: args.backdrop || defBackdrop,
        title: args.title || defTitle,
        position: args.position,
        draggable: args.draggable || defdraggable,
        effect: 'modal-fadein'
    })
};

$.fn.processingButton = function (args, rollback) {
    let elements = [];
    let shadowThemes = {
        yellow: 'rgba(255, 242, 5, 0.8)',
        green: 'rgb(8, 86, 105)',
        purple: '#3d2ca8',
        blue: '#253e85',
        ILPYellow: '#cace21'
    };
    let defaultValue = oakdef.processingButton_value;
    let loadingTime = args.loadingtime || oakdef.processingButton_loadingTime;
    let timeOut = oakdef.processingButton_timeOut
    let shadowValue = '';

    if (args === false || args == 'visible') {
        rollback = true;
        args = {};
    } else if (args === undefined)
        args = {};

    if (this[0] instanceof HTMLElement)
        elements.push(this[0]);

    if (args.elements)
        elements.concat(args.elements);

    if (args.value === undefined)
        args.value = true;

    if (args.color)
        shadowValue = args.color
    else if (args.theme !== undefined)
        shadowValue = shadowThemes[args.theme];
    else
        shadowValue = shadowThemes[oakdef.processingButton_theme];

    if (args.timeout)
        timeOut = args.timeout;

    let addLoadingCss = function (element) {
        if (element.LoadingCssClassIsExists)
            return element.classList.add(element.LoadingCssClassName);

        let id = element.id || Math.random().toString(36).substring(7);
        let width100Per = element.getBoundingClientRect().width;
        let keyframeName = 'keyframeOf_' + id;
        let callerName = 'calleOf_' + id;

        let keyf = document.createElement('style');
        keyf.type = 'text/css';
        keyf.innerHTML = '@keyframes ' + keyframeName + ' { '
            + '0% {box-shadow: inset 0 0 0 0 ' + shadowValue + ';} '
            + '60% {box-shadow: inset  ' + width100Per + 'px 0 0 1px ' + shadowValue + ';}'
            + '80% {box-shadow: inset  ' + width100Per + 'px 0 0 1px ' + shadowValue + ';}'
            + '100% {box-shadow: inset  0 ' + width100Per + 'px 0 0 0 ' + shadowValue + ';}'
            + '} ';

        let caller = document.createElement('style');
        caller.type = 'text/css';
        caller.innerHTML = '.' + callerName + '{animation:' + keyframeName + ' ' + loadingTime / 1000 + 's infinite}';

        document.getElementsByTagName('head')[0].appendChild(caller);
        document.getElementsByTagName('head')[0].appendChild(keyf);
        element.LoadingCssClassIsExists = true;
        element.LoadingCssClassName = callerName;
        element.classList.add(callerName);
    }
    let removeLoadingCss = function (element) {
        callerName = element.LoadingCssClassName;
        element.classList.remove(callerName);
    }

    for (i = 0; i < elements.length; i++) {
        let me = oak.pureHtml(elements[i]);
        if (!rollback) {
            me.valueOrigin = me.value;
            me.disabled = true;
            me.style.pointerEvents = 'none';
            if (args.value)
                me.value = args.value == true ? defaultValue : args.value;

            loadingTime && addLoadingCss(me);

            window.setTimeout(function () {
                $(me).processingButton(false);
            }, timeOut);

        } else {

            if (me.valueOrigin)
                me.value = me.valueOrigin;

            me.disabled = false;
            me.style.pointerEvents = 'visible';
            removeLoadingCss(me)
        }
    };

    return this;
}

$.fn.progressbar = function (args) {
    args = args === undefined ? {} : args;
    var ele = this[0];
    $.fn.progressbar.prototype.ele = this[0];
    this.createBar = function () {
        if (ele.dataset.createdbar)
            return;

        var bar = document.createElement('div');
        bar.style.width = '0%';
        bar.style.height = args.height || '6px';
        bar.style.background = args.background || '#0096A9';
        bar.style.position = 'absolute';
        bar.style.transition = '.5s width';
        ele.appendChild(bar);
        ele.dataset.createdbar = true;
        ele.style.zIndex = 999;
        ele.mybar = bar;
    }
    this.move = function () {
        ele.mybar.style.display = '';
        window.setTimeout(function () { ele.mybar.style.width = '60%'; }, 100);
    };
    $.fn.progressbar.prototype.ele = ele;

    this.createBar();
    this.move();
};
$.fn.progressbar.clear = function () {
    var ele = $.fn.progressbar.prototype.ele;
    if (ele.mybar) {
        window.setTimeout(function () { ele.mybar.style.width = '100%'; }, 100);
        window.setTimeout(function () { $(ele.mybar).fadeOut(500) }, 400);
        window.setTimeout(function () { ele.mybar.style.width = '0%'; }, 900);
    }

};

$.fn.activemenu = function (args) {
    if (!args) args = {};
    if (this instanceof Array && this instanceof jQuery)
        args.container = this[0];

    if (!args.buttons) return this;

    if (!args.container)
        args.buttonsHTML = $(args.buttons);
    else
        args.buttonsHTML = this.find($(args.buttons));

    if (args.buttonsHTML.length === 0) return this;
    if (!args.activecss) args.activecss = '';
    if (!args.inactivecss) args.inactivecss = '';

    args.allMyContainers = [];
    for (i = 0; i < args.buttonsHTML.length; i++) {
        if (args.buttonsHTML[i].dataset.mycontainer)
            args.allMyContainers.push(args.buttonsHTML[i].dataset.mycontainer);
    };

    var onclick = function () {
        $(this.myMember).removeClass(this.activecss);
        $(this).addClass(this.activecss);

        if (this.inactivecss) {
            $(this.myMember).addClass(this.inactivecss);
            $(this).removeClass(this.inactivecss);
        }

        if (this.allMyContainers && this.dataset.mycontainer) {
            var myContatainer = this.dataset.mycontainer;
            var hideContainers = this.allMyContainers.filter(function (item) {
                return item !== myContatainer
            });

            $(myContatainer).slideDown();
            for (i = 0; i < hideContainers.length; i++) {
                $(hideContainers[i]).slideUp();
            }
        }

        if (args.onclick)
            args.onclick(this);
    };

    var defaultContainer = null;
    for (i = 0; i < args.buttonsHTML.length; i++) {
        args.buttonsHTML[i].myMember = args.buttonsHTML;
        args.buttonsHTML[i].activecss = args.activecss;
        args.buttonsHTML[i].inactivecss = args.inactivecss;
        args.buttonsHTML[i].addEventListener('click', onclick);

        if (args.allMyContainers.length)
            args.buttonsHTML[i].allMyContainers = args.allMyContainers;

        if (args.buttonsHTML[i].dataset.defaultContainer)
            defaultContainer = args.buttonsHTML[i];
    }

    if (defaultContainer)
        $(defaultContainer).trigger('click');
}