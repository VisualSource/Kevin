---
name: Stripes
type: fragment
author: Richard Davey
uniform.size: { "type": "1f", "value": 16.0 }
---

#ifdef GL_ES 
precision mediump float;
#endif 

uniform vec2 resolution;
uniform float time;

varying vec2 fragCoord;

void main(void){
    bool color = (mod((fragCoord.x / resolution.x) * time, 1.0) > 0.5);
    if(color){
        gl_FragColor = vec4(1.0,0.0,0.0,1.0);
    }
}
/*
float barsize = 0.05;

vec3 mixcol(float value, float r, float g, float b){
    return vec3(value * r , value * g , value * b);
}

vec3 bar(vec2 pos, float r, float g, float b){
    vec2 position = vec2(0.0,0.0);

    if((position.y <= pos.y + barsize) && (position.y >= pos.y - barsize)){
        return vec3(mixcol(1.0 - abs(pos.y - position.y) / barsize, r, g, b));
    }
}



void main(void){
    vec2 p = ( gl_FragCoord.xy / resolution.xy );
    p = floor(p *256.0) / 256.0;
    p.y = p.y + mod(time * 0.058, 0.1);
    vec3 color = vec3(0.0,0.0,0.0);

    for(float i = 0.0; i < 1.8; i += 0.1){
        color += bar(p - vec2(0.0,i), 1.0,0.0,0.0);
    }

    gl_FragColor = vec4(color, 1.0);
}
*/ 
