//johnny-five
var five = require("johnny-five");
var board = new five.Board();
var servoRoll, servoPitch, servoYaw;
var hardware = false;

//ready servos when board is created
board.on("ready", function () {
	servoRoll = new five.Servo(10);
	servoPitch = new five.Servo(11);
	servoYaw = new five.Servo(12);

	hardware = true;
	console.log("Hardware is ready!");
});

var enableHardware = function () {
	hardware = true;
}

var disableHardware = function () {
	hardware = false;
}

//move servos
var moveServo = function (pitch, yaw, roll) {
	if (hardware) {
		servoRoll.to(roll);
		servoPitch.to(pitch);
		servoYaw.to(yaw);
	}
}

//export functions
module.exports.enableHardware = enableHardware;
module.exports.disableHardware = disableHardware;
module.exports.moveServo = moveServo;