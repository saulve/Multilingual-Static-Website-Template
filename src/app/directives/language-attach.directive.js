LanguageAttach.$inject = ['$translate', '$rootScope'];

export default function LanguageAttach($translate, $rootScope) {
	return {
		restrict: 'A',
		link: (scope, element, attrs) => {
			// append lang attribute to indicate currently 
			// used language to change the font if necessary
			element.attr('lang', $translate.use());

			$rootScope.$on("$translateChangeSuccess", () => {
				element.attr('lang', $translate.use());
			});
		}
	};
}