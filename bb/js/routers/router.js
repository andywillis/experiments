var app = app || {};

(function() {
	'use strict';

	// Todo Router
	// ----------

	var Workspace = Backbone.Router.extend({
		routes:{
			'*other': 'showMap'
		},

		showMap: function() {
			console.log('s');
		}

	});

	app.RouteRouter = new Workspace();
	Backbone.history.start();

}());
