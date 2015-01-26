var five = require("johnny-five"),
    board, servo;

board = new five.Board();

board.on("ready", function() {

  // Create a new `servo` hardware instance.
  izq = new five.Servo({pin:10, range:[60,100]});
  der = new five.Servo({pin:11, range:[80,120]});
  //servo12 = new five.Servo({pin:12, range:[50:130]});

  // Inject the `servo` hardware into
  // the Repl instance's context;
  // allows direct command line access
  board.repl.inject({
    izq: izq,
    der: der
  });

  //izq.center();
  //der.center();
  //servo12.center();

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

fu = function (iz, de) {
  izq.to(60);
  der.to(120);
  setTimeout(function() {
      izq.to(iz);
      der.to(de);
      console.log(iz + " " + de);
  }, 1000);
}

/*
allMin = function () {
  izq.min();
  der.min();
  //servo12.min();
}

allMax = function () {
  izq.max();
  der.max();
  //servo12.max();
}

allCenter = function () {
  izq.center();
  der.center();
  //servo12.center();
}
*/