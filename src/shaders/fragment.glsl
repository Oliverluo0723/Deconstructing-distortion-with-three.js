varying vec2 vUv;
uniform float time;
uniform sampler2D uTexture;
//uniform float progress;
uniform vec4 resolution;
varying vec3 vPosition;
const float PI = 3.141592653589793238;



void main() {
  vec4 color = texture2D(uTexture, vUv);
  // vUv 是每個座標點的意思
  // gl_FragColor = vec4(vUv, 0.0, 1.0); // Removed unnecessary intermediate assignment
  gl_FragColor = color;
}