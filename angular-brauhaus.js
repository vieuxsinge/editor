angular.module('brauhaus', [])
  .filter('bhDebug', function() {
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


