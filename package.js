Package.describe({
  name: 'adamgins:microsoft-oauth',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Login with hotmail etc',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.use('http', ['client', 'server']);
  api.use('templating', 'client');
  api.use('oauth1', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('random', 'client');
  api.use('underscore', 'server');
  api.use('service-configuration', ['client', 'server']);

  api.export('MicrosoftOauth');
  api.addFiles('microsoft_client.js','client');
  api.addFiles('microsoft_server.js','server');


});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('adamgins:microsoft-oauth');
  api.addFiles('microsoft-oauth-tests.js');
});
