angular.module('editor.views.recipes.recipe', ['ui.router', 'monospaced.elastic',
  'editor.data.styles', 'editor.data.settings', 'editor.data.ingredients',
  'editor.services.calculator', 'editor.views.recipes', 'editor.views.project',
  'editor.directives.range', 'editor.filters.recipe', 'editor.filters.text'])
  .config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('recipes.recipe', {
      url: '/{recipe}',
      views: {
        '@': {
          templateUrl: 'editor/views/layout/layout.header.html',
          controller: 'RecipesRecipeController'
        },
        'header@recipes.recipe': {
          templateUrl: 'editor/views/recipes.recipe/header.html'
        },
        '@recipes.recipe': {
          templateUrl: 'editor/views/recipes.recipe/body.html'
        }
      }
    });
  }])
  .controller('RecipesRecipeController', function($scope, $state, $stateParams,
    $q, styles, ingredientsI18n, ingredientsParameters, calculator, settings,
    project) {

    $scope.styles = styles;
    $scope.settings = settings;
    $scope.project = project;
    $scope.calc = calculator;
    $scope.ingredientsI18n = ingredientsI18n;
    $scope.ingredientsParameters = ingredientsParameters;
    $scope.copy = angular.copy;
    $scope.remove = function(array, item) {
      var index = array.indexOf(item);
      array.splice(index, 1);
    };

    var recipeId = $stateParams.recipe;
    $scope.recipeId = recipeId;

    $q.all({
      recipe: project.recipes.get(recipeId),
      equipments: project.equipments.list(),
      ingredients: project.ingredients.list()
    }).then(function(res) {
      $scope.recipe = res.recipe;
      $scope.headerEdit = !res.recipe.name;

      $scope.equipments = res.equipments;
      $scope.ingredients = res.ingredients;
    }).catch(function(e) {
      //TODO
    });

    // Push recipe modifications
    $scope.$watch('recipe', function(newRecipe, oldRecipe) {
      if( !newRecipe || !oldRecipe ) { return; }
      project.recipes.update(newRecipe).catch(function(e) {
        //TODO
      });
    }, true);

    // Update equipment
    $scope.$watch('recipe.equipment', function(id) {
      project.equipments.get(id).then(function(equipment) {
        $scope.equipment = equipment;
      }).catch(function(e) {
        //TODO
      });
    });

    // Watch for volume scaling
    $scope.$watch('recipe.finalVolume', function(newVolume, oldVolume) {
      if( !newVolume || !oldVolume ) { return; }
      if( settings.global.recipeAutoscale ) {
        calculator.recipeScaleVolume($scope.recipe, $scope.equipment, oldVolume, newVolume);
      }
    });

    // Watch for equipment scaling
    $scope.$watch('equipment', function(newEquipment, oldEquipment) {
      if( !newEquipment || !oldEquipment ) { return; }
      if( settings.global.recipeAutoscale ) {
        calculator.recipeScaleEquipment($scope.recipe, oldEquipment, newEquipment);
      }
    });

    // Ingredients
    $scope.numberOfIngredients = function(recipe) {
      if( !recipe ) { return 0; }
      return recipe.fermentables.length + recipe.hops.length
             + recipe.yeast.length + recipe.others.length;
    };

    $scope.addFermentable = function(recipe, fermentable) {
      var item = angular.copy(fermentable);
      item.weight = 0;
      recipe.fermentables.push(item);
    };

    $scope.addHop = function(recipe, hop) {
      var item = angular.copy(hop);
      item.weight = 0;
      item.time = 0;
      item.format = 'pellet';
      item.moment = 'boil';
      recipe.hops.push(item);
    };

    $scope.addOther = function(recipe, ingredient) {
      var item = angular.copy(ingredient);
      item.weight = 0;
      item.time = 0;
      item.moment = 'boil';
      recipe.others.push(item);
    };

  });

