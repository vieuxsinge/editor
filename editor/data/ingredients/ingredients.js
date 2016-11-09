angular.module('editor.data.ingredients', ['editor.services.collection'])
  .factory('ingredients', function(Collection) {
    return new Collection();
  })
  .value('ingredientsParameters', {
    fermentableMoments: ['steep', 'mash', 'boil'],
    hopMoments: ['mash', 'firstWort', 'boil', 'late', 'dry'],
    hopFormats: ['pellet', 'cone'],
    otherMoments: ['mash', 'firstWort', 'boil', 'late', 'dry']
  })
  .value('ingredientsI18n', {
    fermentables: "Malts/Extraits",
    hops: "Houblons",
    yeast: "Levures",
    others: "Autres",
    moments: {
      steep:      "Trempage",
      mash:       "Empâtage",
      boil:       "Ébullition",
      firstWort:  "Premier jus",
      late:       "Fin d'ébullition",
      dry:        "À froid"
    },
    formats: {
      pellet:     "Pellet",
      cone:       "Cône"
    }
  });

