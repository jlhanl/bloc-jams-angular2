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

myAppModule.controller('LandingController', ['$scope', function($scope) {
    $scope.someText = "Turn the music up!";
}]);

myAppModule.controller('CollectionController', ['$scope', function($scope) {
    $scope.albums = [albumPicasso, albumMarconi];
    
    $scope.copyPicasso = function() {
        angular.copy(albumPicasso);
    };
}]);
    
myAppModule.controller('AlbumController', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.currentAlbum;
    $scope.pauseSong = function(song) {
        SongPlayer.pause();
    };
    
}]);
    
/**myAppModule.service('SongPlayer', function SongPlayer() {
    return {
        currentSoundFile: null,
        currentAlbum: albumPicasso,
        currentlyPlayingSongNumber: null,
        currentSongFromAlbum: null,
        currentVolume: 80,
        
        play: function() {
            this.playing = true;
            currentSoundFile.play();
        },
        pause: function() {
            this.playing = false;
            currentSoundFile.pause();
        },
        previousTrack: function() {
            currentSongFromAlbum -= 1;
        },
        nextTrack: function() {
            currentSongFromAlbum += 1;
 //       


