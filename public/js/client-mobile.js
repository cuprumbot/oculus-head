RADTODEG	= 180 / 3.1415926563;
WIDTH 		= 640;
HEIGHT 		= 400;

var	receivedFPS	= 0,
	renderedFPS = 0,
	initTime	= Date.now();

var socket;

function log (msg) {
	document.getElementById('log').innerHTML = msg + "<br/>" + document.getElementById('log').innerHTML;
	//console.log("MSG >>> " + msg);
};

function write (msg) {
	document.getElementById('log').innerHTML = msg;
	//console.log("MSG >>> " + msg);
}

(function (document) {
	document.addEventListener('DOMContentLoaded', function () {    

		socket = io.connect();
		socket.emit('test', { data:"test" });

		// TO DO: make address selection dynamic
		//var client = new BinaryClient('ws://192.168.1.4:9000');
		//var client = new BinaryClient('ws://0.0.0.0:9000');
		//var client = new BinaryClient('ws://localhost:9000');
		//var client = new BinaryClient({port:9000});

		var hn = "ws://" + location.hostname + ":9000";
		console.log(hn);
		var client = new BinaryClient(hn);

		// canvas
		var	camerasElement 	= document.getElementById('cameras'),
			camerasContext 	= camerasElement.getContext('2d'),
			imageFrame 		= camerasContext.getImageData(0, 0, WIDTH, HEIGHT);
		
		var stream;

		var working = false;

		client.on('open', function() {   

			stream = client.createStream("client");
			
			stream.on('data', function(data){
				receivedFPS++;

				if (!working) {

					working = true;

					var dataArr = new Uint8Array(data);

					for (oPos = 0, nPos = 0; oPos < dataArr.length; oPos++, nPos++) {
						imageFrame.data[nPos] = dataArr[oPos];

						if ((oPos % 3) == 2) {
							nPos++;
							imageFrame.data[nPos] |= 255;
						}
					}

					camerasContext.putImageData(imageFrame, 0, 0);
					renderedFPS++;									

					working = false;
				}

				if (Date.now() > initTime + 1020) {
					//write("rec: " + receivedFPS + " ren: " + renderedFPS);
					receivedFPS = 0;
					renderedFPS = 0;
					initTime = Date.now();
				}

			}); // stream.on
		}); // client.on

	}); // DOM content loaded
})(document);