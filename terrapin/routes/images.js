// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

function images(app) {

  return {

    index: function (request, response) {
      response.send(app.gallery.getJSON());
    },

    add: function (request, response) {
      app.gallery.add(request.body);
      app.gallery.save(app, request, response);
    },

    delete: function (request, response) {
      console.log('model destroyed:', request.params.id);
      app.gallery.delete(request.params.id);
      app.gallery.save(app, request, response);
    }

  };

}

exports = module.exports = images;
