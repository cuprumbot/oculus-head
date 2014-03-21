var radToDeg = 180 / 3.1415926536;
var eulerType = 'XZY';

var getTypeForLock = function (lockType) {
	if (lockType == 'roll') return 'YZX';
	else if (lockType == 'pitch') return 'YXZ';
	else if (lockType == 'yaw') return 'ZYX';
	else return 'XZY';
}

var getEulerFromQuat = function (data, order) {
	function clamp(x) { return Math.min(Math.max(x,-1),1); }

	qx = data.quaternion[0];
	qy = data.quaternion[1];
	qz = data.quaternion[2];
	qw = data.quaternion[3];

	var sqx = qx * qx;
	var sqy = qy * qy;
	var sqz = qz * qz;
	var sqw = qw * qw;

	var ex, ey, ez;

	if (order == null) t = eulerType;
	else t = order;

	if ( t === 'YXZ' ) { //lock on pitch
		ex = Math.asin( clamp( 2 * ( qx * qw - qy * qz ) ) );
		ey = Math.atan2( 2 * ( qx * qz + qy * qw ), ( sqw - sqx - sqy + sqz ) );
		ez = Math.atan2( 2 * ( qx * qy + qz * qw ), ( sqw - sqx + sqy - sqz ) );
	} else if ( t === 'ZYX' ) { //lock on yaw
		ex = Math.atan2( 2 * ( qx * qw + qz * qy ), ( sqw - sqx - sqy + sqz ) );
		ey = Math.asin( clamp( 2 * ( qy * qw - qx * qz ) ) );
		ez = Math.atan2( 2 * ( qx * qy + qz * qw ), ( sqw + sqx - sqy - sqz ) );
	} else if ( t === 'YZX' ) { //lock on roll
		ex = Math.atan2( 2 * ( qx * qw - qz * qy ), ( sqw - sqx + sqy - sqz ) );
		ey = Math.atan2( 2 * ( qy * qw - qx * qz ), ( sqw + sqx - sqy - sqz ) );
		ez = Math.asin( clamp( 2 * ( qx * qy + qz * qw ) ) );
	} else if ( t === 'XZY' ) { //lock on roll
		ex = Math.atan2( 2 * ( qx * qw + qy * qz ), ( sqw - sqx + sqy - sqz ) );
		ey = Math.atan2( 2 * ( qx * qz + qy * qw ), ( sqw + sqx - sqy - sqz ) );
		ez = Math.asin( clamp( 2 * ( qz * qw - qx * qy ) ) );
	}
	
	ex = (ex*radToDeg) + 90;
	ey = (ey*radToDeg) + 90;
	ez = (ez*radToDeg) + 90;

	console.log(ex + "\t" + ey + "\t" + ez);
}

//export functions
module.exports.getTypeForLock = getTypeForLock;
module.exports.getEulerFromQuat = getEulerFromQuat;

//export values
module.exports.eulerType = eulerType;
module.exports.radToDeg = radToDeg;