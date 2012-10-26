var dbox  = require("dbox")
var app   = dbox.app({ "app_key": "drn3vtowps2zhux", "app_secret": "o48soo8b4kohz08" })

/*app.requesttoken(function(status, request_token){
  console.log(request_token)
})*/

rt = { oauth_token_secret: 'pm5bqwtal16b132',
  oauth_token: 'xip95bd2tmx9ik9',
  authorize_url: 'https://www.dropbox.com/1/oauth/authorize?oauth_token=xip95bd2tmx9ik9' }

app.accesstoken(rt, function(status, access_token){
  console.log(access_token)
})

