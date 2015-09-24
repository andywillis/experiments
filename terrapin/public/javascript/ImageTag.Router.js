'use strict';

define('ImageTag.Router', [
  'jquery',
  'backbone',
  'ImageTag.Route.Client',
  'ImageTag.Route.Manager'
], function ($, Backbone, clientRoute, managerRoute) {

  return Backbone.Router.extend({

    routes: {
      'client': 'client',
      'manager': 'manager'
    },

    initialize: function (application) {
      this.application = application;
    },

    /**
     * Decided to separate out the routes into separate
     * files: ImageTag.Route.Client and ImageTag.Route.Manager
     * so that the code is cleaner
     */

    client: function () {
      clientRoute(this.application);
    },

    manager: function () {
      managerRoute(this.application);
    }

  });

});
