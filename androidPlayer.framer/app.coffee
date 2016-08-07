#most of the code by George Kedenburg III
# http://share.framerjs.com/cck1i1mbo1y0/

# Sharing Info
# This info is presented in a widget when you share

Framer.Info =
	title: "Android phone spotify"
	description: "multidevice prototype of android  spotify player"
	author: "Sergey Voronov"
	twitter: "mamezito"

#firebase module
{Firebase} = require 'firebase'
firebase = new Firebase
	debug: true
	projectID: "spotify-227df"
	secret: "HuCiWyr5CZBR5Cind9OHnEvSSP6eTvvb37Vc5rXu"
	server: "s-usc1c-nss-129.firebaseio.com"

# sketch import
sketch = Framer.Importer.load("imported/spotifyFramer@3x")
sketch.pause.opacity=0

#interface layers
backgroundCover = new Layer
	width:Screen.width
	height:Screen.height
	backgroundColor: "null"
	blur: 150
	opacity:0.4
cover=new Layer
	width:810
	height:810
	backgroundColor: "white"
	x:Align.center
	y:240

currentTime=new Layer x:13*3, y:423*3, backgroundColor:"null", width:100, opacity:0.75
songTime=new Layer x:315*3, y:423*3, backgroundColor:"null", width:100, opacity:0.75
songTime.style = 
	color: "white"
	textAlign:"center"
	fontSize: "36px"
	fontFamily: "Roboto"
currentTime.style = 
	color: "white"
	textAlign:"center"
	fontSize: "36px"
	fontFamily: "Roboto"
stopMusic = false
playing = false

slider=new SliderComponent x:Align.center, y:428*3, width:237*3, backgroundColor: "rgba(252,255,255,0.25)", height:3

slider.fill.backgroundColor = "#fff"


# using a hidden video layer to play the music
music = new VideoLayer width: 0, height: 0

songName = new Layer width: 810, height: 100, x: Align.center, y: 365*3, backgroundColor: "transparent"
songName.style = 
	color: "white"
	textAlign:"center"
	fontSize: "48px"
	fontWeight:"500"
	fontFamily: "Roboto"
	whiteSpace: "nowrap"
# 	overflow: "hidden"
	textOverflow: "ellipsis"

artist = new Layer width: 810, height: 100, x: Align.center, y: 387*3, backgroundColor: "transparent"
artist.style = 
	color: "#BEBEBE"
	textAlign:"center"
	fontSize: "42px"
	fontFamily: "Roboto"
	whiteSpace: "nowrap"
# 	overflow: "hidden"
	textOverflow: "ellipsis"

# play, pause functions
playSong=()->
	playing = true
	stopMusic = false
	music.player.play()
	sketch.pause.opacity=1
	sketch.play.opacity=0
	sketch.pause.bringToFront()
	
pauseSong=()->
	sketch.pause.opacity=0
	sketch.play.opacity=1
	playing = false
	music.player.pause()
	stopMusic = true
	sketch.play.bringToFront()
	
# set up our events
sketch.play.onClick ->
	playSong()
	firebase.patch("/spotify", { 
				"state":"play",
				})

sketch.pause.onClick ->
	pauseSong()
	firebase.patch("/spotify", { 
					"state":"pause",
					})
	

#spotify API
# this finds our albums
searchAlbums = (query) ->
	r = new XMLHttpRequest
	qString = "?q=" + encodeURIComponent(query) + "&type=album"
	r.open 'GET', 'https://api.spotify.com/v1/search' + qString, true
	r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

	r.onreadystatechange = ->
		if r.readyState != 4 or r.status != 200
			return
		response = JSON.parse(r.responseText)
		firstMatch = response.albums.items[0]
		if firstMatch
			cover.image = firstMatch.images[0].url
			backgroundCover.image = firstMatch.images[0].url
			fetchTracks(firstMatch.id)
			songName._element.innerHTML = firstMatch.name
			firebase.patch("/spotify", { 
					"cover":firstMatch.images[0].url,
					"song":firstMatch.name
					})
	r.send()

# this gets a specific track
fetchTracks = (albumId) ->
	r = new XMLHttpRequest
	r.open 'GET', 'https://api.spotify.com/v1/albums/' + albumId, true
	r.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');	
	r.onreadystatechange = ->
		if r.readyState != 4 or r.status != 200
			return
		response = JSON.parse(r.responseText)
		track = response.tracks.items[0]
		music.video = track.preview_url
		artist.html = track.artists[0].name
		firebase.patch("/spotify", { 
					"trackurl":track.preview_url,
					"artist":track.artists[0].name
					})
	r.send()


# start listening for music progress
# (this hooks into the existing framer render loop)
Framer.Loop.on "render", ->
	songTimeVal=String("0" + Math.round(music.player.duration)).slice(-2);
	songTime.html='0:'+songTimeVal
	if playing
		currentTimeVal=String("0" + Math.round(music.player.currentTime)).slice(-2);
		currentTime.html='0:' + currentTimeVal
		offset = Utils.modulate(music.player.currentTime, [0, music.player.duration], [0, 1])
		slider.value=offset
query="red hot chilli peppers"

if location.hash.substr(1).length>0
	query=location.hash.substr(1).split('_').join(' ')

Utils.delay .1, -> searchAlbums(query)

#firebase functions
responseFirebase = (data, method, path, breadcrumbs) ->
	if data.state=="pause"
			pauseSong()
		else if data.state="play"
			playSong()

firebase.onChange("/spotify", responseFirebase)
