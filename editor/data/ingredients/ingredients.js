angular.module('editor.data.ingredients', ['editor.services.collection'])
  .factory('ingredients', function(Collection) {
    return {
      fermentables: new Collection(),
      hops: new Collection(),
      yeast: new Collection(),
      others: new Collection()
    };
  })
  .run(function($http, ingredients) {

    var addIngredient = function(category, collection) {
      return function(ingredient) {
        ingredient.category = category;
        collection.create(ingredient);
      };
    };

    $http.get('resources/yeast.json').then(function(response) {
      angular.forEach(response.data, addIngredient('yeast', ingredients.yeast));
    });

    $http.get('resources/others.json').then(function(response) {
      angular.forEach(response.data, addIngredient('others', ingredients.others));
    });

    $http.get('resources/hops.json').then(function(response) {
      angular.forEach(response.data, addIngredient('hops', ingredients.hops));
    });

    $http.get('resources/fermentables.json').then(function(response) {
      angular.forEach(response.data, addIngredient('fermentables', ingredients.fermentables));
    });

  });

