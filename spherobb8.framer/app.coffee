#project info
Framer.Info =
	title: "Sphero BB8 control"
	description: "control color and movement of bluetooth enabled droid sphero bb8"
	author: "Sergey Voronov"
	twitter: "mamezito"

#modules
{Firebase} = require 'firebase'
dragOnCircle = require "dragOnCircle"

firebase = new Firebase
	debug: true
	projectID: "sphero-d446f"
	secret: "FzuikFwdVCzWtNEE28PdyXvn167WptCfqBwx1uxg"
	server: "s-usc1c-nss-125.firebaseio.com"

# sketch
sketch = Framer.Importer.load("imported/ui@3x")
Utils.globalLayers sketch
ui.center()

# variables
hue=0
speed=0
rotation=0
colorHSL = new Color("hsl(#{hue}, 100, 50)")

# color changing
colorKnob = new Layer
	width: 150
	height: 150
	backgroundColor: "red"
	borderRadius: 75
	y: 549
	shadowBlur: 30
	shadowColor: "rgba(0,0,0,0.2)"
colorKnob.style=
	"border":" 40px solid #FFFFFF"
	
colorKnob.midY=colorpicker.y+245
colorKnob.centerX()
angle=dragOnCircle.circleDrag colorKnob, 350

colorKnob.on "change:x", ->
	hue=dragOnCircle.dragAngle
	colorHSL=new Color("hsl(#{hue}, 100, 50)")
	colorKnob.backgroundColor=colorHSL
	hex=colorHSL.toHexString()

	firebase.patch("/sphero", {"color": hex})

#movement controls

body=new Layer
	width:360
	height:360
	backgroundColor: "#FFF"
	shadowSpread: 15
	shadowBlur: 90
	borderRadius: 180
	shadowColor: "rgba(123,123,123,0.27)"
	scale:0.5
body.center()

body.states.add
	clicked:
		scale:1
body.states.animationOptions =
    curve: "spring(200, 10, 0)"

head=new Layer
	width:150
	height:150
	midY:body.y
	backgroundColor: "#FFF"
	shadowBlur: 60
	borderRadius: 75
	shadowColor: "rgba(0,0,0,0.2)"
	opacity:0

head.centerX()
headAngle=dragOnCircle.circleDrag head, body.width/2
headX=head.x
headY=head.y

head.midY=body.midY

body.bringToFront()
body.onClick (event, layer) ->
	body.states.next()
	if speed==0
		speed=100
		body.sendToBack()
		ui.sendToBack()
		head.animate
			properties:
				opacity:1
				x:headX
				y:headY
			curve: "spring(400, 10, 10)"
		
		
	else
		speed=0
		headX=head.x
		headY=head.y
		
		head.animate
			properties:
				opacity:0
				midX:body.midX
				midY:body.midY
			curve: "spring(400, 10, 10)"
		body.bringToFront()
	firebase.patch("/sphero", {"speed": speed})
eye=new Layer
	parent:head
	width:70
	height:70
	backgroundColor:"grey"
	borderWidth: 30
	borderColor: "rgba(255,255,255,0.5)"
	borderRadius: 45
	opacity:0.5
eye.center()
head.on "change:x", ->
	rotation=dragOnCircle.dragAngle
	firebase.patch("/sphero", {"rotation": rotation})
