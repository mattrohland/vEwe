(function(){ 
	if(typeof define != 'function') define = function(a,b){ window.viewFactory = b($); };
	define(
		[
			'3rdparty/jquery'
		],
		function($){ "use strict";

			// View Factory
			// Assists in defining and instantiating Views.
			var ViewFactory = function(){
				return this;
			};
			ViewFactory.prototype = {
				'$': $,
				'create': function(){
					var me = this,
						view;

					return (view = me.define.apply(me, arguments))? new view : false ;
				},
				'define': function(){
					var proto = {},
						inheritanceMethod = 'inherit',
						inheritanceArguments,
						View = function(){ return this; }; // Create view "Class"

					// Process Arguments
					switch( arguments.length ){
						case 0:
							return false;
							break;
						case 1: // If only 1 argument is provided assume it is the prototype
							inheritanceArguments = (Array.prototype.slice.call(arguments));
							break;
						default: // If more than 1 is passed assume prototype inheritance needs to occur
							
							// If the first argument is an object we assume we're 
							// applying basic prototype inheritance to all the arguments
							if(typeof arguments[0] == 'object'){
								inheritanceArguments = (Array.prototype.slice.call(arguments))
							}else{
								inheritanceMethod = arguments[0]
								inheritanceArguments = (Array.prototype.slice.call(arguments)).slice(1);
							}
							break;
					}

					// All items inherit from viewDefaultPrototype
					inheritanceArguments.unshift(this.viewDefaultPrototype);

					// Begin inheritance if we need to
					proto = (typeof inheritanceMethod == 'string')? this[inheritanceMethod].apply(this,inheritanceArguments) : inheritanceMethod.apply(this,inheritanceArguments);

					// All prototypes start from the viewDefaultPrototype
					View.prototype = proto;

					// Return "Class" definition
					return View;
				},
				'inherit': function(){
					// Runs an extend on all arguments
					return this.$.extend.apply(this,arguments);
				},
				'inheritAndMergeEvents': function(){
					// Runs an extend on all arguments
					// Also merges all the events down the inheritance chain
					var i,
						protos = Array.prototype.slice.call(arguments),
						proto,
						events = [];

					for(i in protos){
						if(typeof protos[i]['events'] == 'object')
							events = this._merge(events, protos[i]['events']);
					}
					proto = this.inherit.apply(this, arguments);
					proto['events'] = events;

					return proto;
				},
				'_merge': function(){
					// A basic array merge method that takes an unlimited # of arguments
					var i,
						ii,
						merged = [];

					for(i in arguments){
						for(ii in arguments[i]){
							merged.push(arguments[i][ii]);
						}
					}

					return merged;
				},
				// This is the default view prototype on which all views are based
				'viewDefaultPrototype': {
					'$': $,
					'selector': 'body',
					'events': [],
					'on': function(){
						this._elementRefresh();
						this._eventsOn();
						this.$el.trigger('view.on');
					},
					'off': function(){
						this._eventsOff();
						this.$el.trigger('view.off');
					},
					'_elementRefresh': function(){
						delete this.element;
						this.element = new Element(this.selector);
						this.$el = this.element.get(); // For shortcut sake.
					},
					'_eventStandardize': function(rawEve){
						var me = this,
							eve = this.$.extend([], rawEve),
							handlerMaybe = eve[eve.length-1];

						if(typeof handlerMaybe == 'string' && typeof me[handlerMaybe] == 'function')
							eve[eve.length-1] = me[handlerMaybe];
						
						return eve;
					},
					'_eventsOn': function(){
						var i,
							eve;

						for(i in this.events){
							eve = this._eventStandardize(this.events[i]);
							this.$el.on.apply(this.$el, eve);
						}
					},
					'_eventsOff': function(){
						var i;
						
						for(i in this.events){
							this.$el.off.apply(this.$el, this.events[i]);
						}
					}
				}
			};


			// Element
			// Enhances the View's top level DOM element.
			// Note: This is currently overkill.
			var Element = function(selector){
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

			// The View Factory is intended to be sudo singleton in nature
			// so we return an instance
			return new ViewFactory();
		}
	);
})();