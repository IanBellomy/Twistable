# Twistable.coffee

##### Drag-rotate layers

<img alt="example" src="https://github.com/IanBellomy/Twistable/blob/master/examples/twistable.gif" width=300 height=404>




## Use

<!-- #### Option 1 : Framer Modules<br>
<a href='https://open.framermodules.com/Twistable'><img alt='Install with Framer Modules' src='https://www.framermodules.com/assets/badge@2x.png' width='160' height='40' /></a>
 -->
#### Manual Install<br>
Download the Twistable.coffee file and place it in the modules folder of your project.<br>
In your framer project, write:

````coffeescript
require "Twistable"
````

Make a layer twistable (i.e. drag-rotabable)

````coffeescript
twistLayer = new Layer
twistLayer.enableTwistable()
````

NOTE: This module modifies Layer.prototype and so is not gauranteed to play well with all modules in existance or even your own code. Buyer beware. 

## New Layer methods


````coffeescript
enableTwistable()
enableTwistable( range )
enableTwistable( range, constrain )
````

Where `range` is an array with a minimum and maximum value. If a `range` is provided the layer's twisting will be constrained to the range.
`constrain` is a Boolean. If `false`, the layer will not be constrained to `range`.

Once `enableTwistable` is called, the layer will become twistable, and will emit the following events: 

- `"twistStart"`
- `"twist"`
- `"twistEnd"` 
- `"spin"`
- `"spinEnd"`

<br><br>
````coffeescript
setTwistValue( n )
````
Where `n` is a value between 0-1. The rotation of the layer will be set with respect to its twist range. Like `value =` of a `SliderComponent`. `enableTwistable` must be called before `setTwistValue`.

---
## Event handling shortcuts

For responding to twisting, recommend using:

````coffeeScript
onChange "rotation", ->
````
<br><br>
For specialized listening:

````coffeeScript
onTwistStart( ()->  )
````
When the mouse first moves after pressing down on the twistable layer.<br>


````coffeeScript
onTwist( ()->  )
````
When the mouse moves anwhere while twisting.


````coffeeScript
onTwistEnd( ()->  )
````
When the mouse is released after twisting.


````coffeeScript
onSpin( ()->  )
````
When the layer moves due to velocity after the twist has ended.


````coffeeScript
onSpinEnd( ()->  )
````
When the layer stops moving when before it was spinning due to velocity from a previous twist.



---
## Properties

````coffeescript
twistValue
````
A number between 0-1. The rotation of the layer with respect to its twist range. Like `value` of a `SliderComponent`. Setting this value has no effect. Use `setTwistValue()`.




## Contact
Twitter: @ianbellomy

