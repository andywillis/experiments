var WebSocketServer = require('ws').Server;

exports = module.exports = ticker;

function ticker(options) {

  var port = options.port
    , feeds = options.feeds
    , wss = new WebSocketServer({port: port}), WebSocket, interval = {}
    ;

  return function ticker(callback) {

    function clearTimer() { for (var i  in interval) { clearTimeout(interval[i]); } interval = {}; }

    function emitPrice(id, name, currentLevel, currency) {
      var change = getRandomInteger(-1000, 1000) / 100
        , newLevel = parseFloat(currentLevel + change)
        , level = newLevel.toFixed(2)
        , json, wait
        ;

      var message = {
        'level': level,
        'id': id,
        'name' : name,
        'currency': 'GBP',
        'timestamp': new Date().getTime()
      };

      json = JSON.stringify(message);

      try {
        WebSocket.send(json);
        wait = getRandomInteger(200, 2000);
          interval[name] = setTimeout(function() {
            emitPrice(id, name, newLevel);
          }, wait);
      } catch(e) {
        console.log(e);
      }

    }

    function getRandomInteger (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    wss.on('connection', function (ws) {
      clearTimer();
      console.log('Client connected - sending data.'.green);
      WebSocket = ws;
      for (var i in feeds) {
        emitPrice(parseInt(i, 10) + 1, feeds[i]['name'], getRandomInteger(100, 600));
      }
      ws.on('close', function () {
        clearTimer();
        console.log('Client disconnected.'.green);
      });
      ws.on('error', function (err) {
        clearTimer();
        console.log(err);
      });
    });
    callback();
  };

}