var app = app || {};

(function() {
		'use strict';

	var Routes = Backbone.Collection.extend({

		model: app.Route,

		localStorage: new Store('routes'),

		getAll: function() {
			return this.filter(function( route ) {
				return todo.get('title');
			});
		},

		nextOrder: function() {
			if ( !this.length ) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		comparator: function(todo) {
			return route.get('order');
		}

	});

	app.Routes = new Routes();

}());
