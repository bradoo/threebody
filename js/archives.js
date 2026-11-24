class CivilizationArchives {
    constructor(game) {
        this.game = game;
        this.history = [];
        this.loadHistory();
    }

    loadHistory() {
        try {
            this.history = JSON.parse(localStorage.getItem('threebody_civilization_archives') || '[]');
        } catch (e) {
            this.history = [];
        }
    }

    recordEpoch(epochNum, years, cause, peakTech, legacy) {
        this.loadHistory();
        const record = {
            epoch: epochNum,
            years: Math.floor(years || 0),
            cause: cause || '文明灭绝',
            peakTech: typeof peakTech === 'number' ? peakTech.toFixed(1) : (peakTech || '0.0'),
            legacy: legacy || '无',
            timestamp: new Date().toLocaleString()
        };

        this.history.unshift(record);
        if (this.history.length > 50) this.history.pop();

        try {
            localStorage.setItem('threebody_civilization_archives', JSON.stringify(this.history));
        } catch (e) {
            console.error('Failed to save archives to localStorage:', e);
        }
    }

    showArchivesModal() {
        this.loadHistory();
        const modal = document.getElementById('modal-archives');
        const listContainer = document.getElementById('archives-list-container');
        const statsHeader = document.getElementById('archives-stats-header');

        if (!modal || !listContainer) {
            console.error('Archives modal DOM elements missing');
            return;
        }

        const totalPlayed = this.history.length;
        const maxYears = this.history.reduce((max, r) => (r.years > max ? r.years : max), 0);

        if (statsHeader) {
            statsHeader.innerText = `历史总纪元: ${totalPlayed} 个 | 最长生存记录: ${maxYears} 年`;
        }

        if (this.history.length === 0) {
            listContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 24px; font-size: 0.85rem;">尚无历史文明毁灭/胜利记录。请开始游戏试玩！</div>';
        } else {
            listContainer.innerHTML = '';
            this.history.forEach(r => {
                const item = document.createElement('div');
                item.className = 'archive-item';
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: var(--cyan-primary);">第 ${r.epoch} 号文明</span>
                        <span style="font-size: 0.78rem; color: var(--amber-primary); font-family: var(--font-mono);">存活 ${r.years} 年</span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 4px;">
                        结果: <span style="color: ${r.cause.includes('成功') || r.cause.includes('胜利') ? 'var(--green-stable)' : 'var(--red-alert)'};">${r.cause}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 4px; font-family: var(--font-mono);">
                        <span>峰值科技: ${r.peakTech}</span>
                        <span>继承遗产: ${r.legacy}</span>
                    </div>
                `;
                listContainer.appendChild(item);
            });
        }

        modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playChime();
    }
}

window.CivilizationArchives = CivilizationArchives;
