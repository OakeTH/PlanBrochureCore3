$.fn.googleapi_auth = [];
$.getScript('https://apis.google.com/js/api.js', function () {
    let gauth = oak.googleapi_auth;
    gauth.client_id = null;
    gauth.api_key = null;
    gauth.initial = function () {
        gauth.getinitial_keys();
    };
    gauth.initClient = function () {
        let init = gapi.client.init({
            apiKey: gauth.api_key,
            discoveryDocs: ["https://people.googleapis.com/$discovery/rest?version=v1"],
            clientId: gauth.client_id,
            scope: 'profile'
        });

        init.then(function () {
            if (!oak.googleapi_auth.then) {
                return false;
            }
            let me = {};
            if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
                oak.googleapi_auth.me().then(function (me) {
                    oak.googleapi_auth.then(me);
                })

            } else
                oak.googleapi_auth.then({ status: 'unknown' });

        });
    };
    gauth.getinitial_keys = function () {

        if (gauth.client_id == null && gauth.api_key == null) {
            oak.ajaxget({
                url: 'Account/GetGoogleInitial_Keys',
                onsuccess: function (key) {
                    gauth.client_id = key.client_id;
                    gauth.api_key = key.api_key;
                    gapi.load('client:auth2', gauth.initClient);
                }
            });
        } else
            gapi.load('client:auth2', gauth.initClient);

    };
    gauth.updateSigninStatus = function () { };
    gauth.me = function () {
        let get = gauth.get();
        let me = {};
        return get.then(function (res) {
            if (!res.error) {
                me.firstname = res.result.names ? res.result.names[0].givenName : null;
                me.lastname = res.result.names ? res.result.names[0].familyName : null;
                me.photo = res.result.photos ? res.result.photos[0].url : null;
                me.email = res.result.emailAddresses ? res.result.emailAddresses[0].value : null;
                me.gender = res.result.genders ? res.result.genders[0].value : null;
                me.birthday = res.result.birthdays ? res.result.birthdays[0].value : null;
                me.accountid = res.result.resourceName || null;
                me.residence = res.result.residences ? res.result.residences[0].value : null;
                me.phonenumber = res.result.phoneNumbers ? res.result.phoneNumbers[0].value : null;
                me.organization = $.grep(res.result.organizations, function (val, key) {
                    return val.current = true && !val.endDate
                })[0];
                me.status = 'connected';
            } else
                me = res;

            return me;
        });
    };
    gauth.get = function () {
        return new Promise(resolve => {
            gapi.client.people.people.get({
                'resourceName': 'people/me',
                'requestMask.includeField': 'person.names,person.photos,person.emailAddresses,person.genders,'
                    + 'person.organizations,person.residences,person.phoneNumbers,person.birthdays'
            }).then(function (response) {
                resolve(response)
            }).catch(function (response) {
                resolve(JSON.parse(response.body))
            });
        });
    };
    gauth.signin = function () {
        return new Promise(resolve => {
            gapi.auth2.getAuthInstance().signIn().then(function (response) {
                if (response.isSignedIn()) {
                    oak.googleapi_auth.me().then(function (me) {
                        resolve(me);
                    });

                } else
                    resolve(response);

            }, function (error) { resolve(error) });
        });
    }
    gauth.signout = function () {
        return new Promise(resolve => {
            gapi.auth2.getAuthInstance().signOut();
            gapi.auth2.getAuthInstance().disconnect().then(function () {
                gapi.auth2.getAuthInstance().disconnect();
                resolve({ status: "unknown" });
            });

        });
    }

    gauth.initial();

});

