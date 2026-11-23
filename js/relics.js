const RELICS = [
    {
        id: 'pressurized_vault',
        name: '干皮高压舱',
        desc: '地下干皮仓采用隔绝高压技术，脱水人口抗霉变能力 +50%，且脱水率提升速度加快。',
        icon: '🏛️',
        apply: (game) => {
            game.log('success', '📜【遗基宝物】激活：[干皮高压舱]！干皮抗霉变能力大增！');
        }
    },
    {
        id: 'deep_water_well',
        name: '墨家深井水槽',
        desc: '在地下打通深水温泉井，恒纪元浸泡状态下人口恢复与增长速度 +30%。',
        icon: '💧',
        apply: (game) => {
            game.log('success', '📜【遗基宝物】激活：[墨家深井水槽]！恒纪元人口增长速度 +30%！');
        }
    },
    {
        id: 'sophon_damper',
        name: '智子微观阻尼器',
        desc: '安装量子高频相位阻尼器，三体智子干扰的触发间隔延长 200%。',
        icon: '🛡️',
        apply: (game) => {
            game.log('success', '📜【遗基宝物】激活：[智子微观阻尼器]！智子干涉频率显著降低！');
        }
    },
    {
        id: 'bronze_gravimeter',
        name: '青铜万有引力仪',
        desc: '巨型单摆自带自动重力感应对齐，单摆基础锁定率直接提升 20%。',
        icon: '⚖️',
        apply: (game) => {
            game.pendulumLength = 300;
            game.log('success', '📜【遗基宝物】激活：[青铜万有引力仪]！巨型单摆获得基础引力锁加成！');
        }
    }
];

class RelicDraftManager {
    constructor(game) {
        this.game = game;
        this.selectedRelic = null;
    }

    showRelicDraftModal() {
        const modal = document.getElementById('modal-relic-draft');
        const container = document.getElementById('relic-options-container');
        container.innerHTML = '';

        // Shuffle & pick 3 relics
        const shuffled = [...RELICS].sort(() => 0.5 - Math.random()).slice(0, 3);

        shuffled.forEach(relic => {
            const card = document.createElement('div');
            card.className = 'relic-card';
            card.innerHTML = `
                <div style="font-size: 2rem; text-align: center;">${relic.icon}</div>
                <div class="relic-title">${relic.name}</div>
                <div class="relic-desc">${relic.desc}</div>
            `;

            card.addEventListener('click', () => {
                relic.apply(this.game);
                this.selectedRelic = relic;
                modal.classList.remove('active');
            });

            container.appendChild(card);
        });

        modal.classList.add('active');
    }
}
