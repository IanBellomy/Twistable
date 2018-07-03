
# Twistable

Layer.prototype.enableTwistable = (range,constrained)->
	
	@canvasPinLocation = null # the point of rotation in canvas coordinates
	@previousAngle = 0	
	@angularVel = 0	# Used for flicked spin
	@twistRange = range || [0,360]  # Used for twistValue
	@twistValue = 0		# The rotation as percent of the twistRange
	@twistConstrained = constrained || true	 # Whether or not to clamp twisting.
	@spinDecay = 0.95
	
	handleMouseMove = (e)=>			
		newAngle = Math.atan2(@canvasPinLocation.y-e.pageY,@canvasPinLocation.x-e.pageX)
		newAngleDeg = (newAngle / Math.PI * 180)
		newAngleDegUpIsZero = newAngleDeg - 90
		angleDif = shortestDistanceBetweenAngles(@previousAngle,newAngleDegUpIsZero)			
		@rotation += angleDif			
		@angularVel = angleDif
		if @twistConstrained
			constrainedRotation = Math.min(Math.max(@rotation,@twistRange[0]),@twistRange[1])
			if @rotation != constrainedRotation 				
				@angularVel = 0
				@rotation = constrainedRotation
			
		if !@hasTwistBegan and @angularVel != 0
			@hasTwistBegan = true
			@emit "twistStart"
		@previousAngle = newAngleDegUpIsZero
		@twistValue = Utils.modulate(@rotation,@twistRange,[0,1])			
		@emit "twist"
	
	handleSpinning = (e)=>						
		
		@rotation += @angularVel
		@angularVel *= @spinDecay
		if @twistConstrained
			constrainedRotation = Math.min(Math.max(@rotation,@twistRange[0]),@twistRange[1])
			if @rotation != constrainedRotation 				
				@angularVel = 0
				@rotation = constrainedRotation		
		@twistValue = Utils.modulate(@rotation,@twistRange,[0,1])		
		@emit "spin"		
		if Math.abs(angularVel) < 0.01
			angularVel = 0
			@emit "spinEnd"
			Framer.Loop.off "update",handleSpinning
			
	handleMouseUp = =>		
		@isBeingTwisted = false		
		@emit "twistEnd"
		Events.wrap(document).removeEventListener "mousemove",handleMouseMove
		Events.wrap(document).removeEventListener "mouseup",handleMouseUp
		Framer.Loop.on "update",handleSpinning
		
	@onMouseDown (e)=>
		localPinLocation = 
			x:@width * @originX
			y:@height * @originY
		@canvasPinLocation = @convertPointToCanvas(localPinLocation)
			
		# calculate initial angle of click/tap
		startAngle = Math.atan2(@canvasPinLocation.y-e.pageY,@canvasPinLocation.x-e.pageX)
		startAngleDeg = (startAngle / Math.PI * 180)
		startAngleDegUpIsZero = startAngleDeg - 90		
		@previousAngle = startAngleDegUpIsZero				
		@rotationTouchPoint = {x:e.pageX,y:e.pageY}
		@hasTwistBegan = false
		@isBeingTwisted = true
		Events.wrap(document).addEventListener "mousemove",handleMouseMove
		Events.wrap(document).addEventListener "mouseup",handleMouseUp
		Framer.Loop.off "update",handleSpinning
		
	@setTwistValue = (v)=>
		@twistValue = Math.max(Math.min(v,1),0)
		@rotation = Utils.modulate(v,[0,1],@twistRange)
		@emit "twist"		
		
		
Layer.prototype.disableTwistable = ->
	print "NOT WORKING YET"

# Event handling shortcuts
Layer.prototype.onTwist = (fn)->
	@on "twist",fn
	
Layer.prototype.onTwistStart = (fn)->
	@on "twistStart",fn

Layer.prototype.onTwistEnd = (fn)->
	@on "twistEnd",fn

Layer.prototype.onSpin = (fn)->
	@on "spin",fn	

Layer.prototype.onSpinEnd = (fn)->
	@on "spinEnd",fn	
			
#
# Helpers
#

# Convert angle to value between 0–360
normalizeAngle = (a)->
	return (a + 360*10000)%360

# Should be named shortestDistance between NORMALIZED angles. 
shortestDistanceBetweenAngles = (a1,a2)->
	a1Norm = normalizeAngle(a1)
	a2Norm = normalizeAngle(a2) 	
	r1 = a2Norm-a1Norm	
	if Math.abs(r1) > 180 
		if r1 > 0 then	return r1 - 360 
		else return r1 + 360 
	else
		return r1

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

layerA.enableTwistable([-360,360])

# Twist events happen when layer is grabbed and being twisted
layerA.onTwist ->	
	layerB.width = 768 * @twistValue	
	textLayer.text = Math.round(@rotation) + "°, " +Math.round(@twistValue*100)+"%"
	
# Spin events happen after layer –was- being twisted but was released and is now coasting freely. 
layerA.onSpin ->	
	layerB.width = 768 * @twistValue	
	textLayer.text = Math.round(@rotation) + "°, " +Math.round(@twistValue*100)+"%"
	

layerA.setTwistValue(0.5)


	
	