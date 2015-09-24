'use strict';

require.config({
  paths: {
    jquery: 'lib/jquery',
    lodash: 'lib/lodash',
    backbone: 'lib/backbone'
  },
  shim: {
    'jquery': {
      exports: 'jquery'
    },
    'lodash': {
      exports: 'lodash'
    },
    'backbone': {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    }
  }
});

require([
  'backbone',
  'ns',
  'app'
], function (Backbone, NS, App) {

  new App(NS);

});
