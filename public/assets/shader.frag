---
name: Stripes
type: fragment
author: Richard Davey
uniform.size: { "type": "1f", "value": 16.0 }
---

precision mediump float;

uniform float size;
uniform vec2 resolution;

varying vec2 fragCoord;

void main(void)
{
    //vec3 black = vec3(0.0, 1.0, 0.0);
    vec3 white = vec3(1.0, 0.0, 0.0);
    bool color = (mod((fragCoord.y / resolution.y) * size, 1.0) > 0.5);

    if (color)
    {
        gl_FragColor = vec4(white, 1.0);
    }
}