const DILEMMAS = [
    {
        id: 'wenwang_burn',
        title: '周文王·焚身卜筮',
        desc: '周文王请求在巨型青铜鼎中引火焚身，以至诚之意向上天占卜未来百年恒纪元之期。',
        optionA: {
            text: '允许焚身 (算力+100%, 损失少量人口)',
            action: (game) => {
                game.computeBonus = 2.0;
                game.population -= 3.0;
                game.log('alert', '🔥 周文王于青铜鼎中引火焚身！大火照亮夜空，全军算力提升 100%！');
            }
        },
        optionB: {
            text: '严词拒绝 (保全智者，获得普及教育)',
            action: (game) => {
                game.techLevel += 5.0;
                game.log('info', '📜 你拒绝了文王的残酷请求。文明转向理性教育，科技点 +5.0。');
            }
        }
    },
    {
        id: 'mozi_fortress',
        title: '墨子·防日机关城',
        desc: '墨子提议动员 50 万劳工，在地下建造巨大的岩浆隔热铜板机关城，以抵御双日凌空。',
        optionA: {
            text: '动工建造 (极端高温伤害 -60%, 消耗算力)',
            action: (game) => {
                game.pendulumLength = 400;
                game.log('success', '🛡️ 墨子防日机关城竣工！极大地增强了地表隔热抗性。');
            }
        },
        optionB: {
            text: '专注于脱水 (将资源用于干皮仓扩建)',
            action: (game) => {
                game.log('info', '🏜️ 你决定将重点放在地下干皮仓，脱水防护效率提升。');
            }
        }
    },
    {
        id: 'qin_execution',
        title: '秦始皇·斩首误传信号兵',
        desc: '人肉计算机第 4 逻辑门军阵因兵士疲惫导致白旗信号传递延迟 0.5 秒，差之毫厘。秦始皇大怒欲斩首整军。',
        optionA: {
            text: '斩首立威 (算力+50%, 人口 -5 万)',
            action: (game) => {
                game.computeBonus += 0.5;
                game.population -= 5.0;
                game.log('warn', '⚔️ 秦始皇斩首整军！阵列纪律大增，算力进一步提升！');
            }
        },
        optionB: {
            text: '特赦并替换 (维持人口，算力不变)',
            action: (game) => {
                game.log('info', '🕊️ 你特赦了误传兵士。军阵士气稳定。');
            }
        }
    },
    {
        id: 'flying_star_harvest',
        title: '观天象·捕捉飞星粒子流',
        desc: '天空中划过一道罕见的三体恒星耀斑高能粒子流！你可以选择将其吸收转化为能量，或用于科研观测。',
        optionA: {
            text: '吸收高能辐射 (直接获得 15.0 科技点)',
            action: (game) => {
                game.techLevel += 15.0;
                game.log('success', '⚡ 成功捕捉耀斑高能粒子流！科技大幅跃升 +15.0！');
            }
        },
        optionB: {
            text: '充能单摆磁场 (单摆锁定率直接升至 100%)',
            action: (game) => {
                game.pendulumActive = true;
                game.resonanceRate = 100;
                game.log('success', '🧲 高能粒子流充能巨型单摆！引力相位瞬间达到 100% 完全共振！');
            }
        }
    }
];
