RADTODEG	= 180 / 3.1415926563;
WIDTH 		= 640;
HEIGHT 		= 400;

var	receivedFPS	= 0,
	renderedFPS = 0,
	initTime	= Date.now();

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

		var socket = io.connect();
		socket.emit('test', { data:"test" });

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
					write("rec: " + receivedFPS + " ren: " + renderedFPS);
					receivedFPS = 0;
					renderedFPS = 0;
					initTime = Date.now();
				}

			}); // stream.on
		}); // client.on

		vr.load(function(error) {

			if (error) {
				window.alert('VR error:\n' + error.toString);
			} else {
				window.alert('VR OK!');
			}

			var state = new vr.State();

			function tick() {
				vr.requestAnimationFrame(tick);
				if (!vr.pollState(state)) return;

				if (state.hmd.present) {
					var hmdInfo = vr.getHmdInfo();

					//quaternion
					var quat = new THREE.Quaternion();
					quat.fromArray(state.hmd.rotation);
					//euler
					var euler = new THREE.Euler();
					euler.setFromQuaternion(quat, 'YZX');
					var eulerDeg = euler.toArray();
					eulerDeg[0] *= RADTODEG;
					eulerDeg[1] *= RADTODEG;
					eulerDeg[2] *= RADTODEG;
					eulerDeg[3] = 1;

					socket.emit('angles', { eulerAngles:eulerDeg });
				}; // state.hmd.present
			} // tick

			vr.requestAnimationFrame(tick);
		}); // vr.load

	}); // DOM content loaded
})(document);