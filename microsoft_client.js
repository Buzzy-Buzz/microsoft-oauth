/**
 * Created by adamginsburg on 3/04/2015.
 */
MicrosoftOauth = {};
MicrosoftOauth.requestCredential = function (options, credentialRequestCompleteCallback) {
    // support both (options, callback) and (callback).


    if (!credentialRequestCompleteCallback && typeof options === 'function') {

        credentialRequestCompleteCallback = options;
        options = {};
    }

    var config = ServiceConfiguration.configurations.findOne({service: 'microsoft'});
    if (!config) {

        credentialRequestCompleteCallback && credentialRequestCompleteCallback(
            new ServiceConfiguration.ConfigError());
        return;
    }

    var credentialToken = Random.secret();
    var mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
    var display = mobile ? 'touch' : 'popup';

    var scope = "email";
    if (options && options.requestPermissions)
        scope = options.requestPermissions.join(',');
    console.log("MicrosoftOauth 2 config:", config);
    var loginStyle = OAuth._loginStyle('microsoft', config, options);

    var loginUrl =
        'https://login.live.com/oauth20_authorize.srf?client_id=' + config.clientId +
        '&redirect_uri=' + Meteor.absoluteUrl("_oauth/microsoft") +
        '&response_type=' + "code" +
        '&display=' + display + '&scope=' + config.scope +
        '&state=' + OAuth._stateParam(loginStyle, credentialToken);


    OAuth.launchLogin({
        loginService: "microsoft",
        loginStyle: loginStyle,
        loginUrl: loginUrl,
        credentialRequestCompleteCallback: credentialRequestCompleteCallback,
        credentialToken: credentialToken
    });
};


Meteor.loginWithMicrosoft = function (options, callback) {
    // support a callback without options
    if (!callback && typeof options === "function") {
        callback = options;
        options = null;
    }

    var credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
    MicrosoftOauth.requestCredential(options, credentialRequestCompleteCallback);
};
