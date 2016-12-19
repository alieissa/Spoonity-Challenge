(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _chartDirective = require('./chart.directive.js');

var _languagesDirective = require('./languages.directive.js');

var _reposDirective = require('./repos.directive.js');

var _userDirective = require('./user.directive.js');

var _repoDirective = require('./repo.directive.js');

var _reposController = require('./repos.controller.js');

var _repo = require('./repo.service');

var _settingsDirective = require('./settings.directive.js');

angular.module('spoonityApp', ['ngRoute']).config(config).constant('HTTP', {
    baseUrl: 'https://api.github.com'
}).controller('mainCtrl', mainCtrl).directive('aeChart', _chartDirective.aeChart).directive('aeLanguages', _languagesDirective.aeLanguages).directive('aeSettings', _settingsDirective.aeSettings).directive('aeRepos', _reposDirective.aeRepos).directive('aeRepo', _repoDirective.aeRepo).directive('aeUser', _userDirective.aeUser).factory('repoService', _repo.repoService);

function config($routeProvider) {

    $routeProvider.when('/', {
        template: '<ae-user></ae-user>'
    })
    // $routeProvider.when('/', {
    //     template: '<ae-repos></ae-repos>'
    // })


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

},{"./chart.directive.js":2,"./languages.directive.js":3,"./repo.directive.js":4,"./repo.service":5,"./repos.controller.js":6,"./repos.directive.js":7,"./settings.directive.js":8,"./user.directive.js":9}],2:[function(require,module,exports){
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
    TypeScript: 'ts',
    YAML: 'yml',
    JSON: 'json',
    PHP: 'php'
};

var Settings = {
    languages: Object.keys(ABBRS),
    folders: ['assets', 'app', 'scripts']
    // fileNumber: 5
};

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {
    var id = '9accafccc779c70328cb';
    var secret = '993aa0ea792d394457d2cc130b0912b4f690a31b';
    var repoData = void 0;
    var _currentRepo_ = void 0;
    // let languages_;
    var contentInfo_ = [];

    function updateSettings(appFolder, langs) {
        Settings.languages = languages;
        Settings.folders = appfolders.split(',');
    }
    // Gets Repo information for user
    function getAllRepos(username) {
        var defer_ = $q.defer();

        var _handleRes = function _handleRes(result) {
            repoData = result.data;
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

    function getLanguageContent(username, repoName, language) {
        var _repoData$filter = repoData.filter(function (repo) {
            return repo.name === repoName;
        });
        // let defer_ = $q.defer();

        var _repoData$filter2 = _slicedToArray(_repoData$filter, 1);

        _currentRepo_ = _repoData$filter2[0];


        var findLang = function findLang(blob) {

            var _lang = blob.path.split('.').pop();
            return _lang === ABBRS[language];
        };

        var _getDirFiles = function _getDirFiles(appSeg, contentFiles) {
            return $http.get(appSeg.git_url + '?recursive=3&client_id=' + id + '&client_secret=' + secret).then(function (result) {
                return result.data.tree;
            }).then(function (files) {
                return contentFiles = [].concat(_toConsumableArray(files), _toConsumableArray(contentFiles));
            });
        };

        return $http.get(HTTP.baseUrl + '/repos/' + username + '/' + repoName + '/contents/?client_id=' + id + '&client_secret=' + secret)

        // 1) Get files and main folder 'app'
        .then(function (result) {
            var _appSeg = result.data.filter(function (seg) {
                return Settings.folders.includes(seg.name);
            });
            // let _appSeg = result.data.filter(seg => seg.name === Settings.folders);
            contentInfo_ = result.data.filter(function (seg) {
                return seg.type === 'file';
            });
            // console.log(contentInfo_);
            if (_appSeg.length > 0) {
                return _getDirFiles(_appSeg[0], contentInfo_);
            } else {
                return contentInfo_;
            }
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
            repo_.languages = languages.filter(function (lang) {
                return Settings.languages.includes(lang);
            });
            return repo_.languages;
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

    return { getAllRepos: getAllRepos, getLanguages: getLanguages, getLanguageContent: getLanguageContent, updateSettings: updateSettings };
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

function aeRepos($routeParams, repoService) {

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

        vm.chartContent = '';
        vm.languages = '';
        vm.repo = '';

        vm.changeLang = function (lang) {
            console.log(lang);

            repoService.getLanguageContent(vm.repo, lang).then(function (content) {
                return vm.chartContent = window.atob(content[0]);
            });
        };

        vm.changeRepo = function (repo) {
            // console.log(repo);

            repoService.getLanguages(repo).then(function (result) {
                return vm.languages = result.data;
            }).then(function (languages) {
                return vm.changeLang(languages.mainLanguage);
            });
        };

        init('alieissa');

        function init(username) {
            repoService.getAllRepos(username).then(function (repos) {
                return vm.changeRepo(repos[0]);
            })
            // .then(result => vm.languages = result.data.languages)
            .catch(function (err) {
                return vm.err = err;
            });
        }
    }

    function linkFn(scope, element, attrs) {
        console.log(scope.vm);
        console.log(attrs);
    }
}

exports.aeRepos = aeRepos;

},{}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var ABBRS = {
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
    var aeSettings_ = {
        templateUrl: 'settings.html',
        scope: {},
        controller: controllerFn,
        controllerAs: 'settings',
        link: linkFn
    };

    return aeSettings_;

    function controllerFn() {
        var vm = this;

        vm.languages = Object.keys(ABBRS);

        // Defaul Settings
        vm.appFolder = 'app';
        vm.selectedLanguages = Object.keys(ABBRS);

        vm.updateLangs = function (lang, checked) {
            if (checked === -1) {
                vm.selectedLanguages.push(lang);
            } else {
                vm.selectedLanguages = vm.selectedLanguages.filter(function (_lang_) {
                    return _lang_ !== lang;
                });
            }
        };

        vm.updateSettings = function (appFolder, langs) {
            repoService.updateSettings(appFolder, langs);
        };
    }

    function linkFn(scope, element) {
        element.find('i').on('click', function () {
            var _display = element.find('form').css('display') === 'none' ? 'block' : 'none';
            element.find('form').css('display', _display);
        });
    }
}

exports.aeSettings = aeSettings;

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
aeUser.$inject = ['repoService'];

function aeUser(repoService) {

    var aeUser_ = {
        templateUrl: 'user.html',
        restrict: 'E',
        transclude: true,
        controllerAs: 'vm',
        controller: controllerFn,
        link: linkFn
    };

    return aeUser_;

    function controllerFn() {

        var vm = this;

        vm.chartContent = '';
        vm.languages = '';
        vm.repo = '';
        vm.repos = [];
        vm.username = 'alieissa';

        vm.changeLang = function (lang) {
            repoService.getLanguageContent(vm.username, vm.repo, lang).then(function (content) {
                // console.log(lang);
                // console.log(content);
                vm.chartContent = window.atob(content[0]);
            }).catch(function (err) {
                console.log('Error');
                console.log(err);
            });
        };

        vm.changeRepo = function (repo) {
            vm.repo = repo;

            repoService.getLanguages(repo).then(function (result) {
                return vm.languages = result.data;
            }).then(function (languages) {
                vm.changeLang(languages.mainLanguage);
            });
        };

        vm.changeUser = function (username) {
            vm.username = username;
            init(vm.username);
        };

        init(vm.username);

        function init(username) {
            console.log(username);
            repoService.getAllRepos(username).then(function (repos) {
                return vm.repos = repos;
            }).then(function (repos) {
                return vm.changeRepo(repos[0]);
            });
        }
    }

    function linkFn() {
        // console.log(scope.vm);
        // console.log(attrs);
    }
}

exports.aeUser = aeUser;

},{}]},{},[1]);
