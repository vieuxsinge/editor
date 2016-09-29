angular.module('editor.views.layout', ['ui.router'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider
      .state('layout', {
        abstract: true,
        templateUrl: 'editor/views/layout/layout.html'
      });
  }])
