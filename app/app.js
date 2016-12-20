'use strict';

import {aeUser} from './user.directive.js';
import {repoService} from './repo.service';
import {aeSettings} from './settings.directive.js';

angular.module('spoonityApp', ['ngRoute'])
    .config(config)
    .constant('HTTP', {
        baseUrl: 'https://api.github.com'
    })
    .controller('mainCtrl', mainCtrl)
    .directive('aeSettings', aeSettings)
    .directive('aeUser', aeUser)
    .factory('repoService', repoService);

function config($routeProvider) {

    $routeProvider.when('/', {
        template: '<ae-user></ae-user>'
    })
    .otherwise({
        redirectTo: '/'
    });
}

function mainCtrl($rootScope) {
    $rootScope.$on('$routeChangeError', (event, prev, next) => {
        console.log(`Unable to reach ${next}`);
    });
}
