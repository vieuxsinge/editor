angular.module('editor.views.project', ['ui.router',
  'editor.directives.projectMenu', 'editor.services.projects'])
  .config(function($stateProvider) {
    $stateProvider
      .state('project', {
        abstract: true,
        url: '/{project}',
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
            templateUrl: '/editor/views/project/header.html'
          }
        }
      })
      .state('project.home', {
        url: '',
        controller: 'ProjectHomeController'
      });
  })
  .controller('ProjectHomeController', function($state, projectMenu) {
    $state.go(projectMenu.items[0].state);
  });
