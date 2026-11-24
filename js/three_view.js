class Three3DViewRenderer {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.suns3D = [];
        this.planet3D = null;
        this.army3DGroup = null;
        this.isInitialized = false;
    }

    init() {
        if (typeof THREE === 'undefined') {
            console.warn('Three.js not loaded, 3D mode fallback');
            return false;
        }

        const width = this.container.clientWidth || 800;
        const height = this.container.clientHeight || 500;

        // Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x05070a, 0.0015);

        this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 2000);
        this.camera.position.set(0, -250, 350);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Canvas element replacement
        this.domElement = this.renderer.domElement;
        this.domElement.id = 'three-canvas-3d';
        this.domElement.style.display = 'none';
        this.domElement.style.position = 'absolute';
        this.domElement.style.top = '0';
        this.domElement.style.left = '0';

        this.container.appendChild(this.domElement);

        // Ambient & Directional Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Build 3D Celestial Bodies
        this.buildStarfield();
        this.build3DSuns();
        this.build3DPlanet();
        this.build3DArmyPhalanx();

        this.isInitialized = true;
        return true;
    }

    buildStarfield() {
        const starsGeometry = new THREE.BufferGeometry();
        const count = 1200;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 1500;
            positions[i + 1] = (Math.random() - 0.5) * 1500;
            positions[i + 2] = (Math.random() - 0.5) * 1500;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starsMaterial = new THREE.PointsMaterial({ color: 0xe2e8f0, size: 1.5, transparent: true, opacity: 0.8 });
        const starField = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(starField);
    }

    build3DSuns() {
        const sunColors = [0xf59e0b, 0xef4444, 0x06b6d4];
        this.suns3D = sunColors.map(color => {
            const geo = new THREE.SphereGeometry(14, 24, 24);
            const mat = new THREE.MeshBasicMaterial({ color: color });
            const mesh = new THREE.Mesh(geo, mat);

            // Light Glow Aura
            const pLight = new THREE.PointLight(color, 2, 400);
            mesh.add(pLight);

            this.scene.add(mesh);
            return mesh;
        });
    }

    build3DPlanet() {
        const geo = new THREE.SphereGeometry(7, 20, 20);
        const mat = new THREE.MeshPhongMaterial({ color: 0x06b6d4, emissive: 0x0284c7, shininess: 30 });
        this.planet3D = new THREE.Mesh(geo, mat);
        this.scene.add(this.planet3D);
    }

    build3DArmyPhalanx() {
        this.army3DGroup = new THREE.Group();
        const colors = [0x06b6d4, 0xf59e0b, 0x10b981, 0xa855f7];

        for (let i = 0; i < 400; i++) {
            const geo = new THREE.BoxGeometry(3, 3, 8);
            const col = colors[i % colors.length];
            const mat = new THREE.MeshBasicMaterial({ color: col });
            const mesh = new THREE.Mesh(geo, mat);

            mesh.position.x = (i % 20) * 12 - 120;
            mesh.position.y = Math.floor(i / 20) * 12 - 120;
            mesh.position.z = 0;

            this.army3DGroup.add(mesh);
        }

        this.army3DGroup.position.set(0, 0, -50);
        this.army3DGroup.visible = false;
        this.scene.add(this.army3DGroup);
    }

    updateAndRender(physics, viewMode) {
        if (!this.isInitialized) return;

        if (viewMode === '3d_sky') {
            this.domElement.style.display = 'block';
            if (this.army3DGroup) this.army3DGroup.visible = false;

            // Sync 3D Sun positions with 2D physics
            physics.suns.forEach((sun, idx) => {
                if (this.suns3D[idx]) {
                    this.suns3D[idx].position.set(sun.x * 0.8, sun.y * 0.8, 0);
                    this.suns3D[idx].visible = true;
                }
            });

            // Sync 3D Planet
            if (this.planet3D && physics.planet) {
                this.planet3D.position.set(physics.planet.x * 0.8, physics.planet.y * 0.8, 0);
                this.planet3D.visible = true;

                if (physics.planet.temp > 70) {
                    this.planet3D.material.color.setHex(0xef4444);
                } else if (physics.planet.temp < -30) {
                    this.planet3D.material.color.setHex(0x38bdf8);
                } else {
                    this.planet3D.material.color.setHex(0x06b6d4);
                }
            }

            // Slow Camera Rotation around celestial center
            const time = performance.now() * 0.0003;
            this.camera.position.x = Math.sin(time) * 320;
            this.camera.position.y = Math.cos(time) * 320;
            this.camera.lookAt(0, 0, 0);

        } else if (viewMode === '3d_human_computer') {
            this.domElement.style.display = 'block';
            this.suns3D.forEach(s => s.visible = false);
            if (this.planet3D) this.planet3D.visible = false;
            if (this.army3DGroup) {
                this.army3DGroup.visible = true;
                this.army3DGroup.rotation.z += 0.005;

                // Animate soldier blocks waving
                const time = performance.now() * 0.005;
                this.army3DGroup.children.forEach((soldier, idx) => {
                    soldier.position.z = Math.sin(time + idx * 0.2) * 4;
                });
            }

            this.camera.position.set(0, -180, 200);
            this.camera.lookAt(0, 0, 0);
        } else {
            this.domElement.style.display = 'none';
            return;
        }

        this.renderer.render(this.scene, this.camera);
    }

    resize(width, height) {
        if (!this.isInitialized) return;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
}

window.Three3DViewRenderer = Three3DViewRenderer;
