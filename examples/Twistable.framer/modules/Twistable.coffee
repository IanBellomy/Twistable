# Add the following line to your project in Framer Studio. 
# myModule = require "myModule"
# Reference the contents by name, like myModule.myFunction() or myModule.myVar


# Twistable


Layer.prototype.enableTwistable = (range,constrained)->
	
	@canvasPinLocation = null # the point of rotation in canvas coordinates
	@previousAngle = 0	
	@angularVel = 0	# Used for flicked spin
	@twistRange = range || [0,360]  # Used for twistValue
	@twistValue = 0		# The rotation as percent of the twistRange
	@twistConstrained = constrained || range != undefined	 # Whether or not to clamp twisting.
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
		if Math.abs(angularVel) < 0.1
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