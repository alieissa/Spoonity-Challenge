'use strict';

repoService.$inject = ['$q', '$http'];

function repoService($q, $http) {

    function getAllRepos(username) {

        let defer_ = $q.defer();
        let _handleRes = (result) => {
            // parse and return here resolve
            // defer.resolve(parsedRes)
        };

        // $http.get(`/repos/${username}`).then(_handleRes, (err) => defer.reject(err));

        //return defer.promise;
    }

    return {getAllRepos};
}

export {repoService};
