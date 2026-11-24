class ClimateParticleEngine {
    constructor() {
        this.particles = [];
    }

    spawnFireParticle(x, y) {
        if (this.particles.length > 120) return;
        this.particles.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            vx: (Math.random() - 0.5) * 2.5,
            vy: -Math.random() * 3 - 0.5,
            radius: Math.random() * 3 + 1.5,
            color: Math.random() < 0.5 ? '#f59e0b' : '#ef4444',
            life: 1.0,
            type: 'fire'
        });
    }

    spawnFrostParticle(width, height) {
        if (this.particles.length > 100) return;
        this.particles.push({
            x: Math.random() * width,
            y: -10,
            vx: (Math.random() - 0.5) * 1.2,
            vy: Math.random() * 1.5 + 0.5,
            radius: Math.random() * 2.5 + 1,
            color: '#38bdf8',
            life: 1.0,
            type: 'frost'
        });
    }

    updateAndRender(ctx, width, height, temp, planetX, planetY) {
        // Spawn based on climate temperature
        if (temp > 70) {
            this.spawnFireParticle(planetX, planetY);
            if (Math.random() < 0.4) this.spawnFireParticle(planetX, planetY);
        } else if (temp < -30) {
            if (Math.random() < 0.6) this.spawnFrostParticle(width, height);
        }

        // Render particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.type === 'fire') {
                p.life -= 0.025;
                p.radius *= 0.96;
            } else {
                p.life -= 0.008;
            }

            if (p.life <= 0 || p.radius <= 0.2 || p.y > height + 20) {
                this.particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();

            if (p.type === 'fire') {
                ctx.shadowColor = p.color;
                ctx.shadowBlur = 6;
                ctx.fill();
            }
            ctx.restore();
        }
    }
}

window.climateParticleEngine = new ClimateParticleEngine();
