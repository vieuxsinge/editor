angular.module('editor.conf.persistence', ['editor.services.persistence',
  'editor.data.equipments', 'editor.data.recipes', 'editor.data.ingredients',
  'editor.data.settings'])
  .config(function(persistenceProvider) {
  
    persistenceProvider.url = 'https://kinto.notmyidea.org/v1'
    persistenceProvider.username = 'editor';
    persistenceProvider.password = 'pass';
    persistenceProvider.bucket = 'default';
  
  })
  .run(function(persistence, recipes, equipments, ingredients, settings) {
  
    persistence.persistCollection(recipes, 'recipes');
    persistence.persistCollection(ingredients, 'ingredients');
    persistence.persistCollection(equipments, 'equipments');

  });
