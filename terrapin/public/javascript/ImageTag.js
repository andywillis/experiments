/**
 * This is the module entry point. It returns an object containing some menu parameters
 * as well as the function that mounts the module to the app (via the router). The application
 * is passed as a parameter to the router.
 */
'use strict';

define('ImageTag', [
  'ImageTag.Router'
], function (Router) {

  return {

    MenuItems: {

      // relates to list item wih data-id="settings"
      parent: 'settings',

      // the html data-id of the new element - data-id="artistslist"
      id: 'imagetag',

      // label
      name: 'Image Tag Viewer',

      // the hash name
      url: 'imagetag',

      // position in the menu
      index: 0

    },

    mountToApp: function (application) {
      return new Router(application);
    }

  };

});
