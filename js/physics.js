class ThreeBodyPhysics {
    constructor() {
        this.G = 1200;
        this.dt = 0.015;
        this.suns = [];
        this.planet = null;
        this.cosmicOrbs = [];
        this.initSystem();
    }

    initSystem() {
        this.suns = [
            { id: 1, x: -180, y: -50, vx: 0.8, vy: -1.2, mass: 120, color: '#f59e0b', radius: 16 },
            { id: 2, x: 180, y: 50, vx: -0.9, vy: 1.1, mass: 110, color: '#ef4444', radius: 14 },
            { id: 3, x: 0, y: 200, vx: 1.1, vy: -0.3, mass: 100, color: '#06b6d4', radius: 13 }
        ];

        this.planet = {
            x: 0,
            y: -100,
            vx: 2.2,
            vy: 0.5,
            mass: 0.1,
            radius: 5,
            temp: 22.5,
            visibleSuns: 1,
            history: []
        };

        this.cosmicOrbs = [];
    }

    spawnCosmicOrb(width, height) {
        if (this.cosmicOrbs.length >= 4) return;
        const rx = (Math.random() - 0.5) * (width * 0.6);
        const ry = (Math.random() - 0.5) * (height * 0.6);

        this.cosmicOrbs.push({
            x: rx,
            y: ry,
            radius: 8,
            type: Math.random() < 0.5 ? 'tech' : 'energy',
            life: 15.0
        });
    }

    step(speedMultiplier = 1) {
        const effectiveDt = this.dt * speedMultiplier;
        const bodies = [...this.suns, this.planet];
        const forces = bodies.map(() => ({ fx: 0, fy: 0 }));

        for (let i = 0; i < bodies.length; i++) {
            for (let j = i + 1; j < bodies.length; j++) {
                const b1 = bodies[i];
                const b2 = bodies[j];

                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const distSq = dx * dx + dy * dy + 100;
                const dist = Math.sqrt(distSq);

                const f = (this.G * b1.mass * b2.mass) / distSq;
                const fx = f * (dx / dist);
                const fy = f * (dy / dist);

                forces[i].fx += fx;
                forces[i].fy += fy;
                forces[j].fx -= fx;
                forces[j].fy -= fy;
            }
        }

        for (let i = 0; i < bodies.length; i++) {
            const b = bodies[i];
            const ax = forces[i].fx / b.mass;
            const ay = forces[i].fy / b.mass;

            b.vx += ax * effectiveDt;
            b.vy += ay * effectiveDt;

            b.x += b.vx * effectiveDt;
            b.y += b.vy * effectiveDt;
        }

        this.planet.history.push({ x: this.planet.x, y: this.planet.y });
        if (this.planet.history.length > 80) this.planet.history.shift();

        // Update Orbs lifetime
        this.cosmicOrbs.forEach((orb, idx) => {
            orb.life -= effectiveDt;
            if (orb.life <= 0) this.cosmicOrbs.splice(idx, 1);
        });

        this.calculateEnvironment();
    }

    calculateEnvironment() {
        let totalHeat = 0;
        let visibleSuns = 0;

        this.suns.forEach(sun => {
            const dx = sun.x - this.planet.x;
            const dy = sun.y - this.planet.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const heatContribution = (sun.mass * 1800) / (dist * dist);
            totalHeat += heatContribution;

            if (dist < 320) visibleSuns++;
        });

        this.planet.temp = -120 + totalHeat * 3.5;
        this.planet.visibleSuns = visibleSuns;
    }
}
