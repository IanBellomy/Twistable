require "Twistable"

layerA = new Layer
	y: 153	
	x: 289
	originY: 2.01

layerB = new Layer
	backgroundColor: "skyblue"
	height: 20
	
textLayer = new TextLayer
	width: 388
	height: 80
	y: 487
	x: 197
textLayer.center()
textLayer.text = "0°"
textLayer.textAlign = "center"

# range, constrained
layerA.enableTwistable([-360,360])

layerA.onChange "rotation",->
	layerB.width = 768 * @twistValue	
	textLayer.text = Math.round(@rotation) + "°, " +Math.round(@twistValue*100)+"%"

# # Twist events happen when layer is grabbed and being twisted
# layerA.onTwist ->	
# 	layerB.width = 768 * @twistValue	
# 	textLayer.text = Math.round(@rotation) + "°, " +Math.round(@twistValue*100)+"%"
	
# # Spin events happen when layer –was- being twisted but was released and is now coasting freely. 
# layerA.onSpin ->	
# 	layerB.width = 768 * @twistValue	
# 	textLayer.text = Math.round(@rotation) + "°, " +Math.round(@twistValue*100)+"%"
	

# Sets the rotation of the layer as a with respect to the range where 1 is 100%
layerA.setTwistValue(0.5)


	
	