angular.module('editor.conf.persistence', ['editor.services.persistence',
  'editor.data.recipes'])
  .config(function(persistenceProvider) {
  
    persistenceProvider.url = 'https://kinto.notmyidea.org/v1'
    persistenceProvider.username = 'editor';
    persistenceProvider.password = 'pass';
    persistenceProvider.bucket = 'default';
  
  })
  .run(function(persistence, recipes) {
  
    persistence.persist(recipes, 'recipes');
  
  });
