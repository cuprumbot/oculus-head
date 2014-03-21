// ----- hardware control -----
var five = require("johnny-five");
/*var board = new five.Board();*/
var servox, servoy, servoz;
var hardware = false;

// ----- euler angles -----
var euler = require("./js/euler");

// ----- server -----
var serv = require('./js/server')
/*TO FIX: make it able to start in different ports*/
/*serv.setServerPort(process.argv[2]);*/
var httpserver = serv.httpserver;

// ----- websocket -----
var io = require('socket.io').listen(httpserver);

//websocket listener
io.sockets.on('connection', function (socket) {
	//listen for a quaternion
	socket.on('quaternion', function (oculusData) {
		euler.getEulerFromQuat(oculusData);
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