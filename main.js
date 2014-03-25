// ----- hardware control -----
var five = require("johnny-five");
/*var board = new five.Board();*/
var servox, servoy, servoz;
var hardware = false;



// ----- server -----
var serv = require('./js/server')
/*TO FIX: make it able to start in different ports*/
/*serv.setServerPort(process.argv[2]);*/
var httpserver = serv.httpserver;



// ----- websocket -----
var io = require('socket.io').listen(httpserver);

//websocket listener
io.sockets.on('connection', function (socket) {
  	//listen for euler angles
	socket.on('eulerAngles', function (oculusData) {
		var eulerAngles = new Array();

		eulerAngles[0] = oculusData.eulerAngles[0];
		eulerAngles[1] = oculusData.eulerAngles[1];
		eulerAngles[2] = oculusData.eulerAngles[2];

		console.log("Euler Angles\t"
						+ eulerAngles[0].toFixed(1) + "\t"
						+ eulerAngles[1].toFixed(1) + "\t"
						+ eulerAngles[2].toFixed(1));
	});
});

//ready servos when board is created
/*
board.on("ready", function () {
	servox = new five.Servo(12);
	servoy = new five.Servo(10);
	servoz = new five.Servo(13);

	hardware = true;
});
*/