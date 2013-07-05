/*
	View Factory
*/
describe('view.js: viewFactory', function(){
	it('It should be an object', function(){
		expect(typeof viewFactory).toEqual('object');
	});

	it('It should have jQuery', function(){
		expect(typeof viewFactory.$).toEqual('function');
	});
});

describe('view.js: viewFactory.define', function(){
	it('It should be callable', function(){
		expect(typeof viewFactory.define).toEqual('function');
		expect(viewFactory.define()).toBeFalsy();
		expect(viewFactory.define({})).toBeTruthy();
	});
});

describe('view.js: viewFactory.create', function(){
	it('It should be callable', function(){
		expect(typeof viewFactory.create).toEqual('function');
		expect(viewFactory.create()).toBeFalsy();
		expect(viewFactory.create({})).toBeTruthy();
	});
});

describe('view.js: viewFactory.inherit', function(){
	it('It should be callable', function(){
		expect(typeof viewFactory.inherit).toEqual('function');
	});

	it('It should return an object', function(){
		expect(typeof viewFactory.inherit({},{})).toEqual('object');
	});

	it('It should inherit attributes', function(){
		var o = viewFactory.inherit({'a':true,'b':true,'c':true},{'a':false,'d':false,'e':false});

		expect(o.a).toBeFalsy();
		expect(o.b).toBeTruthy();
		expect(o.c).toBeTruthy();
		expect(o.d).toBeFalsy();
		expect(o.e).toBeFalsy();
	});

	it('It should not inherit events', function(){
		expect((viewFactory.inherit({'events':['a','b','c']},{'events':['d']})).events.length).toEqual(1);
	});
});

describe('view.js: viewFactory.inheritAndMergeEvents', function(){
	it('It should be callable', function(){
		expect(typeof viewFactory.inheritAndMergeEvents).toEqual('function');
	});

	it('It should return an object', function(){
		expect(typeof viewFactory.inheritAndMergeEvents({},{})).toEqual('object');
	});

	it('It should inherit attributes', function(){
		var o = viewFactory.inheritAndMergeEvents({'a':true,'b':true,'c':true},{'a':false,'d':false,'e':false});

		expect(o.a).toBeFalsy();
		expect(o.b).toBeTruthy();
		expect(o.c).toBeTruthy();
		expect(o.d).toBeFalsy();
		expect(o.e).toBeFalsy();
	});	

	it('It should inherit events', function(){
		expect((viewFactory.inheritAndMergeEvents({'events':['a','b','c']},{'events':['d']})).events.length).toEqual(4);
	});	
});

/*
	View
*/
describe('view.js: view', function(){
	var view;

	beforeEach(function() {
		view = viewFactory.create({
			'a': function(){ return true; }
		});
	});

	it('It should be an object', function(){
		expect(typeof view).toEqual('object');
	});

	it('It should be able to call methods from it\'s prototype', function(){
		expect(view.a()).toBeTruthy();
	});
});
