var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
window.requestAnimationFrame = requestAnimationFrame;

var v, w, canvas;
var backBuffer = document.createElement('canvas');
var bCtx = backBuffer.getContext('2d');

function init() {
  v = document.getElementById('v');
  w = document.getElementById('w');
  //canvas = document.getElementById('c');
  //gCtx = canvas.getContext('2d');
  navigator.webkitGetUserMedia({video:true}, callbackStreamIsReady);
  navigator.webkitGetUserMedia({video:true}, callbackSecondCamera);
}

function callbackStreamIsReady(stream) {
  v.src = URL.createObjectURL(stream);
  //w.src = URL.createObjectURL(stream);
  v.play();
  //w.play();
  window.requestAnimationFrame(draw);
}

function callbackSecondCamera(stream) {
  w.src = URL.createObjectURL(stream);
  w.play();
  window.requestAnimationFrame(draw);
}

function draw() {
  var w = canvas.clientWidth;
  var h = canvas.clientHeight;
  backBuffer.width = w;
  backBuffer.height = h;
  bCtx.drawImage(v, 0, 0, w, h);
  //pixelOperationFunction(w,h);
  window.requestAnimationFrame(draw);
}

/*
function passNormal(w,h) { 
   var pixels = bCtx.getImageData(0, 0, w, h);
   gCtx.putImageData(pixels, 0, 0);
}
*/