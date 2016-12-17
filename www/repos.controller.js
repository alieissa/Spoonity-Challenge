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

export {repoCtrl};
