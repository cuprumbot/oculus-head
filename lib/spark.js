//johnny-five
var	five 	= require("johnny-five"),
	Spark 	= require("spark-io");

var servoRoll, servoPitch, servoYaw;

var	board 	= new five.Board({
	io: new Spark({
		token: process.env.SPARK_TOKEN,
		deviceId: process.env.SPARK_DEVICE_ID
	})
});

//var hardware = false;

//ready servos when board is created
board.on("ready", function () {
	servoRoll = new five.Servo(A5);
	servoPitch = new five.Servo(A6);
	servoYaw = new five.Servo(A7);

	//hardware = true;
	console.log("Spark is ready!");
});

//move servos
var moveServo = function (pitch, yaw, roll) {
	if (hardware) {
		servoRoll.to(roll);
		servoPitch.to(pitch);
		servoYaw.to(yaw);
	}
}

module.exports.moveServo = moveServo;