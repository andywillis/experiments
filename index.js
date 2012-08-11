var http = require('http')
	,	fs = require('fs')
	,	port = 80

var onRequest = function(req,res) {
		var filename = './prom.ogg'
		,	stat = fs.statSync(filename)

	console.log(stat);

	header = {
		"Pragma": "public",
		"Last-Modified": stat.mtime.toUTCString(),
		"Content-Transfer-Encoding": "binary",
		"Content-Length": stat.size,
		"Cache-Control": "public",
		"Connection": "keep-alive",
		"Content-Type": "video/ogg",
		"Content-Disposition": "inline; filename=" + filename + ";"
	};

	res.writeHead(200, header)
	var s = fs.createReadStream(filename, {flags: 'r', start: 0, end: stat.size-1})
	s.pipe(res)
}

var server = http.createServer(onRequest).listen(port)

console.log('Server:', port);