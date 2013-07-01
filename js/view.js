define(
	[
		'3rdparty/jquery'
	],
	function($){
		// View
		var View = function(options){
			var options = (typeof options == 'undefined')? {} : options,
				defaults = {
					'selector': 'body',
					'events': []
				};
			this.options = this.$.extend({},defaults,options);
			this.helpers = View.helpers;
		};
		View.prototype = {
			'$': $,
			'on': function(){
				this.elementRefresh();
				this.eventsOn();
			},
			'off': function(){
				this.eventsOff();
			},
			'elementRefresh': function(){
				delete this.element;
				this.element = new Element(this.options.selector);
				this.$el = this.element.get(); // For shortcut sake.
			},
			'eventStandardize': function(rawEve){
				var me = this,
					eve = this.$.extend([],rawEve),
					handlerMaybe = eve[eve.length-1];

				if(typeof handlerMaybe == 'string' && typeof me.options[handlerMaybe] == 'function')
					eve[eve.length-1] = me.options[handlerMaybe];
				
				return eve;
			},
			'eventsOn': function(){
				var i,
					eve;

				for(i in this.options.events){
					eve = this.eventStandardize(this.options.events[i]);
					this.$el.on.apply(this.$el, eve);
				}
			},
			'eventsOff': function(){
				var i;
				
				for(i in this.options.events){
					this.$el.off.apply(this.$el, this.options.events[i]);
				}
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

		// Element
		View.helpers = {
			'$': $,
			'merge': function(){
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
		return View;
	}
);