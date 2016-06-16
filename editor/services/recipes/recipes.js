angular.module('editor.services.recipes', [])
  .factory('recipes', function() {
    return new (function() {
      var self = this;

      // For test purpose
      //this.idCount = 0;
      //this.list = [];
      this.idCount = 1;
      this.list = [{
        id: 0,
        
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
      }];
      this.create = function(recipe) {
        var data = angular.copy(recipe);
        data.id = self.idCount++;
        self.list.push(data);
      };
      
      this.get = function(id) {
        var recipe;
        angular.forEach(self.list, function(item) {
          if(item.id == id) {
            recipe = item;
          }
        });
        return recipe;
      };

      this.clear = function() {
        self.list = [];
      };
    })();
  });

