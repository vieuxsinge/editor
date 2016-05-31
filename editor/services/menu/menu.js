angular.module('editor.services.menu', [])
  .factory('Menu', function() {
    return function() {
    
      var self = this;

      this.items = [];
    
      this.add = function(name, state, group) {
        self.items.push({name: name, state: state, group: group});
      };

    };
  });

