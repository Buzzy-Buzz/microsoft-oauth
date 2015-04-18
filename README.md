# microsoft-oauth

Very early DRAFT - not install and NOT on http://atmospherejs.com at this time.

Login with a Microsoft Accounts (eg Hormail, Live.com etc, Outlook.com etc... )
Thanks heaps to http://Sunsama.com folks @khamoud and Jacob for getting this off the ground
Also based off https://github.com/meteor/meteor/tree/devel/packages/facebook and other OAuth packages

Basic package for OAuth2 with Microsoft... allows login with Hotmail, Live.com, Outlook.com accounts etc etc

Configure with:
```
ServiceConfiguration.configurations.insert({
    service: "microsoft",
   
    clientId: <your client id>,
    secret: <your secret>,
    //loginStyle: "redirect",
    display: "popup",
    scope:"wl.signin wl.basic wl.emails"

});
```
Use in application with something like:

```

        Meteor.loginWithMicrosoft(function(err){

            if (err){

                throwError("Unable to Login" + err)
            } else {
                Router.go('<somewhere>');
            }

        })
```


