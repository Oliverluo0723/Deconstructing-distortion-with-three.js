import {
	Vector2
} from 'three';

/**
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

const CustomPass = {

	// name: 'DotScreenShader',
	name: 'CustomPass',


	uniforms: {

		'tDiffuse': { value: null },
		'time': { value: 0 },
        "progress": { value: 0 },
		'tSize': { value: new Vector2( 256, 256 ) },
		'center': { value: new Vector2( 0.5, 0.5 ) },
		'angle': { value: 1.57 },
		'scale': { value: 1.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform vec2 center;
		uniform float angle;
		uniform float time;
		uniform float progress;
		uniform float scale;
		uniform vec2 tSize;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		float pattern() {

			float s = sin( angle ), c = cos( angle );

			vec2 tex = vUv * tSize - center;
			vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;

			return ( sin( point.x ) * sin( point.y ) ) * 4.0;

		}

		void main() {
            vec2 newUv = vUv; 
            // 扭曲
            // newUv = vUv + 0.1*vec2(sin(10.*vUv.x), sin(10.*vUv.y));

            vec2 centerUv = 2.*vUv - vec2(1.);


            newUv = vUv + centerUv*vec2(1.,0.);

            // newUv.x = vUv.x*(1. - progress) + progress;
            newUv.x = mix(vUv.x, length(centerUv), progress);
            newUv.y = mix(vUv.y, 0., progress);


			vec4 color = texture2D( tDiffuse, newUv );
            gl_FragColor = color;
            // gl_FragColor = vec4(length(centerUv), 0., 0, 1);



		}`

};

export { CustomPass };