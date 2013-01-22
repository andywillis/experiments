$(document).ready(function () {

  // Prevent global var-space pollution
  (function () {

    // Declare the various variables in use throughout the code, and grab the most used selectors for effeciency
    var $win = $(window), $outer = $('#outer'), $clock = $('#clock'), $display = $('#display'), $time = $('.time')
      , go, clockType = 'timer'
      , hour = 0 , mins = 0, secs = 0, now
      , prevHour, hourArr, prevHourArr, prevMins, minArr, prevMinArr
      , prevSecs, secsArr, prevSecsArr
      , step = 135;

    // Hide the clock, bind our resize function to the window to run if there are any changes.
    $outer.animate({opacity: 0.0}, 0);
    $win.bind('resize', toCenter);

    // Position the absolute digit divs 78 pixels apart.
    $time.each(function(d) { $(this).css({left: d * 78 + 'px'}) })

    // Resposition the clock in the window and fade it in.
    toCenter(function(){
      $outer.animate({opacity: 1.0}, 500);
    });

    // Click the start button - uses an setInterval rather than a setTimeout for clarity.
    // Use anonymous function to allow parameters to be passed to the setInterval
    $('#start').live('click', function () {
      go = setInterval(function(){ processTime(00, 00, 00) }, 1000)
      $(this).html('Stop').attr({'id': 'stop'})
    })

    // Click the stop button - clear the setInterval
    $('#stop').live('click', function () {
      clearInterval(go)
      $(this).html('Start').attr({'id': 'start'})
    })

    // Click the reset button, reset the vars.
    // True is a parameter passed to processTime
    // to let it know to not increment the secs var on the first pass
    $('#reset').live('click', function () {
      reset()
      processTime(11, 11, 11, true)
    })

    // CLick the current time button.
    // This toggles the display from 'timer' to 'clock'
    $('#current').live('click', function() {
      if ($(this).hasClass('currentOn')) {
        clockType = 'timer'
        $(this).removeClass('currentOn')
        processTime(00, 00, 00);
      } else {
        $(this).addClass('currentOn')
        clockType = 'clock'
        processTime(00, 00, 00);
      }
    })

    /*
     * MAIN FUNCTIONS
     */

    // Reset vars
    function reset() { hour = 0 , mins = 0, secs = 0, shour = 0, smins = 0, ssecs = 0 }

    // Reposition the display
    function toCenter(callback) {
      var el = $outer, top = ($win.height() - el.height())/2.5, left = ($win.width() - $display.width())/2.5;
      el.animate({marginTop: top, marginLeft: left}, 500);
      setTimeout(callback, 100)
    };

    // Resposition the digit div with the appropriate number
    function updateTime(slide, digit) {

      // Move the div down one step
      if (digit != 0) {
        $(slide).animate({
          marginBottom: '-' + parseInt((digit * step), 10) + 'px'
        }, 250, 'linear');
      }

      // Reset the div back to it's original position
      if (digit == 0) {
        var getmargin = parseInt(($(slide).css('margin-bottom')), 10);
        $(slide).animate({
          marginBottom: parseInt((getmargin - step), 10) + 'px'
        }, 250, 'linear', function () {
          $(this).css('margin-bottom', '0px')
        })
      };
    };

    // Determine the correct display based on the previous time and current time
    // then call updateTime to alter the display
    function processTime(prevHour, prevMins, prevSecs, reset) {

      // Determine the display type and calculate the time
      if (clockType === 'clock') {
        now = new Date(), hour = now.getHours(), mins = now.getMinutes(), secs = now.getSeconds()
      } else {
        if (!reset) secs++
        if (secs === 60) { secs = 0; mins++ }
        if (mins === 60) { mins = 0; hours++ }
      }

      // Stringify the digits in order to add prefixing zeros where require
      shour = (hour < 10) ? '0' + hour : hour + ''
      smins = (mins < 10) ? '0' + mins : mins + ''
      ssecs = (secs < 10) ? '0' + secs : secs + ''

      // Update the hour if it's changed
      if (prevHour != shour) {
        prevHour = prevHour + ''
        hourArr = shour.split('');
        prevHourArr = prevHour.split('');
        if (prevHourArr[0] !== hourArr[0]) updateTime('#hourl', hourArr[0]);
        if (prevHourArr[1] !== hourArr[1]) updateTime('#hourr', hourArr[1]);
      };

      // Update the minutes if they've changed
      if (prevMins != smins) {
        prevMins = prevMins + ''
        minArr = smins.split('');
        prevMinArr = prevMins.split('');
        if (prevMinArr[0] != minArr[0]) updateTime('#minl', minArr[0]);
        if (prevMinArr[1] != minArr[1]) updateTime('#minr', minArr[1]);
      };

      // Update the seconds if they've changed
      if (prevSecs != ssecs) {
        prevSecs = prevSecs + ''
        secsArr = ssecs.split('');
        prevSecsArr = prevSecs.split('');
        if (prevSecsArr[0] != secsArr[0]) updateTime('#secl', secsArr[0]);
        if (prevSecsArr[1] != secsArr[1]) updateTime('#secr', secsArr[1]);
      };

    };

  }())

});