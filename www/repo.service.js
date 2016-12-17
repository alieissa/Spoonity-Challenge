'use strict';
const ABBRS = {
    CoffeScript: 'coffee',
    HTML: 'html',
    CSS: 'css',
    Java: 'java',
    JavaScript: 'js',
    Ruby: 'rb',
    Python: 'py',
    TypeScript: 'ts'
};

const SETTINGS = {
    languages: Object.keys(ABBRS),
    appFolder: 'app',
    fileNumber: 5
};

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {
    let id = '9accafccc779c70328cb';
    let secret = '993aa0ea792d394457d2cc130b0912b4f690a31b';
    let repoData, content_urls;
    let _currentRepo_;
    let languages_;
    let contentInfo_ = [];

    // Gets Repo information for user
    function getAllRepos(username) {
        let defer_ = $q.defer();

        let _handleRes = result => {
            repoData = result.data;
            // let repos_ = repoData.map(repo => repo.name);
            defer_.resolve(repoData.map(repo => repo.name));
        };

        $http.get(`${HTTP.baseUrl}/users/${username}/repos?client_id=${id}&client_secret=${secret}`)
            .then(_handleRes, (err) => {
                console.log(err);
                defer_.reject(err);
        });
        return defer_.promise;
    }


    function getLanguageContent(repoName, language) {
        let defer_ = $q.defer();

        [_currentRepo_] = repoData.filter(repo => repo.name === repoName)

        if(_currentRepo_.languages[language].length > 0) {
            console.log('Lang length is larger than 0');
            defer_.resolve(_currentRepo_.languages[language]);
            return defer_.promise;
        }

        console.log('Length is 0');

        let _language = _currentRepo_.language;
        let findLang = blob => {
            let _lang = blob.path.split('.').pop();
            return _lang === ABBRS[language];
        }

        return $http.get(`${HTTP.baseUrl}/repos/alieissa/${repoName}/contents/?client_id=${id}&client_secret=${secret}`)
            // 1) Get files and main folder 'app'
            .then((result) => {
                contentInfo_ = result.data.filter(seg => seg.type === 'file');
                return result.data.filter(seg => seg.name === SETTINGS.appFolder) [0];
            })

            // 2) Get main folder files recursively
            .then(appSeg => {
                return $http.get(`${appSeg.git_url}?recursive=3&client_id=${id}&client_secret=${secret}`);
            })

            // 3) Parse files form http result
            .then(result => result.data.tree)

            // 4) Save main folder files to files from 1)
            .then(blobs => {
                contentInfo_ = [...contentInfo_, ...blobs];
                _currentRepo_.blob_urls = contentInfo_;
                return _currentRepo_.blob_urls
            })
            .then(blobs => {
                return blobs.filter(blob => blob.path.indexOf('.') !== -1)
                    .filter(findLang)
            })
            .then(langBlobs => {
                return langBlobs.slice(0, 5).map(langBlob => {
                    let _sep = langBlob.url.indexOf('?') === -1 ? '?' : '&'
                    return $http.get(`${langBlob.url}${_sep}client_id=${id}&client_secret=${secret}`);
                })
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
                languages.filter(lang => SETTINGS.languages.includes(lang)).map(language => repo_.languages[language] = []);
                return languages.filter(lang => SETTINGS.languages.includes(lang));
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

    return {getAllRepos, getLanguages, getLanguageContent};
}

export {repoService};
