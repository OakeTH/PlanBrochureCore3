$(document).ready(function () {

    window.webFn.adminFn = {
        activeMenu: function () {
            oak.activemenu({
                buttons: '.content-sub-menu label',
                activecss: 'active'
            });
        },
        divUser: function () {
            var getAsync = function () {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: SV.host + "admin/getUsers",
                        success: function (response) {
                            resolve(response)
                        }
                    });
                });
            }
            var insert = function (item) {
                $.ajax({
                    url: SV.host + "admin/insertUsers",
                    method: 'POST',
                    data: { employeeCode: item.employeeCode, roleID: 1 },
                    success: function (response) {
                        $.extend(item, response);
                        item.roleName = 'Admin';
                        item.resolve();

                        oak.minidialog({ value: 'บันทึกสำเร็จ' })
                    }
                });
            };
            var update = function (item) {
                $.ajax({
                    url: SV.host + "admin/updateUsers",
                    method: 'POST',
                    data: { id: item.id, employeeCode: item.employeeCode },
                    success: function () {
                        item.resolve();
                        oak.minidialog({ value: 'บันทึกสำเร็จ' });
                    }
                });
            };
            var remove = function (item) {
                $.ajax({
                    url: SV.host + "admin/deleteUsers",
                    method: 'POST',
                    data: { id: item.id },
                    success: function (response) {
                        oak.minidialog({ value: 'ลบข้อมูลสำเร็จ' })
                        item.resolve(response)
                    }
                });
            };
            var renderDivUserList = function () {
                getAsync().then(function (response) {
                    for (i = 0; i < response.length; i++) {
                        delete response[i]['menu'];
                        delete response[i]['roleID'];
                        delete response[i]['token'];
                        delete response[i]['addBy'];
                    }

                    $(divUserList).grid({
                        source: response,  
                        excelbutton:true,
                        fields: [
                            { fieldname: 'employeeCode', forupdate: true, forinsert: true, title: 'รหัสพนักงาน' },
                            { fieldname: 'roleName', title: 'สิทธิ์' }
                        ],
                        inserter: {
                            onsave: function (item, aa) {
                                insert(item);
                            }
                        },
                        updater: {
                            topicwidth: 130,
                            onsave: function (item) {
                                update(item);
                            }
                        },
                        remover: {
                            onsave: function (item) {
                                remove(item);
                            }
                        }
                    })
                })
            };

            renderDivUserList();
        },
        launch: function () {
            window.webFn.adminFn.activeMenu();
            window.webFn.adminFn.divUser();
        }
    };
});