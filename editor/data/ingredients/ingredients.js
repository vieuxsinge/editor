angular.module('editor.data.ingredients', ['editor.services.collection'])
  .factory('ingredients', function(Collection) {
    return {
      fermentables: new Collection(),
      fermentableMoments: ['steep', 'mash', 'boil'],
      hops: new Collection(),
      hopMoments: ['mash', 'firstWort', 'boil', 'late', 'dry'],
      hopFormats: ['pellet', 'cone'],
      others: new Collection(),
      otherMoments: ['mash', 'firstWort', 'boil', 'late', 'dry'],
      yeast: new Collection(),
      i18n: {
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
      }
    };
  });

