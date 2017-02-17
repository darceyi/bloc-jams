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
//vars to hold jquery selectors for the next and prev buttons
var $previousButton = $('.main-controls .previous');
var $nextButton =  $('.main-controls .next');

var createSongRow = function(songNumber, songName, songLength) {
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
			var currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
			currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
			// console.log("currentlyPlayingSongNumber !== null");
		}
		if (currentlyPlayingSongNumber !== parseInt(songNumberAttr)) {
			// Switch from Play -> Pause button to indicate new song is playing.
			$(this).html(pauseButtonTemplate);
			currentlyPlayingSongNumber = parseInt(songNumberAttr);
			currentSongFromAlbum = currentAlbum.songs[parseInt(songNumberAttr) - 1];
			updatePlayerBarSong(); //when a new song is plaued to display pause in player-bar
			// should show the song name and artist name
			// $('.song-name').html("working");
			// $('.artist-name').html("working");
			// console.log("currentlyPlayingSongNumber !== songNumberAttr and PAUSES");
			//songNumber -1 because referencing the actual index
		} else if (currentlyPlayingSongNumber === parseInt(songNumberAttr)) {
			// Switch from Pause -> Play button to pause currently playing song.
			$(this).html(playButtonTemplate);
			$('.main-controls .play-pause').html(playerBarPlayButton);//revert html of element to playerbarPLAYbutton when song is paused
			currentlyPlayingSongNumber = null;
			currentSongFromAlbum = null;
			// console.log("currentlyPlayingSongNumber === songNumberAttr and shows PLAY button");
		}
	};

	var updatePlayerBarSong = function() {
		$('.currently-playing .song-name').html(currentSongFromAlbum.title);
		$('.currently-playing .artist-name').html(currentAlbum.artist);
		$('.currently-playing .artist-song-mobile').html(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
		$('.main-controls .play-pause').html(playerBarPauseButton);
	};

//Attempt to write the onHover and offHover functions. hover()
//Note that we no longer need to use the getSongItem() helper because we can use jQuery's find() method to 
//get the element with .song-item-number. Use this to refer to the row.

	var onHover = function() {
		var songItem = $(this).find('.song-item-number');
		if (songItem.attr('data-song-number') !== currentlyPlayingSongNumber) {
               songItem.html(playButtonTemplate);
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
        console.log("songNumberAttr type is " + typeof songNumberAttr + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
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

	currentSongIndex++; // Incrementing the song -- why here ???

	if (currentSongIndex >= currentAlbum.songs.length) {
		currentSongIndex = 0;
	}

	//Set new current song
	currentlyPlayingSongNumber = currentSongIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

	//Update player bar info -- why dont we just call the updatePlayerBar function?
	$('.currently-playing .song-name').html(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').html(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').html(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);


	var lastSongNumber = getLastSongNumber(currentSongIndex); // ???
	var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

	$nextSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);

};

var previousSong = function() {
	var getLastSongNumber = function(index) {
		return index == (currentAlbum.songs.length -1) ? 1 : index + 2;
	}

	var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);

	currentSongIndex--;

	if (currentSongIndex < 0) {
		currentSongIndex = currentAlbum.songs.length -1;
	}

	//Set a new current song
	currentlyPlayingSongNumber = currentSongIndex + 1;
	currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

	//Update player bar info -- why dont we just call the updatePlayerBar function?
	$('.currently-playing .song-name').html(currentSongFromAlbum.title);
	$('.currently-playing .artist-name').html(currentAlbum.artist);
	$('.currently-playing .artist-song-mobile').html(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
	$('.main-controls .play-pause').html(playerBarPauseButton);

	var lastSongNumber = getLastSongNumber(currentSongIndex); // ???
	var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
	var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

	$previousSongNumberCell.html(pauseButtonTemplate);
	$lastSongNumberCell.html(lastSongNumber);
};

$(document).ready(function() {
		setCurrentAlbum(albumPicasso);
		$previousButton.click(previousSong);
		$nextButton.click(nextSong);
});