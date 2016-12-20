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
        require: '^aeUser',
        scope: {
            username: '@'
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
        vm.appFolders = 'app,scripts,src,util';
        vm.selectedLanguages = Object.keys(ABBRS);

        vm.updateLangs = (lang, checked) => {
            if(checked === -1) {
                vm.selectedLanguages.push(lang);
            }
            else {
                vm.selectedLanguages = vm.selectedLanguages.filter(_lang_ => _lang_ !== lang);
            }
        };

        vm.updateSettings = (username, appFolders, langs) => {
            repoService.updateSettings(appFolders, langs);
            return vm.reInit(vm.username);
        };
    }

    function linkFn(scope, element, attrs, $ctrl) {

        scope.settings.reInit = $ctrl.changeUser;

        element.find('input[type=submit]').on('click', () => {
            let _display = element.find('form').css('display') === 'none' ? 'block' : 'none';
            element.find('form').css('display', _display);
        });

        element.find('i').on('click', () => {
            let _display = element.find('form').css('display') === 'none' ? 'block' : 'none';
            element.find('form').css('display', _display);
        });
    }
}

export {aeSettings};
