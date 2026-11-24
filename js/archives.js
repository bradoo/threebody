class CivilizationArchives {
    constructor(game) {
        this.game = game;
        this.history = JSON.parse(localStorage.getItem('threebody_civilization_archives') || '[]');
    }

    recordEpoch(epochNum, years, cause, peakTech, legacy) {
        const record = {
            epoch: epochNum,
            years: Math.floor(years),
            cause: cause,
            peakTech: peakTech.toFixed(1),
            legacy: legacy,
            timestamp: new Date().toLocaleString()
        };

        this.history.unshift(record);
        if (this.history.length > 50) this.history.pop(); // Keep last 50 civilizations

        localStorage.setItem('threebody_civilization_archives', JSON.stringify(this.history));
    }

    showArchivesModal() {
        const modal = document.getElementById('modal-archives');
        const listContainer = document.getElementById('archives-list-container');
        const statsHeader = document.getElementById('archives-stats-header');

        if (!modal || !listContainer) return;

        // Calculate statistics
        const totalPlayed = this.history.length;
        const maxYears = this.history.reduce((max, r) => r.years > max ? r.years : max, 0);

        statsHeader.innerText = `历史总纪元: ${totalPlayed} 个 | 最长生存记录: ${maxYears} 年`;

        if (this.history.length === 0) {
            listContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">尚无历史文明毁灭记录。文明正在延续中...</div>';
        } else {
            listContainer.innerHTML = '';
            this.history.forEach(r => {
                const item = document.createElement('div');
                item.className = 'archive-item';
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: var(--cyan-primary);">第 ${r.epoch} 号文明</span>
                        <span style="font-size: 0.78rem; color: var(--amber-primary);">存活 ${r.years} 年</span>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-main); margin-top: 4px;">
                        毁灭原因: <span style="color: var(--red-alert);">${r.cause}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
                        <span>峰值科技: ${r.peakTech}</span>
                        <span>继承遗产: ${r.legacy}</span>
                    </div>
                `;
                listContainer.appendChild(item);
            });
        }

        modal.classList.add('active');
    }
}
