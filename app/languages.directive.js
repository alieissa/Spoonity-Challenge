'use strict';

aeLanguages.$inject = ['$routeParams', 'repoService'];

function aeLanguages($routeParams, repoService) {

    let aeLanguages_ = {
        templateUrl: 'languages.html',
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeLanguages_;

    function controllerFn() {

        let vm = this;

        repoService.getLanguages($routeParams.repo)
            .then(languages => vm.languages = languages)
            .catch(err => vm.error = error);
    }

    function linkFn(scope, element, attrs) {
        // console.log('Language Link');
    }
}

export {aeLanguages};
