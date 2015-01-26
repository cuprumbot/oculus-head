//import modules
var http 	= require("http"),
	url		= require("url"),
	path 	= require("path"),
	fs 		= require("fs");

var	port 	= 8080;

var WIDTH	= 640,
	HEIGHT 	= 480,
	BPIXEL 	= 3;	//bytes per pixel, 3: ignore alpha channel

var	BS 				= require('binaryjs').BinaryServer,
	binaryServer 	= BS({port: 9000, chunkSize : WIDTH * HEIGHT * BPIXEL});

var arduino,
	spark,
	usingArduino	= false,
	usingSpark		= false;
if (process.argv[2] == "-arduino") {
	arduino = require('./lib/arduino');
	usingArduino = true;
	console.log("Arduino enabled");
} else if (process.argv[2] == "-spark") {
	spark = require ('./lib/spark');
	usingSpark = true;
	console.log("Spark enabled");
} else {
	console.log("Hardware disabled");
}

// Web server
var httpserver = http.createServer(function(request, response) {
	// path
	var uri 	= url.parse(request.url).pathname,
		fname 	= path.join(process.cwd(), uri);

	// types
	var contentTypesByExtension = {
		".html"	: "text/html",
		".css"	: "text/css",
		".js"	: "text/javascript"
  	};

  	// check existance
	fs.exists(fname, function(exists) {
		
		// serve 404 if file doesn't exist
		if(!exists) {
			response.writeHead(404, {"Content-Type": "text/plain"});
			response.write("404 Not Found\n");
			response.end();
			return;
		}

		// get file
		fs.readFile(fname, "binary", function(err, file) {
	  		
	  		// serve 500 in case of error
	  		if(err) {        
				response.writeHead(500, {"Content-Type": "text/plain"});
				response.write(err + "\n");
				response.end();
				return;
	  		}

			// serve file
			var headers = {};
			var contentType = contentTypesByExtension[path.extname(fname)];
			if (contentType) headers["Content-Type"] = contentType;
			response.writeHead(200, headers);
			response.write(file, "binary");
			response.end();
		
		}); // fs.readFile
	}); // fs.exists
}); // http.createServer

httpserver.listen(port);
console.log("File server running\n\t=> http://localhost:" + port);

// BinaryJS server
var w,
	r;

binaryServer.on('connection', function(client) {

	client.on('stream', function(stream, meta) {   
		console.log("type: " + meta);  
		
		if (meta === "camera") {
			w = stream;
		} else if (typeof w !== "undefined") {
			w.pipe(stream);
			console.log("sending");
		}
	});
});

// Socket.IO server
var io = require('socket.io').listen(httpserver);

io.sockets.on('connection', function (socket) {
	socket.on('angles', function (oculusData) {

		var eulerAngles = new Array();

		eulerAngles[0] = oculusData.eulerAngles[0];
		eulerAngles[1] = oculusData.eulerAngles[1];
		eulerAngles[2] = oculusData.eulerAngles[2];
		eulerAngles[3] = oculusData.eulerAngles[3];

		
		console.log("Euler Angles\t"
				+ eulerAngles[0].toFixed(1) + "\t"
				+ eulerAngles[1].toFixed(1) + "\t"
				+ eulerAngles[2].toFixed(1));
		
		
		if (usingArduino) {
			arduino.moveServo( eulerAngles[0]+90, 90-eulerAngles[1], 90-eulerAngles[2], eulerAngles[3] );
		}

		if (usingSpark) {
			spark.moveServo( eulerAngles[0]+90, 90-eulerAngles[1], 90-eulerAngles[2], eulerAngles[3] );
		}
	}); // socket.on

	socket.on("test", function (socket) {
		console.log("Socket.IO connected!");
	});
}); // io.sockets.on