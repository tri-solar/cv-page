import * as THREE from 'three'

/**
 * Canvas
 */
const canvas = document.querySelector('canvas.webgl') as HTMLCanvasElement

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Geometry & Material
 */
const geometry = new THREE.SphereGeometry(1, 32, 32)
const material = new THREE.MeshStandardMaterial({ color: '#42DAED' })
const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#ffffff', 0.35)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const tick = () => {
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()