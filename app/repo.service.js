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
    YAML: 'yml',
    JSON: 'json',
    PHP: 'php'
};

let Settings = {
    languages: Object.keys(ABBRS),
    folders: ['assets', 'app', 'scripts']
    // fileNumber: 5
};

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {
    let id = '9accafccc779c70328cb';
    let secret = '993aa0ea792d394457d2cc130b0912b4f690a31b';
    let repoData;
    let _currentRepo_;
    // let languages_;
    let contentInfo_ = [];

    function updateSettings(appFolder, langs) {
        Settings.languages = languages;
        Settings.folders = appfolders.split(',');
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
        // let defer_ = $q.defer();

        [_currentRepo_] = repoData.filter(repo => repo.name === repoName);

        let findLang = blob => {

            let _lang = blob.path.split('.').pop();
            return _lang === ABBRS[language];
        };

        let _getDirFiles = (appSeg, contentFiles) => {
            return $http.get(`${appSeg.git_url}?recursive=3&client_id=${id}&client_secret=${secret}`)
                .then(result => result.data.tree)
                .then(files => contentFiles = [...files, ...contentFiles]);

        };

        return $http.get(`${HTTP.baseUrl}/repos/${username}/${repoName}/contents/?client_id=${id}&client_secret=${secret}`)

            // 1) Get files and main folder 'app'
            .then(result => {
                let _appSeg = result.data.filter(seg => Settings.folders.includes(seg.name));
                // let _appSeg = result.data.filter(seg => seg.name === Settings.folders);
                contentInfo_ = result.data.filter(seg => seg.type === 'file');
                // console.log(contentInfo_);
                if(_appSeg.length > 0) {
                    return _getDirFiles(_appSeg[0], contentInfo_);
                }
                else {
                    return contentInfo_;
                }
            })
            .then(blobs => {
                return blobs.filter(blob => blob.path.indexOf('.') !== -1)
                    .filter(findLang);
            })
            .then(langBlobs => {
                return langBlobs.slice(0, 5).map(langBlob => {
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
    function getLanguages(repoName) {
        let defer_ = $q.defer();

        let [repo_] = repoData.filter(repo => repo.name === repoName);

        if(typeof repo_.languages !== 'undefined') {
            defer_.resolve({input: repoName, data: {mainLanguage: repo_.language, languages: repo_.languages}});
            return defer_.promise;
        }

        repo_.languages = {};

        return $http.get(`${repo_.languages_url}?client_id=${id}&client_secret=${secret}`)
            // Get Language names
            .then(result => Object.keys(result.data))

            // Set-up language arrays for repo
            .then(languages => {
                repo_.languages = languages.filter(lang => Settings.languages.includes(lang));
                return repo_.languages;
            })
            .then(languages => {
                return {
                    input: repoName,
                    data: {
                        mainLanguage: repo_.language,
                        languages: languages
                    }
                };
            });
    }

    return {getAllRepos, getLanguages, getLanguageContent, updateSettings};
}

export {repoService};
