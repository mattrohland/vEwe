define(
	[
		'3rdparty/jquery'
	],
	function($){ "use strict";
		// View
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
					inheritanceMethod = false,
					inheritanceArguments,
					protoDefault = {
						'$': $,
						'selector': 'body',
						'events': [],
						'on': function(){
							this._elementRefresh();
							this._eventsOn();
						},
						'off': function(){
							this._eventsOff();
						},
						'_elementRefresh': function(){
							delete this.element;
							this.element = new Element(this.selector);
							this.$el = this.element.get(); // For shortcut sake.
						},
						'_eventStandardize': function(rawEve){
							var me = this,
								eve = this.$.extend([],rawEve),
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
					},
					View = function(){};


				// Process Arguments
				switch( arguments.length ){
					case 0:
						return false;
						break;
					case 1:
						proto = arguments[0];
						break;
					default:
						if(typeof arguments[0] == 'object'){
							inheritanceMethod = 'inherit';
							inheritanceArguments = arguments;
						}else{
							inheritanceMethod = arguments[0]
							inheritanceArguments = (Array.prototype.slice.call(arguments)).slice(1);
						}
						break;
				}

				if(inheritanceMethod){
					proto = (typeof inheritanceMethod == 'string')? this[inheritanceMethod].apply(this,inheritanceArguments) : inheritanceMethod.apply(this,inheritanceArguments);
				}

				View.prototype = this.$.extend({}, protoDefault, proto);
				return View;
			},
			'inherit': function(){
				var i,
					protos = Array.prototype.slice.call(arguments),
					proto = {};

				for(i in protos){
					proto = this.$.extend(proto, protos[i]);
				}

				return proto;
			},
			'inheritAndMergeEvents': function(){
				var i,
					protos = Array.prototype.slice.call(arguments),
					proto = {},
					events = [];

				for(i in protos){
					proto = this.$.extend(proto, protos[i]);
					console.log(typeof protos[i]['events']);
					if(typeof protos[i]['events'] == 'object')
						events = this._merge(events, protos[i]['events']);
				}
				proto['events'] = events;

				return proto;
			},
			'_merge': function(){
				var i,
					ii,
					merged = [];

				for(i in arguments){
					for(ii in arguments[i]){
						merged.push(arguments[i][ii]);
					}
				}

				return merged;
			}
		};


		// Element
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

		return new ViewFactory();
	}
);