angular.module('editor.views.recipes', ['ui.router', 'ui.bootstrap',
  'editor.filters.text', 'editor.filters.recipe', 'editor.data.settings',
  'editor.views.project'])
  .config(function($stateProvider) {
    $stateProvider.state('recipes', {
      parent: 'project',
      url: '/recipes',
      views: {
        '@project': {
          templateUrl: 'editor/views/recipes/recipes.html',
          controller: 'RecipesController'
        }
      }
    });
  })
  .run(function(projectMenu) {
    projectMenu.add('Recettes', 'recipes', 'recipes');
  })
  .controller('RecipesController', function($scope, $state, $uibModal, $q,
    settings, project) {

    $q.all({
      recipes: project.recipes.list(),
      equipments: project.equipments.list()
    }).then(function(res) {
      $scope.recipes = res.recipes;
      $scope.equipments = res.equipments;
    }).catch(function(e) {
      //TODO
    });

    $scope.create = function() {
      project.recipes.create(angular.copy(settings.defaults.recipe)).then(function(recipe) {
        $state.go('.recipe', { id: recipe.id });
      }).catch(function(e) {
        //TODO
      });
    };

    $scope.delete = function(id) {
      $uibModal.open({
        templateUrl: 'editor/views/recipes/modal_remove.html'
      }).result.then(function() {
        project.recipes.delete(id).then(function() {
          $state.reload();
        }).catch(function(e) {
          //TODO
        });
      });
    };

  });

