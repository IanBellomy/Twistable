# Twistable.coffee

##### Drag-rotate layers

(Example to come)



## Use

#### Option 1 : Framer Modules<br>
<a href='https://open.framermodules.com/Pair'><img alt='Install with Framer Modules' src='https://www.framermodules.com/assets/badge@2x.png' width='160' height='40' /></a>

#### Option 2: Manual Install<br>
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


## New Layer Methods
In order of importance. 


````coffeescript
enableTwistable()
enableTwistable( range )
enableTwistable( range, constrain )
````

Where `range` is an array with a minimum and maximum value. If a `range` is provided the layer's twisting will be constrained to the range
`constrain` is a Boolean. If false, the layer will not be constrained to `range`.

Once `enableTwistable` is called, the layer will become twistable, and will emit the following events: 

- `"twistStart"`
- `"twist"`
- `"twistEnd"` 
- `"spin"`
- `"spinEnd"`


---
##### event handling

For responding to twisting, recommend using:

````coffeeScript
twistableLayer.onChange "rotation", ->
````

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
##### properties

````coffeescript
twistValue
````
A number between 0-1. The rotation of the layer with respect to its twist range. Like `value` of a `SliderComponent`


---
##### methods

````coffeescript
setTwistValue( n )
````
Where `n` is a value between 0-1. The rotation of the layer will be set with respect to its twist range. Like `value =` of a `SliderComponent`


## Contact
Twitter: @ianbellomy

