class RandomEventManager {
    constructor(game) {
        this.game = game;
        this.eventCooldown = 0;
        this.dilemmaCooldown = 0;
        this.quizCooldown = 0;
    }

    step(delta) {
        if (this.game.isGameOver) return;

        this.eventCooldown += delta * this.game.timeScale;
        this.dilemmaCooldown += delta * this.game.timeScale;
        this.quizCooldown += delta * this.game.timeScale;

        if (Math.random() < 0.01) {
            this.game.physics.spawnCosmicOrb(this.game.canvas.width, this.game.canvas.height);
        }

        // Trigger Random Disasters
        if (this.eventCooldown > 12) {
            this.eventCooldown = 0;
            this.rollRandomEvent();
        }

        // Trigger Choice Dilemmas
        if (this.dilemmaCooldown > 20) {
            this.dilemmaCooldown = 0;
            this.triggerRandomDilemma();
        }

        // Trigger Interactive Philosopher Quizzes
        if (this.quizCooldown > 25) {
            this.quizCooldown = 0;
            if (this.game.quizManager) {
                this.game.quizManager.triggerRandomQuiz();
            }
        }
    }

    triggerRandomDilemma() {
        if (this.game.activeDilemma || (this.game.quizManager && this.game.quizManager.currentQuiz)) return;
        const dilemma = DILEMMAS[Math.floor(Math.random() * DILEMMAS.length)];
        this.game.showDilemmaCard(dilemma);
    }

    rollRandomEvent() {
        const roll = Math.random();
        const temp = this.game.physics.planet.temp;
        const visibleSuns = this.physicsPlanetVisibleSuns();

        if (visibleSuns >= 2 && temp > 120 && roll < 0.4) {
            this.game.triggerScreenShake();
            this.game.log('alert', '🔥【天灾事件：双日凌空】双日重叠汇聚焦点！未脱水人口与建筑物开始剧烈焚毁！');
            if (!this.game.isDehydrated) {
                this.game.population -= 8.0;
            }
            return;
        }

        if (temp < -70 && roll < 0.4) {
            this.game.triggerScreenShake();
            this.game.log('alert', '❄️【天灾事件：三日飞空】三日远离，地表骤降至绝对零度，水体与大气冻结成脆片！');
            if (!this.game.isDehydrated) {
                this.game.population -= 6.0;
            }
            return;
        }

        if (this.game.isDehydrated && this.game.dehydrationProgress > 0.8 && roll < 0.3) {
            const loss = (this.game.population * 0.1).toFixed(1);
            this.game.population -= parseFloat(loss);
            this.game.log('warn', `🦠【事故事件：干皮仓真菌发霉】长达数百年的脱水导致地下仓库局部潮湿，损失 ${loss} 万干皮人口！`);
            return;
        }

        if (visibleSuns === 3 && roll < 0.25) {
            this.game.triggerScreenShake();
            this.game.log('alert', '🌋【天灾事件：大撕扯】行星处于三星引力鞍点，地壳剧烈撕裂，板块坍塌！');
            if (!this.game.isDehydrated) {
                this.game.population -= 12.0;
            }
            return;
        }
    }

    physicsPlanetVisibleSuns() {
        return this.game.physics.planet.visibleSuns || 1;
    }
}
