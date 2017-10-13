/*!
 * vEwe
 * https://github.com/mattrohland/vEwe
 * 
 * Copyright (c) 2013 Matt Rohland
 * Released under the MIT license
 */
 /* global define:true,$:false */
 /* jshint strict:false,globalstrict:false */
/**
 * The vEwe module
 * @exports vEweFactory
 * @namespace vewe
 */
(function(){
	// AMDless define method
	if(typeof define !== 'function') define = function(a,b){ window.vEweFactory = b($); };
	
	// AMD define wrapper
	define(
		[
			'3rdparty/jquery'
		],
		function($){
			'use strict';
			var VEweFactory,
				Element,
				ShepHeard;

			/**
			 * A factory that assists in defining and instantiating views.
			 *
			 * @memberof vewe
			 * @class
			 */
			VEweFactory = function(){
				this.shepHeard = new ShepHeard();
				return this;
			};
			/**
			 * @memberof vewe
			 * @lends VEweFactory.prototype
			 */
			VEweFactory.prototype = {
				/**
				 *
				 * A scoped instance of jQuery.
				 * @static
				 */
				'$': $,
				/**
				 * A method used to creates an instance of a VEwe.
				 *
				 * @function
				 * @param {string} [arguments[0]=inherit] - The method to use when merging prototypes.
				 * @param {...object} arguments - One or more prototypes to use when constructing a VEwe instance.
				 * @returns {Function} VEwe instance
				 */
				'create': function(){
					var me = this,
						VEwe;

					return (VEwe = me.define.apply(me, arguments))? new VEwe() : false ;
				},
				/**
				 * A method used to construct an uninstantiated definition of a view.
				 *
				 * @function
				 * @param {string} [arguments[0]=inherit] - The method to use when merging prototypes. Supported values include: inherit, inheritAndMergeEvents
				 * @param {...object} arguments - One or more prototypes to use when constructing a VEwe class.
				 * @returns {Function} VEwe class
				 */
				'define': function(){
					var me = this,
						proto = {},
						inheritanceMethod = 'inherit',
						inheritanceArguments,
						/**
						 * @class
						 */
						VEwe = function(){
							this.shepHeard = me.shepHeard;
							return this; 
						};

					// Process Arguments
					if(arguments.length === 0){
						return false;
					}else if(typeof arguments[0] === 'object'){
						inheritanceArguments = (Array.prototype.slice.call(arguments));
					}else{
						inheritanceMethod = arguments[0];
						inheritanceArguments = (Array.prototype.slice.call(arguments)).slice(1);
					}

					// All items inherit from vEweDefaultPrototype
					inheritanceArguments.unshift({});
					inheritanceArguments.unshift(this.vEweDefaultPrototype);

					// Begin inheritance if we need to
					proto = (typeof inheritanceMethod == 'string')? this[inheritanceMethod].apply(this,inheritanceArguments) : inheritanceMethod.apply(this,inheritanceArguments);

					// All prototypes start from the vEweDefaultPrototype
					VEwe.prototype = proto;
					VEwe.prototype.factory = me;

					// Return "Class" definition
					return VEwe;
				},
				'inherit': function(){
					var extendArgs = (Array.prototype.slice.call(arguments));

					// Insure that we start with a new object (we don't want accidental inheritance)
					extendArgs.unshift({});

					// Runs an extend on all arguments
					return this.$.extend.apply(this,extendArgs);
				},
				'inheritAndMergeEvents': function(){
					// Runs an extend on all arguments
					// Also merges all the events down the inheritance chain
					var i,
						protos = Array.prototype.slice.call(arguments),
						proto,
						events = [];

					for(i=0;i<protos.length;i++){
						if(typeof protos[i].events === 'object')
							events = this._merge(events, protos[i].events);
					}
					proto = this.inherit.apply(this, arguments);
					proto.events = events;

					return proto;
				},
				'_merge': function(){
					// A basic array merge method that takes an unlimited # of arguments
					var i,
						ii,
						merged = [];

					for(i=0;i<arguments.length;i++){
						for(ii=0;ii<arguments[i].length;ii++){
							merged.push(arguments[i][ii]);
						}
					}

					return merged;
				},
				/**
				 * The default view prototype on which all views are based
				 *
				 * @lends vewe.VEweFactory#define~VEwe.prototype
				 */
				'vEweDefaultPrototype': {
					/**
					 * A scoped instance of jQuery.
					 *
					 * @static
					 */
					'$': $,
					/**
					 * The top-level selector used to scope this view's interaction within the DOM.
					 * @type {string}
					 */
					'selector': 'body',
					/**
					 * The list of event instructions used to describe what event listeners to turn on / off.
					 *
					 * @type {object}
					 */
					'events': [],
					/**
					 * A boolean indicator of the view's on / off state.
					 *
					 * @type {boolean}
					 */
					'isOn': false,
					/**
					 * A method used to turn on a view's event listeners.
					 *
					 * @function
					 */
					'on': function(){
						this._elementRefresh();
						this._eventsOn();
						this.$el.trigger('vEwe.on');
					},
					/**
					 * A method used to turn off a view's event listeners.
					 * @function
					 */
					'off': function(){
						this._eventsOff();
						this.$el.trigger('vEwe.off');
					},
					'_elementRefresh': function(){
						delete this.element;
						this.element = new Element(this.selector);
						this.$el = this.element.get(); // For shortcut sake.
					},
					'_eventStandardize': function(rawEve){
						var me = this,
							eve = me.factory._merge([], rawEve),
							handlerMaybe = eve[eve.length-1];

						if(typeof handlerMaybe == 'string' && typeof me[handlerMaybe] == 'function')
							eve[eve.length-1] = me[handlerMaybe];

						// In jQuery's on method data is always the second to last argument.
						// More hacktastic than I would like.
						eve.splice(eve.length-1, 0, me);

						return eve;
					},
					'_eventsOn': function(){
						var i,
							eve;

						for(i=0;i<this.events.length;i++){
							eve = this._eventStandardize(this.events[i]);

							if(eve[0].indexOf(this.shepHeard.eventNamePrefix) === 0) this.shepHeard.element.$el.on.apply(this.shepHeard.element.$el, eve);
							else this.$el.on.apply(this.$el, eve);
						}
						this.isOn = true;
					},
					'_eventsOff': function(){
						var i,
							eve;

						for(i=0;i<this.events.length;i++){
							eve = this._eventStandardize(this.events[i]);

							if(eve[0].indexOf(this.shepHeard.eventNamePrefix) === 0) this.shepHeard.element.$el.off.apply(this.shepHeard.element.$el, [this.events[i][0]]);
							else this.$el.off.apply(this.$el, [this.events[i][0]]);
						}
						this.isOn = false;
					}
				}
			};


			// Element
			// Enhances the VEwe's top level DOM element.
			// Note: This is currently overkill.
			Element = function(selector){
				this.options = {
					'selector': selector
				};

				this.findAndSet();

				return this;
			};
			Element.prototype = {
				'$': $,
				'find': function(){
					return this.$(this.options.selector);
				},
				'findAndSet': function(){
					this.$el = this.find();
				},
				'get': function(){
					return this.$el;
				}
			};


			/**
			 * The ShepHeard is an object used for cross VEwe communication.
			 * All views in a view set have access to a shared ShepHeard and may subscribe, unsubscribe, and publish events to the ShepHeard in a fairly typical pub / sub fashion.
			 * In a sense, the ShepHeard shepherds the views.
			 *
			 * @class
			 * @memberof vewe
			 */
			ShepHeard = function(){
				this.element = new Element({});
				return this;
			};
			/**
			 * @memberof vewe
			 * @lends ShepHeard.prototype
			 */
			ShepHeard.prototype = {
				/**
				 * A scoped instance of jQuery.
				 *
				 * @static
				 */
				'$': $,
				/**
				 * The string prefix used for all events in this ShepHeard names.
				 * Used to prevent event name collision.
				 *
				 * @type {string}
				 */
				'eventNamePrefix': 'shepheard_',
				/**
				 * A method used to publish /trigger an event within this ShepHeard's scope.
				 *
				 * @function
				 * @param {string} eventName - The event name (un-prefixed) that is being published / triggered.
				 * @param {object} [options={}] - The options / data made available to the event.
				 */
				'publish': function(eventName, options){
					if(typeof options == 'undefined') options = {};

					this.element.get().trigger(this.eventNamePrefix + eventName, [options]);
				},
				/**
				 * A method used to subscribe the ShepHeard to an event and describe what action to take if the event is published / triggered.
				 *
				 * @function
				 * @param {string} eventName - The event name (un-prefixed) that is being subscribed to.
				 * @param {function} callback - The callback function that will be fired when the event is triggered.
				 */
				'subscribe': function(eventName, callback){
					this.element.get().on(this.eventNamePrefix + eventName, callback);
				},
				/**
				 * A method used to un-subscribe the ShepHeard from an event.
				 *
				 * @function
				 * @param {string} eventName - The event name (un-prefixed) that is being subscribed to.
				 */
				'unsubscribe': function(eventName){
					this.element.get().off(this.eventNamePrefix + eventName);
				}
			};

			// The VEwe Factory is intended to be pseudo singleton in nature
			// so we return an instance
			return new VEweFactory();
		}
	);
})();
