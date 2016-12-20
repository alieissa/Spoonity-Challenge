(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _userDirective = require('./user.directive.js');

var _repo = require('./repo.service');

var _settingsDirective = require('./settings.directive.js');

angular.module('spoonityApp', ['ngRoute']).config(config).constant('HTTP', {
    baseUrl: 'https://api.github.com'
}).controller('mainCtrl', mainCtrl).directive('aeSettings', _settingsDirective.aeSettings).directive('aeUser', _userDirective.aeUser).factory('repoService', _repo.repoService);

function config($routeProvider) {

    $routeProvider.when('/', {
        template: '<ae-user></ae-user>'
    }).otherwise({
        redirectTo: '/'
    });
}

function mainCtrl($rootScope) {
    $rootScope.$on('$routeChangeError', function (event, prev, next) {
        console.log('Unable to reach ' + next);
    });
}

},{"./repo.service":2,"./settings.directive.js":3,"./user.directive.js":4}],2:[function(require,module,exports){
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
    languages: ABBRS,
    folders: ['app', 'scripts', 'src', 'util']
};

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {
    var id = '9accafccc779c70328cb';
    var secret = '993aa0ea792d394457d2cc130b0912b4f690a31b';
    var repoData = void 0;
    var _currentRepo_ = void 0;

    function updateSettings(appFolder, languages) {
        Settings.languages = {};
        languages.map(function (language) {
            return Settings.languages[language] = ABBRS[language];
        });
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
                return Settings.languages[language] === ext;
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

                if (Object.values(Settings.languages).includes(ext)) {
                    return ext;
                }
            });
        };

        // Get the lanugage of each extension
        var _mapExtensionsToLang = function _mapExtensionsToLang(extensions) {
            return Array.from(extensions).map(function (ext) {
                var language_ = Object.keys(Settings.languages).filter(function (key) {
                    return Settings.languages[key] === ext;
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
            return Object.values(Settings.languages).includes(_lang);
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
        return _files;
    }

    return { getAllRepos: getAllRepos, getLanguages: getLanguages, getLanguageContent: getLanguageContent, updateSettings: updateSettings };
}

exports.repoService = repoService;

},{}],3:[function(require,module,exports){
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

        var vm = this;

        vm.languages = Object.keys(ABBRS);

        // Defaul Settings
        vm.appFolders = 'app,scripts,src,util';
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

        vm.updateSettings = function (username, appFolders, langs) {
            repoService.updateSettings(appFolders, langs);
            return vm.reInit(vm.username);
        };
    }

    function linkFn(scope, element, attrs, $ctrl) {

        scope.settings.reInit = $ctrl.changeUser;

        element.find('input[type=submit]').on('click', function () {
            var _display = element.find('form').css('display') === 'none' ? 'block' : 'none';
            element.find('form').css('display', _display);
        });

        element.find('i').on('click', function () {
            var _display = element.find('form').css('display') === 'none' ? 'block' : 'none';
            element.find('form').css('display', _display);
        });
    }
}

exports.aeSettings = aeSettings;

},{}],4:[function(require,module,exports){
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
        controller: controllerFn
    };

    return aeUser_;

    function controllerFn() {
        var vm = this;

        // Defaults
        vm.chartContent = '';
        vm.languages = '';
        vm.repo = '';
        vm.repos = [];
        vm.username = 'alieissa';

        vm.changeLang = function (username, repo, lang) {
            repoService.getLanguageContent(username, repo, lang).then(function (content) {
                vm.chartContent = window.atob(content[0]);
            }).catch(function (err) {
                console.log('Error');
                console.log(err);
            });
        };

        vm.changeRepo = function (username, repo) {
            repoService.getLanguages(username, repo).then(function (languages) {
                // Dirty workaround
                if (languages.length == 0) {
                    alert('ERROR: ' + repo + ' does not have any of the desired languages');
                    return;
                }
                vm.repo = repo;
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
}

exports.aeUser = aeUser;

},{}]},{},[1]);
