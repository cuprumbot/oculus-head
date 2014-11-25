//compatibility
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

//got first camera
function handleFirstVideo(stream) {
	left = document.getElementById('left');
	left.src = window.URL.createObjectURL(stream);
  	left.play();
  	//alert("left camera initialized");

  	//get second camera
  	navigator.getUserMedia({video:true}, handleSecondVideo, videoError);
}

//got second camera
function handleSecondVideo(stream) {
	right = document.getElementById('right');
	right.src = window.URL.createObjectURL(stream);
	right.play();
	//alert("right camera initialized");
}

function videoError(e) {
}


$( function init() {
	if (navigator.getUserMedia) {
		//get first camera
		navigator.getUserMedia({video:true}, handleFirstVideo, videoError);
	}
} );