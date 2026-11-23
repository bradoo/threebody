class HumanComputerVisualizer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.soldierGroups = [];
        this.pulseTime = 0;
        this.initArmyFormation();
    }

    initArmyFormation() {
        this.soldierGroups = [
            { name: "输入军阵 A (白旗 1)", x: -280, y: -120, rows: 6, cols: 12, state: 1, color: '#06b6d4' },
            { name: "输入军阵 B (白旗 1)", x: -280, y: 40, rows: 6, cols: 12, state: 1, color: '#06b6d4' },
            { name: "与门中枢阵列 (AND Gate)", x: -80, y: -40, rows: 8, cols: 16, state: 1, color: '#f59e0b' },
            { name: "或门/非门辅助阵列", x: 120, y: -120, rows: 6, cols: 12, state: 0, color: '#64748b' },
            { name: "高阶乘法器大方阵", x: 120, y: 40, rows: 8, cols: 14, state: 1, color: '#10b981' },
            { name: "秦始皇中军大本营 (CPU Bus)", x: -80, y: 160, rows: 4, cols: 24, state: 1, color: '#a855f7' }
        ];
    }

    render(width, height) {
        const cx = width / 2;
        const cy = height / 2 - 20;

        this.pulseTime += 0.05;

        // Dark Background with Matrix Grid
        this.ctx.fillStyle = '#040609';
        this.ctx.fillRect(0, 0, width, height);

        // Army Grid Coordinates
        this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < width; x += 30) {
            this.ctx.beginPath(); this.ctx.moveTo(x, 0); this.ctx.lineTo(x, height); this.ctx.stroke();
        }
        for (let y = 0; y < height; y += 30) {
            this.ctx.beginPath(); this.ctx.moveTo(0, y); this.ctx.lineTo(width, y); this.ctx.stroke();
        }

        // Draw Army Groups
        this.soldierGroups.forEach(group => {
            const gx = cx + group.x;
            const gy = cy + group.y;

            // Group Box
            const boxWidth = group.cols * 12 + 10;
            const boxHeight = group.rows * 12 + 10;
            this.ctx.fillStyle = 'rgba(16, 22, 34, 0.7)';
            this.ctx.strokeStyle = group.color;
            this.ctx.lineWidth = 1.5;
            this.ctx.fillRect(gx - 5, gy - 5, boxWidth, boxHeight);
            this.ctx.strokeRect(gx - 5, gy - 5, boxWidth, boxHeight);

            // Group Name Label
            this.ctx.fillStyle = group.color;
            this.ctx.font = '11px "Courier New", monospace';
            this.ctx.fillText(group.name, gx, gy - 10);

            // Draw Soldiers as Flag Points
            for (let r = 0; r < group.rows; r++) {
                for (let c = 0; c < group.cols; c++) {
                    const sx = gx + c * 12 + 6;
                    const sy = gy + r * 12 + 6;

                    // Signal wave ripple through regiments
                    const phase = (c + r) * 0.4 + this.pulseTime;
                    const isWavingWhite = Math.sin(phase) > 0.1;

                    this.ctx.fillStyle = isWavingWhite ? '#ffffff' : '#1e293b';
                    this.ctx.beginPath();
                    this.ctx.arc(sx, sy, isWavingWhite ? 3.5 : 2.5, 0, Math.PI * 2);
                    this.ctx.fill();

                    if (isWavingWhite) {
                        this.ctx.strokeStyle = group.color;
                        this.ctx.lineWidth = 0.8;
                        this.ctx.stroke();
                    }
                }
            }
        });

        // Draw Signal Buses (Lines carrying data between regiments)
        this.drawSignalBus(cx - 130, cy - 80, cx - 80, cy - 10, '#06b6d4');
        this.drawSignalBus(cx - 130, cy + 70, cx - 80, cy + 10, '#06b6d4');
        this.drawSignalBus(cx + 110, cy - 10, cx + 120, cy - 80, '#f59e0b');
        this.drawSignalBus(cx + 110, cy + 10, cx + 120, cy + 80, '#f59e0b');
        this.drawSignalBus(cx + 200, cy + 80, cx + 100, cy + 170, '#10b981');

        // Draw HUD overlay
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.font = 'bold 13px "Courier New", monospace';
        this.ctx.fillText("🪖 秦始皇三千万士兵人肉计算机 — 实时信号总线视图", 20, 30);

        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '11px "Courier New", monospace';
        this.ctx.fillText("状态: 全军白旗/黑旗信号传递中 | 主频: 1.5 Hz | 逻辑门: 1,024,000 个与/非门阵列", 20, 48);
    }

    drawSignalBus(x1, y1, x2, y2, color) {
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // Traveling pulse particle
        const t = (this.pulseTime * 0.8) % 1;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;

        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 4, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
}
