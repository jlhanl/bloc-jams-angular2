var myAppModule = angular.module('myApp', ['ui.router']);

myAppModule.config(function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
    
    $stateProvider
        .state('landing', {
            url: '/landing',
            controller: 'LandingController',
            templateUrl: '/templates/landing.html'
        })
        .state('collection', {
            url: '/collection',
            controller: 'CollectionController',
            templateUrl: '/templates/collection.html'
        })
        .state('album', {
            url: '/album',
            controller: 'AlbumController',
            templateUrl: '/templates/album.html'
        });
    
});
/****
myAppModule.controller('LandingController', [ $scope, function($scope) {
    $scope.tagline = "Turn the music up!";
}]);

myAppModule.controller('CollectionController', [ $scope, function($scope) {
    $scope.albums = {
        name: 'The Colors',
        artist: 'Pablo Picasso',
        label: 'Cubism',
        year: '1881',
        albumArtUrl: 'assets/images/album_covers/01.png',
        songs: [
        {name:'Blue', length: '161.71', audioUrl: 'assets/music/blue' },
        {name:'Green', length: '103.96', audioUrl: 'assets/music/green' },
        {name:'Red', length: '268.45', audioUrl: 'assets/music/red' },
        {name:'Pink', length: '153.14', audioUrl: 'assets/music/pink' },
        {name:'Magenta', length: '374.22', audioUrl: 'assets/music/magenta' }
        }
    $scope.copy = angular.copy($scope.albums.albumArtUrl);
}]);

myAppModule.controller('AlbumController', function() {});