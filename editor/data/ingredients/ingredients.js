angular.module('editor.data.ingredients', ['editor.services.collection'])
  .factory('ingredients', function(Collection) {
    return {
      fermentables: new Collection(),
      hops: new Collection(),
      yeast: new Collection(),
      others: new Collection(),
      i18n: {
        fermentables: "Malts/Extraits",
        hops: "Houblons",
        yeast: "Levures",
        others: "Autres"
      }
    };
  });

