/*
 * Dependancies
 */

var fs = require('fs')
  , express = require('express')
  , config = require('./config')
  , colors = require('colors').setTheme(config.colorTheme)
  , versionator = require('versionator')
  , core = require('./lib/core/core')
  , http = require('http')
  , path = require('path')
  , ticker = require('./lib/ticker')
  ;

/*
 * Variables
 */

var app, ticker;

/*
 * Blank the console
 */

core.clear();
console.log((config.name + ' v' + config.version).appName);

/*
 * Configure express
 */

app = express();
app.VERSION = '0.1';
app.ROOT = __dirname;
app.configure(function () {
  
  basic = versionator.createBasic('v' + app.VERSION);
  app.locals({ versionPath: basic.versionPath });
  
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view options', { layout: false });
  app.set('view engine', 'jade');
  app.use(express.favicon('public/favicon.ico'));
  app.use(require('less-middleware')({
    compress:true,
    debug: false,
   // force: true,
    once: true,
    prefix: '/stylesheets',
    src: __dirname + '/less',
    dest: __dirname + '/public/stylesheets/'
  }));
  
  app.use(app.router);
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, "public"), { maxAge: 360000 }));

});

app.configure('development', function () {
  app.use(express.errorHandler());
});

/*
 * Get the ticker data
 */

app.feeds = require('./data/feeds').fetch();

/*
 * Describe the site routes, passing app as a parameter.
 * The last 'route' is middleware to catch 404s.
 */

app.get(/^(\/|\/home)$/, require('./routes/index')(app));
app.use(require('./routes/fourohfour')(app));
console.log('Routes loaded.'.green);

/*
 * Run the ticker emitter, and start the server.
 */

app.ticker = ticker({ feeds: app.feeds, port: 8081 });
app.ticker(function () {
  console.log('Ticker emitter waiting for client.'.green);
});

http.createServer(app).listen(app.get('port'), function(){
  console.log(('Express server listening on port ' + app.get('port')).server);
});