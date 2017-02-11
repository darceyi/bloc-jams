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

// Elements we'll be adding listeners to
var $songListContainer = $('.album-view-song-list');
var $songRows = $('.album-view-song-item');

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// Store state of playing songs
var currentlyPlayingSong = null;

$(document).ready(function() {
	setCurrentAlbum(albumPicasso);

	var findParentByClassName = function(element, targetClass) {
		if (element.parentElement === null){
			console.log('No parent found');
		} else if (element) {
			var currentParent = element.parentElement;
			while (currentParent.className != targetClass && currentParent.className !== null) {
				currentParent = currentParent.parentElement;
			}
			return currentParent;
		} else {
			console.log('No parent found with that class name');
		}
	};

    var clickHandler = function(targetElement){
      	var songItem = getSongItem(targetElement);
      	if (currentlyPlayingSong === null) {
        	songItem.innerHTML = pauseButtonTemplate;
        	currentlyPlayingSong = songItem.getAttribute('data-song-number');
     	} else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        	songItem.innerHTML = playButtonTemplate;
        	currentlyPlayingSong = null;
        } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        	var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        	currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        	songItem.innerHTML = pauseButtonTemplate;
        	currentlyPlayingSong = songItem.getAttribute('data-song-number');
   		}
    };

//Attempt to write the onHover and offHover functions. hover()
//Note that we no longer need to use the getSongItem() helper because we can use jQuery's find() method to 
//get the element with .song-item-number. Use this to refer to the row.
	var onHover = function() {
		$songListContainer.addEventListener('mouseover', function(event) {
		if (event.target.parentElement.className === 'album-view-song-item') {
			var songItem = getSongItem(event.target);
			if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
                songItem.innerHTML = playButtonTemplate;
          	}
		} 
	};

	var offHover = function() {

		for (var i = 0; i < songRows.length; i++) {
			songRows[i].addEventListener('mouseleave', function(event) {
				var songItem = getSongItem(event.target);
				var songItemNumber = songItem.getAttribute('data-song-number');
				if (songItemNumber !== currentlyPlayingSong) {
					songItem.innerHTML = songItemNumber;
				}
			});

			songRows[i].addEventListener('click', function(event) {
				clickHandler(event.target);
			});
		}
	};

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