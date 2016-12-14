'use strict';

aeRepos.$inject = ['$route', 'repoService'];

function aeRepos($route, repoService) {

    let aeRepos_ = {
        templateUrl: 'repos.html',
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeRepos_;

    function controllerFn() {
        
        let _username = $route.current.params.username;
        repoService.getAllRepos(_username).then(repos => vm.repos = repos)
    }

    function linkFn(scope, element, attrs) {

    }
}

export {aeRepos};
