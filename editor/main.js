angular.module('editor', [
  'ui.router',
  'editor.mainMenu',
  'editor.recipes.last',
  'editor.recipes.recipe'
])
.config(['$urlRouterProvider', '$urlMatcherFactoryProvider',
         function($urlRouterProvider, $urlMatcherFactoryProvider) {
  $urlRouterProvider.when('', '/recipes');
  $urlMatcherFactoryProvider.strictMode(false);
}]);
