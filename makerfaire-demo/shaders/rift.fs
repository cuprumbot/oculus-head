precision highp float;
uniform sampler2D texture;
uniform vec2 LensCenter;
uniform vec2 ScreenCenter;
uniform vec2 Scale;
uniform vec2 ScaleIn;
uniform vec4 HmdWarpParam;
varying vec2 oTexCoord;

vec2 HmdWarp(vec2 in01)
{
	vec2 theta		= (in01 - LensCenter) * ScaleIn;
	float rSq		= theta.x * theta.x + theta.y * theta.y;
	vec2 rvector	= theta * (HmdWarpParam.x + HmdWarpParam.y * rSq +
		HmdWarpParam.z * rSq * rSq +
		HmdWarpParam.w * rSq * rSq * rSq);
	
	return LensCenter + Scale * rvector;
}

void main()
{
	vec2 tc = HmdWarp(oTexCoord);
	
	if (any(bvec2(clamp(tc,ScreenCenter-vec2(0.25,0.5), ScreenCenter+vec2(0.25,0.5)) - tc)))
	{
		gl_FragColor = vec4(vec3(0.0), 1.0);
		
		return;
	}
	
	gl_FragColor = texture2D(texture, tc);
}