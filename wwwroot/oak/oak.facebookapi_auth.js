$.fn.facebookapi_auth = [];
$.when(
    function () {
        let fbauth = oak.facebookapi_auth;
        fbauth.app_id = null;
        fbauth.app_secret = null;
        fbauth.getinitial_keys = function () {
            if (fbauth.app_id == null && fbauth.app_secret == null) {
                oak.ajaxget({
                    url: 'Account/GetFackbookInitial_Keys',
                    onsuccess: function (key) {
                        fbauth.app_id = key.app_ID;
                        fbauth.app_secret = key.app_Secret;
                        fbauth.fbAsyncInit();
                    }
                });
            } else
                fbauth.fbAsyncInit();
        }
        fbauth.get = function () {
            return new Promise(resolve => {
                FB.api('/me/?fields=id,first_name,last_name,middle_name,name,picture,short_name,email',
                    { "redirect": "false" },
                    function (response) {                   
                        resolve(response)
                    })
            });
        };
        fbauth.me = function () {
            return new Promise(resolve => {
                fbauth.get().then(function (response) {
                    let me = {};
                    if (response.error) {
                        me.error = response.error;
                    } else {
                        me.accountid = response.id;
                        me.firstname = response.first_name ? response.first_name : null;
                        me.lastname = response.last_name ? response.last_name : null;
                        me.birthday = null;
                        me.gender = null;
                        me.organization = null;
                        me.photo = response.picture ? response.picture.data.url : null;
                        me.email = response.email ? response.email : null;
                        me.phonenumber = null;
                        me.residence = null;    
                        me.status = 'connected'
                    }
                    resolve(me);
                });
            });
        };
        fbauth.logout = function () {
            return new Promise(resolve => {
                if (FB.getAccessToken()) {
                    FB.logout(function (response) {              
                        resolve(response);
                    });
                } else {
                    resolve({ status: 'unknown' });
                }

            });
        };
        fbauth.fbAsyncInit = function () {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: fbauth.app_id,
                    cookie: true,
                    xfbml: true,
                    version: 'v3.1'
                });
                oak.facebookapi_auth.then &&
                    FB.getLoginStatus(function (response) {
                        if (response.status == 'connected') {
                            fbauth.me().then(function (response) {
                                response.status = 'connected'
                                oak.facebookapi_auth.then(response);
                            })
                        }
                        else 
                            oak.facebookapi_auth.then(response);
                        
                    });
            };

            fbauth.signin = function () {
                return new Promise(resolve => {
                    FB.login(function (response) {
                        if (response.status == 'connected') {
                            fbauth.me().then(function (response) { resolve(response) })
                        } else
                            resolve(response)

                    }, { scope: 'email' });
                });
            };
        };
        fbauth.getinitial_keys();
    }()

).then(function () {
    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) { return; }
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'))
});
