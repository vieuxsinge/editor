angular.module('editor.conf.persistence', ['ngStorage',
  'editor.services.persistence', 'editor.data.auth', 'editor.data.equipments',
  'editor.data.recipes', 'editor.data.ingredients'])
  .decorator('auth', function($delegate, $localStorage) {
    $localStorage.$default({auth: $delegate});
    return $localStorage.auth;
  })
  .run(function($rootScope, persistence, auth, recipes, equipments,
    ingredients) {

    persistence.settings.url = 'https://kinto.notmyidea.org/v1/';
    persistence.settings.bucket = 'beer-editor';

    $rootScope.$watch(function() { return auth.auth; }, function(authHeader) {
      headers = authHeader ? {Authorization: authHeader} : {};
      persistence.settings.headers = headers;
    });

    persistence.persistCollection(recipes, 'recipes');
    persistence.persistCollection(ingredients, 'ingredients');
    persistence.persistCollection(equipments, 'equipments');
  });
