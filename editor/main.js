angular.module('editor', [
  'editor.conf.auth',
  'editor.conf.kinto',
  'editor.conf.loadingbar',
  'editor.views.auth',
  'editor.views.home',
  'editor.views.recipes',
  'editor.views.recipes.recipe',
  'editor.views.recipes.sheet',
  'editor.views.ingredients',
/*  'editor.views.equipments',
  'editor.views.equipments.equipment'*/
])
.config(function($urlMatcherFactoryProvider) {
  $urlMatcherFactoryProvider.strictMode(false);
});
