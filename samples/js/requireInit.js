// Configuring RequireJS
require.config({'baseUrl': '../js'});


// De-scoping jQuery and wrapping it in an AMD define.
define('3rdparty/jquery',
	[
		'http://code.jquery.com/jquery-2.0.2.min.js'
	],
	function(){
		return jQuery.noConflict(true);
	}
);