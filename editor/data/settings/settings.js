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
        category: 'fermentables',
        name: '',
        moment: 'mash',
        color: 0,
        yield: 100
      },
      hop: {
        category: 'hops',
        name: '',
        aa: 5
      },
      yeast: {
        category: 'yeast',
        name: '',
        attenuation: 75
      },
      other: {
        category: 'others',
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

