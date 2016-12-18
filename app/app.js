'use strict';

import {aeChart} from './chart.directive.js';
import {aeLanguages} from './languages.directive.js';
import {aeRepos} from './repos.directive.js';
import {aeRepo} from './repo.directive.js';
import {repoCtrl} from './repos.controller.js';
import {repoService} from './repo.service';
import {aeSettings} from './settings.directive.js';

console.log(aeSettings);

angular.module('spoonityApp', ['ngRoute'])
    .config(config)
    .constant('HTTP', {
        baseUrl: 'https://api.github.com'
    })
    .controller('mainCtrl', mainCtrl)
    .directive('aeChart', aeChart)
    .directive('aeLanguages', aeLanguages)
    .directive('aeSettings', aeSettings)
    .directive('aeRepos', aeRepos)
    .directive('aeRepo', aeRepo)
    .factory('repoService', repoService);

function config($routeProvider) {

    // $routeProvider.when('/', {
    //     template: '<ae-chart> </ae-chart>'
    // })
    $routeProvider.when('/', {
        template: '<ae-repos></ae-repos>'
    })
    .when('/tabs', {
        templateUrl: '/tabs.html'
    })

    // List repos for user
    .when('/users/:username/repos', {
        template: `<ae-repos>
                        <ae-repo ng-repeat="repo in vm.repos"></ae-repo>
                    </ae-repos>`
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
