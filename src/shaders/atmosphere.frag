// Uniforms
uniform vec3  uLightDirection;     // normalized world-space light direction
uniform vec3  uDaySideColor;       // warm atmosphere color on the lit side
uniform vec3  uNightSideColor;     // cool atmosphere color on the dark side
uniform vec3  uRimColor;           // fresnel rim glow color
uniform float uFresnelPower;       // higher = thinner rim band
uniform float uAtmosOpacity;       // global opacity multiplier

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

void main() {
    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewDirection);
    vec3 L = normalize(uLightDirection);

    // --- 1. Fresnel rim glow ---
    // fresnelFactor ≈ 0 at face-on, ≈ 1 at grazing/rim
    float fresnelFactor = pow(1.0 - max(dot(N, V), 0.0), uFresnelPower);

    // --- 2. Light-side vs dark-side color shift ---
    // lightDot: 1 = fully lit, 0 = terminator, -1 = fully dark
    // remap to [0, 1] for mix()
    float lightDot  = dot(N, L) * 0.5 + 0.5;
    // smooth the terminator edge a bit
    float lightBlend = smoothstep(0.35, 0.65, lightDot);
    vec3 atmosColor  = mix(uNightSideColor, uDaySideColor, lightBlend);

    // Boost rim glow on the lit side only
    vec3 rimGlow = uRimColor * fresnelFactor * (0.4 + 0.6 * lightBlend);

    // --- 3. Depth-based opacity falloff ---
    // depthFade ≈ 1 at the face-on centre, fades to 0 at the edges
    // This makes the atmosphere appear thinner at the silhouette
    float depthFade = max(dot(N, V), 0.0);

    // --- Combine ---
    // Base atmosphere is depth-faded; rim glow is additive
    vec3 finalColor  = atmosColor + rimGlow;
    float finalAlpha = depthFade * uAtmosOpacity + fresnelFactor * 0.35;
    finalAlpha = clamp(finalAlpha, 0.0, 1.0);

    gl_FragColor = vec4(finalColor, finalAlpha);
}
