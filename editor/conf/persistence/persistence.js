angular.module('editor.conf.persistence', ['editor.services.persistence',
  'editor.data.recipes', 'editor.data.ingredients'])
  .config(function(persistenceProvider) {
  
    persistenceProvider.url = 'https://kinto.notmyidea.org/v1'
    persistenceProvider.username = 'editor';
    persistenceProvider.password = 'pass';
    persistenceProvider.bucket = 'default';
  
  })
  .run(function(persistence, recipes, ingredients) {
  
    persistence.persist(recipes, 'recipes');
    persistence.persist(ingredients.fermentables, 'fermentables');
    persistence.persist(ingredients.hops, 'hops');
    persistence.persist(ingredients.yeast, 'yeast');
    persistence.persist(ingredients.others, 'others');
  
  });
