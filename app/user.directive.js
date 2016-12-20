'use strict';

aeUser.$inject = ['repoService'];

function aeUser(repoService) {

    let aeUser_ = {
        templateUrl: 'user.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'user',
        controller: controllerFn
    };

    return aeUser_;

    function controllerFn() {
        let vm = this;

        // Defaults
        vm.chartContent = '';
        vm.languages = '';
        vm.repo = '';
        vm.repos = [];
        vm.username = 'alieissa';

        vm.changeLang = (username, repo, lang) => {
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
            repoService.getLanguages(username, repo)
                .then(languages => {
                    // Dirty workaround
                    if(languages.length == 0) {
                        alert(`ERROR: ${repo} does not have any of the desired languages`);
                        return;
                    }
                    vm.repo = repo;
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
}

export {aeUser};
