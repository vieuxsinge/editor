angular.module('editor.services.calculator', [])
  .service('calculator', function() {
    var calc = this;
    
    /*
    Recipe infos and units:

    Volumes
    
      finalVolume:  Final volume of the batch (L)
      lostVolume:   Lost volume after cooling (L)

    Rates
    
      mashEfficiency:   Mash efficiency (%)
      coolingLossRate:  Rate of losses while cooling (% of the volume)
      boilLossRate:     Rate of losses while boiling
                        (% of the volume/boiling time in hours)

    Timing

      boilTime:   Boil time (mn)
    
    Ingredients
    
      fermentables: List of fermentables
        moment:   Either 'steep', 'mash' or 'boil'
        yield:    Percentage of sugar that can theorically be extracted from the
                  fermentable compared to pure sucrose (%)
        weight:   Mass of added fermentable (kg)
    
      hops:       List of hops
        moment:   Either 'mash', 'first-wort', 'boil', 'late' or 'dry'
        time:     Boil time (mn)
        aa:       Alpha acids (%)
    */

    // Volumes
    calc.cooledVolume = function(recipe) {
      if( !recipe ) { return 0; }
      return recipe.finalVolume + recipe.lostVolume;
    };

    calc.postBoilVolume = function(recipe) {
      if( !recipe ) { return 0; }
      return calc.cooledVolume(recipe) / (1 - recipe.coolingLossRate/100);
    };

    calc.preBoilVolume = function(recipe) {
      if( !recipe ) { return 0; }
      return calc.postBoilVolume(recipe) / (1 - recipe.boilLossRate/100 * recipe.boilTime/60);
    };

    calc.averageBoilVolume = function(recipe) {
      if( !recipe ) { return 0; }
      return (calc.postBoilVolume(recipe) + calc.preBoilVolume(recipe)) / 2;
    };

    // Gravities
    calc.fermentableGravityPoints = function(recipe, fermentable) {
      if( !recipe || !fermentable ) { return 0; }
      var efficiency = {
        'steep': 0.5,
        'mash': recipe.mashEfficiency/100,
        'boil': 1
      }[fermentable.moment];

      // 384 correspond to sucrose gravity points for 1kg/L at 20°C
      return fermentable.weight * efficiency * 384 * fermentable.yield/100;
    };

    calc.recipeGravityPoints = function(recipe) {
      if( !recipe ) { return 0; }
      var points = 0;
      angular.forEach(recipe.fermentables, function(fermentable) {
        points += calc.fermentableGravityPoints(recipe, fermentable);
      });
      return points;
    };

    calc.fermentableGravityPercent = function(recipe, fermentable) {
      if( !recipe || !fermentable ) { return 0; }
      return 100 * calc.fermentableGravityPoints(recipe, fermentable) / calc.recipeGravityPoints(recipe);
    };

    var sgToGp = function(sg) { return (sg - 1.0) * 1000; };
    var gpToSg = function(gp) { return 1.0 + gp/1000; };

    calc.originalGravity = function(recipe) {
      if( !recipe ) { return 0; }
      return gpToSg(calc.recipeGravityPoints(recipe) / calc.cooledVolume(recipe));
    };

    calc.finalGravity = function(recipe) {
      if( !recipe ) { return 0; }
      return ((calc.originalGravity(recipe) - 1.0) * (1.0 - calc.attenuation(recipe)/100)) + 1.0;
    };

    calc.recipeBoilGravityPoints = function(recipe) {
      if( !recipe ) { return 0; }
      return sgToGp(calc.originalGravity(recipe)) * calc.postBoilVolume(recipe);
    };

    calc.preBoilGravity = function(recipe) {
      if( !recipe ) { return 0; }
      return gpToSg(calc.recipeBoilGravityPoints(recipe) / calc.preBoilVolume(recipe));
    };

    calc.averageBoilGravity = function(recipe) {
      if( !recipe ) { return 0; }
      return gpToSg(calc.recipeBoilGravityPoints(recipe) / calc.averageBoilVolume(recipe));
    };

    // Fermentation
    calc.attenuation = function(recipe) {
      if( !recipe ) { return 0; }
      var attenuation = 0;
      angular.forEach(recipe.yeast, function(yeast) {
        attenuation = Math.max(attenuation, yeast.attenuation);
      });
      return attenuation;
    };

    calc.abv = function(recipe) {
      if( !recipe ) { return 0; }
      var og = calc.originalGravity(recipe);
      var fg = calc.finalGravity(recipe);
      return ((76.08*(og-fg)/(1.775-og))*(fg/0.794));
    };
    
    // Color
    calc.fermentableColor = function(recipe, fermentable) {
      if( !recipe || !fermentable ) { return 0; }
      return 2.9396 * Math.pow(4.23 * fermentable.color * fermentable.weight / calc.cooledVolume(recipe), 0.6859);
    };

    calc.recipeColor = function(recipe) {
      if( !recipe ) { return 0; }
      var color = 0;
      angular.forEach(recipe.fermentables, function(fermentable) {
        color += calc.fermentableColor(recipe, fermentable);
      });
      return color;
    };

    // Bitterness
    calc.hopBitterness = function(recipe, hop) {
      var formatFactor = {
        'pellet': 1.1,
        'cone':   1.0
      }[hop.format];

      var bignessFactor = (1.65 * Math.pow(0.000125, calc.averageBoilGravity(recipe) - 1.0) );
      var boilTimeFactor = ( 1.0 - Math.exp(-0.04 * hop.time) ) / 4.15;
      var utilisation = bignessFactor * boilTimeFactor;
      return formatFactor * 10 * utilisation * hop.aa * hop.weight / calc.cooledVolume(recipe);
    };

    calc.recipeBitterness = function(recipe) {
      if( !recipe ) { return 0; }
      var ibu = 0;
      angular.forEach(recipe.hops, function(hop) {
        ibu += calc.hopBitterness(recipe, hop);
      });
      return ibu;
    };

    calc.buToGu = function(recipe) {
      if( !recipe ) { return 0; }
      return calc.recipeBitterness(recipe) / sgToGp(calc.originalGravity(recipe));
    };

  });

