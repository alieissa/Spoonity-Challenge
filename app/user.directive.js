'use strict';

aeUser.$inject = ['$routeParams', 'repoService'];

// function aeUser($routeParams, repoService) {
function aeUser($routeParams, repoService) {

    let aeUser_ = {
        templateUrl: 'user.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeUser_;

    function controllerFn() {

        let vm = this;

        vm.chartContent = '';

        vm.changeRepo = () => {
            console.log('Change Repo');
        }


        vm.changeUser = init;

        vm.setLang = (lang) => {
            console.log(lang);

            repoService.getLanguageContent(vm.repos[0], lang)
                .then(content => {
                    vm.chartContent = window.atob(content[0]);
                });
        };

        init('alieissa');

        function init(username) {
            repoService.getAllRepos(username)
                .then(repos => vm.repos = repos)
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

export {aeUser};
