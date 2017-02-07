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
	return template;
};

var setCurrentAlbum = function(album) {
	var albumTitle = document.getElementsByClassName('album-view-title')[0];
	var albumArtist = document.getElementsByClassName('album-view-artist')[0];
	var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
	var albumImage = document.getElementsByClassName('album-cover-art')[0];
	var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

	albumTitle.firstChild.nodeValue = album.title;
	albumArtist.firstChild.nodeValue = album.artist;
	albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
	albumImage.setAttribute('src', album.albumArtUrl);

	albumSongList.innerHTML = '';

	for(var i = 0; i < album.songs.length; i++){
		albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
	}
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];

var songRows = document.getElementsByClassName('album-view-song-item');

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';

var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

var currentlyPlayingSong = null; //store state of playing songs

window.onload = function() {
	setCurrentAlbum(albumPicasso);

	var findParentByClassName = function(element, targetClass) { //climb DOM until parent w/ specified class name found
		//amnd returns the parent element
		if(element.parentElement === null){
			console.log('No parent found');
		} else if(element) {
			var currentParent = element.parentElement;
			while(currentParent.className != targetClass && currentParent.className !== null) {
				currentParent = currentParent.parentElement;
			}
			return currentParent;
		} else {
			console.log('No parent found with that class name');
		}
	};

	var getSongItem = function(element){ //returns the song item that uses a switch statement
		//to return the element with the .song-item-number class
		//Also, need this function for mouseover event (songListContainer) and mouseleave event (songRows)
  		switch (element.className){
   			case 'song-item-number': //stored in the <td> class
      			return element;
      		case 'album-song-button': //play and pause <a> class // child as stored within td when displyed 
	        case 'ion-play': //child
	        case 'ion-pause': //child
           		return findParentByClassName(element, 'song-item-number');
	        case 'album-view-song-item': //parent (<tr> class)
	            return element.querySelector('.song-item-number');
	        case 'song-item-title': //sibiling
	        case 'song-item-duration': //sibling
	            return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
	        default:
	            return;
      	}
    };

    var clickHandler = function(targetElement){ //decided whether to play or pause buttons whether or not currentlyPlaying ===true
      	var songItem = getSongItem(targetElement);
      	if(currentlyPlayingSong === null) {
        	songItem.innerHTML = pauseButtonTemplate;
        	currentlyPlayingSong = songItem.getAttribute('data-song-number');
     	} else if(currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        	songItem.innerHTML = playButtonTemplate;
        	currentlyPlayingSong = null;
        } else if(currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        	var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
        	currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        	songItem.innerHTML = pauseButtonTemplate;
        	currentlyPlayingSong = songItem.getAttribute('data-song-number');
   		}
    };

	songListContainer.addEventListener('mouseover', function(event) {
		//only target individual song rows during event delegation
		//upadte with a conditional statement that only changes innerHTML when the element does not beling to the currently playing song. 
		if(event.target.parentElement.className === 'album-view-song-item') { //album-view-song-list is a table class
			// change content from number to play button
			var songItem = getSongItem(event.target);
			if(songItem.getAttribute('data-song-number') !== currentlyPlayingSong) { //can access data in attribute when mouse leaves table row
                songItem.innerHTML = playButtonTemplate;
          	}
		} 
	});

	for(var i = 0; i < songRows.length; i++) {
		songRows[i].addEventListener('mouseleave', function(event) { //song rows are each <tr> with class album-view-song-item
			var songItem = getSongItem(event.target);
			var songItemNumber = songItem.getAttribute('data-song-number');
			if(songItemNumber !== currentlyPlayingSong) {
				songItem.innerHTML = songItemNumber;
			}
		});

		songRows[i].addEventListener('click', function(event) {
			//event handler call -- whichever song item number?
			clickHandler(event.target);
		});
	}

	var albums = [albumPicasso, albumDerp, albumMarconi];

	var index = 1;

	var toggleCovers = document.getElementsByClassName('album-cover-art')[0];
	
	toggleCovers.addEventListener('click', function(){
		setCurrentAlbum(albums[index]);
		index++;
		if(index === albums.length){
			index = 0;
		}
	});
};