'use strict';

repoService.$inject = ['$q', '$http', 'HTTP'];

function repoService($q, $http, HTTP) {

    let repoData;
    let languages_;
    let content_;

    // Returns languages from for repo from repo information
    function getLanguages(repoName) {

        let defer_ = $q.defer();

        let [repo_] = repoData.filter(repo => repo.name === repoName)
        console.log(repo_);

        let _handleRes = result => {
            let languages_ = Object.keys(result.data);
            repo_.languages = languages_;
            defer_.resolve(languages_)
        };

        if(typeof repo_.languages === 'undefined') {
            $http.get(repo_.languages_url).then(_handleRes, err => {
                console.log(err);
                defer_.reject(err)
            });
        }
        else {
            defer_resolve(repo_.languages);
        }

        return defer_.promise;
    }

    // Gets Repo information for user
    function getAllRepos(username) {
        let defer_ = $q.defer();

        let _handleRes = (result) => {

            // Save app
            repoData = result.data
            let repos_ = repoData.map(repo => repo.name);
            defer_.resolve(repos_)
        };

        $http.get(`${HTTP.baseUrl}/users/${username}/repos`).then(_handleRes, (err) => {
            defer_.reject(err);
        });

        return defer_.promise;
    }

    return {getAllRepos, getLanguages};
}

export {repoService};
