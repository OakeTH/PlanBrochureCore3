$(document).ready(function () {

    window.webFn.announceFn = {
        activeMenu: function () {
            oak.activemenu({
                buttons: '.content-sub-menu label',
                activecss: 'active'
            });
        },
        divMath: function () {
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
            var renderGrid = function () {
                getAsync().then(function (response) {

                    $(divAnnounceMathDocsList).grid({
                        source: response,
                        fields: [{
                            fieldname: 'ชื่อไฟล์', width: 500, itemTemplate: function (value) {
                                var div = $('<div>');
                                var i = $('<i>').addClass('fas fa-folder-open mr10');
                                return div.append(i).append(value);
                            }
                        }],
                        onrowclick: function (item) {
                            oak.ajaxpost.redirect({
                                url: SV.host + 'announce/DownLoadAnnounceMathDocsByDocsName',
                                DocsName: item.data["ชื่อไฟล์"]
                            })
                        }
                    })
                })
            };

            renderGrid();
        },
        launch: function () {

            window.webFn.announceFn.activeMenu();
            window.webFn.announceFn.divMath();

        }

    }


});