# Multilingual Angular Website Template

This template provides a quick setup, which includes a webpack build process, unit test setup and prebuilt language switching logic.

![Template demo](https://github.com/saulve/Multilingual-Single-Page-App-Template/blob/master/demo.png)

## Adding new languages

To add a new language first you need to add a new object in the `languages.constant.js` array. The object should contain three properties:

- `NAME` - which is the label that's going to be displayed in the menu (this should be translated into the native language).
- `CLASS` - the [flag-icon-css](https://github.com/lipis/flag-icon-css) CSS class to display the corresponding country flag next to the language.
- `SHORT_CODE` - a unique code which is used by angular-translate library when switching languages.

### Adding translations

Translated strings should be added to the `strings.js` file as object key-value pairs.

### Setting Angular-translate

Once the `languages.constant.js` and `strings.js` files have been updated you can add languages to the `app.config.js` as follows:

```
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

  /* Map the SHORT_CODE from language.constant.js to strings from strings.js */
  $translateProvider
    .translations('en', strings.EN)
    .translations('zz', strings.ZZ)
    .preferredLanguage('en');
}
```

## Acknowledgements

Webpack setup borrowed from the [Preboot Team](https://github.com/preboot/angularjs-webpack).
