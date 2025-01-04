import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
});

// Corrected the typo: setPixelRatio instead of setPidelRatio
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Set the initial position of the camera
camera.position.setZ(30);

// Create geometry and material for the torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

// Add the torus to the scene
scene.add(torus);

// Set up lighting
const pointLight = new THREE.PointLight(0xffffff, 200, 100);
pointLight.position.set(0,0,0);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Add a bit of ambient light for soft illumination
scene.add(pointLight, ambientLight);

// Add a point light helper to visualize the light position
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

// Add orbit controls for camera manipulation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Smooth out the camera movement
controls.dampingFactor = 0.25; // Adjust the damping
controls.screenSpacePanning = false; // Disable panning in screen space

// Function to add stars to the scene
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);
  
  // Randomize the position of the stars
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}

// Add some stars to the scene
Array(200).fill().forEach(addStar);

// Load and apply space background texture
const spaceTexture = new THREE.TextureLoader().load('src/space.jpg');
scene.background = spaceTexture;

// Load cube texture (jeff)
const myTexture = new THREE.TextureLoader().load('src/space.jpg', () => {
  console.log("Cube texture loaded successfully!");
}, undefined, (err) => {
  console.error("Failed to load cube texture:", err);
});




const moonTexture = new THREE.TextureLoader().load('src/moon.jpg')
const normalTexture = new THREE.TextureLoader().load('src/image.png')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32), // Sphere for a moon-like shape
  new THREE.MeshStandardMaterial({
    map: normalTexture,
    normalMap: normalTexture, // Keep the texture map for the moon
    emissive: new THREE.Color(0xaaaaaa), // Make the moon "glow" with white light
    emissiveIntensity: 0.1, // Controls how much it glows
    roughness: 0.5, // Slightly shiny
    metalness: 0.1, // Slightly metallic
    emissiveMap: moonTexture, // Use the same texture for emissive to make it glow based on the texture
    emissiveIntensity: 1.5 // Make the emissive glow more intense, while keeping the texture visible
  })
);
scene.add(moon)



// Animate function to create the animation loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the torus for animation
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;

  // Update the controls for the camera movement
  controls.update();

  // Render the scene from the perspective of the camera
  renderer.render(scene, camera);
}

animate();

// Optional: Resize listener to adjust the canvas when the window is resized
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
