angular.module('editor', [
  'ui.router',
  'editor.services.persistence',
  'editor.directives.mainMenu',
  'editor.views.recipes.last',
  'editor.views.recipes.recipe'
])
.config(['$urlRouterProvider', '$urlMatcherFactoryProvider',
         function($urlRouterProvider, $urlMatcherFactoryProvider) {
  $urlRouterProvider.when('', '/recipes');
  $urlMatcherFactoryProvider.strictMode(false);
}]);
