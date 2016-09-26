angular.module('editor.services.persistence', ['editor.services.kinto',
  'editor.data.recipes'])
  .run(function($rootScope, kinto, recipes) {
    
    var persist = function(collection, name) {

      // Populate
      kinto.bucket('default').collection(name).listRecords().then(function(res) {
        $rootScope.$apply(function() {
          collection.items = res.data;
        });
      });

      // Save changes
      $rootScope.$watchCollection(
        function() { return collection.items; },
        function(newItems, oldItems) {
          console.log('TODO Save Changes');
        }
      );

    };
    
    persist(recipes, 'recipes');
    
  });
