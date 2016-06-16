angular.module('editor.test.data', ['editor.services.recipes'])
  .run(function(recipes) {
    recipes.save({
      efficiency: 75,
      boilRate: 10,
      coolRate: 5,
      lostVolume: 10,
      
      batchSize: 50,
      boilTime: 60,
      fermentables: [],
      hops: [],
      others: [],
      yeast: [],
      
      name: "Le Vieux Singe",
      description: "On n'apprend pas au Vieux Singe à faire la grimace",
      style: Brauhaus.getStyle('American Ale', 'American Pale Ale')
    });
  });

