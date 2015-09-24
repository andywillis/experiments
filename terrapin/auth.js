var http = require('http');
var express = require('express');
var api = require('instagram-node').instagram();
var app = express();

app.set('port', (process.env.PORT || 5000));

api.use({
  client_id: 'cd6e44cfc6e644a6b02447eb16085a69',
  client_secret: 'aa2eefbdbf574273879bdf3b3ee209cd'
});

var redirect_uri = 'http://terrapin.herokuapp.com/handleauth';

exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log(err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send('You made it!!'  + result.access_token);
    }
  });
};

// This is where you would initially send users to authorize
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI
app.get('/handleauth', exports.handleauth);

app.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});