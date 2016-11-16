angular.module('editor.conf.loadingbar', ['angular-loading-bar'])
  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  });
