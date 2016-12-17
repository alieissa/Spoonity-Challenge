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
            .then(result => {
                vm.languages = result.data.languages;
                // console.log(result);
                return result.data.mainLanguage;
            })
            .then(mainLanguage => {
                // console.log(mainLanguage);
                return repoService.getLanguageContent($routeParams.repo, mainLanguage)
            })
            // .then(content => console.log(content))
            // .catch(err => vm.error = error);

    }

    function linkFn(scope, element, attrs) {
        // console.log(element.find('button'));
        // .on('click', function() {
        //     console.log($routeParams);
        // });
        // console.log('Language Link');
    }
}

export {aeLanguages};
