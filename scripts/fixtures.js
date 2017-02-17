// each album is referenced by currentAlbum
var albumPicasso = {
	title: 'The Colors',
	artist: 'Pablo Picasso',
	label: 'Cubism',
	year: '1881',
	albumArtUrl: 'assets/images/album_covers/01.png',
	songs: [
		{ title: 'Blue', duration: '4:26' }, //referenced by currentSongFromAlbum // indices used by currentSongFromAlbum
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