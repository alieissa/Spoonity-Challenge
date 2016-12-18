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

    function controllerFn($timeout) {

        let vm = this;

        vm.changeRepo = () => {
            console.log('Change Repo');
        }
        vm.setLang = (lang) => {
            console.log(lang);

            repoService.getLanguageContent(vm.repos[0], lang)
                .then(content => {
                    console.log(content)
                    vm.chartContent = window.atob(content[0]);
                    console.log(window.atob(content[0]));
                });
        };

        repoService.getAllRepos('alieissa')
            .then(repos => vm.repos = repos)
            .then(repos => repoService.getLanguages(repos[0]))
            .then(result => vm.languages = result.data.languages)
            // .then(languages => repoService.getLanguageContent(vm.repos[0], 'JavaScript'))
            .then(content => {
                vm.chartContent = window.atob(content[0]);
                // console.log(vm.chartContent);
            })
            .catch(err => vm.err = err);
    }

    function linkFn(scope, element, attrs) {

    }
}

export {aeRepos};
