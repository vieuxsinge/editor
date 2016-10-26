angular.module('editor.data.settings', [])
  .value('settings', {
    global: {
      recipeAutoscale: false
    },
    defaults: {
      recipe: {
        finalVolume: 20,
        fermentables: [],
        hops: [],
        others: [],
        yeast: []
      },
      fermentable: {
        name: '',
        color: 0,
        yield: 100
      },
      hop: {
        name: '',
        aa: 5
      },
      yeast: {
        name: '',
        attenuation: 75
      },
      other: {
        name: ''
      },
      equipment: {
        mashEfficiency: 75,
        boilLossRate: 10,
        coolingLossRate: 4,
        lostVolume: 2,
        finalVolume: 20,
        boilTime: 60
      }
    }
  });

