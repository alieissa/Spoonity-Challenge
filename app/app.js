'use strict';

import {aeChart} from './chart.directive.js';
import {aeLanguages} from './languages.directive.js';
import {aeRepos} from './repos.directive.js';
import {repoCtrl} from './repos.controller.js';
import {repoService} from './repo.service';

angular.module('spoonityApp', ['ngRoute'])
    .config(config)
    .constant('HTTP', {
        baseUrl: 'https://api.github.com'
    })
    .controller('mainCtrl', mainCtrl)
    .directive('aeChart', aeChart)
    .directive('aeLanguages', aeLanguages)
    .directive('aeRepos', aeRepos)
    .factory('repoService', repoService);

function config($routeProvider) {

    $routeProvider.when('/', {
        template: '<ae-chart> </ae-chart>'
    })

    // List repos for user
    .when('/users/:username/repos', {
        template: '<ae-repos></ae-repos>'
    })

    //List langs for repo
    .when('/:repo/languages', {
        template: '<ae-languages></ae-languages>',
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