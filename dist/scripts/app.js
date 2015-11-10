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
    SongPlayer.trackTime();
    $scope.currentSongTime = SongPlayer.currentSongTime;
    $scope.currentSongFromAlbum = $scope.currentAlbum.songs[$scope.currentSongIndex];
    
    
    $scope.isPaused = SongPlayer.isPaused;
    
    $scope.playSong = function() {
        if (SongPlayer.playing) {
            SongPlayer.pause();
        } else {
            SongPlayer.play();
        }
        $scope.isPlaying = SongPlayer.playing;
        $scope.currentSongName = SongPlayer.currentSongName;
        $scope.currentArtistName = SongPlayer.currentArtist;
    };
    
    $scope.pauseSong = function() {
        SongPlayer.pause();
    };
    
    $scope.previousSong = function() {
        SongPlayer.previousTrack();
        $scope.currentSongName = SongPlayer.currentSongName;
        $scope.currentArtistName = SongPlayer.currentArtist;
        $scope.isPlaying = SongPlayer.playing;
    };
    
    $scope.nextSong = function() {
        SongPlayer.nextTrack();
        $scope.currentSongName = SongPlayer.currentSongName;
        $scope.currentArtistName = SongPlayer.currentArtist;
        $scope.isPlaying = SongPlayer.playing;
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
        nextTrack: function() {
            this.currentSongIndex = this.currentSongIndex + 1;
            if (this.currentSongIndex === this.currentAlbum.songs.length) {
                this.currentSongIndex = 0;
            }
            this.play();
        },
        setTime: function() {
            if (this.currentSoundFile) {
                this.currentSoundFile.setTime(time);
            }
        },
        registerListener: function(fn) {
            if (this.currentSoundFile) {
                this.currentSoundFile.bind('timeupdate', listener);
            }
        },
        getDuration: function() {
            this.currentSoundFile.getDuration();
        },
        
        trackTime: function() {
            if (this.currentSoundFile) {
                this.currentSongTime = this.currentSoundFile.getTime();
            }
        },
        
        
    };
});


myAppModule.directive('qmSellingPoints', function($document, $window) {
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
});


myAppModule.directive('mySlider', function(SongPlayer, $document) {
    return {
        templateUrl: 'templates/myslider.html',
        replace: true,
        restrict: 'E',
        scope: {
            value: '='
        },
        
        link: function(scope, element, attributes) {    
            scope.fill = {width: scope.value + "%"};
            scope.thumb = {left: scope.value + "%"};
            
            var barLimits = function() {
                scope.value = Math.max(0, scope.value);
                scope.value = Math.min(100, scope.value);
            };
            var barMove = function(event) {
                var offsetX = event.pageX - (element[0].getBoundingClientRect.left);
                var barWidth = element[0].offsetWidth;
                var seekBarFillRatio = offsetX / barWidth;
                scope.value = seekBarFillRatio * 100;
                barLimits();
            };
            element.on('mousedown', function(event) {
                barMove(event);
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });
            function mousemove(event) {
                barMove(event);
                scope.$apply();
                barLimits();
                
            };
            function mouseup() {
                $document.unbind('mousemove', mousemove);
                barLimits();
            };
            scope.$watch('value', function() {
                scope.fill = {width: scope.value + "%"};
                scope.thumb = {left: scope.value + "%"};
            });
        }
    };
});
              