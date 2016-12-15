angular.module('editor.views.project', ['ui.router',
  'editor.directives.projectMenu', 'editor.services.projects'])
  .config(function($stateProvider) {
    $stateProvider
      .state('project', {
        abstract: true,
        url: '/{project:[a-z0-9]+}',
        resolve: {
          project: function($stateParams, projects) {
            return projects($stateParams.project);
          }
        },
        views: {
          '': {
            templateUrl: '/editor/views/layout/layout.header.html'
          },
          'header@project': {
            templateUrl: '/editor/views/project/header.html',
            controller: 'ProjectHeaderController'
          }
        }
      })
      .state('project.home', {
        url: '',
        controller: 'ProjectHomeController'
      });
  })
  .controller('ProjectHeaderController', function($scope, project) {
    $scope.project = project;
  })
  .controller('ProjectHomeController', function($state, $stateParams, projectMenu) {
    $state.go(projectMenu.items[0].state, $stateParams);
  });
