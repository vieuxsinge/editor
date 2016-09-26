angular.module('editor.data.settings', [])
  .value('settings', {
    defaults: {
      recipe: {
        efficiency: 75,
        boilRate: 10,
        coolRate: 5,
        lostVolume: 10,
        batchSize: 50,
        boilTime: 60,
        fermentables: [],
        hops: [],
        others: [],
        yeast: []
      }
    }
  });

