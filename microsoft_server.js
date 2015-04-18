/**
 * Created by adamginsburg on 3/04/2015.
 */


MicrosoftOauth = {};

MicrosoftOauth.whitelistedFields = ['user_id', 'name', 'first_name', 'last_name', 'email'];

OAuth.registerService('microsoft', 2, null, function (oauthBinding) {
    //console.log("OAuth.registerService 2:", oauthBinding)
    var response = getTokenResponse(oauthBinding);
    var accessToken = response.accessToken;
    var identity = getIdentity(accessToken);
    console.log("identity", identity);

    var serviceData = {
        id: identity.user_id,
        //screenName: identity.screen_name,
        accessToken: OAuth.sealSecret(oauthBinding.accessToken),
        accessTokenSecret: OAuth.sealSecret(oauthBinding.accessTokenSecret)
    };

    // include helpful fields from twitter
    var fields = _.pick(identity, MicrosoftOauth.whitelistedFields);
    _.extend(serviceData, fields);
    return {
        serviceData: serviceData,
        options: {
            profile: {
                name: identity.name,

            }
        }
    };
});


MicrosoftOauth.retrieveCredential = function (credentialToken, credentialSecret) {
    return OAuth.retrieveCredential(credentialToken, credentialSecret);
};

// returns an object containing:
// - accessToken
// - expiresIn: lifetime of token in seconds
var getTokenResponse = function (query) {
    //console.log("query", query);
    var config = ServiceConfiguration.configurations.findOne({service: 'microsoft'});
    if (!config) {
        throw new ServiceConfiguration.ConfigError("Service not configured");
    }

    var responseContent;

    try {
        // Request an access token
        responseContent = HTTP.post(
            "https://login.live.com/oauth20_token.srf", {
                params: {
                    client_id: config.clientId,
                    client_secret: config.secret,
                    code: query.code,
                    grant_type: 'authorization_code',
                    redirect_uri: Meteor.absoluteUrl("_oauth/microsoft")
                }
            }).content;
        console.log("responseContent:", responseContent);


    } catch (err) {
        throw _.extend(new Error("Failed to complete OAuth handshake with microsoft. " + err.message),
            {response: err.response});
    }
    var parsedResponse = JSON.parse(responseContent);

    if (!parsedResponse.access_token) {
        throw new Error("Failed to complete OAuth handshake with Microsoft " +
        "-- can't find access token in HTTP response. " + parsedResponse);
    }
    return {
        accessToken: parsedResponse.access_token,
        microsoftExpires: (+new Date) + (1000 * parsedResponse.expires_in)
    }


};

var getIdentity = function (accessToken) {


    try {
        var responseData = HTTP.get(
            "https://apis.live.net/v5.0/me", {
                params: {
                    access_token: accessToken,
                }
            }).data;
        console.log("***************** responseContent 2:", responseData);


        var microsoftAccessToken = accessToken;
        var microsoft_id = responseData.id;


    } catch (err) {
        throw _.extend(new Error("Failed to get user details. " + err.message),
            {response: err.response});
    }


    return {
        accessToken: microsoftAccessToken,
        user_id: microsoft_id,
        name: responseData.name,
        email: responseData.emails.preferred

    };
}