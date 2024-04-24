import { scale } from 'svelte/transition';
import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(0, 1000, 0, 1000);
const geometry = new THREE.CircleGeometry(100, 64);
const material = new THREE.MeshBasicMaterial({color: 0xffffff});
const point = new THREE.Mesh(geometry, material);
point.position.x = 800;

let renderer: THREE.WebGLRenderer;
scene.add(point);
camera.position.z = 0;
scene.add(camera);

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  };

function resize() {
    renderer.setSize(1920, 500)
    camera.updateProjectionMatrix();
}

export function createScene(canvas: HTMLCanvasElement) {
    renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});
    renderer.setClearColor(new THREE.Color(0, 0, 0), 1);
    renderer.clearColor();
    resize();
}