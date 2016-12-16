'use strict';

aeRepos.$inject = ['$routeParams', 'repoService'];

// function aeRepos($routeParams, repoService) {
function aeRepos($routeParams, repoService) {

    let aeRepos_ = {
        templateUrl: 'repos.html',
        restrict: 'E',
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeRepos_;

    function controllerFn() {

        let vm = this;
        vm.test = () => {
            console.log('Test')
        }
        console.log($routeParams);
        // let _username = $state.current.params.username;
        repoService.getAllRepos($routeParams.username)
            .then(repos => vm.repos = repos)
            .catch(err => vm.err = err);
    }

    function linkFn(scope, element, attrs) {

    }
}

export {aeRepos};
