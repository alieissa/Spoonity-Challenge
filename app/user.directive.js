'use strict';

aeUser.$inject = ['repoService'];

function aeUser(repoService) {

    let aeUser_ = {
        templateUrl: 'user.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'user',
        controller: controllerFn,
        link: linkFn
    };

    return aeUser_;

    function controllerFn() {

        let vm = this;

        vm.chartContent = '';
        vm.languages = '';
        vm.repo = '';
        vm.repos = [];
        vm.username = 'alieissa';

        vm.changeLang = (username, repo, lang) => {
            console.log(username);
            repoService.getLanguageContent(username, repo, lang)
                .then(content => {
                    vm.chartContent = window.atob(content[0]);
                })
                .catch(err => {
                    console.log('Error');
                    console.log(err);
                });
        };

        vm.changeRepo = (username, repo) => {
            vm.repo = repo;

            repoService.getLanguages(username, repo)
                .then(languages => {
                    vm.languages = languages;
                    vm.changeLang(username, repo, vm.languages[0]);
                });
        };

        vm.changeUser = username => {
            vm.username = username;
            init(vm.username);
        };

        init(vm.username);

        function init(username) {
            repoService.getAllRepos(username)
                .then(repos => vm.repos = repos)
                .then(repos => {
                    return vm.changeRepo(username, repos[0]);
                });
        }

    }

    function linkFn() {
        // console.log(scope.vm);
        // console.log(attrs);
    }
}

export {aeUser};
