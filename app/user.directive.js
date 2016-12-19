'use strict';

aeUser.$inject = ['repoService'];

function aeUser(repoService) {

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
        vm.languages = '';
        vm.repo = '';
        vm.repos = [];
        vm.username = 'alieissa';

        vm.changeLang = lang => {
            repoService.getLanguageContent(vm.username, vm.repo, lang)
                .then(content => {
                    // console.log(lang);
                    // console.log(content);
                    vm.chartContent = window.atob(content[0]);
                })
                .catch(err => {
                    console.log('Error');
                    console.log(err);
                });
        };

        vm.changeRepo = repo => {
            vm.repo = repo;

            repoService.getLanguages(repo)
                .then(result => vm.languages = result.data)
                .then(languages => {
                    vm.changeLang(languages.mainLanguage);
                });
        };

        vm.changeUser = username => {
            vm.username = username;
            init(vm.username);
        };

        init(vm.username);

        function init(username) {
            console.log(username);
            repoService.getAllRepos(username)
                .then(repos => vm.repos = repos)
                .then(repos => vm.changeRepo(repos[0]));
        }

    }

    function linkFn() {
        // console.log(scope.vm);
        // console.log(attrs);
    }
}

export {aeUser};
