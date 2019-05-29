import template from "./navigation.tpl.html";

const NavComponent = {
  bindings: {},
  template: template,
  controller: NavController,
  controllerAs: "nav"
};

NavController.$inject = ["$translate", "LANGUAGES", "$scope"];

function NavController($translate, LANGUAGES, $scope) {
  let vm = this;

  vm.languages = LANGUAGES;
  vm.selectLangHover = false; // flag that hides the language menu on mouse leave
  LANGUAGES.forEach((el, index) => {
    if (el.SHORT_CODE === $translate.use()) {
      vm.currentLang = el;
      vm.languages.splice(index, 1)[0];
    }
  });

  vm.switchLang = language => {
    $translate.use(language.SHORT_CODE).then(function(shortCode) {
      vm.languages.push(vm.currentLang);
      vm.currentLang = language;
      vm.languages.splice(
        vm.languages.findIndex(lang => lang.SHORT_CODE === shortCode),
        1
      )[0];
    });
  };
}

export default NavComponent;
