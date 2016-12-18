'use strict';

aeRepos.$inject = ['$routeParams', 'repoService'];

// function aeRepos($routeParams, repoService) {
function aeRepos($routeParams, repoService) {

    let aeRepos_ = {
        templateUrl: 'repos.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeRepos_;

    function controllerFn() {

        let vm = this;

        vm.chartContent = '';

        vm.changeRepo = () => {
            console.log('Change Repo');
        }

        vm.setLang = (lang) => {
            console.log(lang);

            repoService.getLanguageContent(vm.repos[0], lang)
                .then(content => {
                    vm.chartContent = window.atob(content[0]);
                });
        };


        function init(username) {
            repoService.getAllRepos(username)
                .then(repos => repoService.getLanguages(repos[0]))
                .then(result => vm.languages = result.data.languages)
                // .then(languages => repoService.getLanguageContent(vm.repos[0], 'JavaScript'))
                // .then(content => {
                //     vm.chartContent = window.atob(content[0]);
                // })
                .catch(err => vm.err = err);
        }

    }

    function linkFn(scope, element, attrs) {
        console.log(scope.vm);
    }
}

export {aeRepos};
