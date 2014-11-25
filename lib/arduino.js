//johnny-five
var five = require("johnny-five");
var board = new five.Board();
var servoRoll, servoPitch, servoYaw;
var hardware = false;
var center = 90;
var first = true;

var MIN_PITCH = 5,
	MAX_PITCH = 175,
	MIN_YAW = 5,
	MAX_YAW = 175;

//ready servos when board is created
board.on("ready", function () {
	//servoRoll = new five.Servo(10);
	servoPitch	= new five.Servo({pin:10, range:[ MIN_PITCH, MAX_PITCH ]});
	servoYaw	= new five.Servo({pin:11, range:[ MIN_YAW, MAX_YAW ]});

	hardware = true;
	console.log("Arduino is ready!");
});

//move servos
function moveServo (pitch, yaw, roll, hw) {
	if (hardware) {
		//put this in the socket listener
		pitch = (pitch < MIN_PITCH) ? MIN_PITCH : pitch;
		pitch = (pitch > MAX_PITCH) ? MAX_PITCH : pitch;

		if (first) {
			center = yaw;
			first = false;
			//yaw = 90;
		}

		yaw = (yaw + 810 - center) % 360;

		if (hw == 1) {			//oculus
			yaw = (yaw > 270) ? 0 : yaw;
			yaw = (yaw > 180) ? 180 : yaw;

			yaw = 180 - yaw;
		} else if (hw == 2) {	//phone
			//PENDIENTE: ajustar valores cuando el telefono se giro hasta un extremo

			//yaw = (yaw > 270) ? 180 : yaw;
			//yaw = (yaw > 180) ? 0 : yaw;

			yaw = 360 - yaw;

			yaw = (yaw > 270) ? 0 : yaw;
		}

		console.log("pitch: " + pitch.toFixed(1) + "\tyaw: " + yaw.toFixed(1));

		servoPitch.to(pitch);
		servoYaw.to(yaw);
	}
}

//export functions
module.exports.moveServo = moveServo;