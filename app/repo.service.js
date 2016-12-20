'use strict';
const ABBRS = {
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

let Settings = {
    languages: Object.keys(ABBRS),
    folders: ['app', 'scripts', 'src', 'util']
};

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {
    let id = '9accafccc779c70328cb';
    let secret = '993aa0ea792d394457d2cc130b0912b4f690a31b';
    let repoData;
    let _currentRepo_;


    function updateSettings(appFolder, langs) {
        Settings.languages = langs;
        Settings.folders = appFolder.split(',');
    }
    // Gets Repo information for user
    function getAllRepos(username) {
        let defer_ = $q.defer();

        let _handleRes = result => {
            repoData = result.data;
            defer_.resolve(repoData.map(repo => repo.name));
        };

        $http.get(`${HTTP.baseUrl}/users/${username}/repos?client_id=${id}&client_secret=${secret}`)
            .then(_handleRes, (err) => {
                console.log(err);
                defer_.reject(err);
            });
        return defer_.promise;
    }

    function getLanguageContent(username, repoName, language) {

        return detectLanguages(username, repoName)
            .then(langs => {
                return langs.filter(lang => {
                    let ext = lang.path.split('.').pop();

                    return ABBRS[language] === ext;
                });
            })
            .then(langBlobs => {
                return langBlobs.map(langBlob => {
                    // console.log(langBlob.path);
                    let _sep = langBlob.url.indexOf('?') === -1 ? '?' : '&';
                    return $http.get(`${langBlob.url}${_sep}client_id=${id}&client_secret=${secret}`);
                });
            })
            .then(promises => $q.all(promises))
            .then(contents => {
                _currentRepo_.languages[language] = contents.map(article => article.data.content);
                return _currentRepo_.languages[language];
            });
    }

    // Returns languages from for repo from repo information
    function getLanguages(username, repoName) {
        let [_repo_] = repoData.filter(repo => repo.name === repoName);

        let _getLangExtensions = languages => {

            return languages.map(language => {
                let ext = language.path.split('.').pop();

                if(Object.values(ABBRS).includes(ext)) {
                    return ext;
                }
            });
        };

        return detectLanguages(username, repoName)
            .then(_getLangExtensions)
            // .then(languages => {
            //     return languages.map(language => {
            //         let ext = language.path.split('.').pop();
            //
            //         if(Object.values(ABBRS).includes(ext)) {
            //             return ext;
            //         }
            //     });
            // })
            .then(extensions => new Set(extensions)) // Get unique values
            .then(uExtensions => {
                return Array.from(uExtensions).map(ext => {
                    let language_ = Object.keys(ABBRS).filter(key => ABBRS[key] === ext)[0];
                    return language_;
                });
            })
            .then(languages => {
                _repo_.languages = languages;
                return languages;
            });

    }

    function detectLanguages(username='alieissa', repoName) {
        [_currentRepo_] = repoData.filter(repo => repo.name === repoName);

        let _findLang = blob => {
            let _lang = blob.path.split('.').pop();
            return Object.values(ABBRS).includes(_lang);
        };

        let _getDirFiles = dirs => {
            let _promises =  dirs.map(dir => {
                return $http.get(`${dir.git_url}?recursive=3&client_id=${id}&client_secret=${secret}`)
                    .then(result => result.data.tree);
            });

            return $q.all(_promises);

        };

        return $http.get(`${HTTP.baseUrl}/repos/${username}/${repoName}/contents/?client_id=${id}&client_secret=${secret}`)

            // 1) Get files and main folder 'app'
            .then(result => {
                let appFiles = result.data.filter(seg => seg.type === 'file');

                // Uncomment to filter folder by exclusion
                // let _appSeg = result.data.filter(seg => {
                //     return Settings.folders.indexOf(seg.name) === -1 && seg.type === 'dir';
                // });

                // Uncomment to filter folder by inclusion
                let _appSeg = result.data.filter(seg => Settings.folders.includes(seg.name));

                if(_appSeg.length > 0) {
                    return _getDirFiles(_appSeg).then(dirFiles => mergeFiles(dirFiles, appFiles));
                }
                else {
                    return appFiles;
                }
            })

            // Return files with extensions that match lang extensions
            .then(blobs => {
                return blobs.filter(blob => blob.path.indexOf('.') !== -1)
                    .filter(_findLang);
            }).then(langs => {
                return langs;
            });
    }
    function flattenArray(dirFiles) {
        // console.log(dirFiles)
        return  dirFiles.reduce((prevDir, currDir) =>  prevDir.concat(currDir));
    }
    function mergeFiles(dirFiles, appFiles) {
        let _files = dirFiles;
        if(appFiles.length > 0) {
            _files.push(appFiles);
            _files = flattenArray(_files);
        }
        else {
            _files = flattenArray(_files);
        }
        // console.log(_files)
        return _files;
    }

    return {getAllRepos, getLanguages, getLanguageContent, updateSettings};
}


export {repoService};
