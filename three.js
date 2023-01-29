import * as THREE from "three";

import "./style.css";

// orbit controls 
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import gsap from "gsap";

// set width and height
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

// scene is like a movie scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, sizes.width/sizes.height, 0.1, 1000);

// create a model to render
const geometry = new THREE.SphereGeometry(3, 64, 64);
const materail = new THREE.MeshStandardMaterial( { color: "#00ff83" } );
const Sphere = new THREE.Mesh( geometry, materail );
// add to the scene
scene.add( Sphere );

// access 'canvas' to paint the 'dom'
const canvas = document.querySelector(".webgl");

// for controlling camera orbit around
const controls = new OrbitControls(camera, canvas);
controls.enableZoom = false;
controls.enableDamping = true;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 3;

// move the position of camera
camera.position.z = 15;
console.log(camera)

// add light 
const light = new THREE.PointLight(0xffffff, 1, 100); // color, intensity, distance, dimming
light.position.set(1, 5, 8);
scene.add(light);

// create a renderer for scene
const renderer = new THREE.WebGLRenderer({canvas, antialias: true}); // 'antialias' removes blur
renderer.setSize(sizes.width, sizes.height);  // set size to render

renderer.setPixelRatio(2); // prevents edges blur

// render the scene
function loop() {
  controls.update();
  requestAnimationFrame(loop);
  Sphere.rotation.x += 0.009;
  Sphere.rotation.y += 0.009;
  renderer.render(scene, camera);
};

loop();

// resize render environment
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width/sizes.height;
  camera.updateProjectionMatrix();  // not squishes the shape when resizing
  renderer.setSize(sizes.width, sizes.height);
});


// does the animation
const tl = gsap.timeline( {defaults: {duration: 1}} );
// animate sphere from tiny to big
tl.fromTo(Sphere.scale, {x:0, y:0, z:0}, {x:1, y:1, z:1});

// show nav
tl.fromTo("nav", {y:-135}, {y:0});
// show title
tl.fromTo(".title", {opacity: 0}, {opacity: 1});


// mouse events to control sphere color
let mouseUp = true;
let rgb = [];
document.addEventListener("mousedown", () => mouseUp = false);
document.addEventListener("mouseup", () => mouseUp = true);

window.addEventListener("mousemove", (e) => {
  if(mouseUp) {
    rgb = [
      Math.round((e.pageX/sizes.width) * 255),
      Math.round((e.pageY/sizes.width) * 255),
      Math.round(Math.random( 1 * 255))
    ];
  }
  else {
    rgb = [ 
      Math.round((e.pageX/sizes.width) * 255),
      Math.round((e.pageY/sizes.width) * 255),
      Math.round(Math.random( 1 * 255))
    ]
  }

  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);  // makes >> rgb(200, 15, 90)
  console.log(newColor)
  // then apply color to the Sphere
  gsap.to(Sphere.material.color, {r:newColor.r, g:newColor.g, b:newColor.b});

});