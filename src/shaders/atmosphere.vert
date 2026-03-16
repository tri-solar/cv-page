varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

void main() {
    // Normal in view space (for Fresnel and depth-based opacity)
    vNormal = normalize(normalMatrix * normal);

    // World-space position and view direction for light dot product
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    vViewDirection = normalize(cameraPosition - worldPos.xyz);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
