class GameController {
    constructor() {
        this.physics = new ThreeBodyPhysics();

        this.epochNumber = 137;
        this.year = 0;
        this.timeScale = 1;
        this.currentViewMode = 'sky'; // 'sky' or 'human_computer'

        this.population = 100.0;
        this.isDehydrated = false;
        this.dehydrationProgress = 0;
        this.techLevel = 10.0;

        // Human Computer & Pendulum Systems
        this.computeBonus = 1.0;
        this.pendulumActive = false;
        this.pendulumLength = 250;
        this.pendulumMass = 100;
        this.pendulumAngle = 0;
        this.resonanceRate = 0;

        // Sophon System
        this.sophonActive = false;
        this.sophonCountdownVal = 3600;

        this.activePhilosopher = PHILOSOPHERS[0];
        this.isGameOver = false;

        this.setupDOMReferences();
        this.humanComputerVis = new HumanComputerVisualizer(this.canvas, this.ctx);

        this.setupEventListeners();
        this.renderPhilosopherCards();
        this.resizeCanvas();

        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));

        this.log('system', `[系统启幕] 第 ${this.epochNumber} 号三体文明启程。`);
    }

    setupDOMReferences() {
        this.canvas = document.getElementById('sim-canvas');
        this.ctx = this.canvas.getContext('2d');

        this.epochTitle = document.getElementById('epoch-title');
        this.epochStateTag = document.getElementById('epoch-state-tag');
        this.timeDisplay = document.getElementById('time-display');

        this.tempDisplay = document.getElementById('telemetry-temp');
        this.sunsDisplay = document.getElementById('telemetry-suns');
        this.modeDisplay = document.getElementById('telemetry-mode');
        this.hazardDisplay = document.getElementById('telemetry-hazard');

        this.popVal = document.getElementById('pop-val');
        this.popBar = document.getElementById('pop-bar');
        this.hydrateVal = document.getElementById('hydrate-status-val');
        this.hydrateBar = document.getElementById('hydrate-bar');
        this.techVal = document.getElementById('tech-val');
        this.techBar = document.getElementById('tech-bar');

        this.logConsole = document.getElementById('log-console');
        this.predictionText = document.getElementById('prediction-text');
        this.predictionConfidence = document.getElementById('prediction-confidence');

        this.btnDehydrate = document.getElementById('btn-dehydrate');
        this.btnRehydrate = document.getElementById('btn-rehydrate');
        this.btnHumanComputer = document.getElementById('btn-human-computer');
        this.btnSophonCleanse = document.getElementById('btn-sophon-cleanse');
        this.btnSpeed = document.getElementById('btn-speed');

        this.tabSky = document.getElementById('tab-sky');
        this.tabHC = document.getElementById('tab-hc');

        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalTitle = document.getElementById('modal-title');
        this.modalSubtitle = document.getElementById('modal-subtitle');
        this.modalBody = document.getElementById('modal-body');
        this.modalBtn = document.getElementById('modal-btn');

        // Human Computer Modal Elements
        this.modalHC = document.getElementById('modal-human-computer');
        this.btnToggleInputA = document.getElementById('btn-toggle-input-a');
        this.btnToggleInputB = document.getElementById('btn-toggle-input-b');
        this.inputAFlag = document.getElementById('input-a-flag');
        this.inputBFlag = document.getElementById('input-b-flag');
        this.outputFlag = document.getElementById('output-flag');
        this.outputValText = document.getElementById('output-val-text');
        this.selectGateType = document.getElementById('select-gate-type');
        this.btnApplyHC = document.getElementById('btn-apply-hc');
        this.btnCloseHC = document.getElementById('btn-close-hc');

        // Pendulum Sliders
        this.sliderPendulumLen = document.getElementById('slider-pendulum-len');
        this.sliderPendulumMass = document.getElementById('slider-pendulum-mass');
        this.valPendulumLen = document.getElementById('val-pendulum-len');
        this.valPendulumMass = document.getElementById('val-pendulum-mass');
        this.pendulumResonanceVal = document.getElementById('pendulum-resonance-val');
        this.btnTogglePendulum = document.getElementById('btn-toggle-pendulum');
        this.pendulumStatus = document.getElementById('pendulum-status');

        // Sophon Elements
        this.sophonCountdown = document.getElementById('sophon-countdown');
        this.sophonWarning = document.getElementById('sophon-warning');

        this.inputAState = 1;
        this.inputBState = 1;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());

        this.btnDehydrate.addEventListener('click', () => this.toggleDehydration(true));
        this.btnRehydrate.addEventListener('click', () => this.toggleDehydration(false));

        this.tabSky.addEventListener('click', () => {
            this.currentViewMode = 'sky';
            this.tabSky.classList.add('active');
            this.tabHC.classList.remove('active');
            this.log('system', '切换至 [🌌 三体天象视图]');
        });

        this.tabHC.addEventListener('click', () => {
            this.currentViewMode = 'human_computer';
            this.tabHC.classList.add('active');
            this.tabSky.classList.remove('active');
            this.log('system', '切换至 [🪖 秦始皇三千万士兵人肉计算机列阵]');
        });

        this.btnSpeed.addEventListener('click', () => {
            if (this.timeScale === 1) this.timeScale = 2;
            else if (this.timeScale === 2) this.timeScale = 5;
            else this.timeScale = 1;
            document.getElementById('speed-label').innerText = `⏩ ${this.timeScale}x 速度`;
        });

        this.modalBtn.addEventListener('click', () => this.restartNewEpoch());

        this.btnHumanComputer.addEventListener('click', () => {
            this.modalHC.classList.add('active');
        });
        this.btnCloseHC.addEventListener('click', () => {
            this.modalHC.classList.remove('active');
        });

        this.btnToggleInputA.addEventListener('click', () => {
            this.inputAState = this.inputAState === 1 ? 0 : 1;
            this.updateHCUI();
        });
        this.btnToggleInputB.addEventListener('click', () => {
            this.inputBState = this.inputBState === 1 ? 0 : 1;
            this.updateHCUI();
        });
        this.selectGateType.addEventListener('change', () => this.updateHCUI());

        this.btnApplyHC.addEventListener('click', () => {
            const gate = this.selectGateType.value;
            if (gate === 'AND') {
                this.computeBonus = 1.5;
                this.currentViewMode = 'human_computer';
                this.tabHC.classList.add('active');
                this.tabSky.classList.remove('active');
                this.log('success', '【人肉计算机】三千万士兵逻辑门电路校验成功！全军算力提升 50%！');
                this.modalHC.classList.remove('active');
            } else {
                alert('逻辑门校验错误！请选择正确的 [与门 (AND)] 以准确求解积分。');
            }
        });

        this.sliderPendulumLen.addEventListener('input', (e) => {
            this.pendulumLength = parseInt(e.target.value);
            this.valPendulumLen.innerText = `${this.pendulumLength} m`;
        });
        this.sliderPendulumMass.addEventListener('input', (e) => {
            this.pendulumMass = parseInt(e.target.value);
            this.valPendulumMass.innerText = `${this.pendulumMass} 吨`;
        });
        this.btnTogglePendulum.addEventListener('click', () => {
            this.pendulumActive = !this.pendulumActive;
            this.btnTogglePendulum.innerText = this.pendulumActive ? '关闭单摆' : '启动单摆';
            this.pendulumStatus.innerText = this.pendulumActive ? '谐振避震中' : '未锁定';
            this.pendulumStatus.style.color = this.pendulumActive ? 'var(--green-stable)' : 'var(--amber-primary)';
            if (this.pendulumActive) {
                this.log('system', '【巨型单摆】启动重力谐振，开始对抗引力紊乱。');
            }
        });

        this.btnSophonCleanse.addEventListener('click', () => {
            this.sophonActive = false;
            this.sophonWarning.style.display = 'none';
            this.sophonCountdown.classList.remove('active');
            this.btnSophonCleanse.style.display = 'none';
            this.log('sophon', '【智子净化】施加微观高维电磁脉冲，临时驱散智子视网膜干涉！');
        });
    }

    updateHCUI() {
        this.inputAFlag.className = `flag-indicator ${this.inputAState === 1 ? 'flag-white' : 'flag-black'}`;
        this.inputBFlag.className = `flag-indicator ${this.inputBState === 1 ? 'flag-white' : 'flag-black'}`;

        const gate = this.selectGateType.value;
        let out = 0;
        if (gate === 'AND') out = (this.inputAState === 1 && this.inputBState === 1) ? 1 : 0;
        else if (gate === 'OR') out = (this.inputAState === 1 || this.inputBState === 1) ? 1 : 0;
        else if (gate === 'NAND') out = !(this.inputAState === 1 && this.inputBState === 1) ? 1 : 0;

        this.outputFlag.className = `flag-indicator ${out === 1 ? 'flag-white' : 'flag-black'}`;
        this.outputValText.innerText = `输出: ${out}`;
    }

    resizeCanvas() {
        const container = document.getElementById('canvas-container');
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
    }

    renderPhilosopherCards() {
        const listEl = document.getElementById('philosopher-list');
        listEl.innerHTML = '';

        PHILOSOPHERS.forEach(p => {
            const isUnlocked = this.techLevel >= p.techCost;
            const isActive = this.activePhilosopher.id === p.id;

            const card = document.createElement('div');
            card.className = `philosopher-card ${isActive ? 'active' : ''}`;
            card.style.opacity = isUnlocked ? '1' : '0.4';

            card.innerHTML = `
                <div class="philosopher-header">
                    <span class="philosopher-name">${p.name}</span>
                    <span class="philosopher-school">${p.school}</span>
                </div>
                <div class="philosopher-desc">${p.desc}</div>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => {
                    this.activePhilosopher = p;
                    this.renderPhilosopherCards();
                });
            }
            listEl.appendChild(card);
        });
    }

    toggleDehydration(shouldDehydrate) {
        if (this.isDehydrated === shouldDehydrate) return;
        this.isDehydrated = shouldDehydrate;
        if (shouldDehydrate) {
            this.log('warn', '【行政指令】全民脱水！三体人卷成干皮进入地下仓储。');
        } else {
            this.log('success', '【行政指令】浸泡！将干皮投入水槽，文明重获新声。');
        }
    }

    gameLoop(timestamp) {
        const delta = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;

        if (!this.isGameOver) {
            this.update(delta);
        }

        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    update(delta) {
        this.physics.step(this.timeScale);

        this.year += delta * 1.5 * this.timeScale;
        this.timeDisplay.innerText = `${Math.floor(this.year)} 年`;

        const targetProgress = this.isDehydrated ? 1 : 0;
        this.dehydrationProgress += (targetProgress - this.dehydrationProgress) * delta * 2;

        if (this.techLevel > 60 && !this.sophonActive && Math.random() < 0.002) {
            this.sophonActive = true;
            this.sophonWarning.style.display = 'block';
            this.sophonCountdown.classList.add('active');
            this.btnSophonCleanse.style.display = 'flex';
            this.log('sophon', '⚠️【智子降临】检测到来自半人马座的三体智子对数据展开微观量子干扰！');
        }

        if (this.pendulumActive) {
            const targetFreq = Math.abs(this.physics.planet.temp) + 100;
            const currentFreq = (this.pendulumLength * 0.5) + (this.pendulumMass * 0.2);
            const diff = Math.abs(targetFreq - currentFreq);

            this.resonanceRate = Math.max(0, 100 - Math.floor(diff * 0.4));
            this.pendulumResonanceVal.innerText = `${this.resonanceRate}%`;

            this.pendulumAngle += delta * 2 * (this.resonanceRate / 50);
        } else {
            this.resonanceRate = 0;
            this.pendulumResonanceVal.innerText = `0%`;
        }

        let temp = this.physics.planet.temp;

        if (this.pendulumActive && this.resonanceRate > 60) {
            temp = temp * (1 - (this.resonanceRate / 200));
        }

        if (this.sophonActive && Math.random() < 0.3) {
            temp += (Math.random() * 20 - 10);
        }

        const isExtremeTemp = temp > 90 || temp < -50;

        if (isExtremeTemp) {
            const damageRate = (1 - this.dehydrationProgress) * 0.15 * this.timeScale;
            this.population -= damageRate;

            if (Math.random() < 0.03) {
                this.log('alert', `极端气候预警！当前温度 ${temp.toFixed(1)}°C！未脱水人口受灾中！`);
            }
        } else if (!this.isDehydrated && this.population < 100) {
            this.population += 0.02 * this.timeScale;
            this.techLevel += 0.015 * this.computeBonus * this.timeScale;
            if (this.techLevel > 100) this.techLevel = 100;
            this.renderPhilosopherCards();
        }

        if (this.population <= 0) {
            this.triggerApocalypse();
        }

        this.updateUI(temp);
    }

    updateUI(temp) {
        const visibleSuns = this.physics.planet.visibleSuns;

        this.tempDisplay.innerText = `${temp.toFixed(1)} °C`;
        this.tempDisplay.style.color = temp > 80 ? '#ef4444' : (temp < -40 ? '#06b6d4' : '#f59e0b');

        this.sunsDisplay.innerText = `${visibleSuns} 颗`;

        if (this.isDehydrated) {
            this.epochStateTag.innerText = '脱水仓储';
            this.epochStateTag.className = 'state-tag dehydrated';
        } else if (temp > 80 || temp < -40) {
            this.epochStateTag.innerText = '灾难乱纪元';
            this.epochStateTag.className = 'state-tag chaotic';
        } else {
            this.epochStateTag.innerText = '恒纪元';
            this.epochStateTag.className = 'state-tag stable';
        }

        this.popVal.innerText = `${Math.max(0, this.population).toFixed(1)} 万`;
        this.popBar.style.width = `${Math.max(0, this.population)}%`;

        const hydratedPercent = Math.floor((1 - this.dehydrationProgress) * 100);
        this.hydrateVal.innerText = `${hydratedPercent}% 浸泡`;
        this.hydrateBar.style.width = `${hydratedPercent}%`;

        this.techVal.innerText = `${this.techLevel.toFixed(1)} / 100`;
        this.techBar.style.width = `${this.techLevel}%`;

        if (this.activePhilosopher) {
            const confidence = Math.floor(this.activePhilosopher.confidence * this.computeBonus);
            this.predictionText.innerText = this.activePhilosopher.predict(temp, visibleSuns);
            this.predictionConfidence.innerText = `${confidence}%`;
        }
    }

    log(type, text) {
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerText = `[${Math.floor(this.year)}年] ${text}`;
        this.logConsole.appendChild(entry);
        this.logConsole.scrollTop = this.logConsole.scrollHeight;
    }

    triggerApocalypse() {
        this.isGameOver = true;
        const temp = this.physics.planet.temp;

        let cause = '双日凌空的烈焰中毁灭';
        if (temp < -50) cause = '三日飞空的严寒中冻结成脆片';

        this.modalTitle.innerText = `文明毁灭通知`;
        this.modalSubtitle.innerText = `第 ${this.epochNumber} 号文明在${cause}`;
        this.modalBody.innerText = `在 ${Math.floor(this.year)} 年的生存挣扎中，由于未能适应乱纪元的物理毁伤，文明生灵涂炭。幸运的是，智者留下的理论遗产保留了下来，科技初始点数提升至 ${(this.techLevel + 5).toFixed(1)}。`;

        this.modalOverlay.classList.add('active');
    }

    restartNewEpoch() {
        this.epochNumber++;
        this.year = 0;
        this.population = 100.0;
        this.isDehydrated = false;
        this.dehydrationProgress = 0;
        this.isGameOver = false;

        this.physics.initSystem();
        this.modalOverlay.classList.remove('active');

        this.epochTitle.innerText = `第 ${this.epochNumber} 号文明`;
        this.log('system', `=== 毁灭后的重生：第 ${this.epochNumber} 号三体文明启幕 ===`);
    }

    render() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        if (this.currentViewMode === 'human_computer') {
            this.humanComputerVis.render(width, height);
            return;
        }

        // Celestial View Mode
        const cx = width / 2;
        const cy = height / 2;

        this.ctx.fillStyle = '#05070a';
        this.ctx.fillRect(0, 0, width, height);

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        this.ctx.lineWidth = 1;
        const gridSize = 40;
        for (let x = 0; x < width; x += gridSize) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, height); this.ctx.stroke();
        }
        for (let y = 0; y < height; y += gridSize) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(width, y); this.ctx.stroke();
        }

        // Render Pendulum
        if (this.pendulumActive) {
            const pendX = cx;
            const pendY = 60;
            const rodLen = 140;
            const bobX = pendX + Math.sin(this.pendulumAngle) * rodLen;
            const bobY = pendY + Math.cos(this.pendulumAngle) * rodLen;

            this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(pendX - 40, 20);
            this.ctx.lineTo(pendX, pendY);
            this.ctx.lineTo(pendX + 40, 20);
            this.ctx.stroke();

            this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(pendX, pendY);
            this.ctx.lineTo(bobX, bobY);
            this.ctx.stroke();

            this.ctx.fillStyle = '#06b6d4';
            this.ctx.beginPath();
            this.ctx.arc(bobX, bobY, 12, 0, Math.PI * 2);
            this.ctx.fill();

            if (this.resonanceRate > 50) {
                this.ctx.strokeStyle = `rgba(16, 185, 129, ${this.resonanceRate / 100})`;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.arc(bobX, bobY, 24, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        }

        // Render Orbit Trail
        if (this.physics.planet.history.length > 1) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
            this.ctx.lineWidth = 1.5;
            this.physics.planet.history.forEach((pt, idx) => {
                const px = cx + pt.x;
                const py = cy + pt.y;
                if (idx === 0) this.ctx.moveTo(px, py);
                else this.ctx.lineTo(px, py);
            });
            this.ctx.stroke();
        }

        // Render Suns
        this.physics.suns.forEach(sun => {
            const sx = cx + sun.x;
            const sy = cy + sun.y;

            const gradient = this.ctx.createRadialGradient(sx, sy, sun.radius * 0.3, sx, sy, sun.radius * 3.5);
            gradient.addColorStop(0, sun.color);
            gradient.addColorStop(0.5, sun.color + '66');
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, sun.radius * 3.5, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, sun.radius * 0.8, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Render Planet
        const planet = this.physics.planet;
        const px = cx + planet.x;
        const py = cy + planet.y;

        this.ctx.fillStyle = this.isDehydrated ? 'rgba(245, 158, 11, 0.5)' : 'rgba(6, 182, 212, 0.6)';
        this.ctx.beginPath();
        this.ctx.arc(px, py, planet.radius * 2, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = this.isDehydrated ? '#f59e0b' : '#06b6d4';
        this.ctx.beginPath();
        this.ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameController();
});
