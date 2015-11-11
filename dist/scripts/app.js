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
    $scope.currentSongTime = SongPlayer.currentSongTime;
    $scope.currentSongFromAlbum = $scope.currentAlbum.songs[$scope.currentSongIndex];
    $scope.isPaused = SongPlayer.isPaused;
    
    $scope.$watch('trackProgress', function() {
        if($scope.trackProgress === undefined) {
            return;
        }
        if (Math.abs(SongPlayer.getTime() / SongPlayer.getDuration() * 100 - $scope.trackProgress) > 1){
            SongPlayer.setTime($scope.trackProgress / 100 * SongPlayer.getDuration());
        }
    });
    
    $scope.updateSeekBarWhileSongPlays = function() {
        $scope.trackProgress = (SongPlayer.getTime() / SongPlayer.getDuration()) * 100;
        if(SongPlayer.getTime() === SongPlayer.getDuration()) {
            $scope.nextSong();
        }
    };
    
    $scope.listener = function() {
        SongPlayer.registerProgressListener(function() {  
            $scope.$digest();
            $scope.$apply(function(){
                $scope.updateTime = SongPlayer.getTime();
                $scope.updateDuration = SongPlayer.getDuration();
                $scope.updateSeekBarWhileSongPlays();
            })
        });
    };
    $scope.listener();
    
 
    $scope.duration = SongPlayer.getDuration();
    $scope.time = SongPlayer.getTime();
    $scope.updateSeekBarWhileSongPlays();
    
    $scope.playSong = function() {
        if (SongPlayer.playing) {
            SongPlayer.pause();
        } else {
            SongPlayer.play();
        }
        $scope.isPlaying = SongPlayer.playing;
        $scope.currentSongName = SongPlayer.currentSongName;
        $scope.currentArtistName = SongPlayer.currentArtist;
        $scope.listener();
    };
    
    $scope.pauseSong = function() {
        SongPlayer.pause();
    };
    
    $scope.previousSong = function() {
        SongPlayer.previousTrack();
        $scope.currentSongName = SongPlayer.currentSongName;
        $scope.currentArtistName = SongPlayer.currentArtist;
        $scope.isPlaying = SongPlayer.playing;
        $scope.listener();
    };
    
    $scope.nextSong = function() {
        SongPlayer.nextTrack();
        $scope.currentSongName = SongPlayer.currentSongName;
        $scope.currentArtistName = SongPlayer.currentArtist;
        $scope.isPlaying = SongPlayer.playing;
        $scope.listener();
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
            return 'notplaying';
        }
        return 'default';
    };
    
    
    $scope.playPause = function(songIndex) {
        if (songIndex !== SongPlayer.currentSongIndex && SongPlayer.playing) {
            SongPlayer.currentSongIndex = songIndex;
            SongPlayer.play();
        } 
        if (songIndex === SongPlayer.currentSongIndex && SongPlayer.playing) {
            SongPlayer.pause();
        } else {
            SongPlayer.currentSongIndex = songIndex;
            SongPlayer.play();
        }
        $scope.isPlaying = SongPlayer.playing;
        $scope.currentSongName = SongPlayer.currentSongName;
        $scope.currentArtistName = SongPlayer.currentArtist;
        
    };
    

}]);
    
myAppModule.service('SongPlayer', function() {
    return {
        currentAlbum: albumPicasso,
        currentSongIndex: 0,
        currentSoundFile: null,
        currentSongFromAlbum: null,
        currentVolume: 80,
        currentSongTime: 0,
        playing: false,
        currentSongName: null,
        currentArtist: null,
        setSong: function(newSongIndex) {
            if (this.currentSoundFile) {
                this.currentSoundFile.stop();
            }
            var newSongIndex = this.currentSongIndex;
            this.currentSoundFile = new
            buzz.sound(this.currentAlbum.songs[this.currentSongIndex].audioUrl, {
                formats: [ 'mp3' ],
                preload: true
            });
            this.setVolume(this.currentVolume);
            this.currentSongName = this.currentAlbum.songs[this.currentSongIndex].name;
            this.currentArtist = this.currentAlbum.artist;
        },
        play: function() {
            this.setSong();
            this.playing = true;
            this.paused = false;
            this.currentSoundFile.play();
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
            this.currentSongIndex = this.currentSongIndex - 1;
            if (this.currentSongIndex === -1) {
                this.currentSongIndex = this.currentAlbum.songs.length - 1;
            }
            this.play();
        },
        registerProgressListener: function(listener) {
            if (this.currentSoundFile === null) {
                return null;
            } 
                this.currentSoundFile.bind('timeupdate', listener);
        },
        nextTrack: function() {
            this.currentSongIndex = this.currentSongIndex + 1;
            if (this.currentSongIndex === this.currentAlbum.songs.length) {
                this.currentSongIndex = 0;
            }
            this.play();
        },
        setTime: function() {
            if (this.currentSoundFile) {
                this.currentSoundFile.setTime(seconds);
            }
        },
        
        getDuration: function() {
            if (this.currentSoundFile) {
            this.currentSoundFile.getDuration();
            }
        },
        
        getTime: function() {
            if (this.currentSoundFile) {
            this.currentSoundFile.getTime();
            }
        },
        
        
    };
});


/*myAppModule.directive('qmSellingPoints', function($document, $window) {
    return {
        restrict: 'EA',
        scope: {
        
        },
        templateUrl: 'templates/sellingpoints.html',
        link: function(scope, element, attributes) {
            var points = $('.point');
            var sellingPoints = $('.selling-points');
            var animatePoints = function(points) {

                angular.element(points).css({

                    opacity: 1,

                    transform: 'scaleX(1) translateY(0)'

                });

            };

            if ($window.height() > 950) {
                angular.forEach(points, function(point) {
                    animatePoints(point);

                });
            }
            
            var scrollDistance = angular.element(sellingPoints).offset().top - $window.height() + 200;
            $window.scroll(function (event) {
            if ($window.scrollTop() >= scrollDistance) {
                angular.forEach(points, function (point) {
                    animatePoints(point);

                });
            }

            });
        }
    }
});*/


myAppModule.directive('mySlider', function(SongPlayer, $document) {
    return {
        templateUrl: 'templates/myslider.html',
        replace: true,
        restrict: 'E',
        scope: {
            value: '='
        },
        
        link: function(scope, element, attributes) {

            scope.setFill = {width: (scope.value || 0) + "%"};
            scope.setThumb = {left: scope.setFill.width};
            
            scope.$watch('value', function() {
                scope.fill = {width: scope.value + "%"};
                scope.thumb = {left: scope.value + "%"};
            });
            
            scope.barLimits = function() {
                scope.value = Math.max(0, scope.value);
                scope.value = Math.min(100, scope.value);
            };
            

            

        }
    };
});
