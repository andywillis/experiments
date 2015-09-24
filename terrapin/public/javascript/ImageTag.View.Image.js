// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

define('ImageTag.View.Image', [
  'jquery',

  // Need to change lodash to underscore here
  'lodash',
  'backbone'
], function ($, _, Backbone) {

  return Backbone.View.extend({

    tagName: 'div.image',

    initialize: function (options) {

      this.model = options.model;
      this.view = options.view;
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
    },

    render: function () {

      var link = this.model.get('link');
      var id = this.model.get('id');
      var url = this.model.get('url');

      // Create the HTML array for both client and manager views
      // I haven't used a template for this, but this is what it would
      // look like
      var html = [
        '<div class="imagetag-ns-container" data-link="' + link + '" data-id="' + id + '">',
        '<a href="' + link + '">',
        '<img class="imagetag-image" src="' + url + '"/>',
        '</a><br/>',
        '<button class="imagetag-remove">Remove</button>',
        '</div>'
      ];

      // if we're on the client view, splice out the 'remove' button
      // from the HTML array
      if (this.view === 'client') { html.splice(4, 1); }

      // Write the HTML (joining the array)
      $(this.el).append($(html.join('')));

      return this;
    }

  });

});
