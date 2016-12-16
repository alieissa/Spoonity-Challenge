'use strict';
const ABBRS = {
    CoffeScript: 'coffee',
    HTML: 'html',
    Java: 'java',
    JavaScript: 'js',
    Ruby: 'rb',
    Python: 'py',
    TypeScript: 'ts'
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
            let repos_ = repoData.map(repo => repo.name);
            defer_.resolve(repos_);
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
            return;
        }

        console.log('Length is 0');

        let _language = _currentRepo_.language;
        let findLang = blob => {
            let _lang = blob.path.split('.').pop();
            return _lang === ABBRS[language];
        }
        $http.get(`${HTTP.baseUrl}/repos/alieissa/${repoName}/contents/?client_id=${id}&client_secret=${secret}`)
            .then((result) => {
                contentInfo_ = result.data.filter(seg => seg.type === 'file');
                return result.data.filter(seg => seg.name === 'app') [0];
            })
            .then(appSeg => {
                return $http.get(`${appSeg.git_url}?recursive=3&client_id=${id}&client_secret=${secret}`);
            })
            .then(result => result.data.tree)
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
            .then(promises => {
                $q.all(promises).then(contents => {
                    _currentRepo_.languages[language] = contents.map(article => article.data.content);
                    console.log(_currentRepo_.languages[language]);
                    // console.log(window.atob(contents[0].data.content))
                    // console.log(contents)
                })
            });

            console.log(_currentRepo_.languages[language]);
    }


    // Returns languages from for repo from repo information
    function getLanguages(repoName) {
        let defer_ = $q.defer();

        let [repo_] = repoData.filter(repo => repo.name === repoName);
        let mainLanguage_ = repo_.language;

        let _handleRes = result => {
            let languages_ = Object.keys(result.data);
            repo_.languages = {};
            languages_.map(language => repo_.languages[language] = []);
            defer_.resolve({input: repoName, data: {mainLanguage: mainLanguage_, languages: languages_}});
        };

        if(typeof repo_.languages === 'undefined') {

            $http.get(`${repo_.languages_url}?client_id=${id}&client_secret=${secret}`)
                .then(_handleRes, err => defer_.reject(err));;
        }
        else {
            defer_resolve({input: repoName, data: repo_.languages});
        }
        return defer_.promise;
    }

    function getLanguagesContentsUrls(repoName) {
        let defer_ = $q.defer();
        let _promises = [];

        let _repo = repoData.filter(repo => repo.name === repoName);
        let _language = _repo.language;

        let _getUrlsRecursively = seg => {

            let _handleRes = (result) => {
                defer_.resolve(result.data.tree.filter(datum => datum.type === 'blob'));
            };

            $http.get(`${seg.git_url}?recursive=3&client_id=${id}&client_secret=${secret}`)
                    .then(_handleRes, err => console.log(err));
        };

        let _handleRes = result => {

            result.data.forEach(seg => {
                if(seg.type === 'file') {
                    contentInfo_.push(seg);
                }
                else if(seg.name === 'app') {
                    _getUrlsRecursively(seg);
                }
            });
        };

        $http.get(`${HTTP.baseUrl}/repos/alieissa/${repoName}/contents/?client_id=${id}&client_secret=${secret}`)
            .then( _handleRes, err => console.log(err));

        return defer_.promise;
    }

    return {getAllRepos, getLanguages, getLanguageContent};
}

export {repoService};
