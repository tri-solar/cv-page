import * as THREE from 'three'
import GUI from 'lil-gui'

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

/**
 * Scene
 */
const scene = new THREE.Scene()

//textures
const textureLoader = new THREE.TextureLoader()
const uranusColor = textureLoader.load('/textures/uranus-color-tuned.webp')
uranusColor.colorSpace = THREE.SRGBColorSpace

const particleTextures = [
    textureLoader.load('/textures/particles/star1.png'),
    textureLoader.load('/textures/particles/star2.png'),
    textureLoader.load('/textures/particles/star3.png')
]

/**
 * Geometry & Material
 */
const urnausGeometry = new THREE.SphereGeometry(1, 64, 32)
const uranusMaterial = new THREE.MeshStandardMaterial({
    map: uranusColor,
    metalness: 0.1,
    roughness: 0.8
})
const uranus = new THREE.Mesh(urnausGeometry, uranusMaterial)
uranus.castShadow = true
uranus.receiveShadow = true
scene.add(uranus)

/**
 * Uranus Rings
 */
const innerRadius = 1.25
const outerRadius = 3
const ringSegments = 128

const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, ringSegments)

const uvs = ringGeometry.attributes.uv
const pos = ringGeometry.attributes.position
const v2 = new THREE.Vector2()

for (let i = 0; i < pos.count; i++) {
    v2.fromBufferAttribute(pos, i)
    const r = Math.sqrt(v2.x * v2.x + v2.y * v2.y)
    const radiusT = (r - innerRadius) / (outerRadius - innerRadius)
    const angle = Math.atan2(v2.y, v2.x)
    const angleT = (angle + Math.PI) / (Math.PI * 2)

    uvs.setXY(i, radiusT, angleT)
}
uvs.needsUpdate = true

const ringTexture = textureLoader.load('/textures/2k_uranus_ring_alpha.webp')
ringTexture.colorSpace = THREE.SRGBColorSpace

const ringMaterial = new THREE.MeshStandardMaterial({
    map: ringTexture,
    side: THREE.DoubleSide,
    metalness: 0.3,
    roughness: 0.9,
    transparent: true,
    alphaTest: 0.5
})

const uranusRing = new THREE.Mesh(ringGeometry, ringMaterial)
uranusRing.name = "Uranus's Rings"
uranusRing.rotation.x = Math.PI / 2.7
uranusRing.rotation.y = 0.15
uranusRing.castShadow = false
uranusRing.receiveShadow = false
scene.add(uranusRing)

/**
 * Particles
 */
const totalParticles = 10000
const particlesPerTexture = Math.floor(totalParticles / particleTextures.length)
const excludeRadius = 7
const particlesMeshes: THREE.Points[] = []

particleTextures.forEach(texture => {
    const particlesGeometry = new THREE.BufferGeometry()
    const count = particlesPerTexture
    
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for(let i = 0; i < count; i++)
    {
        let x, y, z
        let inExcludeZone = true
        
        while(inExcludeZone)
        {
            x = (Math.random() - 0.5) * 15
            y = (Math.random() - 0.5) * 15
            z = (Math.random() - 0.5) * 15
            
            const distance = Math.sqrt(x * x + y * y + z * z)
            if(distance > excludeRadius)
            {
                inExcludeZone = false
            }
        }
        
        positions[i * 3] = x
        positions[i * 3 + 1] = y
        positions[i * 3 + 2] = z
        
        colors[i * 3] = 0.85 + Math.random() * 0.15     // Red
        colors[i * 3 + 1] = 0.95 + Math.random() * 0.05  // Green
        colors[i * 3 + 2] = 0.95 + Math.random() * 0.05  // Blue
        
        sizes[i] = 0.05 + Math.random() * 0.1
    }
    
    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )
    
    particlesGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )
    
    particlesGeometry.setAttribute(
        'size',
        new THREE.BufferAttribute(sizes, 1)
    )
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: '#ffffff',
        size: 0.1,
        sizeAttenuation: true,
        transparent: true,
        alphaMap: texture,
        depthWrite: false,
        vertexColors: true,
        alphaTest: 0.001
    })
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)
    particlesMeshes.push(particles)
})

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.01)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#d7f4ff', 4)
directionalLight.position.set(5, 5, 5)
directionalLight.castShadow = true
scene.add(directionalLight)

/**
 * Light Helpers
 */
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5)
directionalLightHelper.visible = false
scene.add(directionalLightHelper)

const gridHelper = new THREE.GridHelper(10, 10)
gridHelper.visible = false
scene.add(gridHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 0
camera.position.y = 1
camera.position.x = 6
camera.lookAt(0, 0, 0)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

/**
 * GUI
 */
const gui = new GUI()

const lightsFolder = gui.addFolder('Lights')
lightsFolder.add(ambientLight, 'intensity', 0, 1, 0.01).name('Ambient Light')
lightsFolder.add(directionalLight, 'intensity', 0, 10, 0.01).name('Directional Light')

const helpersFolder = gui.addFolder('Helpers')
helpersFolder.add(directionalLightHelper, 'visible').name('Directional Helper')
helpersFolder.add(gridHelper, 'visible').name('Grid Helper')

const ringFolder = gui.addFolder('Ring')
ringFolder.add(uranusRing.rotation, 'x', 0, Math.PI * 2, 0.01).name('Rotation X')
ringFolder.add(uranusRing.rotation, 'y', 0, Math.PI * 2, 0.01).name('Rotation Y')
ringFolder.add(uranusRing.rotation, 'z', 0, Math.PI * 2, 0.01).name('Rotation Z')

const animationSettings = { animSpeed: 0.0001 }
const animationFolder = gui.addFolder('Animation')
animationFolder.add(animationSettings, 'animSpeed', 0, 0.001, 0.00001).name('Particles Speed')

/**
 * Camera Zoom on Scroll
 */
const initialCameraX = 6
const initialCameraY = 2
const initialCameraZ = 0

/**
 * Animate
 */
const tick = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop
    const scrollHeight = document.body.scrollHeight - window.innerHeight
    const scrollProgress = scrollHeight > 0 ? scrollY / scrollHeight : 0
    
    camera.position.x = initialCameraX - scrollProgress * 4
    camera.position.y = initialCameraY - scrollProgress * 1.35
    camera.position.z = initialCameraZ
    camera.lookAt(0, 0, 0)
    
    // Rotate particles to the left
    particlesMeshes.forEach(particles => {
        particles.rotation.y -= animationSettings.animSpeed
    })
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()

/**
 * Scroll Navigation
 */
const downArrow = document.querySelector('.down-arrow') as HTMLElement
const sections = document.querySelectorAll('section')

function scrollToNextSection() {
    const currentScroll = window.scrollY + window.innerHeight / 2

    for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement
        if (section.offsetTop > currentScroll) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' })
            break
        }
    }
}

downArrow?.addEventListener('click', scrollToNextSection)