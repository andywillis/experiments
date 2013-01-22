$(document).ready(function () {

  /*
   * Module that takes the list of feeds
   * applies a template to each one,
   * caches each feed's DOM elements
   * and listens to data coming through the socket,
   * updaing each feed with the correct information.
   */

  (function () {

    var
        // jQuery shortcuts
        $document = $(document)
      , $content = $('#content')
      , $loader = $('div#loader')
      , $spark = $('div#sparkSwitch')
      , spark = false

      // Feed information stored in a script tag in index.jade
      , $feedsInfo = JSON.parse($('#feedsInfo').html())

      // Template
      , feedTemplate = _.template($('#feedTemplate').html())

      // Other
      , slice = Array.prototype.slice
      , pipe1, data, feed, len, check, pre, now, fname, level
      , min, max, diff, change, perchange, toggle
      , ws, feeds = {}, dom = {}
      ;

    function buildList(feedList) {

      // Use core utils for efficiency
      var group = core.create({ el: 'ul', id: 'feeds'})
        , frag = core.create({ type: 'frag' })
        , br = core.create({type: 'el', el: 'br'});

      feedList.forEach(function(obj, i) {
        // Create a new feed object in the collection,
        feeds[obj.name] = {};
        feeds[obj.name].name = obj.name;
        feeds[obj.name].initial = 0;
        feeds[obj.name].sixtyInitial = 0;
        feeds[obj.name].history = [0];
        feeds[obj.name].spark = [0];
        // Create a new feed element from the template.
        frame = core.create({ el: 'li', id: obj.name, cls: 'feed frame clearfix' });
        frame.innerHTML = feedTemplate({obj: obj});
        frag.appendChild(frame);
        frag.appendChild(br);
        group.appendChild(frag);
      });
      return group;
    }

    function getElements(feedList) {
      feedList.forEach(function(obj, i) {
        fname = obj.name;
        // Grab the elements from the DOM to try and be as efficient as possible.
        dom[fname] = {};
        $this = $('#' + fname);
        dom[fname].up = $this.children('.up');
        dom[fname].down = $this.children('.down');
        dom[fname].price = $this.children('.feedPrice');
        dom[fname].range = $this.children('.range');
        dom[fname].change = $this.children('.change');
        dom[fname].perchange = $this.children('.perchange');
        dom[fname].spark = $this.children('.spark');
      });
      return dom;
    }

    // Grab the feed information and add it to the content.
    group = buildList($feedsInfo);
    $content.empty().append(group);
    if (!spark) $('div.spark').hide();
    $spark.click(function() {
      if (spark) { $('div.spark').hide(); toggle = 'on'; } else { $('div.spark').show(); toggle = 'off'; }
      $(this).html('Toggle sparklines: ' + toggle);
      spark = !spark;
    });

    // Cache the DOM elements so we're not constantly picking them up.
    dom = getElements($feedsInfo);

    // Reset the price floor every sixty seconds.
    setInterval(function () {
        for (var f in feeds) {
          feed = feeds[f];
          feed.sixtyInitial = feed.history[feed.history.length-1];
          feed.spark = [0];
          dom[feed.name].spark.html('');
        }
      }, 1000 * 60);

    // Set up the web socket.
    ws = $.WebSocket("ws://127.0.0.1:8081/");
    ws.onerror = function(err) { console.log(err); };
    ws.onopen = function () {
      pipe1 = ws.registerPipe('/', null, {
        onopen: function() { console.log('Connected'); },
        onerror: function(e) { console.log(e); },
        onclose: function() { console.log('Connection closed.'); },
        onmessage: function(m) {

          // Grab the data
          data = JSON.parse(m.data);
          fname = data.name;
          feed = feeds[fname];
          level = data.level;
          feed.history.push(level);
          len = feed.history.length;
          max = Math.max.apply(null, feed.history.slice(1));
          min = Math.min.apply(null, feed.history.slice(1));
          pre = feed.history[len-2], now = feed.history[len-1];

          // Set the initial prices.
          if (feed.initial === 0) {
            feed.initial = level;
            feed.sixtyInitial = feed.initial;
          }

          // Change and percentage change
          diff = now - feed.initial;
          feed.spark.push(diff);
          sixtyDiff = now - feed.sixtyInitial;
          change = Math.floor(diff * 100) / 100;
          change = (change > 0) ? '+' + change : change;
          perchange = Math.floor((((now - feed.initial)/feed.initial) * 100) *100) / 100;
          sixtyChange = Math.floor(sixtyDiff * 100) / 100;
          sixtyChange = (sixtyChange > 0) ? '+' + sixtyChange : sixtyChange;
          sixtyPerchange = Math.floor((((now - feed.sixtyInitial)/feed.sixtyInitial) * 100) *100) / 100;

          // Update the DOM
          if (now > pre) check = 'up';
          if (now < pre) check = 'down';
          if (now === pre) check = 'equal';

          if (check === 'up') {
            dom[fname].up.addClass('green').removeClass('neutral');
            dom[fname].down.addClass('neutral').removeClass('red');
          }

          if (check === 'down') {
            dom[fname].up.addClass('neutral').removeClass('green');
            dom[fname].down.addClass('red').removeClass('neutral');
          }

          if (check === 'equal') {
            dom[fname].up.addClass('neutral').removeClass('green');
            dom[fname].down.addClass('neutral').removeClass('red');
          }

          dom[fname].price.html(level);
          dom[fname].change.html('<div class="icon"><a title="Baseline: ' + feed.initial +'">BL</a></div>' + feed.initial + ': ' + change + ' (' + perchange + '%)');
          dom[fname].perchange.html('<div class="icon"><a title="60 second baseline: ' + feed.sixtyInitial +'">60</a></div>' + feed.sixtyInitial + ': ' + sixtyChange + ' (' + sixtyPerchange + '%)');
          dom[fname].range.html('<div class="icon"><a title="Price floor">&#x25BC;</a></div>' + min + '<div class="icon"><a title="Price ceiling">&#x25B2;</a></div>' + max);
          if (spark) dom[fname].spark.sparkline(feed.spark, { type: 'bar', posBarColor: 'green', negBarColor: 'red', barWidth: '3px', barSpacing: '1px' });

        }

      });

    };

  }());

});