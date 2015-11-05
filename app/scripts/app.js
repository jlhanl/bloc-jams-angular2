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
        trackTime: function() {
            if (this.currentSoundFile) {
                this.currentSongTime = this.currentSoundFile.getTime();
            }
        },
        
        
    };
});

myAppModule.directive('mySlider', ['SongPlayer', '$document', function(SongPlayer, $document) {
    return {
        templateUrl: 'templates/myslider.html',
        replace: true,
        restrict: 'E',
        scope: { },
        link: function(scope, element, attributes) {
            
            var offsetX = event.pageX - $(this).offset().left;
            var barWidth = $(this).width();
            var seekBarFillRatio = offsetX / barWidth;
            var updateSeekBarWhileSongPlays = function() {
                if (currentSoundFile) {
                    currentSoundFile.bind('timeupdate', function(event) {
                        var currentTime = this.getTime();
                        var songLength = this.getDuration();
                        var seekBarFillRatio = currentTime / songLength;
                        var $seekBar = $('.seek-control .seek-bar');
                        updateSeekPercentage($seekBar, seekBarFillRatio);
                        setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
                    });
                }
            };
            var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
                var offsetXPercent = seekBarFillRatio * 100;
                offsetXPercent = Math.max(0, offsetXPercent);
                offsetXPercent = Math.min(100, offsetXPercent);

                var percentageString = offsetXPercent + '%';
                $seekBar.find('.fill').width(percentageString);
                $seekBar.find('.thumb').css({left: percentageString});
            };
            //scope.fill = function() {
              //  return { width: performAction() };
            //};
            //var $someElement = $(element);
            
        //}
    //};
}]);




/*var setCurrentTimeInPlayerBar = function(currentTime) {
  var $currentTimeElement = $('.seek-control .current-time');
  $currentTimeElement.text(currentTime);
};


var setTotalTimeInPlayerBar = function(totalTime) {
  var $totalTimeElement = $('.seek-control .total-time');
  $totalTimeElement.text(totalTime);
};


var filterTimeCode = function(timeInSeconds) {
  var seconds = Number.parseFloat(timeInSeconds);
  var wholeSeconds = Math.floor(seconds);
  var minutes = Math.floor(wholeSeconds / 60);

  var remainingSeconds = wholeSeconds % 60;
  var output = minutes + ':';

  if (remainingSeconds < 10) {
    output += '0';
  }

  output += remainingSeconds;
  return output;
};


var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {
    currentSoundFile.bind('timeupdate', function(event) {
      var currentTime = this.getTime();
      var songLength = this.getDuration();
      var seekBarFillRatio = currentTime / songLength;
      --var $seekBar = $('.seek-control .seek-bar');
      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
    });
  }
};


var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};


var setupSeekBars = function() {
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    var seekBarFillRatio = offsetX / barWidth;
    

    if ($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    } else {
      setVolume(seekBarFillRatio * 100);
    }

    updateSeekPercentage($(this), seekBarFillRatio);
  });

  $seekBars.find('.thumb').mousedown(function(event) {
    var $seekBar = $(this).parent();

    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      if($seekBar. parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        setVolume(seekBarFillRatio);
      }

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });

    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};


var updatePlayerBarSong = function() {

  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.length));
};
*/
