uniform vec3 light_position;

vec3 stretch(vec3 a, vec3 b, float magnitude) {
    return normalize(b - a) * magnitude;
}

vec3 when_opposing(vec3 normal, vec3 value) {
    return value * max(0.0, -sign(dot(value, normal)));
}

void main()
{
    vec3 shadow_position = position + when_opposing(normal, stretch(
        light_position,
        position,
        10000.0
    ));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(shadow_position, 1.0);
}
