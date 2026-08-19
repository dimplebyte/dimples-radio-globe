/* =========================================
   RADIO GLOBE — VISUAL UPGRADE
========================================= */

let globe;
let scene;
let camera;
let renderer;
let earth;
let atmosphere;
let stars;

function initGlobe() {

    const container = document.getElementById("globe");

    if (!container) {
        console.error("Globe container not found");
        return;
    }

    /* =========================================
       SCENE
    ========================================= */

    scene = new THREE.Scene();


    /* =========================================
       CAMERA
    ========================================= */

    camera = new THREE.PerspectiveCamera(
        42,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    );

    camera.position.set(0, 0, 3.1);


    /* =========================================
       RENDERER
    ========================================= */

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );

    container.innerHTML = "";

    container.appendChild(
        renderer.domElement
    );


    /* =========================================
       LIGHTING
    ========================================= */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            1.5
        );

    scene.add(ambientLight);


    const sunLight =
        new THREE.DirectionalLight(
            0xffffff,
            2.5
        );

    sunLight.position.set(
        5,
        3,
        5
    );

    scene.add(sunLight);


    /* =========================================
       EARTH
    ========================================= */

    const earthGeometry =
        new THREE.SphereGeometry(
            1,
            128,
            128
        );


    const earthMaterial =
        new THREE.MeshPhongMaterial({

            color: 0x1769aa,

            shininess: 35,

            specular: 0x3fa9ff

        });


    earth = new THREE.Mesh(
        earthGeometry,
        earthMaterial
    );

    scene.add(earth);


    /* =========================================
       EARTH GLOW
    ========================================= */

    const atmosphereGeometry =
        new THREE.SphereGeometry(
            1.075,
            128,
            128
        );


    const atmosphereMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x35b9ff,

            transparent: true,

            opacity: 0.14,

            side: THREE.BackSide

        });


    atmosphere = new THREE.Mesh(
        atmosphereGeometry,
        atmosphereMaterial
    );

    scene.add(atmosphere);


    /* =========================================
       OUTER GLOW
    ========================================= */

    const glowGeometry =
        new THREE.SphereGeometry(
            1.13,
            128,
            128
        );


    const glowMaterial =
        new THREE.MeshBasicMaterial({

            color: 0x168cff,

            transparent: true,

            opacity: 0.055,

            side: THREE.BackSide

        });


    const outerGlow =
        new THREE.Mesh(
            glowGeometry,
            glowMaterial
        );

    scene.add(outerGlow);


    /* =========================================
       STARS
    ========================================= */

    createStars();


    /* =========================================
       START ANIMATION
    ========================================= */

    animate();


    /* =========================================
       RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        resizeGlobe
    );
}


/* =========================================
   STAR FIELD
========================================= */

function createStars() {

    const geometry =
        new THREE.BufferGeometry();

    const starCount = 3500;

    const positions =
        new Float32Array(
            starCount * 3
        );


    for (
        let i = 0;
        i < starCount;
        i++
    ) {

        const radius =
            4 + Math.random() * 12;

        const theta =
            Math.random() *
            Math.PI *
            2;

        const phi =
            Math.acos(
                2 * Math.random() - 1
            );


        positions[i * 3] =
            radius *
            Math.sin(phi) *
            Math.cos(theta);

        positions[i * 3 + 1] =
            radius *
            Math.sin(phi) *
            Math.sin(theta);

        positions[i * 3 + 2] =
            radius *
            Math.cos(phi);
    }


    geometry.setAttribute(
        "position",

        new THREE.BufferAttribute(
            positions,
            3
        )
    );


    const material =
        new THREE.PointsMaterial({

            color: 0xffffff,

            size: 0.018,

            transparent: true,

            opacity: 0.9,

            sizeAttenuation: true
        });


    stars =
        new THREE.Points(
            geometry,
            material
        );


    scene.add(stars);
}


/* =========================================
   ANIMATION
========================================= */

function animate() {

    requestAnimationFrame(
        animate
    );


    if (earth) {

        earth.rotation.y += 0.0018;

    }


    if (stars) {

        stars.rotation.y += 0.00012;

    }


    if (atmosphere) {

        atmosphere.rotation.y -= 0.0005;

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
        document.getElementById(
            "globe"
        );

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
