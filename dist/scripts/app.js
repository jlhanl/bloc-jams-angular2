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
    $scope.currentSongIndex = SongPlayer.currentSongIndex;
    $scope.currentSoundFile = SongPlayer.currentSoundFile;
    $scope.isPlaying = SongPlayer.playing;
    
    $scope.isPaused = SongPlayer.isPaused;
    
    $scope.playSong = function() {
        if (SongPlayer.playing) {
            SongPlayer.pause();
        } else {
            SongPlayer.play();
        }
        $scope.isPlaying = SongPlayer.playing;
    };
    
    $scope.pauseSong = function() {
        SongPlayer.pause();
    };
    
    
    
    $scope.previousSong = function() {
        SongPlayer.previousTrack();
    };
    
    $scope.nextSong = function() {
        SongPlayer.nextTrack();
    };
    
    var hoveredSongIndex = null;
    
    $scope.onHover = function(songIndex) {
        hoveredSongIndex = songIndex;
    };
      
    $scope.offHover = function() {
        hoveredSongIndex = null;
    };
    
    $scope.getSongClass = function(songIndex) {
        if (songIndex === SongPlayer.currentSongIndex && SongPlayer.playing) {
            return 'playing';
        } else if (songIndex === hoveredSongIndex || songIndex === SongPlayer.currentSongIndex) {
            return 'hovered';
        }
        return 'default';
    };
    
    
    $scope.playPause = function(songIndex) {
        SongPlayer.isPlaying(songIndex);
        if (songIndex !== SongPlayer.currentSongIndex && SongPlayer.playing) {
            SongPlayer.setSong(songIndex);
        } 
        if (SongPlayer.playing) {
            SongPlayer.pause();
        } else {
            SongPlayer.play();
        }
        $scope.isPlaying = SongPlayer.playing;
        $scope.currentSongName = SongPlayer.currentSongName;
        $scope.currentArtistName = SongPlayer.currentArtistName;
    };
    /*
    $scope.playPause = function(songIndex) {
        SongPlayer.isPlaying(songIndex);
        if (songIndex !== SongPlayer.currentSongIndex) {
            SongPlayer.setSong(songIndex);
        }
        if (SongPlayer.playing) {
            SongPlayer.pause();
        } else {
            SongPlayer.play();
        }
    };*/
}]);
    
myAppModule.service('SongPlayer', function() {
    return {
        currentAlbum: albumPicasso,
        currentSongIndex: 0,
        currentSoundFile: null,
        currentSongFromAlbum: null,
        currentVolume: 80,
        playing: this.playing = true,
        testPlay: function() {
            this.currentSoundFile = new buzz.sound("http://localhost:3000/assets/music/blue", {
                formats: [ 'mp3' ],
                preload: true
            });
            this.currentSoundFile.play();
            this.setVolume(this.currentVolume);
        },    
        play: function() {
            this.setSong();
            this.playing = true;
            this.paused = false;
            this.currentSoundFile.play();
        },
        setSong: function() {
            if (this.currentSoundFile) {
                this.currentSoundFile.stop();
            }
            this.currentSoundFile = new
            buzz.sound(this.currentAlbum.songs[this.currentSongIndex].audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            /*
            buzz.sound(this.currentAlbum.songs[songIndex].audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            */
            this.setVolume(this.currentVolume);
        },
        setVolume: function(volume) {
            if (this.currentSoundFile) {
                this.currentSoundFile.setVolume(volume);
            }
        },
        pause: function() {
            this.playing = false;
            this.paused = true;
            this.currentSoundFile.pause();
        },
        isPlaying: function() {
            if (this.paused = false) {
                this.playing = true;
            } else {
                this.playing = false;
            }
        },
        isPaused: this.pause = true,
        previousTrack: function() {
            this.currentSongIndex -= 1;
            if (this.currentSongIndex === 0) {
                this.currentSongIndex = this.currentAlbum.songs.length;
            }
            this.setSong();
            this.play();
        },
        nextTrack: function() {
            this.currentSongIndex += 1;
            if (this.currentSongIndex === this.currentAlbum.songs.length) {
                this.currentSongIndex = 0;
            }
            this.setSong();
            this.play();
        }
        
    };
});
