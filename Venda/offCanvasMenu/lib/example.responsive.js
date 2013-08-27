/*global console, $, google, util, jQuery, FastClick: true */
/*jslint browser: true */
/*jslint white: true */
/*jslint bitwise: true */
/*jslint plusplus: true */
(function() {
  "use strict";

  $(function() {

    var menu, menu2, menuOn, menu2On;

    menuOn = false;
    menu2On = false;

    menu = $.offCanvasMenu({
      direction: 'right',
      coverage: '70%',
      menu: "#menu",
      trigger: "#menu-trigger"
    });

    menu2 = $.offCanvasMenu({
      direction: 'left',
      coverage: '70%',
      menu: "#menu2",
      trigger: "#menu-trigger2"
    });

    $('#menu-trigger').click(function(e) {
      e.preventDefault();
      if (!menuOn) {
        if (menu2On) {
          menu2.off(function() {
            menu.on();
            menuOn = !menuOn;
            menu2On = !menu2On;
          });
        } else {
          menu.on();
          menuOn = !menuOn;
        }
      }
      menu.toggle();
    });

    $('#menu-trigger2').click(function(e) {
      e.preventDefault();
      if (!menu2On) {
        if (menuOn) {
          menu.off(function(){
            menu2.on();
            menuOn = !menuOn;
            menu2On = !menu2On;
          });
        } else {
          menu2.on();
          menu2On = !menu2On;
        }
      }
      menu2.toggle();
    });

  });

}());