var albumPicasso = {
	title: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
		{ title: 'Blue', duration: '4:26' },
		{ title: 'Green', duration: '3:14' },
		{ title: 'Red', duration: '5:01' },
		{ title: 'Pink', duration: '3:21' },
		{ title: 'Magenta', duration: '2:15' },
	]
};

var albumMarconi = {
	title: 'The Telephone',
	artist: 'Guglielmo Marconi',
	label: 'EM',
	year: '1909',
	albumArtUrl: 'assets/images/album_covers/20.png',
	songs: [
		{ title: 'Hello, Operator?', duration: '1:01' },
		{ title: 'Ring, ring, ring', duration: '5:01' },
		{ title: 'Fits in your pocket', duration: '3:21' },
		{ title: 'Can you hear me now?', duration: '3:14' },
		{ title: 'Wrong phone number', duration: '2:15' },
	]
};

var albumDerp = {
	title: 'Derpee Derp Derp',
	artist: 'The Derps',
	label: 'Derp Records',
	year: '2017',
	albumArtUrl: 'assets/images/album_covers/15.png',
	songs: [
		{ title: 'Derp Rhymes with Burp', duration: '0:40' },
		{ title: 'Derp Twerp', duration: '0:59' },
		{ title: 'Fantastic Derp', duration: '0:31' },
		{ title: 'Derp Is a Carrot', duration: '0:34' },
		{ title: 'Wrong Derp', duration: '0:55' },
	]
};

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

		var songItemNumber = $(this).attr('data-song-number');

		if (currentlyPlayingSong !== null) {
			// Revert to song number for currently playing song because user started playing new song.
			var currentlyPlayingSongElement = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
			currentlyPlayingSongElement.html(currentlyPlayingSong);
		}
		if (currentlyPlayingSong !== songItemNumber) {
			// Switch from Play -> Pause button to indicate new song is playing.
			$(this).html(pauseButtonTemplate);
			currentlyPlayingSong = songItemNumber;
		} else if (currentlyPlayingSong === songItemNumber) {
			// Switch from Pause -> Play button to pause currently playing song.
			$(this).html(playButtonTemplate);
			currentlyPlayingSong = null;
		}
	};


//Attempt to write the onHover and offHover functions. hover()
//Note that we no longer need to use the getSongItem() helper because we can use jQuery's find() method to 
//get the element with .song-item-number. Use this to refer to the row.


// var offHover = function() {

// 		var songItem = $(this).find('.song-item-number');
// 		var songItemNumber = songItem.attr('data-song-number');
// 		if (songItemNumber !== currentlyPlayingSong) {
// 				songItem.html(songItemNumber);
// 		}
// };
// };
	var onHover = function() {
		
		var songItem = $(this).find('.song-item-number');
		if (songItem.attr('data-song-number') !== currentlyPlayingSong) {
               songItem.html(playButtonTemplate);
     	}
	};

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = songNumberCell.attr('data-song-number');

        if (songNumber !== currentlyPlayingSong) {
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

// Store state of playing songs
var currentlyPlayingSong = null;

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