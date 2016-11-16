angular.module('editor', [
  'ui.router',
  'editor.conf.persistence',
  'editor.conf.loadingbar',
  'editor.views.recipes',
  'editor.views.recipes.recipe',
  'editor.views.recipes.sheet',
  'editor.views.ingredients',
  'editor.views.equipments',
  'editor.views.equipments.equipment'
])
.config(['$urlRouterProvider', '$urlMatcherFactoryProvider',
         function($urlRouterProvider, $urlMatcherFactoryProvider) {
  $urlRouterProvider.when('', '/recipes');
  $urlMatcherFactoryProvider.strictMode(false);
}]);
