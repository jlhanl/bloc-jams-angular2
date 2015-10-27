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
    $scope.currentlyPlayingSongNumber = SongPlayer.currentlyPlayingSongNumber;
    $scope.currentSongFromAlbum = SongPlayer.currentSongFromAlbum;
    $scope.playSong = function(song) {
        SongPlayer.play();
    };
     
}]);
    
myAppModule.service('SongPlayer', function() {
    return {
        currentAlbum: albumPicasso,
        currentSoundFile: null,
        currentlyPlayingSongNumber: null,
        currentSongFromAlbum: 0,
        currentVolume: 80,
        trackIndex: function(currentAlbum, song) {
            return currentAlbum.songs.indexOf(song);
        },
        setSong: function(songNumber) {
            if (this.currentSoundFile) {
                this.currentSoundFile.stop();
            }
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            setVolume(currentVolume);
        },
        play: function() {
            this.playing = true;
            currentSoundFile.play();
        },
        pause: function() {
            this.playing = false;
            currentSoundFile.pause();
        },
        previousTrack: function() {
            var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
            this.currentSongIndex -= 1;
            if (this.currentSongIndex === 0) {
                currentSongIndex == this.currentAlbum.songs.length - 1;
            }
            this.setSong(currentSongIndex += 1);
            currentSoundFile.play();
        },
        nextTrack: function() {
            this.currentSongIndex += 1;
            if (this.currentSongIndex == this.currentAlbum.songs.length + 1) {
                currentSongIndex === 0;
            }
            this.setSong(currentSongIndex);
            currentSoundFile.play();
        }
        
    };
});
