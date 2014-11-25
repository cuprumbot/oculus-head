//import modules
var http = require("http"),
	url = require("url"),
	path = require("path"),
	fs = require("fs"),
	port = 80;

//change port
var setServerPort = function (p) {
	port = p;
}

//create server
var httpserver = http.createServer(function(request, response) {
	//path
	var uri = url.parse(request.url).pathname,
		filename = path.join(process.cwd(), uri);

	//let it serve html, css and js
	var contentTypesByExtension = {
		'.html': "text/html",
		'.css':  "text/css",
		'.js':   "text/javascript"
	};

	fs.exists(filename, function(exists) {
		//serve 404 if file doesn't exist
		if(!exists) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		if (fs.statSync(filename).isDirectory()) filename += '/index.html';

		fs.readFile(filename, "binary", function(err, file) {
			//serve 500 in case of error
			if(err) {        
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
			}

			//serve file
			var headers = {};
			var contentType = contentTypesByExtension[path.extname(filename)];
			if (contentType) headers["Content-Type"] = contentType;
			response.writeHead(200, headers);
			response.write(file, "binary");
			response.end();
		}); //fs.readFile() end
	}); //fs.exists() end
}) //http.createServer end
.listen(parseInt(port, 10));
console.log("Static file server running at\n\t=> http://localhost:" + port + "/\nCTRL + C to shutdown");

//export functions
module.exports.setServerPort = setServerPort;

//export values
module.exports.httpserver = httpserver;