const ACHIEVEMENTS = [
    {
        id: 'fire_survivor',
        name: '火海生灵',
        desc: '在双日凌空烈焰到来前成功进行全民脱水避难。',
        icon: '🔥'
    },
    {
        id: 'logic_gate_master',
        name: '算暴狂徒',
        desc: '成功校验秦始皇三千万士兵与门逻辑电路，解锁 50% 算力加成。',
        icon: '🧮'
    },
    {
        id: 'gravity_lock',
        name: '引力锁扣',
        desc: '调节摆长与质量，使巨型单摆重力谐振锁定率超过 80%。',
        icon: '⚙️'
    },
    {
        id: 'sophon_immunity',
        name: '理性的胜利',
        desc: '上阵爱因斯坦并解锁广义相对论，彻底免疫智子微观量子干扰。',
        icon: '👁️'
    }
];

const CODEX_ENTRIES = [
    {
        id: 'zhouyi_theory',
        title: '《周易卦象概率论》',
        author: '周文王',
        content: '利用阴阳八卦六十四卦爻辞，归纳早期三体星系混沌运动的统计学概率分布。虽然在平稳轨可行，但在引力共振区极易陷入伪随机发散。'
    },
    {
        id: 'mozi_optics',
        title: '《墨子暗室小孔反射》',
        author: '墨子',
        content: '构建 1:1000 比例的双层铜球观察室，利用光线直线传播与小孔成像原理，精确测定双日凌空角距离与大撕扯前兆。'
    },
    {
        id: 'copernican_system',
        title: '《哥白尼日心说》',
        author: '哥白尼',
        content: '打破天圆地方的神学迷信，建立太阳中心公转坐标系，将三体星系轨道的预测盲区缩小 40%。'
    },
    {
        id: 'newtonian_calculus',
        title: '《牛顿万有引力与微积分》',
        author: '牛顿 & 莱布尼茨',
        content: '发明 Fluxion (流数法微积分) 与万有引力定律，求得平稳双星体系数值代数解。对于三体问题可以进行短暂步长数值推演。'
    },
    {
        id: 'von_neumann_array',
        title: '《三千万阵列高阶数值积分》',
        author: '冯·诺依曼 & 秦始皇',
        content: '利用三千万士兵挥舞白旗(1)与黑旗(0)构建非门、与门、或门、全加器逻辑总线，以海量并行算力数值求解混沌引力方程。'
    },
    {
        id: 'einstein_relativity',
        title: '《爱因斯坦广义相对论时空曲率》',
        author: '爱因斯坦',
        content: '将重力解释为高维时空弯曲，捕捉三体恒星引力透镜效应，能够完全无视智子在微观层面施加的量子电磁干涉。'
    }
];

function switchCodexTab(tabName) {
    const tabAch = document.getElementById('codex-tab-ach');
    const tabLaws = document.getElementById('codex-tab-laws');
    const viewAch = document.getElementById('codex-ach-view');
    const viewLaws = document.getElementById('codex-laws-view');

    if (!tabAch || !tabLaws || !viewAch || !viewLaws) return;

    if (tabName === 'ach') {
        tabAch.classList.add('active');
        tabLaws.classList.remove('active');
        viewAch.classList.add('active');
        viewLaws.classList.remove('active');
    } else {
        tabLaws.classList.add('active');
        tabAch.classList.remove('active');
        viewLaws.classList.add('active');
        viewAch.classList.remove('active');
    }
}

class ScientificCodexManager {
    constructor(game) {
        this.game = game;
        this.unlockedAchievements = JSON.parse(localStorage.getItem('threebody_achievements') || '[]');
    }

    unlockAchievement(id) {
        if (this.unlockedAchievements.includes(id)) return;
        this.unlockedAchievements.push(id);
        localStorage.setItem('threebody_achievements', JSON.stringify(this.unlockedAchievements));

        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) {
            this.game.log('success', `🏆【成就解锁】[${ach.name}]：${ach.desc}`);
            if (window.soundEngine) window.soundEngine.playOrb();
        }
    }

    showCodexModal() {
        const modal = document.getElementById('modal-codex');
        const achContainer = document.getElementById('codex-achievements-container');
        const theoryContainer = document.getElementById('codex-theory-container');

        if (!modal || !achContainer || !theoryContainer) return;

        // Render Achievements
        achContainer.innerHTML = '';
        ACHIEVEMENTS.forEach(ach => {
            const isUnlocked = this.unlockedAchievements.includes(ach.id);
            const card = document.createElement('div');
            card.className = 'archive-item';
            card.style.opacity = isUnlocked ? '1' : '0.4';
            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.4rem;">${ach.icon}</span>
                    <div>
                        <div style="font-weight: bold; color: ${isUnlocked ? 'var(--amber-primary)' : 'var(--text-muted)'};">${ach.name} ${isUnlocked ? ' (已解锁)' : ' (未解锁)'}</div>
                        <div style="font-size: 0.78rem; color: var(--text-main); margin-top: 2px;">${ach.desc}</div>
                    </div>
                </div>
            `;
            achContainer.appendChild(card);
        });

        // Render Codex Physics Laws
        theoryContainer.innerHTML = '';
        CODEX_ENTRIES.forEach(entry => {
            const item = document.createElement('div');
            item.className = 'archive-item';
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: var(--cyan-primary);">${entry.title}</span>
                    <span style="font-size: 0.75rem; color: var(--amber-primary); font-family: var(--font-mono);">${entry.author}</span>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-main); line-height: 1.35; margin-top: 4px;">${entry.content}</div>
            `;
            theoryContainer.appendChild(item);
        });

        switchCodexTab('ach'); // Default to Achievements tab
        modal.style.display = 'flex';
        modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playChime();
    }

    closeCodexModal() {
        const modal = document.getElementById('modal-codex');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }
}

function openCodexModal() {
    if (window.game && window.game.codexManager) {
        window.game.codexManager.showCodexModal();
    } else {
        const codex = new ScientificCodexManager();
        codex.showCodexModal();
    }
}

function closeCodexModal() {
    if (window.game && window.game.codexManager) {
        window.game.codexManager.closeCodexModal();
    } else {
        const modal = document.getElementById('modal-codex');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }
}

window.ScientificCodexManager = ScientificCodexManager;
window.openCodexModal = openCodexModal;
window.closeCodexModal = closeCodexModal;
window.switchCodexTab = switchCodexTab;
