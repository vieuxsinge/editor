angular.module('editor', [
  'ui.router',
  'editor.conf.persistence',
  'editor.views.recipes.last',
  'editor.views.recipes.recipe',
  'editor.views.recipes.print',
  'editor.views.ingredients',
  'editor.views.equipments.last',
  'editor.views.equipments.equipment'
])
.config(['$urlRouterProvider', '$urlMatcherFactoryProvider',
         function($urlRouterProvider, $urlMatcherFactoryProvider) {
  $urlRouterProvider.when('', '/recipes');
  $urlMatcherFactoryProvider.strictMode(false);
}]);
