#vEwe - A Javascript Event Manager

vEwe is a JS library used to manage events through an easy to extend view object. With jQuery as its sole dependency it provides a lightweight alternative for those wishing to avoid a full fledged "framework".

**Key features include:**
+ AMD (asynchronous module definition) ready
+ Unlimited inheritance in 2 flavors
+ Lightweight prototypical view objects
+ Events with all the power of `jQuery.on()`

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

## The vEwe

### Selector (`this.selector`)

The intention of the vEwe's primary selector is to define the vEwe's area of operation within the DOM. A selector can be an individual DOM element or a string written in the CSS-esque format jQuery users are familiar with (https://api.jquery.com/category/selectors/).

While it is possible for a vEwe's selector to be all-encompassing by setting it to `window` those building larger applications will find that grouping similar functionality into smaller vEwe's with a very specific scope and purpose produces a more maintainable system.

### Events (`this.events`)

The fundamental objective of vEwe is to provide a simple interface that can be used to listen and react to JS events. Every vEwe contains an array of event binds that will be turned on when the vEwe's `this.on()` method is invoked and off when the vEwe's `this.off()` method is invoked.

The array of event bind instructions are stored in the vEwe at `this.events`. Each event bind instruction set is itself an array with a specific structure; A structure that closely mimics `jQuery.on()` (http://api.jquery.com/on/).

**Event** - The first item in the array is the event name as a string (https://developer.mozilla.org/en-US/docs/Web/Events).

**Method** - The last item in the array is a string representing the method in the current vEwe that will be invoked.

**Sub-selector (optional)**  - If there are 3 items in the array the second item is a selector to further limit the scope in which the event must occur. Keep in mind that a vEwe is already limiting the scope in which it is listening for an event to that vEwe's defined `this.selector`.

**For example:**

```
vEwePrototype = {
	'events': [
		['event','method'],
		['event','sub-selector','method']
	],
	'method': function(e){
		// Do something.
	}
}
```

*For those of you familiar with jQuery.on(), you may have noticed that the "data" passed with the event can't be configured in this format. The data associated with the event will always be the current vEwe. If you have information that must be passed to the method, it should be made available to the current vEwe.*

#### Custom Events

##### vEwe.on

Each vEwe instance can be turned on or off. When the vEwe's `this.on()` method is invoked a custom event is triggered on the vEwe's primary selector. Like other events, this custom event can be used in `this.events` entries to bind a vEwe method to the "vEwe.on" event.

**For example:**

```
vEwePrototype = {
	'events': [
		['vEwe.on','method']
	],
	'method': function(e){
		// Do something.
	}
}
```

##### vEwe.off

Each vEwe instance can be turned on or off. When the vEwe's `this.off()` method is invoked a custom event is triggered on the vEwe's primary selector. Like other events, this custom event can be used in `this.events` entries to bind a vEwe method to the "vEwe.off" event.

**For example:**

```
vEwePrototype = {
	'events': [
		['vEwe.off','method']
	],
	'method': function(e){
		// Do something.
	}
}
```

### Event Methods

When a registered event occurs the correlating method within the vEwe is invoked, these methods are referred to as event methods.

When an event method is invoked its first (and only) parameter is a jQuery event object. The event object (https://api.jquery.com/category/events/event-object/). The event object's `data` (https://api.jquery.com/event.data/) will always be the current vEwe instance.

## More...

For more information visit: http://mattrohland.github.io/vEwe
