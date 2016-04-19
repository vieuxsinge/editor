angular.module('brauhaus', ['ui.bootstrap'])
  .controller('BrauhausController', function($scope) {
    $scope.parameters = {
      boil_rate: 10
    };
  
    var create_recipe_data = function() {
      return {
        fermentables: [],
        spices: []
      };
    };

    $scope.data = localStorage.data ? JSON.parse(localStorage.data) : 
                                      create_recipe_data();
    
    $scope.clear = function() {
      $scope.data = create_recipe_data();
    };
    
    $scope.$watch('data', function(data){
      localStorage.data = JSON.stringify(data);
    }, true);

    $scope.$watch('data', function(data){
      var recipe = new Brauhaus.Recipe(data);
      recipe.calculate();
      $scope.recipe = recipe;
    }, true);
  })
  .filter('bhDisplay', function() {
    return function(recipe) {
      if(!recipe)
        return '';
      return [
        recipe.name,
        '--------------------------',
        "Batch size: " + recipe.batchSize.toFixed(1) + " liters (" + Math.round(recipe.batchSize / recipe.servingSize) + " bottles)",
        "Boil size: " + recipe.boilSize.toFixed(1) + " liters",
        "",
        "OG: " + recipe.og.toFixed(3) + " (" + recipe.ogPlato.toFixed(1) + "&deg; Plato)",
        "FG: " + recipe.fg.toFixed(3) + " (" + recipe.fgPlato.toFixed(1) + "&deg; Plato)",
        "Color: " + recipe.color.toFixed(1) + "&deg; SRM <span style='display: inline-block; width: 12px; height: 12px; background-color: " + Brauhaus.srmToCss(recipe.color) + "'></span>",
        "IBU: " + recipe.ibu.toFixed(1),
        "ABV: " + recipe.abv.toFixed(1) + "%",
        "Calories: " + Math.round(recipe.calories),
        "",
        "BU/GU: " + recipe.buToGu.toFixed(2),
        "BV: " + recipe.bv.toFixed(2),
        "",
        "Cost: about $" + recipe.price.toFixed(2) + " ($" + (recipe.price / (recipe.batchSize / recipe.servingSize)).toFixed(2) + " / bottle)"
      ].join('\n');
    };
  });


