const SYNERGIES = [
    {
        id: 'oriental_rationality',
        name: '东方理性',
        req: ['wenwang', 'mozi'],
        desc: '周易卦象与墨家光学暗室相互印证！预测可靠度 +25%，算力需求 -30%。',
        apply: (game) => {
            game.computeBonus += 0.25;
        }
    },
    {
        id: 'classical_science',
        name: '经典科学',
        req: ['copernicus', 'newton'],
        desc: '日心说与万有引力定律结合！科研点积累速率 +40%，平稳轨道预测加成。',
        apply: (game) => {
            game.techLevel += 0.01; // Passive tech gain boost
        }
    },
    {
        id: 'ultimate_compute',
        name: '终极算力',
        req: ['von_neumann', 'einstein'],
        desc: '人肉计算机与广义相对论结合！求解彻底免疫智子干涉，算力额外 +50%。',
        apply: (game) => {
            game.sophonActive = false; // Suppress sophon
            game.computeBonus += 0.5;
        }
    }
];

class SynergyManager {
    constructor(game) {
        this.game = game;
        this.activeSynergy = null;
    }

    checkSynergies(selectedIds) {
        this.activeSynergy = null;

        for (const syn of SYNERGIES) {
            const hasAll = syn.req.every(id => selectedIds.includes(id));
            if (hasAll) {
                this.activeSynergy = syn;
                syn.apply(this.game);
                this.game.log('success', `✨【隐藏羁绊激活】[${syn.name}]：${syn.desc}`);
                break;
            }
        }

        this.updateSynergyUI();
    }

    updateSynergyUI() {
        const badge = document.getElementById('synergy-badge');
        if (!badge) return;

        if (this.activeSynergy) {
            badge.innerText = `✨ 羁绊激活: ${this.activeSynergy.name}`;
            badge.style.display = 'block';
            badge.title = this.activeSynergy.desc;
        } else {
            badge.style.display = 'none';
        }
    }
}
