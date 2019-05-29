import angular from 'angular';
import uiRouter from 'angular-ui-router';
import angularTranslate from 'angular-translate';
import duScroll from 'angular-scroll';
import animate from 'angular-animate';

import {LANGUAGES} from './constants/languages.constant';
import MainController from './controllers/main.controller';
import attachLang from './directives/language-attach.directive';
import navigation from './partials/navigation/navigation.component';
import scroller from './partials/scroller/scroller.component';
import config from './app.config';
import '../style/main.scss';

/**
 * Function used to do multiple requires
 */
function importAll(r) {
  return r.keys().map(r);
}

/**
 * Import all images for webpack loaders to process
 */
importAll(require.context('../public/img', false, /\.(png|jpg|jpe?g|gif|svg)$/));
/**
 * Import all fonts for webpack loaders to process
 */
importAll(require.context('../public/fonts', false, /\.(woff|woff2|ttf|eot|otf)$/));

const MODULE_NAME = 'app';

/**
 * Add angular services, controllers, etc. here
 */
angular.module(MODULE_NAME, [uiRouter, angularTranslate, duScroll, animate])
  .config(config)
  .constant('LANGUAGES', LANGUAGES)
  .controller('MainCtrl', MainController)
  .component('navigation', navigation)
  .directive('attachLang', attachLang)
  .component('scroller', scroller);

export default MODULE_NAME;