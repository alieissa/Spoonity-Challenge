(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _chartDirective = require('./chart.directive.js');

var _languagesDirective = require('./languages.directive.js');

var _reposDirective = require('./repos.directive.js');

var _repoDirective = require('./repo.directive.js');

var _reposController = require('./repos.controller.js');

var _repo = require('./repo.service');

var _settingsDirective = require('./settings.directive.js');

console.log(_settingsDirective.aeSettings);

angular.module('spoonityApp', ['ngRoute']).config(config).constant('HTTP', {
    baseUrl: 'https://api.github.com'
}).controller('mainCtrl', mainCtrl).directive('aeChart', _chartDirective.aeChart).directive('aeLanguages', _languagesDirective.aeLanguages).directive('aeSettings', _settingsDirective.aeSettings).directive('aeRepos', _reposDirective.aeRepos).directive('aeRepo', _repoDirective.aeRepo).factory('repoService', _repo.repoService);

function config($routeProvider) {

    // $routeProvider.when('/', {
    //     template: '<ae-chart> </ae-chart>'
    // })
    $routeProvider.when('/', {
        template: '<ae-repos></ae-repos>'
    }).when('/tabs', {
        templateUrl: '/tabs.html'
    })

    // List repos for user
    .when('/users/:username/repos', {
        template: '<ae-repos>\n                        <ae-repo ng-repeat="repo in vm.repos"></ae-repo>\n                    </ae-repos>'
    })

    //List langs for repo
    .when('/:repo/languages', {
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

},{"./chart.directive.js":2,"./languages.directive.js":3,"./repo.directive.js":4,"./repo.service":5,"./repos.controller.js":6,"./repos.directive.js":7,"./settings.directive.js":8}],2:[function(require,module,exports){
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

        repoService.getLanguages($routeParams.repo).then(function (result) {
            vm.languages = result.data.languages;
            // console.log(result);
            return result.data.mainLanguage;
        }).then(function (mainLanguage) {
            // console.log(mainLanguage);
            return repoService.getLanguageContent($routeParams.repo, mainLanguage);
        });
        // .then(content => console.log(content))
        // .catch(err => vm.error = error);
    }

    function linkFn(scope, element, attrs) {
        // console.log(element.find('button'));
        // .on('click', function() {
        //     console.log($routeParams);
        // });
        // console.log('Language Link');
    }
}

exports.aeLanguages = aeLanguages;

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRepo.$inject = ['$routeParams', 'repoService'];

function aeRepo($routeParams, repoService) {

    var aeRepo_ = {
        templateUrl: '<li></li>',
        restrict: 'E',
        transclude: true,
        require: '^repos',
        controllerAs: 'repo',
        controller: controllerFn,
        link: linkFn
    };

    return aeRepo_;

    function controllerFn() {

        var vm = this;
        vm.test = function () {
            console.log('Test');
        };
        console.log($routeParams);
        // let _username = $state.current.params.username;
        // repoService.getAllRepos($routeParams.username)
        //     .then(repos => vm.repos = repos)
        //     .catch(err => vm.err = err);
    }

    function linkFn(scope, element, attrs, ctrl) {
        console.log(ctrl);
    }
}

exports.aeRepo = aeRepo;

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var ABBRS = {
    CoffeScript: 'coffee',
    HTML: 'html',
    CSS: 'css',
    Java: 'java',
    JavaScript: 'js',
    Ruby: 'rb',
    Python: 'py',
    TypeScript: 'ts'
};

var SETTINGS = {
    languages: Object.keys(ABBRS),
    appFolder: 'app',
    fileNumber: 5
};

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {
    var id = '9accafccc779c70328cb';
    var secret = '993aa0ea792d394457d2cc130b0912b4f690a31b';
    var repoData = void 0,
        content_urls = void 0;
    var _currentRepo_ = void 0;
    var languages_ = void 0;
    var contentInfo_ = [];

    // Gets Repo information for user
    function getAllRepos(username) {
        var defer_ = $q.defer();

        var _handleRes = function _handleRes(result) {
            repoData = result.data;
            // let repos_ = repoData.map(repo => repo.name);
            defer_.resolve(repoData.map(function (repo) {
                return repo.name;
            }));
        };

        $http.get(HTTP.baseUrl + '/users/' + username + '/repos?client_id=' + id + '&client_secret=' + secret).then(_handleRes, function (err) {
            console.log(err);
            defer_.reject(err);
        });
        return defer_.promise;
    }

    function getLanguageContent(repoName, language) {
        var defer_ = $q.defer();

        var _repoData$filter = repoData.filter(function (repo) {
            return repo.name === repoName;
        });

        var _repoData$filter2 = _slicedToArray(_repoData$filter, 1);

        _currentRepo_ = _repoData$filter2[0];


        if (_currentRepo_.languages[language].length > 0) {
            console.log('Lang length is larger than 0');
            defer_.resolve(_currentRepo_.languages[language]);
            return defer_.promise;
        }

        console.log('Length is 0');

        var _language = _currentRepo_.language;
        var findLang = function findLang(blob) {
            var _lang = blob.path.split('.').pop();
            return _lang === ABBRS[language];
        };

        return $http.get(HTTP.baseUrl + '/repos/alieissa/' + repoName + '/contents/?client_id=' + id + '&client_secret=' + secret)
        // 1) Get files and main folder 'app'
        .then(function (result) {
            contentInfo_ = result.data.filter(function (seg) {
                return seg.type === 'file';
            });
            return result.data.filter(function (seg) {
                return seg.name === SETTINGS.appFolder;
            })[0];
        })

        // 2) Get main folder files recursively
        .then(function (appSeg) {
            return $http.get(appSeg.git_url + '?recursive=3&client_id=' + id + '&client_secret=' + secret);
        })

        // 3) Parse files form http result
        .then(function (result) {
            return result.data.tree;
        })

        // 4) Save main folder files to files from 1)
        .then(function (blobs) {
            contentInfo_ = [].concat(_toConsumableArray(contentInfo_), _toConsumableArray(blobs));
            _currentRepo_.blob_urls = contentInfo_;
            return _currentRepo_.blob_urls;
        }).then(function (blobs) {
            return blobs.filter(function (blob) {
                return blob.path.indexOf('.') !== -1;
            }).filter(findLang);
        }).then(function (langBlobs) {
            return langBlobs.slice(0, 5).map(function (langBlob) {
                var _sep = langBlob.url.indexOf('?') === -1 ? '?' : '&';
                return $http.get('' + langBlob.url + _sep + 'client_id=' + id + '&client_secret=' + secret);
            });
        }).then(function (promises) {
            return $q.all(promises);
        }).then(function (contents) {
            _currentRepo_.languages[language] = contents.map(function (article) {
                return article.data.content;
            });
            return _currentRepo_.languages[language];
        });
    }

    // Returns languages from for repo from repo information
    function getLanguages(repoName) {
        var defer_ = $q.defer();

        var _repoData$filter3 = repoData.filter(function (repo) {
            return repo.name === repoName;
        }),
            _repoData$filter4 = _slicedToArray(_repoData$filter3, 1),
            repo_ = _repoData$filter4[0];

        if (typeof repo_.languages !== 'undefined') {
            defer_.resolve({ input: repoName, data: { mainLanguage: repo_.language, languages: repo_.languages } });
            return defer_.promise;
        }

        repo_.languages = {};

        return $http.get(repo_.languages_url + '?client_id=' + id + '&client_secret=' + secret)
        // Get Language names
        .then(function (result) {
            return Object.keys(result.data);
        })

        // Set-up language arrays for repo
        .then(function (languages) {
            languages.filter(function (lang) {
                return SETTINGS.languages.includes(lang);
            }).map(function (language) {
                return repo_.languages[language] = [];
            });
            return languages.filter(function (lang) {
                return SETTINGS.languages.includes(lang);
            });
        }).then(function (languages) {
            return {
                input: repoName,
                data: {
                    mainLanguage: repo_.language,
                    languages: languages
                }
            };
        });
    }

    // function getLanguagesContentsUrls(repoName) {
    //     let defer_ = $q.defer();
    //     let _promises = [];
    //
    //     let _repo = repoData.filter(repo => repo.name === repoName);
    //     let _language = _repo.language;
    //
    //     let _getUrlsRecursively = seg => {
    //
    //         let _handleRes = (result) => {
    //             defer_.resolve(result.data.tree.filter(datum => datum.type === 'blob'));
    //         };
    //
    //         $http.get(`${seg.git_url}?recursive=3&client_id=${id}&client_secret=${secret}`)
    //                 .then(_handleRes, err => console.log(err));
    //     };
    //
    //     let _handleRes = result => {
    //
    //         result.data.forEach(seg => {
    //             if(seg.type === 'file') {
    //                 contentInfo_.push(seg);
    //             }
    //             else if(seg.name === 'app') {
    //                 _getUrlsRecursively(seg);
    //             }
    //         });
    //     };
    //
    //     $http.get(`${HTTP.baseUrl}/repos/alieissa/${repoName}/contents/?client_id=${id}&client_secret=${secret}`)
    //         .then( _handleRes, err => console.log(err));
    //
    //     return defer_.promise;
    // }

    return { getAllRepos: getAllRepos, getLanguages: getLanguages, getLanguageContent: getLanguageContent };
}

exports.repoService = repoService;

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
repoCtrl.$inject = ['$routeParams', 'repoService'];

function repoCtrl($routeParams, repoService) {

    // let vm = this;
    //
    // console.log($routeParams);
    // // let _username = $state.current.params.username;
    // repoService.getAllRepos(_username)
    //     .then(repos => vm.repos = repos)
    //     .catch(err => vm.err = err);
}

exports.repoCtrl = repoCtrl;

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeRepos.$inject = ['$routeParams', 'repoService'];

// function aeRepos($routeParams, repoService) {
function aeRepos($routeParams, repoService) {

    var aeRepos_ = {
        templateUrl: 'repos.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeRepos_;

    function controllerFn($timeout) {

        var vm = this;
        vm.setLang = function (lang) {
            console.log(lang);

            repoService.getLanguageContent(vm.repos[0], lang).then(function (content) {
                console.log(content);
                vm.chartContent = window.atob(content[0]);
                console.log(window.atob(content[0]));
            });
        };

        repoService.getAllRepos('alieissa').then(function (repos) {
            return vm.repos = repos;
        }).then(function (repos) {
            return repoService.getLanguages(repos[0]);
        }).then(function (result) {
            return vm.languages = result.data.languages;
        }).then(function (languages) {
            return repoService.getLanguageContent(vm.repos[0], 'JavaScript');
        }).then(function (content) {
            vm.chartContent = window.atob(content[0]);
            // console.log(vm.chartContent);
        }).catch(function (err) {
            return vm.err = err;
        });
    }

    function linkFn(scope, element, attrs) {}
}

exports.aeRepos = aeRepos;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeSettings.$inject = ['repoService'];

function aeSettings(repoService) {

    var aeSettings_ = {
        templateUrl: 'settings.html',
        scope: { settings: "=" },
        controller: controllerFn,
        controllerAs: 'settings',
        link: linkFn
    };

    return aeSettings_;

    function controllerFn() {}

    function linkFn(scope, element, attrs) {
        // let _form = element.find('form')
        // console.log(element.find('i'))
        // console.log(element.find('.settings'))
        element.find('i').on('click', function () {
            var _display = element.find('form').css('display') === 'none' ? 'block' : 'none';
            console.log(_display);
            element.find('form').css('display', _display);
        });
    }
}

exports.aeSettings = aeSettings;

},{}]},{},[1]);
