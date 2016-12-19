'use strict';

aeRepos.$inject = ['$routeParams', 'repoService'];

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

        vm.chartContent = '';
        vm.languages = '';
        vm.repo = '';

        vm.changeLang = lang => {
            console.log(lang);

            repoService.getLanguageContent(vm.repo, lang)
                .then(content => vm.chartContent = window.atob(content[0]));
        };

        vm.changeRepo = repo => {
            // console.log(repo);

            repoService.getLanguages(repo)
                .then(result => vm.languages = result.data)
                .then(languages => vm.changeLang(languages.mainLanguage));
        };

        init('alieissa');

        function init(username) {
            repoService.getAllRepos(username)
                .then(repos => vm.changeRepo(repos[0]))
                // .then(result => vm.languages = result.data.languages)
                .catch(err => vm.err = err);
        }

    }

    function linkFn(scope, element, attrs) {
        console.log(scope.vm);
        console.log(attrs);
    }
}

export {aeRepos};
