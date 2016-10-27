angular.module('editor.services.calculator', [])
  .service('calculator', function() {
    var calc = this;
    
    /*
    Recipe infos and units:
      Volumes
      
        finalVolume:      Final volume of the batch (L)
      
      Ingredients
      
        fermentables:     List of fermentables
          moment:         Either 'steep', 'mash' or 'boil'
          yield:          Percentage of sugar that can theorically be extracted from the
                          fermentable compared to pure sucrose (%)
          weight:         Mass of added fermentable (kg)
      
        hops:             List of hops
          moment:         Either 'mash', 'first-wort', 'boil', 'late' or 'dry'
          time:           Boil time (mn)
          aa:             Alpha acids (%)

    Equipment infos and units:
      Volumes

        lostVolume:       Lost volume after cooling (L)

      Rates
      
        mashEfficiency:   Mash efficiency (%)
        coolingLossRate:  Rate of losses while cooling (% of the volume)
        boilLossRate:     Rate of losses while boiling
                          (% of the volume/boiling time in hours)

      Timing

        boilTime:         Boil time (mn)
      
    */

    // Volumes
    calc.cooledVolume = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return recipe.finalVolume + equipment.lostVolume;
    };

    calc.postBoilVolume = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return calc.cooledVolume(recipe, equipment) / (1 - equipment.coolingLossRate/100);
    };

    calc.preBoilVolume = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return calc.postBoilVolume(recipe, equipment) / (1 - equipment.boilLossRate/100 * equipment.boilTime/60);
    };

    calc.averageBoilVolume = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return (calc.postBoilVolume(recipe, equipment) + calc.preBoilVolume(recipe, equipment)) / 2;
    };

    // Gravities
    calc.fermentableGravityPoints = function(equipment, fermentable) {
      if( !equipment || !fermentable ) { return 0; }
      var efficiency = {
        'steep': 0.5,
        'mash': equipment.mashEfficiency/100,
        'boil': 1
      }[fermentable.moment];

      // 384 correspond to sucrose gravity points for 1kg/L at 20°C
      return fermentable.weight * efficiency * 384 * fermentable.yield/100;
    };

    calc.recipeGravityPoints = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      var points = 0;
      angular.forEach(recipe.fermentables, function(fermentable) {
        points += calc.fermentableGravityPoints(equipment, fermentable);
      });
      return points;
    };

    calc.fermentableGravityPercent = function(recipe, equipment, fermentable) {
      if( !recipe || !equipment || !fermentable ) { return 0; }
      return 100 * calc.fermentableGravityPoints(equipment, fermentable) / calc.recipeGravityPoints(recipe, equipment);
    };

    var sgToGp = function(sg) { return (sg - 1.0) * 1000; };
    var gpToSg = function(gp) { return 1.0 + gp/1000; };

    calc.originalGravity = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return gpToSg(calc.recipeGravityPoints(recipe, equipment) / calc.cooledVolume(recipe, equipment));
    };

    calc.finalGravity = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return ((calc.originalGravity(recipe, equipment) - 1.0) * (1.0 - calc.attenuation(recipe)/100)) + 1.0;
    };

    calc.recipeBoilGravityPoints = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return sgToGp(calc.originalGravity(recipe, equipment)) * calc.postBoilVolume(recipe, equipment);
    };

    calc.preBoilGravity = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return gpToSg(calc.recipeBoilGravityPoints(recipe, equipment) / calc.preBoilVolume(recipe, equipment));
    };

    calc.averageBoilGravity = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return gpToSg(calc.recipeBoilGravityPoints(recipe, equipment) / calc.averageBoilVolume(recipe, equipment));
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

    calc.abv = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      var og = calc.originalGravity(recipe, equipment);
      var fg = calc.finalGravity(recipe, equipment);
      return ((76.08*(og-fg)/(1.775-og))*(fg/0.794));
    };
    
    // Color
    calc.fermentableColor = function(recipe, equipment, fermentable) {
      if( !recipe || !fermentable || !equipment ) { return 0; }
      return 2.9396 * Math.pow(4.23 * fermentable.color * fermentable.weight / calc.cooledVolume(recipe, equipment), 0.6859);
    };

    calc.recipeColor = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      var color = 0;
      angular.forEach(recipe.fermentables, function(fermentable) {
        color += calc.fermentableColor(recipe, equipment, fermentable);
      });
      return color;
    };

    // Bitterness
    calc.utilisationBignessFactor = function(recipe, equipment) {
      return 1.65 * Math.pow(0.000125, calc.averageBoilGravity(recipe, equipment) - 1.0);
    };
    
    calc.hopBitterness = function(recipe, equipment, hop) {
      if( !recipe || !equipment || !hop ) { return 0; }
      var formatFactor = {
        'pellet': 1.1,
        'cone':   1.0
      }[hop.format];

      var bignessFactor = calc.utilisationBignessFactor(recipe, equipment);
      var boilTimeFactor = ( 1.0 - Math.exp(-0.04 * hop.time) ) / 4.15;
      var utilisation = bignessFactor * boilTimeFactor;
      return formatFactor * 10 * utilisation * hop.aa * hop.weight / calc.cooledVolume(recipe, equipment);
    };

    calc.recipeBitterness = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      var ibu = 0;
      angular.forEach(recipe.hops, function(hop) {
        ibu += calc.hopBitterness(recipe, equipment, hop);
      });
      return ibu;
    };

    calc.buToGu = function(recipe, equipment) {
      if( !recipe || !equipment ) { return 0; }
      return calc.recipeBitterness(recipe, equipment) / sgToGp(calc.originalGravity(recipe, equipment));
    };

    // Scaling
    calc.recipeScale = function(recipe, ratio) {
      // Scale
      angular.forEach(Array.concat(recipe.fermentables, recipe.hops, recipe.others), function(ingredient) {
        ingredient.weight *= ratio;
      });
    };
      
    calc.recipeRound = function(recipe) {
      // Round fermentable at ±0.1kg and others at ±1g
      angular.forEach(recipe.fermentables, function(ingredient) {
        ingredient.weight = Math.round(ingredient.weight * 10) / 10;
      });
      angular.forEach(Array.concat(recipe.hops, recipe.others), function(ingredient) {
        ingredient.weight = Math.round(ingredient.weight);
      });
    };

    calc.recipeScaleVolume = function(recipe, equipment, oldVolume, newVolume) {
      if( !recipe || !equipment || !newVolume ) { return; }
      var oldRecipe = angular.copy(recipe);
      oldRecipe.finalVolume = oldVolume;
      
      var ratio = calc.cooledVolume(recipe, equipment) / calc.cooledVolume(oldRecipe, equipment);
      calc.recipeScale(recipe, ratio);
      calc.recipeRound(recipe);
    };

    calc.recipeScaleEquipment = function(recipe, oldEquipment, newEquipment) {
      if( !recipe || !oldEquipment || !newEquipment ) { return; }
      var oldRecipe = angular.copy(recipe);

      var volumeRatio = calc.cooledVolume(recipe, newEquipment) / calc.cooledVolume(oldRecipe, oldEquipment);
      calc.recipeScale(recipe, volumeRatio);

      // Apply mash efficiency correction to fermentables only
      var mashEfficiencyRatio = oldEquipment.mashEfficiency / newEquipment.mashEfficiency;
      angular.forEach(recipe.fermentables, function(ingredient) {
        ingredient.weight *= mashEfficiencyRatio;
      });

      // Apply utilisation correction to hops only and after changes on fermentables
      var utilisationRatio = calc.utilisationBignessFactor(oldRecipe, oldEquipment) / calc.utilisationBignessFactor(recipe, newEquipment);
      angular.forEach(recipe.hops, function(ingredient) {
        ingredient.weight *= utilisationRatio;
      });

      calc.recipeRound(recipe);
    };

  });

