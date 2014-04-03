// ----- server -----
var server = require('./js/server');
/*TO FIX: make it able to start in different ports*/
/*serv.setServerPort(process.argv[2]);*/
var httpserver = server.httpserver;

// ----- hardware -----
var hardware = require('./js/hardware');



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

		hardware.moveServo(	eulerAngles[0]+90,
							eulerAngles[1]+90,
							90-eulerAngles[2]);
	});
});

/*

*/