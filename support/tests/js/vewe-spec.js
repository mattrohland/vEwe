'use strict';
/*
	View Factory
*/
describe('vewe.js: vEweFactory', function(){
	it('It should be an object', function(){
		expect(typeof vEweFactory).toEqual('object');
	});

	it('It should have jQuery', function(){
		expect(typeof vEweFactory.$).toEqual('function');
	});
});

describe('vewe.js: vEweFactory.define', function(){
	it('It should be callable', function(){
		expect(typeof vEweFactory.define).toEqual('function');
		expect(vEweFactory.define()).toBeFalsy();
		expect(vEweFactory.define({})).toBeTruthy();
	});
});

describe('vewe.js: vEweFactory.create', function(){
	it('It should be callable', function(){
		expect(typeof vEweFactory.create).toEqual('function');
		expect(vEweFactory.create()).toBeFalsy();
		expect(vEweFactory.create({})).toBeTruthy();
	});
});

describe('vewe.js: vEweFactory.inherit', function(){
	it('It should be callable', function(){
		expect(typeof vEweFactory.inherit).toEqual('function');
	});

	it('It should return an object', function(){
		expect(typeof vEweFactory.inherit({},{})).toEqual('object');
	});

	it('It should inherit attributes', function(){
		var o = vEweFactory.inherit({'a':true,'b':true,'c':true},{'a':false,'d':false,'e':false});

		expect(o.a).toBeFalsy();
		expect(o.b).toBeTruthy();
		expect(o.c).toBeTruthy();
		expect(o.d).toBeFalsy();
		expect(o.e).toBeFalsy();
	});

	it('It should not inherit events', function(){
		expect((vEweFactory.inherit({'events':['a','b','c']},{'events':['d']})).events.length).toEqual(1);
	});
});

describe('vewe.js: vEweFactory.inheritAndMergeEvents', function(){
	it('It should be callable', function(){
		expect(typeof vEweFactory.inheritAndMergeEvents).toEqual('function');
	});

	it('It should return an object', function(){
		expect(typeof vEweFactory.inheritAndMergeEvents({},{})).toEqual('object');
	});

	it('It should inherit attributes', function(){
		var o = vEweFactory.inheritAndMergeEvents({'a':true,'b':true,'c':true},{'a':false,'d':false,'e':false});

		expect(o.a).toBeFalsy();
		expect(o.b).toBeTruthy();
		expect(o.c).toBeTruthy();
		expect(o.d).toBeFalsy();
		expect(o.e).toBeFalsy();
	});	

	it('It should inherit events', function(){
		expect((vEweFactory.inheritAndMergeEvents({'events':['a','b','c']},{'events':['d']})).events.length).toEqual(4);
	});	
});

/*
	View
*/
describe('vewe.js: Basic vEwe', function(){
	var vEwe;

	beforeEach(function() {
		vEwe = vEweFactory.create({
			'a': function(){ return true; }
		});
	});

	it('It should be an object', function(){
		expect(typeof vEwe).toEqual('object');
	});

	it('It should be able to call methods from it\'s prototype', function(){
		expect(vEwe.a()).toBeTruthy();
	});

	it('It should be able to change state from on to off.', function(){
		expect(vEwe.isOn).toBe(false);

		vEwe.on()
		expect(vEwe.isOn).toBe(true);

		vEwe.off()
		expect(vEwe.isOn).toBe(false);
	});

});

describe('vewe.js: vEwe ShepHearding', function(){
	var vEwe = vEweFactory.create({
			'events': [
				['shepheard_dance', 'dance']
			],
			'dance': function(){
				didDance = true;
			}
		}),
		bossyVEwe = vEweFactory.create({
			'triggerDance': function(){
				this.shepHeard.publish('dance');
			}
		}),
		didDance;

	beforeEach(function() {
		didDance = false;
		vEwe.on();
		bossyVEwe.on();
	});

	afterEach(function() {
		vEwe.off();
		bossyVEwe.off();
	});

	it('The shepHeard should be an object', function(){
		expect(typeof vEwe.shepHeard).toEqual('object');
	});

	it('The shepHeard should be able to trigger events', function(){
		bossyVEwe.triggerDance();

		expect(didDance).toEqual(true);
	});

	it('The shepHeard should not be able to trigger events if the vEwe is off.', function(){
		vEwe.off();
		bossyVEwe.off();
		bossyVEwe.triggerDance();

		expect(didDance).toEqual(false);
	});

});
