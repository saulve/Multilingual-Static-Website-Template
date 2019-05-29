import template from './scroller.tpl.html';

const ScrollerComponent = {
  	bindings: {
  	},
    template: template,
    controller: ScrollerController,
    controllerAs: 'scroller'
};

ScrollerController.$inject = ['$document', '$scope']
function ScrollerController($document, $scope) {
	let vm = this;

	$document.on('scroll', function() {
		if ( $document.scrollTop() != 0 ) {
			vm.show = true;
		} else {
			vm.show = false;
		}
		$scope.$digest();
	});
}

export default ScrollerComponent;