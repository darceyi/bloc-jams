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

		var songNumber = $(this).attr('data-song-number');

		if (currentlyPlayingSongNumber !== null) {
			// Revert to song number for currently playing song because user started playing new song.
			var currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
			currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
		}
		if (currentlyPlayingSongNumber !== songNumber) {
			// Switch from Play -> Pause button to indicate new song is playing.
			$(this).html(pauseButtonTemplate);
			currentlyPlayingSongNumber = songNumber;
		} else if (currentlyPlayingSongNumber === songNumber) {
			// Switch from Pause -> Play button to pause currently playing song.
			$(this).html(playButtonTemplate);
			currentlyPlayingSongNumber = null;
		}
	};


//Attempt to write the onHover and offHover functions. hover()
//Note that we no longer need to use the getSongItem() helper because we can use jQuery's find() method to 
//get the element with .song-item-number. Use this to refer to the row.


	var onHover = function() {
		
		var songItem = $(this).find('.song-item-number');
		if (songItem.attr('data-song-number') !== currentlyPlayingSongNumber) {
               songItem.html(playButtonTemplate);
     	}
	};

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
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

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of songs and albums
var currentlyPlayingSongNumber = null;
var currentAlbum = null;
//Will hold the currently playing song object from the songs array
var currentSongFromAlbum  = null;


$(document).ready(function() {
	
	setCurrentAlbum(albumPicasso);

	var albums = [albumPicasso, albumDerp, albumMarconi];

	var index = 1;

	var toggleCovers = document.getElementsByClassName('album-cover-art')[0];
	
	toggleCovers.addEventListener('click', function(){
		setCurrentAlbum(albums[index]);
		index++;
		if (index === albums.length){
			index = 0;
		}
	});
});