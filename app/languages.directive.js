'use strict';

// aeChart.$inject = ['reposService'];

function aeLanguages() {

    let aeLanguages_ = {
        templateUrl: 'languages.html',
        controllerAs: 'languages',
        controller: controllerFn,
        link: linkFn
    };

    return aeLanguages_;

    function controllerFn() {
        // console.log('Language Controller');
    }

    function linkFn(scope, element, attrs) {
        // console.log('Language Link');
    }
}

export {aeLanguages};
