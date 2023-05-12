import { shaderMaterial } from "@react-three/drei";
import * as THREE from 'three'

const vertexShader = `
uniform sampler2D uPositions;
uniform float uTime;
attribute vec3 aRandom;
varying vec3 vPosition;

void main() {
  vec3 pos = texture2D(uPositions, position.xy).xyz;
  pos.x += sin(uTime * aRandom.x) * 0.01;
  pos.y += cos(uTime * aRandom.y) * 0.01;
  pos.z += sin(uTime * aRandom.z) * 0.01;
  vPosition = pos;


  vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 3.0 / -mvPosition.z;
}
`;

const fragmentShader = `
uniform vec3 uColor;
uniform float uTime;
uniform int uModel1;
uniform int uModel2;
uniform float uTransitionProgress;
varying vec3 vPosition;
  
vec3 increaseSaturation(vec3 color, float f) {
    // Convert color from RGB to HSL
    float r = color.r;
    float g = color.g;
    float b = color.b;
    float cmax = max(max(r, g), b);
    float cmin = min(min(r, g), b);
    float h, s, l;
    float delta = cmax - cmin;
    l = (cmax + cmin) / 2.0;

    if (delta == 0.0) {
        h = 0.0;
        s = 0.0;
    } else {
        if (l < 0.5) {
            s = delta / (cmax + cmin);
        } else {
            s = delta / (2.0 - cmax - cmin);
        }
        if (r == cmax) {
            h = (g - b) / delta;
        } else if (g == cmax) {
            h = 2.0 + (b - r) / delta;
        } else {
            h = 4.0 + (r - g) / delta;
        }
        h *= 60.0;
        if (h < 0.0) h += 360.0;
    }

    // Increase the saturation by the given factor
    s *= f;

    // Convert color back to RGB
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h / 60.0, 2.0) - 1.0));
    float m = l - c / 2.0;
    vec3 newColor;
    if (h < 60.0) {
        newColor = vec3(c + m, x + m, 0.0 + m);
    } else if (h < 120.0) {
        newColor = vec3(x + m, c + m, 0.0 + m);
    } else if (h < 180.0) {
        newColor = vec3(0.0 + m, c + m, x + m);
    } else if (h < 240.0) {
        newColor = vec3(0.0 + m, x + m, c + m);
    } else if (h < 300.0) {
        newColor = vec3(x + m, 0.0 + m, c + m);
    } else {
        newColor = vec3(c + m, 0.0 + m, x + m);
    }

    return newColor;
}

float circleSDF(vec2 fragCoord, vec2 circleCenter, float radius) {
    return length(fragCoord - circleCenter) - radius;
  }
  
  vec3 chooseColor(int m) {
    vec3 color;

    // Outside the circle
    if(m == 0){
        if (circleSDF(vPosition.xy, vec2(0.0), 0.4) < 0.0) {
          // Inside the circle
          color = vec3(1.0, 1.0, 1.0);
          } else {
          // Outside the circle
          vec3 vPos = vPosition;
          vPos.y *= -1.0;
          color = vec3(vPosition + 0.5) + vec3(0.1, 0.1, 0.1);
        }  
    } else if (m == 1){
      color = vec3(1.0, 0.0, 1.0);
    } else if (m == 2){
      color = vec3(0.0, 1.0, 0.0);
    }
    
    return increaseSaturation(color, 3.0);
  }


void main() {
    vec3 color1 = chooseColor(uModel1);
    vec3 color2 = chooseColor(uModel2);

    vec3 colorMix = mix(color1, color2, uTransitionProgress);
    
    
    gl_FragColor = vec4(colorMix, 1.0);
}
`;

export const PointsShader = shaderMaterial(
    {
      uPositions: null,
      uColor: new THREE.Color('#FC06FF'),
      uTime: 0.0,
      uTransitionProgress: 0.0,
      uModel1: 0,
      uModel2: 0
    },
    vertexShader,
    fragmentShader
  );