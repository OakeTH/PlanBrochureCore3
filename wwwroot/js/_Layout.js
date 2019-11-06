$(document).ready(function () {

    sharedFn = {};
    sharedFn.loadingMessage = {
        show: function () {
            $(divWebLoading).progressbar();
        },
        hide: function () {
            $(divWebLoading).progressbar.clear()
        }
    };
    sharedFn.warningBox = function (message) {
        if (!message) message = 'ไม่พบข้อมูล';

        var icon = '<i class="fas fa-exclamation-circle mr10"></i>';
        return $('<div class="error_warning_big"> ' + icon + message + ' </div>');
    };

    startupFn = function () {

        this.setupDefaultJqueryFunctions = function () {
            //<-- Setup ajax default parameters.
            $.ajaxSetup({
                beforeSend: function () {
                    sharedFn.loadingMessage.show();
                },
                complete: function () {
                    sharedFn.loadingMessage.hide();
                },
                error: function (response) {
                    var obj;

                    if (response.status === 404)
                        return oak.minidialog({ icon: 'error', value: 'Error 404 - Page Not Found' })

                    try {
                        obj = JSON.parse(response.responseText);

                        if (typeof obj.errors === 'object') {
                            var arrObj = Object.keys(obj.errors);
                            for (i = 0; i < arrObj.length; i++) {
                                oak.minidialog({ icon: 'error', value: obj.errors[arrObj[i]][0] })
                            }
                        } else if (typeof obj.errors === 'string')
                            oak.minidialog({ icon: 'error', value: obj.errors });

                    } catch (e) {
                        oak.minidialog({ icon: 'error', value: response.responseText })
                    }
                }
            });

            //<-- Setup oak.grid default parameters.
            $.gridSetup({
                theme: 'clear',
                excelbutton: false,
                onemptydata: function (me) {
                    me.style.display = 'none';
                    oak.minidialog({ icon: 'error', value: 'ไม่พบข้อมูล' });
                }
            });
        };
        this.webFn = function () {
            //<-- window.webFn is globo static object, all of javascript's functions in each pages will be extent to this one.
            window.webFn = {};
        };
        this.user = {
            //<-- authenticationAsync had no longger use to login the user, now use "loginFn"'s function in "Login.js" instant.
            //<-- This function use for get user available menu.
            //<-- First if for: user go to this page by redirect from login.cshtml
            //<-- Else for: user enter this page directy. 
            authenticationAsync: function () {
                var getMainManu = this.getMainManu;

                return new Promise(function (resolve, reject) {
                    //if (sessionStorage['EmployeeCode']) {
                    //    window.webFn.Menu = getMainManu(JSON.parse(sessionStorage['Menu']));
                    //    window.webFn.SubMenu = JSON.parse(sessionStorage['Menu']);
                    //    window.webFn.UserInfo = {
                    //        roleName: sessionStorage['RoleName'],
                    //        employeeCode: sessionStorage['EmployeeCode']
                    //    };
                    //    return resolve();

                    //} else {
                    $.ajax({
                        url: SV.host + "authentication/getmenu",
                        method: 'POST',
                        success: function (response) {
                            window.webFn.Menu = getMainManu(response.menu);
                            window.webFn.SubMenu = response.menu;
                            //window.webFn.Menu = getMainManu(JSON.parse(response.menu));
                            //window.webFn.SubMenu = JSON.parse((response.menu));
                            window.webFn.UserInfo = {
                                roleName: response.roleName,
                                employeeCode: response.employeeCode
                            };
                            return resolve();
                        }
                    });
                    //  };
                });

            },
            createMenu: function () {
                this.createDiv = function (option) {
                    var div = document.createElement('div');
                    div.classList.add('btn');
                    div.innerText = option.text;
                    div.myOption = option;
                    div.addEventListener('click', this.renderPartailView);
                    return div;
                };
                this.createIcon = function (option) {
                    var i = document.createElement('i');
                    i.classList.add('fas');
                    i.classList.add('fa-' + option.icon);
                    return i;
                };
                //<-- get partailViews from server (Only for the first time which user enter to each page.)
                //<-- and stored that partailViews to sessionStorage(Clinet side). Next time when user enter back to the same page.
                //<-- partailViews will be get from sessionStorage instant server.
                this.renderPartailView = function () {
                    var ssPrefix = 'ssAGV_partailOf_';
                    var option = this.myOption;
                    // var option = window.webFn.Menu.filter(function (item) { return item.id === myMainMenuId })[0];

                    var createContentHeader = function () {
                        this.createDiv = function () {
                            var div = document.createElement('div');
                            div.classList.add('btn');
                            div.innerText = option.text;
                            div.myOption = option;
                            return div;
                        };
                        this.createIcon = function () {
                            var i = document.createElement('i');
                            i.classList.add('fas');
                            i.classList.add('fa-' + option.icon);
                            return i;
                        };

                        var div = this.createDiv();
                        var icon = this.createIcon();
                        $(div).prepend(icon).appendTo(".content-header");
                    };
                    //<-- Create sub menu $(.content-sub-menu>label)for each page.
                    var createSubMenu = function () {
                        //<label data-mycontainer="#divUser" data-default-container="true"><i class="fas fa-user-tie mr10" style="color:#f83c58"></i>Admin User</label>
                        this.getSubMenu = function () {
                            return window.webFn.SubMenu.filter(function (item) { return item.iD_Menu_Main === option.id })
                        }
                        this.createLabel = function (item) {
                            var label = document.createElement('label');
                            label.innerText = item.subText;
                            label.dataset["mycontainer"] = item.mycontainer;
                            return label;
                        };
                        this.createIcon = function (item) {
                            var i = document.createElement('i');
                            i.style.color = item.subColor;
                            i.classList.add('mr10');
                            i.classList.add('fas');
                            i.classList.add('fa-' + item.subIcon);
                            return i;
                        };
                        this.build = function () {
                            var submenu = this.getSubMenu();
                            for (i = 0; i < submenu.length; i++) {
                                var label = this.createLabel(submenu[i]);
                                var icon = this.createIcon(submenu[i]);
                                $(label).prepend(icon).appendTo("#containerMenu .content-sub-menu");

                                if (i === 0)
                                    label.dataset["defaultContainer"] = true;
                            }
                        };

                        this.build();
                    };
                    var runStardnardFn = function (option) {
                        createContentHeader();
                        createSubMenu();
                        eval(option.javascriptFn);
                    };

                    if (sessionStorage[ssPrefix + option.id]) {
                        divContainer.innerHTML = sessionStorage[ssPrefix + option.id];
                        runStardnardFn(option);
                    }
                    else {
                        $.ajax({
                            url: SV.host + option.partailViewUrl,
                            beforeSend: function () {
                                //<-- Replace default function with do nothing
                            },
                            complete: function () {
                                //<-- Replace default function with do nothing
                            },
                            success: function (data) {
                                divContainer.innerHTML = data;
                                sessionStorage[ssPrefix + option.id] = data;
                                runStardnardFn(option);
                                //createContentHeader();
                                //createSubMenu();
                                //eval(option.javascriptFn);
                            }
                        });
                    }

                    //<-- Remove all Dialogs if exists --<<
                    $(".modal-backdrop").remove();
                    $(".modal.modal-slidedown").remove();
                };
                this.applyActiveMenuCSS = function () {
                    oak.activemenu({
                        buttons: '.btn',
                        activecss: 'btn-accept',
                        onclick: function () {
                            //    $(divUserMenu).find('.btn-accept').clone().removeClass('btn btn-accept').appendTo(".content-header");
                        }
                    })
                };
                this.build = function () {
                    for (i = 0; i < window.webFn.Menu.length; i++) {
                        var div = this.createDiv(window.webFn.Menu[i]);
                        var icon = this.createIcon(window.webFn.Menu[i]);
                        $(div).prepend(icon);
                        divUserMenu.appendChild(div);
                    }
                    this.applyActiveMenuCSS();

                    //<-- auto selected one menu if there is only 1 menu.
                    $(divUserMenu).children('div.btn').first().trigger('click');

                };
                this.build();
            },
            setUserInfo: function () {
                spanUserFullName.innerText = window.webFn.UserInfo.employeeCode || '';
            },
            getMainManu: function (data) {
                return data.map(function (item) {
                    return { id: item.id, text: item.text, icon: item.icon, partailViewUrl: item.partailViewUrl, javascriptFn: item.javascriptFn }
                    //return { id: item.ID, text: item.Text, icon: item.Icon, partailViewUrl: item.PartailViewUrl, javascriptFn: item.javascriptFn }
                }).distinct();
            }
        };
        this.setupDefaultJqueryFunctions();
        this.webFn();
        this.user.authenticationAsync()
            .then(function () {
                this.user.createMenu();
                this.user.setUserInfo();
            })
            .catch(function (response) {
                sharedFn.loadingMessage.hide();
                oak.minidialog({ icon: 'error', value: 'Error' })
            });
    };

    //<-----------
    startupFn();

});


