# >>> Framer Fold >>>
# Sharing Info
# This info is presented in a widget when you share

Framer.Info =
	title: "Android wear spotify"
	description: "multidevice prototype of android spotify player"
	author: "Sergey Voronov"
	twitter: "mamezito"

#modules
{Firebase} = require 'firebase'
firebase = new Firebase
	debug: true
	projectID: "spotify-227df"
	secret: "HuCiWyr5CZBR5Cind9OHnEvSSP6eTvvb37Vc5rXu"
	server: "s-usc1c-nss-129.firebaseio.com"

# Moto 360 - Custom Device
Framer.DeviceView.Devices["custom"] =
	"deviceType": "Moto 360"
	"screenWidth": 360
	"screenHeight": 360
	"deviceImage": "http://beta.rss-ems.com/Moto360/M-B-B.png"
	"deviceImageWidth": 450
	"deviceImageHeight": 650
Screen.backgroundColor="rgba(255,255,255,0)"

# Set device and background 
Framer.Device.deviceType = "custom"

# Mask
mask = new Layer
	width: 360
	height: 360
	backgroundColor: "rgba(255,255,255,0)"
	borderRadius: 180
	clip:true

# interface layers
cover=new Layer
	width:360
	height:360
	superLayer: mask
meta=new Layer
	width:360
	height:120
	maxY: 330
	backgroundColor: "white"
	superLayer: mask
play=new Layer
	image: "images/play.png"
	width:30
	height:38
	y:20
	x:280
	opacity:1
	superLayer: meta
pause=new Layer
	image: "images/pause.png"
	width:32
	height:37
	y:20
	x:280
	opacity:0
	superLayer: meta

songName = new Layer width: 300, height: 60, x: 60, y: 50, backgroundColor: "transparent", parent:meta
songName.style = 
	color: "#787878"
	fontSize: "23px"
	fontFamily: "Roboto"
	whiteSpace: "nowrap"
	overflow: "hidden"
	textOverflow: "ellipsis"
artist = new Layer width: 181, height: 100, x: 60, y: 20, backgroundColor: "transparent", parent:meta
artist.style = 
	color: "#B9B9B9"
	fontSize: "25px"
	fontFamily: "Roboto"
	whiteSpace: "nowrap"
	overflow: "hidden"
	textOverflow: "ellipsis"

#firebase functions
response = (data, method, path, breadcrumbs) ->
	
	firebase.get "/spotify", (datas)->
		cover.image=datas.cover
		songName.html=datas.song
		artist.html=datas.artist
	if data.state=="pause"
		pauseSong()
	else if data.state="play"
		playSong()


firebase.onChange("/spotify", response)	

# play pause functions
playSong=()->

	pause.opacity=1
	play.opacity=0
	pause.bringToFront()
	
pauseSong=()->
	pause.opacity=0
	play.opacity=1
	play.bringToFront()
	
	
play.onClick ->
	playSong()
	firebase.patch("/spotify", { 
				"state":"play",
				})

pause.onClick ->
	pauseSong()
	firebase.patch("/spotify", { 
					"state":"pause",
					})

#android wear custom device required
sensorAndGlassReflection = new Layer
	width: 360, height: 360
	x:0, y:0
	image: "images/s.png"
sensorAndGlassReflection.bringToFront()
sensorAndGlassReflection.ignoreEvents
sensorAndGlassReflection.parent = mask
mask.bringToFront()
Screen.backgroundColor="rgba(255,255,255,0)"

