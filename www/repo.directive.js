'use strict';

aeRepo.$inject = ['$routeParams', 'repoService'];

function aeRepo($routeParams, repoService) {

    let aeRepo_ = {
        templateUrl: '<li></li>',
        restrict: 'E',
        transclude: true,
        require: '^repos',
        controllerAs: 'repo',
        controller: controllerFn,
        link: linkFn
    };

    return aeRepo_;

    function controllerFn() {

        let vm = this;
        vm.test = () => {
            console.log('Test')
        }
        console.log($routeParams);
        // let _username = $state.current.params.username;
        // repoService.getAllRepos($routeParams.username)
        //     .then(repos => vm.repos = repos)
        //     .catch(err => vm.err = err);
    }

    function linkFn(scope, element, attrs, ctrl) {
        console.log(ctrl);
    }
}

export {aeRepo};
