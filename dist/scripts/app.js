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
    $scope.isPlaying = SongPlayer.isPlaying;
    $scope.playSong = SongPlayer.play;
    $scope.pauseSong = SongPlayer.pause;
     
}]);
    
myAppModule.service('SongPlayer', function() {
    return {
        currentAlbum: albumPicasso,
        currentSongIndex: 0,
        currentSoundFile: null,
        currentSongFromAlbum: null,
        currentVolume: 80,
        trackIndex: function(currentAlbum, song) {
            return this.currentAlbum.songs.indexOf(song);
        },
        setSong: function(songIndex) {
            if (currentSoundFile) {
                currentSoundFile.stop();
            }
            this.currentSongIndex = songIndex;
            this.currentSoundFile = new buzz.sound(currentAlbum.songs[songIndex].audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            this.setVolume(currentVolume);
        },
        isPlaying: function(songIndex) {
            if (this.playing = true) {
                return true;
            } else 
                return false;
        },
        play: function() {
            this.setSong;
            this.playing = true;
            this.paused = false;
            this.currentSoundFile.playing();
        },
        pause: function() {
            this.currentSoundFile.pause();
            this.playing = false;
            this.paused = true;
        },
        previousTrack: function() {
            this.currentSongIndex -= 1;
            if (this.currentSongIndex === 0) {
                this.currentSongIndex = this.currentAlbum.songs.length - 1;
            }
            this.setSong(this.currentSongIndex);
            this.currentSoundFile.play();
        },
        nextTrack: function() {
            this.currentSongIndex += 1;
            if (this.currentSongIndex === this.currentAlbum.songs.length) {
                this.currentSongIndex === 0;
            }
            this.setSong(currentSongIndex);
            this.currentSoundFile.play();
        }
        
    };
});
