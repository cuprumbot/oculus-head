var five = require("johnny-five"),
    board, servo;

board = new five.Board();

board.on("ready", function() {

  // Create a new `servo` hardware instance.
  servo10 = new five.Servo({pin:10, range:[60,120]});
  servo11 = new five.Servo({pin:11});
  servo12 = new five.Servo({pin:12});

  // Inject the `servo` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    servo10: servo10,
    servo11: servo11,
    servo12: servo12
  });

  servo10.center();
  servo11.center();
  servo12.center();

  // Servo API

  // min()
  //
  // set the servo to the minimum degrees
  // defaults to 0
  //
  // eg. servo.min();

  // max()
  //
  // set the servo to the maximum degrees
  // defaults to 180
  //
  // eg. servo.max();

  // center()
  //
  // centers the servo to 90°
  //

  // move( deg )
  //
  // Moves the servo to position by degrees
  //
  // servo.move( 90 );

  // sweep( obj )
  //
  // Perform a min-max cycling servo sweep (defaults to 0-180)
  // optionally accepts an object of sweep settings:
  // {
  //    lapse: time in milliseconds to wait between moves
  //           defaults to 500ms
  //    degrees: distance in degrees to move
  //           defaults to 10°
  // }
  //
  // servo.sweep();
});

allMin = function () {
  servo10.min();
  servo11.min();
  servo12.min();
}

allMax = function () {
  servo10.max();
  servo11.max();
  servo12.max();
}

allCenter = function () {
  servo10.center();
  servo11.center();
  servo12.center();
}