// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
// Store state of songs and albums
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
//Will hold the currently playing song object from the songs array
var currentSongFromAlbum  = null;
//store the sound object in this variable when we set a new current song
var currentSoundFile = null;
var currentVolume = 40;
//vars to hold jquery selectors for the next and prev buttons
var $previousButton = $('.main-controls .previous');
var $nextButton =  $('.main-controls .next');

var setSong = function(songNumberAttr) {
	//If we click to play a different song before a the current song is finished, we need to stop the current song 
	//before we set a new one. Add a conditional statement to the beginning of setSong() that checks for a defined 
	//currentSoundFile and then runs currentSoundFile.stop() if true
	if (currentSoundFile) {
		currentSoundFile.stop();
	}

	currentlyPlayingSongNumber = parseInt(songNumberAttr);
	currentSongFromAlbum = currentAlbum.songs[songNumberAttr - 1];
	// At #1, we assign a new Buzz sound object. We've passed the audio file via the  audioUrl property on the currentSongFromAlbum object.
	currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl,{
		formats: ['mp3'],
		preload: true
	});

	setVolume(currentVolume);
	//show the correlation between the currentVolume and seekbarratio
	$('.volume .seek-bar .fill').width(currentVolume);
	$('.volume .seek-bar .thumb').css({left: currentVolume});
	// console.log("setSong");
};

//We need to create a method that can change the current song's playback location -- click a new location to seek to correspoding
//position in the song//
//seek() uses the Buzz setTime() method to change the position in a song to a specified time.
var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
	if (currentSoundFile) {
		currentSoundFile.setVolume(volume);
	}
	// console.log("setVolume");
};

var filterTimeCode = function(timeInSeconds) {
	var totalSeconds = parseFloat(timeInSeconds).toFixed();
	var minutes = Math.floor(totalSeconds / 60);
	var seconds = totalSeconds - minutes * 60;

	if (seconds < 10) {
		return minutes + ":" + '0' + seconds;
	} else {
		return minutes + ":" + seconds;
	}
};
// Write a function called setCurrentTimeInPlayerBar() that takes one argument, currentTime, 
// that sets the text of the element with the .current-time class to the current time in the song.
// Add the method to updateSeekBarWhileSongPlays() so the current time updates with song playback.
var setCurrentTimeInPlayerBar = function(currentTime) {
		$('.current-time').html(filterTimeCode(currentTime));
};

var setTotalTimeInPlayerBar = function(totalTime) {
	$('.total-time').html(filterTimeCode(totalTime));
};

var getSongNumberCell = function(number) {
	return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
	songLength = filterTimeCode(songLength);
	var template =
		'<tr class = "album-view-song-item">'
	+	'	<td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
	+	'	<td class="song-item-title">' + songName + '</td>'
	+	'	<td class="song-item-duration">' + songLength + '</td>'
	+	'</tr>'
	;

	var $row = $(template);

	var clickHandler = function() {

		var songNumberAttr = parseInt($(this).attr('data-song-number')); //"this" is referencing the table cell

		if (currentlyPlayingSongNumber !== null) {
			// Revert to song number for currently playing song because user started playing new song.
			var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
			currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
			// console.log("currentlyPlayingSongNumber !== null");
		}
		if (currentlyPlayingSongNumber !== songNumberAttr) { //when click song that is not the currentply playing song
			// Switch from Play -> Pause button to indicate new song is playing.
			$(this).html(pauseButtonTemplate);
			setSong(songNumberAttr);
			currentSoundFile.play();
			updateSeekBarWhileSongPlays();
			updatePlayerBarSong(); //when a new song is plaued to display pause in player-bar
	        // var $volumeFill = $('.volume .fill').width(currentVolume + '%');
	        // var $volumeThumb = $('.volume .thumb').css({left: currentVolume + '%'});
	        // console.log($volumeFill, "volumeFill");
	        // console.log($volumeThumb, "volumeThumb");

			// should show the song name and artist name
			// $('.song-name').html("working");
			// $('.artist-name').html("working");
			//songNumber -1 because referencing the actual index
		} else if (currentlyPlayingSongNumber === songNumberAttr) { //when clicks pause button for same song thats playing
			//we need to get rid of the logic that sets the  currentlyPlayingSongNumber and currentSongFromAlbum to null. 
			//We should replace it with a conditional statement that checks if the currentSoundFile is paused:
			if (currentSoundFile.isPaused()) {
				//revert the icon in the song row and playerbar to pause button
				$(this).html(pauseButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPauseButton);//revert html of element to playerbarPLAYbutton when song is paused
				//start plaging the song again
				currentSoundFile.play();
				updateSeekBarWhileSongPlays();
			} else {
				//and set the content of the song number cell and player bars pause button back to play button
				$(this).html(playButtonTemplate);
				$('.main-controls .play-pause').html(playerBarPlayButton);//revert html of element to playerbarPLAYbutton when song is paused
				//we need to pause it
				currentSoundFile.pause();
			}
		}
	};

//Attempt to write the onHover and offHover functions. hover()
//Note that we no longer need to use the getSongItem() helper because we can use jQuery's find() method to 
//get the element with .song-item-number. Use this to refer to the row.
	var onHover = function() {
		var songNumberCell = $(this).find('.song-item-number');
		var songNumberAttr = parseInt(songNumberCell.attr('data-song-number'));
		if (songNumberAttr !== currentlyPlayingSongNumber) {
               songNumberCell.html(playButtonTemplate);
               // console.log("data-song-number !== currentlyPlayingSongNumber and PLAY BUTTON");
               // you dont want hover to change the currentSongFromAlbum. only clickHandler
     	}
	};

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumberAttr = parseInt(songNumberCell.attr('data-song-number'));
        if (songNumberAttr !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumberAttr);
        }
    };
	//find the element with the .song-item-number class that's contained in whichever row is clicked
	$row.find('.song-item-number').click(clickHandler);
	//The hover() event listener at #2 combines the mouseover and mouseleave functions. 
	//The first argument is a callback that executes when the user mouses over the $row element 
	//and the second is a callback executed when the mouse leaves $row.
	$row.hover(onHover, offHover);

	return $row;
};

var setCurrentAlbum = function(album) {
	//exposes album to global scope
	currentAlbum = album;
 	// Select elements that we want to populate with text dynamically
	var $albumTitle = $('.album-view-title');
	var $albumArtist = $('.album-view-artist');
	var $albumReleaseInfo = $('.album-view-release-info');
	var $albumImage = $('.album-cover-art');
	var $albumSongList = $('.album-view-song-list');
//We call jQuery's text() method to replace the content of the text nodes, instead of setting 
//firstChild.nodeValue. We also change the setAttribute() method to jQuery's  attr() method, 
//which changes the element attribute using the same arguments.
	// Assign values to each part of the album (text, images)
	$albumTitle.text(album.title);
	$albumArtist.text(album.artist);
	$albumReleaseInfo.text(album.year + ' ' + album.label);
	$albumImage.attr('src', album.albumArtUrl);

	// Clear contents of album song container
	$albumSongList.empty();

	// Build list of songs from album Javascript objects
	for (var i = 0; i < album.songs.length; i++){
		var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
		$albumSongList.append($newRow);
	}
};

//The interface for the seek bars works, but it doesn't affect the song position or volume.
var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        // #10
        currentSoundFile.bind('timeupdate', function(event) {
            // #11
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            updateSeekPercentage($seekBar, seekBarFillRatio);
			setCurrentTimeInPlayerBar(currentSoundFile.getTime());   
			setTotalTimeInPlayerBar(currentSongFromAlbum.duration);
        });
    }
};

//The function must take two arguments, one for the seek bar to alter (either the volume or audio playback controls) 
//and one for the ratio that will determine the  width and left values of the .fill and .thumb classes, respectively.
//The ratio must be converted to a percentage so we can set the CSS property values as percents.
//The percentage must be passed into jQuery functions that set the width and  left CSS properties.
//my note this function included in setupSeekBars as it has to respond to click events
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
	//We start by multiplying the ratio by 100 to determine a percentage. 
	var offsetXPercent = seekBarFillRatio * 100;
	//we use the built-in JavaScript Math.max() function to make sure our percentage isn't less than zero and 
	//the Math.min() function to make sure it doesn't exceed 100.
	offsetXPercent = Math.max(0, offsetXPercent);
	offsetXPercent = Math.min(100, offsetXPercent);
	//er convert our percenage to a string and add the % character
	var percentageString = offsetXPercent + '%';
	//wehn we se the width and fill class and the left value of the thumb class, the css interprets
	//the value as a percent instead of a unitless number between 0 and 100
	$seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
    // console.log("updateSeek%%%");
};

//updateSeekPercentage() is useless until we have a method for determining the  seekBarFillRatio. 
//Create a function called setupSeekBars()
var setupSeekBars = function() {
	//At #6, we are using jQuery to find all elements in the DOM with a class of "seek-bar" that are contained within 
	//the element with a class of "player-bar". This will return a jQuery wrapped array containing both 
	//the song seek control and the volume control.
	var $seekBars = $('.player-bar .seek-bar');
	//The seek bar that updates will be determined by the target of the event.
	$seekBars.click(function(event) {
		//we see a new property on the event object called pageX. This is a jQuery-specific event value, which holds 
		//the X (or horizontal) coordinate at which the event occurred (think of the X-Y coordinate plane)
		//We subtract the offset() of the seek bar held in $(this) from the left side. 
		var offsetXPercent = event.pageX - $(this).offset().left;
		var barWidth = $(this).width();
		var seekBarFillRatio = offsetXPercent / barWidth;
		//Checks the class of the seek bar's parent to determine whether the current seek bar is changing the volume 
		//or seeking to a song position
		//If it's the playback seek bar, seek to the position of the song determined by the seekBarFillRatio

		// if (this.parentElement.className === 'seek-control') { 
		if ($(this).parent().attr('class') === 'seek-control') {
			seek(seekBarFillRatio * currentSoundFile.getDuration());
			// console.log("seek conditional for playback seekbar");
		} else {
			setVolume(seekBarFillRatio * 100);
			// console.log("setVolume conditional");
		}

		updateSeekPercentage($(this), seekBarFillRatio);
		// console.log("seekBars.click() to update");
		// console.log(seekBarFillRatio, "seekbarfillratio");
	});
	//At #7, we find elements with a class of .thumb inside our $seekBars and add an event listener for the mousedown event. 
	//A click event fires when a mouse is pressed and released quickly, but the mousedown event will fire as soon as the mouse 
	//button is pressed down. 
	//jQuery allows us access to a shorthand method of attaching the mousedown event by calling mousedown on a jQuery collection.
	$seekBars.find('.thumb').mousedown(function(event) {
		//At #8, we are taking the context of the event and wrapping it in jQuery. 
		//In this scenario, "this" will be equal to the .thumb node that was clicked. Because we are attaching an event to both 
		//the song seek and volume control, this is an important way for us to determine which of these nodes dispatched the 
		//event. We can then use the  parent method, which will select the immediate parent of the node. This will be whichever 
		//seek bar this .thumb belongs to.
		var $seekBar = $(this).parent();
		//new way to track events, jQuery's bind() event. bind() behaves similarly to addEventListener() in that it takes a 
		//string of an event instead of wrapping the event in a method like we've seen with all other jQuery events thus far. 
		//We use  bind() because it allows us to namespace event listeners  
		//The event handler inside the bind() call is identical to the click behavior. The event handler on $(document) is the 
		//reason we need to use bind() with namespacing. 
		//We've attached the mousemove event to $(document) to make sure that we can drag the thumb after mousing down, 
		//even when the mouse leaves the seek bar. This allows for a smoother experience for seeking to a song position. 
		
		$(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;
            updateSeekPercentage($seekBar, seekBarFillRatio);
            
            // console.log($seekBar, "$seekBar within mousemove.thumb");
        });
        //we bind the mouseup event with a .thumb namespace. The event handler uses the unbind() event method, which removes 
        //the previous event listeners that we just added. If we fail to unbind() them, the thumb and fill would continue to 
        //move even after the user released the mouse. Comment out this block to demonstrate the unintended behavior.
		$(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
            // console.log("mouseup.thumb");
        });
        // console.log($seekBar, "seekBar within mousedown");
	});
};

var updatePlayerBarSong = function() {
	$('.currently-playing .song-name').html(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').html(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').html(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);
};
//Match the currently playing song's object with its corresponding index in the songs array
//RETURN INDEX OF A SONG found in album's song array
var trackIndex = function(album, song) {
	return album.songs.indexOf(song);
};

//when we call NEXT and PREVIOUS functions in ourapp, they should increment or decrement the index of the
//current song in the array
// is this supposed to be called in the clickHandler function too???
var nextSong = function() {
	// ???
	var getLastSongNumber = function(index) {
		return index == 0 ? currentAlbum.songs.length : index;
	}; 

	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

	currentSongIndex++; 

	if (currentSongIndex >= currentAlbum.songs.length) {
		currentSongIndex = 0;
	}

	//Set new current song
	setSong(currentSongIndex + 1);
	// currentlyPlayingSongNumber = currentSongIndex + 1;
	// currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

	//Play songs when skipping
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();
	//Update player bar info -- why dont we just call the updatePlayerBar function?
	updatePlayerBarSong();

	var lastSongNumber = getLastSongNumber(currentSongIndex);
	var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
	var getLastSongNumber = function(index) {
		return index == (currentAlbum.songs.length -1) ? 1 : index + 2;
	};

	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

	currentSongIndex--;

	if (currentSongIndex < 0) {
		currentSongIndex = currentAlbum.songs.length -1;
	}

	//Set a new current song
	setSong(currentSongIndex + 1);
	// currentlyPlayingSongNumber = currentSongIndex + 1;
	// currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

	//play songs when skipping
	currentSoundFile.play();
	updateSeekBarWhileSongPlays();

	//Update player bar info -- why dont we just call the updatePlayerBar function?
	updatePlayerBarSong();
	
	var lastSongNumber = getLastSongNumber(currentSongIndex); // ???
	var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

	$previousSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};
//CP20 ASSIGNMENT
//	create a var to hold $('.main-controls .play-pause')
var $playerBarControl = $('.main-controls .play-pause');

var togglePlayFromPlayerBar = function() {

	var currentlyPlayingSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
	//If a song is paused and the play button is clicked in the player bar
	if (currentSoundFile.isPaused()) {
		//change the song number cell from a play button to a pause button
		currentlyPlayingSongNumberCell.html(pauseButtonTemplate);
		//change the html of player bar's play button to pause
		$playerBarControl.html(playerBarPauseButton);
		//play the song
		currentSoundFile.play();
	} else { //If the song is playing (so a current sound file exist), and the pause button is clicked
		//change the song number number cell from a pause to a play button
		currentlyPlayingSongNumberCell.html(playButtonTemplate);
		//change html if player bars pause button to play
		$playerBarControl.html(playerBarPlayButton);
		currentSoundFile.pause();
	}
};
	
$(document).ready(function() {
		setCurrentAlbum(albumPicasso);
		$previousButton.click(previousSong);
		$nextButton.click(nextSong);
		//add a click() event to it in the $(document).ready() block with togglePlayFromPlayerBar() as an event handler.
		$playerBarControl.click(togglePlayFromPlayerBar);
		setupSeekBars();
});