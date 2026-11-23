class RandomEventManager {
    constructor(game) {
        this.game = game;
        this.eventCooldown = 0;
    }

    step(delta) {
        if (this.game.isGameOver) return;

        this.eventCooldown += delta * this.game.timeScale;
        if (this.eventCooldown > 15) { // Check event trigger every 15 simulated seconds
            this.eventCooldown = 0;
            this.rollRandomEvent();
        }
    }

    rollRandomEvent() {
        const roll = Math.random();
        const temp = this.game.physics.planet.temp;
        const visibleSuns = this.physicsPlanetVisibleSuns();

        // Event 1: Double Sun Zenith (双日凌空)
        if (visibleSuns >= 2 && temp > 120 && roll < 0.35) {
            this.game.log('alert', '🔥【天灾事件：双日凌空】双日重叠汇聚焦点！未脱水人口与建筑物开始剧烈焚毁！');
            if (!this.game.isDehydrated) {
                this.game.population -= 8.0;
            }
            return;
        }

        // Event 2: Triple Flying Stars (三日飞空)
        if (temp < -70 && roll < 0.35) {
            this.game.log('alert', '❄️【天灾事件：三日飞空】三日远离，地表骤降至绝对零度，水体与大气冻结成脆片！');
            if (!this.game.isDehydrated) {
                this.game.population -= 6.0;
            }
            return;
        }

        // Event 3: Warehouse Mold (干皮仓真菌发霉)
        if (this.game.isDehydrated && this.game.dehydrationProgress > 0.8 && roll < 0.25) {
            const loss = (this.game.population * 0.1).toFixed(1);
            this.game.population -= parseFloat(loss);
            this.game.log('warn', `🦠【事故事件：干皮仓真菌发霉】长达数百年的脱水导致地下仓库局部潮湿，损失 ${loss} 万干皮人口！`);
            return;
        }

        // Event 4: Giant Tear (大撕扯)
        if (visibleSuns === 3 && roll < 0.2) {
            this.game.log('alert', '🌋【天灾事件：大撕扯】行星处于三星引力鞍点，地壳剧烈撕裂，板块坍塌！');
            if (!this.game.isDehydrated) {
                this.game.population -= 12.0;
            }
            return;
        }

        // Event 5: Soldier Heatstroke (人肉计算机传令兵中暑)
        if (this.game.computeBonus > 1.0 && temp > 70 && roll < 0.3) {
            this.game.computeBonus = 1.0;
            this.game.log('warn', '☀️【事故事件：传令兵中暑】酷热导致三千万士兵人肉计算机出现比特翻转，算力加成暂时失效！');
            return;
        }
    }

    physicsPlanetVisibleSuns() {
        return this.game.physics.planet.visibleSuns || 1;
    }
}
