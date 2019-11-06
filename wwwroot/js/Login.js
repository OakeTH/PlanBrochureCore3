$(document).ready(function () {

    //<-- check querystring wherever have "externaluser" parametor
    var employeeCode = '';
    //var externaluser = '';
    //var getExternaluserFnTemp = function () {
    //    querystr().externaluser && redirectToIndex();
    //};
    var getExternaluserFn = function () {
        employeeCode = querystr().employeecode || '';
        roleName = querystr().rolename;
        querystr().rolename && redirectToIndex();
    };


    var redirectToIndex = function () {
        oak.minidialog({ icon: 'success', value: 'กำลังล็อกอินเข้าสู่ระบบ ..' })
        loginFn();
    };
    var loginFn = function () {
        $.ajax({
            url: window.myUrl.Login,
            data: {
                employeeCode: txtUsername.value || employeeCode,
                password: txtPassword.value,
                externalUser: querystr().externaluser || '',
                roleName: roleName
            },
            method: 'POST',
            success: function (response) {
                Cookies.set('Authorization', response.token, { expires: 10 });
                sessionStorage['EmployeeCode'] = response.employeeCode;
                sessionStorage['RoleName'] = response.roleName
                sessionStorage['Menu'] = JSON.stringify(response.menu);

                window.location.href = SV.host;

            },
            error: function (response) {
                if (response.status === 401)
                    oak.minidialog({ icon: 'error', value: 'User Name หรือ Password ไม่ถูกต้อง' })
            }
        });
    };

    btnLogin.addEventListener('click', function () {
        loginFn();
    });

    //<-- Launch --<<
    getExternaluserFn();
    //  getExternaluserFnTemp();

});

