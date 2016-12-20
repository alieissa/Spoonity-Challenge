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

        // Filter for language blobs that are for desired languages
        let _filterLanguageBlobs =  langs => {
            return langs.filter(lang => {
                let ext = lang.path.split('.').pop();

                return ABBRS[language] === ext;
            });
        };

        // Gets the contents of all language blobs from github
        let _getLanguageBlobContent = langBlobs => {
            return langBlobs.map(langBlob => {
                let _sep = langBlob.url.indexOf('?') === -1 ? '?' : '&';
                return $http.get(`${langBlob.url}${_sep}client_id=${id}&client_secret=${secret}`);
            });
        };

        return detectLanguages(username, repoName)
            .then(_filterLanguageBlobs)
            .then(_getLanguageBlobContent)
            .then(promises => $q.all(promises)) // Resolves _getLanguageBlobContent array of promises
            .then(contents => {
                _currentRepo_.languages[language] = contents.map(article => article.data.content);
                return _currentRepo_.languages[language];
            });
    }

    // Returns languages from for repo from repo information
    function getLanguages(username, repoName) {
        let [_repo_] = repoData.filter(repo => repo.name === repoName);

        //Filters for extensions of repo languages
        let _getLangExtensions = languages => {
            return languages.map(language => {
                let ext = language.path.split('.').pop();

                if(Object.values(ABBRS).includes(ext)) {
                    return ext;
                }
            });
        };

        // Get the lanugage of each extension
        let _mapExtensionsToLang = extensions => {
            return Array.from(extensions).map(ext => {
                let language_ = Object.keys(ABBRS).filter(key => ABBRS[key] === ext)[0];
                return language_;
            });
        };

        return detectLanguages(username, repoName)
            .then(_getLangExtensions)
            .then(extensions => new Set(extensions)) // Get unique values
            .then(_mapExtensionsToLang)
            .then(languages => _repo_.languages = languages);

    }

    // Detects the languages of user specified folders, i.e. settings.folders
    function detectLanguages(username='alieissa', repoName) {
        [_currentRepo_] = repoData.filter(repo => repo.name === repoName);

        let _findLang = blob => {
            let _lang = blob.path.split('.').pop();
            return Object.values(ABBRS).includes(_lang);
        };

        // Takes a dir and returns an array of promises of all of its files
        let _getDirFiles = dirs => {
            let _promises =  dirs.map(dir => {
                return $http.get(`${dir.git_url}?recursive=3&client_id=${id}&client_secret=${secret}`)
                    .then(result => result.data.tree);
            });

            return $q.all(_promises);

        };

        // Gets the contents of entire repo
        let _getAllFiles = result => {
            let appFiles = result.data.filter(seg => seg.type === 'file');

            // Uncomment to filter folder by exclusion
            // let _appSeg = result.data.filter(seg => {
            //     return Settings.folders.indexOf(seg.name) === -1 && seg.type === 'dir';
            // });

            let _appSeg = result.data.filter(seg => Settings.folders.includes(seg.name));

            if(_appSeg.length > 0) {
                return _getDirFiles(_appSeg).then(dirFiles => mergeFiles(dirFiles, appFiles));
            }
            else {
                return appFiles;
            }
        };

        return $http.get(`${HTTP.baseUrl}/repos/${username}/${repoName}/contents/?client_id=${id}&client_secret=${secret}`)
            .then(_getAllFiles)
            .then(blobs => {
                return blobs.filter(blob => blob.path.indexOf('.') !== -1)
                    .filter(_findLang);
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
