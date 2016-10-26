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
    persistence.persistCollection(ingredients.fermentables, 'fermentables');
    persistence.persistCollection(ingredients.hops, 'hops');
    persistence.persistCollection(ingredients.yeast, 'yeast');
    persistence.persistCollection(ingredients.others, 'others');
    persistence.persistCollection(equipments, 'equipments');
    persistence.persistObject(settings.global, 'settings.global');
  
  });
