(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _chartDirective = require('./chart.directive.js');

var _languagesDirective = require('./languages.directive.js');

var _reposDirective = require('./repos.directive.js');

var _repo = require('./repo.service');

angular.module('spoonityApp', ['ngRoute']).config(config).constant('HTTP', {
    baseUrl: 'https://api.github.com'
}).controller('mainCtrl', mainCtrl).directive('aeChart', _chartDirective.aeChart).directive('aeLanguages', _languagesDirective.aeLanguages).directive('aeRepos', _reposDirective.aeRepos).factory('repoService', _repo.repoService);

function config($routeProvider) {

    $routeProvider.when('/', {
        template: '<ae-chart> </ae-chart>'
    }).when('/repos/:username', {
        template: '<ae-repos></ae-repos>'
    }).when('/repos/:repo/languages', {
        template: '<ae-languages></ae-languages>'
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

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeLanguages.$inject = ['$routeParams', 'repoService'];

function aeLanguages($routeParams, repoService) {

    var aeLanguages_ = {
        templateUrl: 'languages.html',
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeLanguages_;

    function controllerFn() {

        var vm = this;

        repoService.getLanguages($routeParams.repo).then(function (languages) {
            return vm.languages = languages;
        }).catch(function (err) {
            return vm.error = error;
        });
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

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {

    var repoData = void 0;
    var languages_ = void 0;
    var content_ = void 0;

    // Returns languages from for repo from repo information
    function getLanguages(repoName) {

        var defer_ = $q.defer();

        var _repoData$filter = repoData.filter(function (repo) {
            return repo.name === repoName;
        }),
            _repoData$filter2 = _slicedToArray(_repoData$filter, 1),
            repo_ = _repoData$filter2[0];

        console.log(repo_);

        var _handleRes = function _handleRes(result) {
            var languages_ = Object.keys(result.data);
            repo_.languages = languages_;
            defer_.resolve(languages_);
        };

        if (typeof repo_.languages === 'undefined') {
            $http.get(repo_.languages_url).then(_handleRes, function (err) {
                console.log(err);
                defer_.reject(err);
            });
        } else {
            defer_resolve(repo_.languages);
        }

        return defer_.promise;
    }

    // Gets Repo information for user
    function getAllRepos(username) {
        var defer_ = $q.defer();

        var _handleRes = function _handleRes(result) {

            // Save app
            repoData = result.data;
            var repos_ = repoData.map(function (repo) {
                return repo.name;
            });
            defer_.resolve(repos_);
        };

        $http.get(HTTP.baseUrl + '/users/' + username + '/repos').then(_handleRes, function (err) {
            defer_.reject(err);
        });

        return defer_.promise;
    }

    return { getAllRepos: getAllRepos, getLanguages: getLanguages };
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
        restrict: 'E',
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeRepos_;

    function controllerFn() {

        var vm = this;

        var _username = $route.current.params.username;
        repoService.getAllRepos(_username).then(function (repos) {
            return vm.repos = repos;
        });
    }

    function linkFn(scope, element, attrs) {}
}

exports.aeRepos = aeRepos;

},{}]},{},[1]);
