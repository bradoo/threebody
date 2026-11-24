class GameController {
    constructor() {
        this.physics = new ThreeBodyPhysics();

        this.epochNumber = 137;
        this.year = 0;
        this.timeScale = 1;
        this.currentViewMode = 'sky';

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
        this.highResonanceStreak = 0;

        // Sophon & Dilemmas & Relics & Archives & Codex & Wallfacer & Quizzes
        this.sophonActive = false;
        this.activeDilemma = null;

        this.activePhilosophers = [PHILOSOPHERS[0]];
        this.isGameOver = false;

        this.setupDOMReferences();
        this.humanComputerVis = new HumanComputerVisualizer(this.canvas, this.ctx);
        this.three3DVis = new Three3DViewRenderer(document.getElementById('canvas-container'));
        this.three3DVis.init();

        this.eventManager = new RandomEventManager(this);
        this.relicManager = new RelicDraftManager(this);
        this.synergyManager = new SynergyManager(this);
        this.archivesManager = new CivilizationArchives(this);
        this.codexManager = new ScientificCodexManager(this);
        this.wallfacerManager = new WallfacerManager(this);
        this.quizManager = new InteractiveQuizManager(this);

        this.setupEventListeners();
        this.renderPhilosopherCards();
        this.resizeCanvas();

        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));

        this.log('system', `[系统启幕] 第 ${this.epochNumber} 号三体文明启程。`);

        setTimeout(() => this.relicManager.showRelicDraftModal(), 600);
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
        this.btnArchives = document.getElementById('btn-archives');
        this.btnCodex = document.getElementById('btn-codex');
        this.btnWallfacer = document.getElementById('btn-wallfacer');
        this.btnQuiz = document.getElementById('btn-quiz');

        this.tabSky = document.getElementById('tab-sky');
        this.tab3DSky = document.getElementById('tab-3d-sky');
        this.tabHC = document.getElementById('tab-hc');
        this.tab3DHC = document.getElementById('tab-3d-hc');

        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalTitle = document.getElementById('modal-title');
        this.modalSubtitle = document.getElementById('modal-subtitle');
        this.modalBody = document.getElementById('modal-body');
        this.modalBtn = document.getElementById('modal-btn');

        this.dilemmaPopup = document.getElementById('dilemma-popup');
        this.dilemmaTitle = document.getElementById('dilemma-title');
        this.dilemmaDesc = document.getElementById('dilemma-desc');
        this.btnDilemmaOptA = document.getElementById('btn-dilemma-opt-a');
        this.btnDilemmaOptB = document.getElementById('btn-dilemma-opt-b');

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

        this.modalArchives = document.getElementById('modal-archives');
        this.btnCloseArchives = document.getElementById('btn-close-archives');

        this.modalCodex = document.getElementById('modal-codex');
        this.btnCloseCodex = document.getElementById('btn-close-codex');

        this.modalWallfacer = document.getElementById('modal-wallfacer');
        this.btnCloseWallfacer = document.getElementById('btn-close-wallfacer');

        this.modalQuiz = document.getElementById('modal-quiz');
        this.btnCloseQuiz = document.getElementById('btn-close-quiz');

        this.sliderPendulumLen = document.getElementById('slider-pendulum-len');
        this.sliderPendulumMass = document.getElementById('slider-pendulum-mass');
        this.valPendulumLen = document.getElementById('val-pendulum-len');
        this.valPendulumMass = document.getElementById('val-pendulum-mass');
        this.pendulumResonanceVal = document.getElementById('pendulum-resonance-val');
        this.btnTogglePendulum = document.getElementById('btn-toggle-pendulum');
        this.pendulumStatus = document.getElementById('pendulum-status');

        this.sophonCountdown = document.getElementById('sophon-countdown');
        this.sophonWarning = document.getElementById('sophon-warning');

        this.inputAState = 1;
        this.inputBState = 1;
    }

    setupEventListeners() {
        window.addEventListener('resize', () => this.resizeCanvas());

        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const cx = this.canvas.width / 2;
            const cy = this.canvas.height / 2;

            this.physics.cosmicOrbs.forEach((orb, idx) => {
                const ox = cx + orb.x;
                const oy = cy + orb.y;
                const dist = Math.sqrt((mouseX - ox) ** 2 + (mouseY - oy) ** 2);

                if (dist < orb.radius + 15) {
                    this.physics.cosmicOrbs.splice(idx, 1);
                    if (window.soundEngine) window.soundEngine.playOrb();

                    if (orb.type === 'tech') {
                        this.techLevel += 5.0;
                        this.log('success', '✨【手动吸收】点击收集天象宇宙晶体！科技点 +5.0！');
                    } else {
                        this.computeBonus += 0.2;
                        this.log('success', '⚡【手动吸收】点击采集太阳耀斑能核！全军算力 +20%！');
                    }
                }
            });
        });

        this.btnDehydrate.addEventListener('click', () => this.toggleDehydration(true));
        this.btnRehydrate.addEventListener('click', () => this.toggleDehydration(false));

        if (this.btnArchives) {
            this.btnArchives.addEventListener('click', () => {
                if (window.openArchivesModal) window.openArchivesModal();
            });
        }

        if (this.btnCodex) {
            this.btnCodex.addEventListener('click', () => {
                if (window.openCodexModal) window.openCodexModal();
            });
        }

        if (this.btnWallfacer) {
            this.btnWallfacer.addEventListener('click', () => {
                if (window.openWallfacerModal) window.openWallfacerModal();
            });
        }

        if (this.btnQuiz) {
            this.btnQuiz.addEventListener('click', () => {
                if (window.openRandomQuiz) window.openRandomQuiz();
            });
        }

        if (this.btnCloseArchives) {
            this.btnCloseArchives.addEventListener('click', () => {
                if (window.closeArchivesModal) window.closeArchivesModal();
            });
        }

        if (this.btnCloseCodex) {
            this.btnCloseCodex.addEventListener('click', () => {
                if (window.closeCodexModal) window.closeCodexModal();
            });
        }

        if (this.btnCloseWallfacer) {
            this.btnCloseWallfacer.addEventListener('click', () => {
                if (window.closeWallfacerModal) window.closeWallfacerModal();
            });
        }

        if (this.btnCloseQuiz) {
            this.btnCloseQuiz.addEventListener('click', () => {
                if (window.closeQuizModal) window.closeQuizModal();
            });
        }

        const viewTabs = [
            { btn: this.tabSky, mode: 'sky', label: '2D天象视图' },
            { btn: this.tab3DSky, mode: '3d_sky', label: '3D三体宇宙视图' },
            { btn: this.tabHC, mode: 'human_computer', label: '2D人肉计算机阵列' },
            { btn: this.tab3DHC, mode: '3d_human_computer', label: '3D秦始皇三千万士兵方阵' }
        ];

        viewTabs.forEach(tab => {
            if (tab.btn) {
                tab.btn.addEventListener('click', () => {
                    viewTabs.forEach(t => t.btn && t.btn.classList.remove('active'));
                    tab.btn.classList.add('active');
                    this.currentViewMode = tab.mode;
                    if (window.soundEngine) window.soundEngine.playChime();
                    this.log('system', `切换至 [ ${tab.label} ]`);
                });
            }
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
                if (this.tabHC) {
                    [this.tabSky, this.tab3DSky, this.tabHC, this.tab3DHC].forEach(b => b && b.classList.remove('active'));
                    this.tabHC.classList.add('active');
                }
                if (window.soundEngine) window.soundEngine.playChime();
                this.codexManager.unlockAchievement('logic_gate_master');
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
                if (window.soundEngine) window.soundEngine.playChime();
                this.log('system', '【巨型单摆】启动重力谐振，开始对抗引力紊乱。');
            }
        });

        this.btnSophonCleanse.addEventListener('click', () => {
            this.sophonActive = false;
            this.sophonWarning.style.display = 'none';
            this.sophonCountdown.classList.remove('active');
            this.btnSophonCleanse.style.display = 'none';
            if (window.soundEngine) window.soundEngine.playChime();
            this.log('sophon', '【智子净化】施加微观高维电磁脉冲，临时驱散智子视网膜干涉！');
        });
    }

    showDilemmaCard(dilemma) {
        this.activeDilemma = dilemma;
        this.dilemmaTitle.innerText = dilemma.title;
        this.dilemmaDesc.innerText = dilemma.desc;

        this.btnDilemmaOptA.innerText = `A. ${dilemma.optionA.text}`;
        this.btnDilemmaOptB.innerText = `B. ${dilemma.optionB.text}`;

        this.btnDilemmaOptA.onclick = () => {
            dilemma.optionA.action(this);
            this.hideDilemmaCard();
        };
        this.btnDilemmaOptB.onclick = () => {
            dilemma.optionB.action(this);
            this.hideDilemmaCard();
        };

        this.dilemmaPopup.classList.add('active');
    }

    hideDilemmaCard() {
        this.dilemmaPopup.classList.remove('active');
        this.activeDilemma = null;
    }

    triggerScreenShake() {
        if (window.soundEngine) window.soundEngine.playAlarm();
        const container = document.querySelector('.viewport-container');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
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
        const width = container.clientWidth;
        const height = container.clientHeight;
        this.canvas.width = width;
        this.canvas.height = height;

        if (this.three3DVis) {
            this.three3DVis.resize(width, height);
        }
    }

    renderPhilosopherCards() {
        const listEl = document.getElementById('philosopher-list');
        listEl.innerHTML = '';

        PHILOSOPHERS.forEach(p => {
            const isUnlocked = this.techLevel >= p.techCost;
            const isActive = this.activePhilosophers.some(ap => ap.id === p.id);

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
                    if (isActive) {
                        if (this.activePhilosophers.length > 1) {
                            this.activePhilosophers = this.activePhilosophers.filter(ap => ap.id !== p.id);
                        }
                    } else {
                        if (this.activePhilosophers.length >= 2) {
                            this.activePhilosophers.shift();
                        }
                        this.activePhilosophers.push(p);
                    }
                    this.renderPhilosopherCards();
                    this.synergyManager.checkSynergies(this.activePhilosophers.map(ap => ap.id));

                    if (this.activePhilosophers.some(ap => ap.id === 'einstein')) {
                        this.codexManager.unlockAchievement('sophon_immunity');
                    }
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
            if (this.physics.planet.temp > 90) {
                this.codexManager.unlockAchievement('fire_survivor');
            }
        } else {
            if (window.soundEngine) window.soundEngine.playSplash();
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
        this.eventManager.step(delta);

        this.year += delta * 1.5 * this.timeScale;
        this.timeDisplay.innerText = `${Math.floor(this.year)} 年`;

        const targetProgress = this.isDehydrated ? 1 : 0;
        this.dehydrationProgress += (targetProgress - this.dehydrationProgress) * delta * 2;

        if (this.techLevel > 60 && !this.sophonActive && Math.random() < 0.002) {
            const hasEinstein = this.activePhilosophers.some(ap => ap.id === 'einstein');
            if (!hasEinstein) {
                this.sophonActive = true;
                this.sophonWarning.style.display = 'block';
                this.sophonCountdown.classList.add('active');
                this.btnSophonCleanse.style.display = 'flex';
                if (window.soundEngine) window.soundEngine.playAlarm();
                this.log('sophon', '⚠️【智子降临】检测到来自半人马座的三体智子对数据展开微观量子干扰！');
            }
        }

        if (this.pendulumActive) {
            const targetFreq = Math.abs(this.physics.planet.temp) + 100;
            const currentFreq = (this.pendulumLength * 0.5) + (this.pendulumMass * 0.2);
            const diff = Math.abs(targetFreq - currentFreq);

            this.resonanceRate = Math.max(0, 100 - Math.floor(diff * 0.4));
            this.pendulumResonanceVal.innerText = `${this.resonanceRate}%`;

            if (this.resonanceRate > 80) {
                this.codexManager.unlockAchievement('gravity_lock');
            }

            if (this.resonanceRate > 85) this.highResonanceStreak += delta * this.timeScale;
            else this.highResonanceStreak = 0;

            this.pendulumAngle += delta * 2 * (this.resonanceRate / 50);
        } else {
            this.resonanceRate = 0;
            this.highResonanceStreak = 0;
            this.pendulumResonanceVal.innerText = `0%`;
        }

        let temp = this.physics.planet.temp;

        if (this.pendulumActive && this.resonanceRate > 60) {
            temp = temp * (1 - (this.resonanceRate / 200));
        }

        if (this.sophonActive && !this.activePhilosophers.some(ap => ap.id === 'einstein') && Math.random() < 0.3) {
            temp += (Math.random() * 20 - 10);
        }

        const isExtremeTemp = temp > 90 || temp < -50;

        if (isExtremeTemp) {
            const damageRate = (1 - this.dehydrationProgress) * 0.15 * this.timeScale;
            this.population -= damageRate;
        } else if (!this.isDehydrated && this.population < 100) {
            const hasCopernicus = this.activePhilosophers.some(ap => ap.id === 'copernicus');
            const growthBonus = hasCopernicus ? 1.2 : 1.0;
            this.population += 0.02 * growthBonus * this.timeScale;
            this.techLevel += 0.015 * this.computeBonus * this.timeScale;

            if (this.techLevel >= 100) {
                this.triggerVictory("启动光速曲率飞船逃离三体星系");
                return;
            }
            this.renderPhilosopherCards();
        }

        if (this.highResonanceStreak > 60) {
            this.triggerVictory("通过巨型单摆锁定双星拉格朗日平动点，建立万年稳定恒纪元");
            return;
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

        if (this.activePhilosophers.length > 0) {
            const p = this.activePhilosophers[0];
            const confidence = Math.floor(p.confidence * this.computeBonus);
            this.predictionText.innerText = p.predict(temp, visibleSuns);
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

    triggerVictory(reason) {
        this.isGameOver = true;
        this.modalTitle.innerText = `🎉 三体文明终极胜利！`;
        this.modalSubtitle.innerText = `第 ${this.epochNumber} 号文明成功拯救了自身`;
        this.modalBody.innerText = `在经历了 ${Math.floor(this.year)} 年的浴血挣扎后，文明通过【${reason}】。三体星人终于摆脱了毁灭的宿命！`;

        this.archivesManager.recordEpoch(
            this.epochNumber,
            this.year,
            "终极拯救成功！",
            this.techLevel,
            reason
        );

        this.modalOverlay.classList.add('active');
    }

    triggerApocalypse() {
        this.isGameOver = true;
        const temp = this.physics.planet.temp;

        let cause = '双日凌空的烈焰中毁灭';
        if (temp < -50) cause = '三日飞空的严寒中冻结成脆片';

        this.modalTitle.innerText = `文明毁灭通知`;
        this.modalSubtitle.innerText = `第 ${this.epochNumber} 号文明在${cause}`;
        this.modalBody.innerText = `在 ${Math.floor(this.year)} 年的生存挣扎中，由于未能适应乱纪元的物理毁伤，文明生灵涂炭。幸运的是，智者留下的理论遗产保留了下来，科技初始点数提升至 ${(this.techLevel + 5).toFixed(1)}。`;

        this.archivesManager.recordEpoch(
            this.epochNumber,
            this.year,
            cause,
            this.techLevel,
            this.activePhilosophers[0] ? this.activePhilosophers[0].school : '遗基遗产'
        );

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

        setTimeout(() => this.relicManager.showRelicDraftModal(), 400);
    }

    render() {
        const width = this.canvas.width;
        const height = this.canvas.height;

        if (this.currentViewMode === '3d_sky' || this.currentViewMode === '3d_human_computer') {
            this.canvas.style.display = 'none';
            if (this.three3DVis) this.three3DVis.updateAndRender(this.physics, this.currentViewMode);
            return;
        }

        if (this.three3DVis) this.three3DVis.hide();
        this.canvas.style.display = 'block';

        if (this.currentViewMode === 'human_computer') {
            this.humanComputerVis.render(width, height);
            return;
        }

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

        this.physics.cosmicOrbs.forEach(orb => {
            const ox = cx + orb.x;
            const oy = cy + orb.y;

            const orbGrad = this.ctx.createRadialGradient(ox, oy, 2, ox, oy, orb.radius * 2);
            orbGrad.addColorStop(0, '#ffffff');
            orbGrad.addColorStop(0.5, orb.type === 'tech' ? '#06b6d4' : '#f59e0b');
            orbGrad.addColorStop(1, 'transparent');

            this.ctx.fillStyle = orbGrad;
            this.ctx.beginPath();
            this.ctx.arc(ox, oy, orb.radius * 2, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(ox, oy, orb.radius * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
        });

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

        const planet = this.physics.planet;
        const px = cx + planet.x;
        const py = cy + planet.y;
        const temp = planet.temp;

        let planetGlow = 'rgba(6, 182, 212, 0.6)';
        let planetColor = '#06b6d4';

        if (temp > 70) {
            planetGlow = 'rgba(239, 68, 68, 0.8)';
            planetColor = '#ef4444';
        } else if (temp < -30) {
            planetGlow = 'rgba(56, 189, 248, 0.8)';
            planetColor = '#38bdf8';
        } else if (this.isDehydrated) {
            planetGlow = 'rgba(245, 158, 11, 0.5)';
            planetColor = '#f59e0b';
        }

        this.ctx.fillStyle = planetGlow;
        this.ctx.beginPath();
        this.ctx.arc(px, py, planet.radius * 2.5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = planetColor;
        this.ctx.beginPath();
        this.ctx.arc(px, py, planet.radius, 0, Math.PI * 2);
        this.ctx.fill();

        if (temp > 70) {
            this.ctx.strokeStyle = '#f59e0b';
            this.ctx.lineWidth = 1.2;
            this.ctx.beginPath();
            this.ctx.moveTo(px - 3, py - 3); this.ctx.lineTo(px + 2, py + 1); this.ctx.lineTo(px - 1, py + 4);
            this.ctx.stroke();
        } else if (temp < -30) {
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(px - 4, py); this.ctx.lineTo(px + 4, py);
            this.ctx.moveTo(px, py - 4); this.ctx.lineTo(px, py + 4);
            this.ctx.stroke();
        }

        if (window.climateParticleEngine) {
            window.climateParticleEngine.updateAndRender(this.ctx, width, height, temp, px, py);
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.game = new GameController();
});
