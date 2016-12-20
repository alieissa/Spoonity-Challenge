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

var ABBRS = {
    CoffeScript: 'coffee',
    HTML: 'html',
    CSS: 'css',
    Java: 'java',
    JavaScript: 'js',
    Ruby: 'rb',
    Python: 'py',
    TypeScript: 'ts',
    PHP: 'php'
};

var Settings = {
    languages: Object.keys(ABBRS),
    folders: ['app', 'scripts', 'src', 'util']
};

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {
    var id = '9accafccc779c70328cb';
    var secret = '993aa0ea792d394457d2cc130b0912b4f690a31b';
    var repoData = void 0;
    var _currentRepo_ = void 0;

    function updateSettings(appFolder, langs) {
        Settings.languages = langs;
        Settings.folders = appFolder.split(',');
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

        // Filter for language blobs that are for desired languages
        var _filterLanguageBlobs = function _filterLanguageBlobs(langs) {
            return langs.filter(function (lang) {
                var ext = lang.path.split('.').pop();

                return ABBRS[language] === ext;
            });
        };

        // Gets the contents of all language blobs from github
        var _getLanguageBlobContent = function _getLanguageBlobContent(langBlobs) {
            return langBlobs.map(function (langBlob) {
                var _sep = langBlob.url.indexOf('?') === -1 ? '?' : '&';
                return $http.get('' + langBlob.url + _sep + 'client_id=' + id + '&client_secret=' + secret);
            });
        };

        return detectLanguages(username, repoName).then(_filterLanguageBlobs).then(_getLanguageBlobContent).then(function (promises) {
            return $q.all(promises);
        }) // Resolves _getLanguageBlobContent array of promises
        .then(function (contents) {
            _currentRepo_.languages[language] = contents.map(function (article) {
                return article.data.content;
            });
            return _currentRepo_.languages[language];
        });
    }

    // Returns languages from for repo from repo information
    function getLanguages(username, repoName) {
        var _repoData$filter = repoData.filter(function (repo) {
            return repo.name === repoName;
        }),
            _repoData$filter2 = _slicedToArray(_repoData$filter, 1),
            _repo_ = _repoData$filter2[0];

        //Filters for extensions of repo languages


        var _getLangExtensions = function _getLangExtensions(languages) {
            return languages.map(function (language) {
                var ext = language.path.split('.').pop();

                if (Object.values(ABBRS).includes(ext)) {
                    return ext;
                }
            });
        };

        // Get the lanugage of each extension
        var _mapExtensionsToLang = function _mapExtensionsToLang(extensions) {
            return Array.from(extensions).map(function (ext) {
                var language_ = Object.keys(ABBRS).filter(function (key) {
                    return ABBRS[key] === ext;
                })[0];
                return language_;
            });
        };

        return detectLanguages(username, repoName).then(_getLangExtensions).then(function (extensions) {
            return new Set(extensions);
        }) // Get unique values
        .then(_mapExtensionsToLang).then(function (languages) {
            return _repo_.languages = languages;
        });
    }

    // Detects the languages of user specified folders, i.e. settings.folders
    function detectLanguages() {
        var username = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'alieissa';
        var repoName = arguments[1];

        var _repoData$filter3 = repoData.filter(function (repo) {
            return repo.name === repoName;
        });

        var _repoData$filter4 = _slicedToArray(_repoData$filter3, 1);

        _currentRepo_ = _repoData$filter4[0];


        var _findLang = function _findLang(blob) {
            var _lang = blob.path.split('.').pop();
            return Object.values(ABBRS).includes(_lang);
        };

        // Takes a dir and returns an array of promises of all of its files
        var _getDirFiles = function _getDirFiles(dirs) {
            var _promises = dirs.map(function (dir) {
                return $http.get(dir.git_url + '?recursive=3&client_id=' + id + '&client_secret=' + secret).then(function (result) {
                    return result.data.tree;
                });
            });

            return $q.all(_promises);
        };

        // Gets the contents of entire repo
        var _getAllFiles = function _getAllFiles(result) {
            var appFiles = result.data.filter(function (seg) {
                return seg.type === 'file';
            });

            // Uncomment to filter folder by exclusion
            // let _appSeg = result.data.filter(seg => {
            //     return Settings.folders.indexOf(seg.name) === -1 && seg.type === 'dir';
            // });

            var _appSeg = result.data.filter(function (seg) {
                return Settings.folders.includes(seg.name);
            });

            if (_appSeg.length > 0) {
                return _getDirFiles(_appSeg).then(function (dirFiles) {
                    return mergeFiles(dirFiles, appFiles);
                });
            } else {
                return appFiles;
            }
        };

        return $http.get(HTTP.baseUrl + '/repos/' + username + '/' + repoName + '/contents/?client_id=' + id + '&client_secret=' + secret).then(_getAllFiles).then(function (blobs) {
            return blobs.filter(function (blob) {
                return blob.path.indexOf('.') !== -1;
            }).filter(_findLang);
        });
    }
    function flattenArray(dirFiles) {
        // console.log(dirFiles)
        return dirFiles.reduce(function (prevDir, currDir) {
            return prevDir.concat(currDir);
        });
    }
    function mergeFiles(dirFiles, appFiles) {
        var _files = dirFiles;
        if (appFiles.length > 0) {
            _files.push(appFiles);
            _files = flattenArray(_files);
        } else {
            _files = flattenArray(_files);
        }
        // console.log(_files)
        return _files;
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

        vm.updateSettings = function (username, appFolder, langs) {
            repoService.updateSettings(appFolder, langs);
            console.log(vm.username);
        };
    }

    function linkFn(scope, element, attrs) {
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
        controllerAs: 'user',
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

        vm.changeLang = function (username, repo, lang) {
            console.log(username);
            repoService.getLanguageContent(username, repo, lang).then(function (content) {
                vm.chartContent = window.atob(content[0]);
            }).catch(function (err) {
                console.log('Error');
                console.log(err);
            });
        };

        vm.changeRepo = function (username, repo) {
            vm.repo = repo;

            repoService.getLanguages(username, repo).then(function (languages) {
                vm.languages = languages;
                vm.changeLang(username, repo, vm.languages[0]);
            });
        };

        vm.changeUser = function (username) {
            vm.username = username;
            init(vm.username);
        };

        init(vm.username);

        function init(username) {
            repoService.getAllRepos(username).then(function (repos) {
                return vm.repos = repos;
            }).then(function (repos) {
                return vm.changeRepo(username, repos[0]);
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
