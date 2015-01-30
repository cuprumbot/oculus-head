// browser support
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || oGetUserMedia;
window.requestAnimationFrame = requestAnimationFrame;

var getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
navigator.getUserMedia = getUserMedia;

//video and canvas
var video1, video2, canvas, canvasContext;

//size constants
var	CANV_WIDTH 	= 1280,
	CANV_HEIGHT = 800,
	CAM_WIDTH 	= 800,
	CAM_HEIGHT 	= 640,
	BPIXEL 		= 3;
var TRANS_VID1_X 	= (CANV_WIDTH/2 - CAM_HEIGHT)/2,
	TRANS_VID1_Y 	= CAM_WIDTH + (CANV_HEIGHT - CAM_WIDTH)/2,
	TRANS_VID2_X 	= CANV_WIDTH/2 + CAM_HEIGHT + (CANV_WIDTH/2 - CAM_HEIGHT)/2,
	TRANS_VID2_Y 	= (CANV_HEIGHT - CAM_WIDTH)/2;

//socket
var socket,
	stream,
	settings = {           
		socketSrv: 'ws://localhost:9000'
	};	// check this

function successCallback1 (stream) {
	log("Camera 1 is ready");
	video1.src = window.URL.createObjectURL(stream);
	video1.play();
	log("Video 1 is ready");

	navigator.getUserMedia({video:true}, successCallback2, errorCallback);
}

function successCallback2 (stream) {
	log("Camera 1 is ready");
	video2.src = window.URL.createObjectURL(stream);
	video2.play();
	log("Video 1 is ready");
}

function errorCallback (stream) {
	log("Error reading from cameras");
}

function log(msg) {
	document.getElementById('log').innerHTML = msg + "<br/>" + document.getElementById('log').innerHTML;
	//console.log("MSG >>> " + msg);
};

function draw (ctx, img, xt, yt, w, h, r, img2, xt2, yt2, w2, h2, r2) {
	var stringData;

	ctx.translate(xt, yt);
	ctx.rotate(r);
	try {
		ctx.drawImage(img, 0, 0, w, h);
	} catch (e) {}
	
	//undo changes
	ctx.rotate(2*Math.PI - r);
	ctx.translate(-xt, -yt);

	ctx.translate(xt2, yt2);
	ctx.rotate(r2);
	try {
		ctx.drawImage(img2, 0, 0, w2, h2); 
	} catch (e) {}
	
	//undo changes
	ctx.rotate(2*Math.PI - r2);
	ctx.translate(-xt2, -yt2);

	/*
	var toSend = ctx.getImageData(0,0,CANV_WIDTH,CANV_HEIGHT),
		cArray = new Uint8ClampedArray(CANV_WIDTH*CANV_HEIGHT*BPIXEL);

	for (oPos = 0, nPos = 0; oPos < toSend.data.length; oPos++, nPos++) {
		cArray[nPos] = toSend.data[oPos];

		if ((oPos % 4) == 2) {
			oPos++;
		}
	}
	
	if (typeof stream !== 'undefined') {
		stream.write(cArray);
	}
	*/

	setTimeout(	function() { draw(ctx, img, xt, yt, w, h, r, img2, xt2, yt2, w2, h2, r2); }, 1000/fps );
};

$( function init () {
	video1 = document.getElementById('videoId1');
	video2 = document.getElementById('videoId2');
	canvas = document.getElementById('canvasId');
	canvasContext = canvas.getContext('2d');
	
	navigator.getUserMedia({video:true}, successCallback1, errorCallback);

	/*
	log("Creating BinaryClient...");
	var client = new BinaryClient(settings.socketSrv);
	client.on('open', function () {
		stream = client.createStream('camera');
	});
	log("BinaryClient created!");
	*/

	log("Attempting first draw...");
	//draw(canvasContext, video1, TRANS_VID1_X, TRANS_VID1_Y, CAM_WIDTH, CAM_HEIGHT, Math.PI*3/2, video2, TRANS_VID2_X, TRANS_VID2_Y, CAM_WIDTH, CAM_HEIGHT, Math.PI*1/2);
	draw(canvasContext, video1, TRANS_VID1_X, TRANS_VID1_Y, CAM_WIDTH, CAM_HEIGHT, Math.PI*3/2, video2, TRANS_VID1_X+(CANV_WIDTH/2), TRANS_VID1_Y+30, CAM_WIDTH, CAM_HEIGHT, Math.PI*3/2);
} );