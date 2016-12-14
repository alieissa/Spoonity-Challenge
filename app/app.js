'use strict';

import {aeChart} from './chart.directive.js';
import {aeLanguages} from './languages.directive.js';
import {aeRepos} from './repos.directive.js';
import {repoService} from './repo.service';

angular.module('spoonityApp', ['ngRoute'])
    .config(config)
    .controller('mainCtrl', mainCtrl)
    .directive('aeChart', aeChart)
    .directive('aeLanguages', aeLanguages)
    .directive('aeRepos', aeRepos)
    .factory('repoService', repoService);

function config($routeProvider) {

    $routeProvider.when('/', {
        template: '<ae-chart> </ae-chart>'
    })
    .when('/repos/:username', {
        template: '<ae-repos></ae-repos>'
    })
    .when('/test', {
        template: '<ae-languages><ae-languages>',
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
