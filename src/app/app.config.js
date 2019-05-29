config.$inject = ['$stateProvider', '$translateProvider'];

import { default as strings } from './strings/strings'

export default function config($stateProvider, $translateProvider) {
  $stateProvider
    .state('home', {
      url: '',
      template: require('./controllers/main.tpl.html'),
      controller: 'MainCtrl',
      controllerAs: 'main'
    });

  /**
   * Specify translations here
   * More information: https://angular-translate.github.io/docs/#/guide/02_getting-started
   */
  
  $translateProvider
    .translations('en', strings.EN)
    .translations('zz', strings.ZZ)
    .translations('gg', strings.ZZ)
    .translations('bb', strings.ZZ)
    .preferredLanguage('en');
}