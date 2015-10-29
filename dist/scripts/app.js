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
        angular.copy($scope.albums[0]);
    };
    
    $scope.copyPicasso;

}]);
    
myAppModule.controller('AlbumController', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
    $scope.currentAlbum = SongPlayer.currentAlbum;
    $scope.currentSoundFile = SongPlayer.currentSoundFile;
    $scope.currentSongIndex = SongPlayer.currentSongIndex;
    $scope.playSong = function() {
        SongPlayer.playSong();
    };
     
}]);
    
myAppModule.service('SongPlayer', function() {
    return {
        currentAlbum: albumPicasso,
        currentSoundFile: null,
        currentSongIndex: albumPicasso.songs[0],
        currentVolume: 80,
        setSong: function() {
            this.currentSoundFile = new buzz.sound(this.currentSongIndex.audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            this.setVolume(this.currentVolume);
        },
        playSong: function() {
            this.setSong();
            this.currentSoundFile.play();
            this.playing = true;
            this.paused = false;
        }
    };
});
