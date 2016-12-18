'use strict';

aeSettings.$inject = ['repoService'];

function aeSettings(repoService) {

    let aeSettings_ = {
        templateUrl: 'settings.html',
        scope: { settings: "=" },
        controller: controllerFn,
        controllerAs: 'settings',
        link: linkFn
    };

    return aeSettings_;

    function controllerFn() {

    }

    function linkFn(scope, element, attrs) {
        // let _form = element.find('form')
        // console.log(element.find('i'))
        // console.log(element.find('.settings'))
        element.find('i').on('click', () => {
            let _display = element.find('form').css('display') === 'none' ? 'block' : 'none';
            console.log(_display)
            element.find('form').css('display', _display);
        })
    }
}

export {aeSettings};
