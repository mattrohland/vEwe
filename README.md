#vEwe - A Javascript Event Manager

vEwe is a JS library used to manage events through an easy to extend view object. With jQuery as its sole dependency it provides a lightweight alternative for those wishing to avoid a full fledged "framework".

**Key features include:**
+ AMD (asynchronous module definition) ready
+ Unlimited inheritance in 2 flavors
+ Lightweight prototypical view objects
+ Events with all the power of jQuery's .on()

vEwes provide a format for organizing a cohesive set of interactions without being extremely restrictive. It is up to the developer to determine what set of interactions each set should entail.

## Simple Example

A very simple vEwe that triggers a confirmation prompt when a form's cancel button is clicked could be achieved with the following:

```
var vEwePrototype,
	vEwe;

// 1. Define a view prototype
vEwePrototype = {
	'selector': 'form',
	'events': [
		['click','button[type=reset]','resetWarning']
	],
	'resetWarning': function(e){
		return confirm('You are about to reset the form. All the data currently entered will be cleared.');
	}
}

// 2. Create a view from the view prototype
vEwe = vEweFactory.create(vEwePrototype);

// 3. On DOMReady, turn on the view
vEweFactory.$(function(){
	vEwe.on();
});
```

*Use of a reset button and a confirm popup in a single example -- how quaint.*


## More...

For more information visit: http://mattrohland.github.io/vEwe
