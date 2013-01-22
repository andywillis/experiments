$(document).ready(function () {

  // Declare the various variables in use throughout the code
  var $win = $(window), $outer = $('#outer'), $clock = $('#clock'), $display = $('#display'), $time = $('.time')
    , go, clockType = 'timer'
    , hour = 0 , mins = 0, secs = 0, now
    , prevhour, hoursplit, prevhoursplit, prevmins, minsplit, prevminsplit
    , prevsecs, secsplit, prevsecsplit

  // Hide the clock, bind our resize function to the window to run if there are any changes.
  $outer.animate({opacity: 0.0}, 0);
  $win.bind('resize', toCenter);

  // Position the absolute digit divs 78 pixels apart, and reset the vars.
  $time.each(function(d) { $(this).css({left: d * 78 + 'px'}) })
  reset()

  // Resposition the clock in the window and fade it in.
  toCenter(function(){
    $outer.animate({opacity: 1.0}, 500);
  });

  // CLick the start button
  $('#start').live('click', function () {
    go = setInterval(function(){ processTime(00,00,00) }, 1000)
    $(this).html('Stop').attr({'id': 'stop'})
  })

  // CLick the stop button
  $('#stop').live('click', function () {
    clearInterval(go)
    $(this).html('Start').attr({'id': 'start'})
  })

  // CLick the reset button
  $('#reset').live('click', function () {
    reset()
    processTime(11,11,11, true)
  })

  // CLick the current time button
  $('#current').live('click', function() {
    if ($(this).hasClass('currentOn')) {
      clockType = 'timer'
      $(this).removeClass('currentOn')
      processTime(00,00,00);
    } else {
      $(this).addClass('currentOn')
      clockType = 'clock'
      processTime(00,00,00);
    }
  })

  // Reset vars
  function reset() {
    hour = 0 , mins = 0, secs = 0, shour = 0, smins = 0, ssecs = 0
  }

  // Reposition the display
  function toCenter(callback) {
    var el = $outer, top = ($win.height() - el.height())/2.5, left = ($win.width() - $display.width())/2.5;
    el.animate({marginTop: top, marginLeft: left}, 500);
    setTimeout(callback, 100)
  };

  function updateTime(slide, digit) {
    var step = 135;
    if (digit != 0) {
      $(slide).animate({
        marginBottom: '-' + parseInt((digit * step), 10) + 'px'
      }, 250, 'linear');
    }
    if (digit == 0) {
      var getmargin = parseInt(($(slide).css('margin-bottom')), 10);
      $(slide).animate({
        marginBottom: parseInt((getmargin - step), 10) + 'px'
      }, 250, 'linear', function () {
        $(this).css("margin-bottom","0px")
      })
    };
  };

  function processTime(prevhour, prevmins, prevsecs, reset) {

    if (clockType === 'clock') {
      now = new Date(), hour = now.getHours(), mins = now.getMinutes(), secs = now.getSeconds()
    } else {
      if (!reset) secs++
      if (secs === 60) { secs = 0; mins++ }
      if (mins === 60) { mins = 0; hours++ }
    }

    // Stringify the digits in order to add prefixing zeros where require
    shour = (hour < 10) ? "0" + hour : hour + ""
    smins = (mins < 10) ? "0" + mins : mins + ""
    ssecs = (secs < 10) ? "0" + secs : secs + ""

    // Update the hour if it's changed
    if (prevhour != shour) {
      prevhour = prevhour + ""
      hoursplit = shour.split("");
      prevhoursplit = prevhour.split("");
      if (prevhoursplit[0] !== hoursplit[0]) updateTime('#hourl', hoursplit[0]);
      if (prevhoursplit[1] !== hoursplit[1]) updateTime('#hourr', hoursplit[1]);
    };

    // Update the minutes if they've changed
    if(prevmins != smins) {
      prevmins = prevmins + ""
      minsplit = smins.split("");
      prevminsplit = prevmins.split("");
      if (prevminsplit[0] != minsplit[0]) updateTime('#minl', minsplit[0]);
      if (prevminsplit[1] != minsplit[1]) updateTime('#minr', minsplit[1]);
    };

    // Update the seconds if they've changed
    if(prevsecs != ssecs) {
      prevsecs = prevsecs + ""
      secsplit = ssecs.split("");
      prevsecsplit = prevsecs.split("");
      if (prevsecsplit[0] != secsplit[0]) updateTime('#secl', secsplit[0]);
      if (prevsecsplit[1] != secsplit[1]) updateTime('#secr', secsplit[1]);
    };

  };

});