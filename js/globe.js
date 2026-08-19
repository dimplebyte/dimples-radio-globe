/* =========================================
   ATTRACTIVE RADIO GLOBE
========================================= */

let globe;
let scene;
let camera;
let renderer;
let earth;
let stars;

function initGlobe() {

    const container = document.getElementById("globe");

    if (!container) {
        console.error("Globe container not found");
        return;
    }

    /* ---------- SCENE ---------- */

    scene = new THREE.Scene();

    /* ---------- CAMERA ---------- */

    camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.z = 3.2;

    /* ---------- RENDERER ---------- */

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    /* ---------- LIGHT ---------- */

    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        1.2
    );

    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        2
    );

    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    /* ---------- EARTH ---------- */

    const geometry = new THREE.SphereGeometry(
        1,
        96,
        96
    );

    const material = new THREE.MeshPhongMaterial({
        color: 0x1769aa,
        shininess: 25,
        transparent: false
    });

    earth = new THREE.Mesh(
        geometry,
        material
    );

    scene.add(earth);

    /* ---------- ATMOSPHERE ---------- */

    const atmosphereGeometry =
        new THREE.SphereGeometry(1.06, 96, 96);

    const atmosphereMaterial =
        new THREE.MeshBasicMaterial({
            color: 0x4fc3ff,
            transparent: true,
            opacity: 0.12,
            side: THREE.BackSide
        });

    const atmosphere = new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
    );

    scene.add(atmosphere);

    /* ---------- STARS ---------- */

    createStars();

    /* ---------- ANIMATION ---------- */

    animate();

    /* ---------- RESIZE ---------- */

    window.addEventListener("resize", resizeGlobe);
}


/* =========================================
   STAR FIELD
========================================= */

function createStars() {

    const starGeometry =
        new THREE.BufferGeometry();

    const starCount = 1800;

    const positions =
        new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {

        positions[i] =
            (Math.random() - 0.5) * 20;

    }

    starGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const starMaterial =
        new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.025,
            transparent: true,
            opacity: 0.9
        });

    stars = new THREE.Points(
        starGeometry,
        starMaterial
    );

    scene.add(stars);
}


/* =========================================
   ANIMATION
========================================= */

function animate() {

    requestAnimationFrame(animate);

    if (earth) {

        earth.rotation.y += 0.0015;

    }

    if (stars) {

        stars.rotation.y += 0.00015;

    }

    renderer.render(
        scene,
        camera
    );
}


/* =========================================
   RESIZE
========================================= */

function resizeGlobe() {

    const container =
        document.getElementById("globe");

    if (!container) return;

    camera.aspect =
        container.clientWidth /
        container.clientHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );
}


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initGlobe
);
