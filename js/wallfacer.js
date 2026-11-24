const WALLFACER_DIRECTIVES = [
    {
        id: 'orbit_camouflage',
        name: '面壁法案·恒纪元伪装假象',
        desc: '通过放射性云层制造假性引力视星等，使智子误判乱纪元轨迹 50 年，完全消除量子干涉噪点！',
        cost: 20.0,
        apply: (game) => {
            game.sophonActive = false;
            game.log('sophon', '🕵️【面壁者密令】[恒纪元伪装假象] 生效！智子误判轨道轨迹，量子干涉被成功阻断！');
            if (window.soundEngine) window.soundEngine.playOrb();
        }
    },
    {
        id: 'thought_vault',
        name: '面壁法案·思维风暴防热盾',
        desc: '指令全军进入深层高能磁场地下要塞，未来 40 年内双日凌空毁热伤害降低 80%！',
        cost: 30.0,
        apply: (game) => {
            game.pendulumLength = 500;
            game.pendulumActive = true;
            game.resonanceRate = 100;
            game.log('success', '🛡️【面壁者密令】[思维风暴防热盾] 生效！地表要塞极高能磁场展开！');
            if (window.soundEngine) window.soundEngine.playChime();
        }
    },
    {
        id: 'droplet_counter',
        name: '面壁法案·水滴强相互作用力研究',
        desc: '密研强相互作用力材料，直接越过技术屏障获得 +25.0 科技点突破！',
        cost: 40.0,
        apply: (game) => {
            game.techLevel += 25.0;
            game.log('success', '🚀【面壁者密令】[水滴强相互作用力突破] 生效！科技跃升 +25.0 点！');
            if (window.soundEngine) window.soundEngine.playOrb();
        }
    }
];

class WallfacerManager {
    constructor(game) {
        this.game = game;
    }

    showWallfacerModal() {
        const modal = document.getElementById('modal-wallfacer');
        const container = document.getElementById('wallfacer-directives-container');

        if (!modal || !container) return;

        container.innerHTML = '';
        WALLFACER_DIRECTIVES.forEach(dir => {
            const isAfford = this.game.techLevel >= dir.cost;
            const card = document.createElement('div');
            card.className = 'archive-item';
            card.style.opacity = isAfford ? '1' : '0.5';
            card.style.cursor = isAfford ? 'pointer' : 'not-allowed';

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: bold; color: var(--amber-primary);">${dir.name}</span>
                    <span style="font-size: 0.75rem; color: var(--cyan-primary); font-family: var(--font-mono);">需要科技: ${dir.cost}</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 4px; line-height: 1.35;">${dir.desc}</div>
            `;

            if (isAfford) {
                card.addEventListener('click', () => {
                    this.game.techLevel -= dir.cost;
                    dir.apply(this.game);
                    modal.classList.remove('active');
                    modal.style.display = 'none';
                });
            }

            container.appendChild(card);
        });

        modal.style.display = 'flex';
        modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playChime();
    }

    closeWallfacerModal() {
        const modal = document.getElementById('modal-wallfacer');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }
}

function openWallfacerModal() {
    if (window.game && window.game.wallfacerManager) {
        window.game.wallfacerManager.showWallfacerModal();
    } else {
        const wf = new WallfacerManager();
        wf.showWallfacerModal();
    }
}

function closeWallfacerModal() {
    if (window.game && window.game.wallfacerManager) {
        window.game.wallfacerManager.closeWallfacerModal();
    } else {
        const modal = document.getElementById('modal-wallfacer');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
    }
}

window.WallfacerManager = WallfacerManager;
window.openWallfacerModal = openWallfacerModal;
window.closeWallfacerModal = closeWallfacerModal;
