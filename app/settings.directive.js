'use strict';

const ABBRS = {
    CoffeScript: 'coffee',
    HTML: 'html',
    CSS: 'css',
    Java: 'java',
    JavaScript: 'js',
    PHP: 'php',
    Python: 'py',
    Ruby: 'rb',
    TypeScript: 'ts'
};

aeSettings.$inject = ['repoService'];

function aeSettings(repoService) {
    let aeSettings_ = {
        templateUrl: 'settings.html',
        scope: {
            username: '@',
            reInit: '&changeUser'
        },
        controller: controllerFn,
        controllerAs: 'settings',
        bindToController: true,
        link: linkFn
    };

    return aeSettings_;

    function controllerFn() {
        let vm = this;

        vm.languages = Object.keys(ABBRS);

        // Defaul Settings
        vm.appFolder = 'app';
        vm.selectedLanguages = Object.keys(ABBRS);

        vm.updateLangs = (lang, checked) => {
            if(checked === -1) {
                vm.selectedLanguages.push(lang);
            }
            else {
                vm.selectedLanguages = vm.selectedLanguages.filter(_lang_ => _lang_ !== lang);
            }
        };

        vm.updateSettings = (username, appFolder, langs) => {
            repoService.updateSettings(appFolder, langs);
            console.log(vm.username)
        };
    }

    function linkFn(scope, element, attrs) {
        element.find('i').on('click', () => {
            let _display = element.find('form').css('display') === 'none' ? 'block' : 'none';
            element.find('form').css('display', _display);
        });
    }
}

export {aeSettings};
