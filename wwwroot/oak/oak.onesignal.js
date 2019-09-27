let $onesignal = $.fn.onesignal = [];
$onesignal.getplayers = function (args) {

    if (args.playerid) {
        return oak.ajaxget({
            url: 'https://onesignal.com/api/v1/players/' + args.playerid,
            async: false
        });
    } else if (args.appid) {
        return oak.ajaxget({
            url: 'https://onesignal.com/api/v1/players/PLAYER_ID?app_id=' + args.appid,
            async: false
        });
    }
};
$onesignal.initial = function (args) {
    if (!args) { args = []; }
    if (!args.appid) {
        oak.ajaxget({
            url: WEBAPI.OneSignalGetAppID,
            onsuccess: function (response) {
                args.appid = response;
                $onesignal.register(args);
            }
        });
    } else {
        $onesignal.register(args);
    }
};
$onesignal.register = function (args) {
    var OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
        OneSignal.init({
            appId: args.appid,
            autoRegister: true,
            notifyButton: { enable: false }
        });

        $.each(args.addtags, function (key, val) {
            OneSignal.sendTag(key, val);
        });

        var response = {};
        OneSignal.getUserId(function (id) {
            response.playerid = id;
        });
        OneSignal.getTags(function (tags) {
            response.tags = tags;
            args.onsuccess && args.onsuccess(response);
        });

    });
};
