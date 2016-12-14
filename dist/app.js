(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _chartDirective = require('./chart.directive.js');

var _languagesDirective = require('./languages.directive.js');

var _reposDirective = require('./repos.directive.js');

var _repo = require('./repo.service');

angular.module('spoonityApp', ['ngRoute']).config(config).controller('mainCtrl', mainCtrl).directive('aeChart', _chartDirective.aeChart).directive('aeLanguages', _languagesDirective.aeLanguages).directive('aeRepos', _reposDirective.aeRepos).factory('repoService', _repo.repoService);

function config($routeProvider) {

    $routeProvider.when('/', {
        template: '<ae-chart> </ae-chart>'
    }).when('/repos/:username', {
        template: '<ae-repos></ae-repos>'
    }).when('/test', {
        template: '<ae-languages><ae-languages>'
    }).otherwise({
        redirectTo: '/'
    });
}

function mainCtrl($rootScope) {
    $rootScope.$on('$routeChangeError', function (event, prev, next) {
        console.log('Unable to reach ' + next);
    });
}

},{"./chart.directive.js":2,"./languages.directive.js":3,"./repo.service":4,"./repos.directive.js":5}],2:[function(require,module,exports){
'use strict';

// aeChart.$inject = ['reposService'];

Object.defineProperty(exports, "__esModule", {
    value: true
});
function aeChart() {

    var aeChart_ = {
        templateUrl: 'main.html',
        controllerAs: 'chart',
        controller: controllerFn,
        link: linkFn
    };

    return aeChart_;

    function controllerFn() {
        // console.log('Chart Controller');
    }

    function linkFn(scope, element, attrs) {
        // console.log('Chart Link');
    }
}

exports.aeChart = aeChart;

},{}],3:[function(require,module,exports){
'use strict';

// aeChart.$inject = ['reposService'];

Object.defineProperty(exports, "__esModule", {
    value: true
});
function aeLanguages() {

    var aeLanguages_ = {
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

exports.aeLanguages = aeLanguages;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
repoService.$inject = ['$q', '$http'];

function repoService($q, $http) {

    function getAllRepos(username) {

        var defer_ = $q.defer();
        var _handleRes = function _handleRes(result) {
            // parse and return here resolve
            // defer.resolve(parsedRes)
        };

        // $http.get(`/repos/${username}`).then(_handleRes, (err) => defer.reject(err));

        //return defer.promise;
    }

    return { getAllRepos: getAllRepos };
}

exports.repoService = repoService;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRepos.$inject = ['$route', 'repoService'];

function aeRepos($route, repoService) {

    var aeRepos_ = {
        templateUrl: 'repos.html',
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeRepos_;

    function controllerFn() {

        var _username = $route.current.params.username;
        repoService.getAllRepos(_username).then(function (repos) {
            return vm.repos = repos;
        });
    }

    function linkFn(scope, element, attrs) {}
}

exports.aeRepos = aeRepos;

},{}]},{},[1]);
