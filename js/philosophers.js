const PHILOSOPHERS = [
    {
        id: 'wenwang',
        name: '周文王',
        school: '易经占卜',
        desc: '推演八卦阴阳，通过《周易》卜筮推测乱纪元与恒纪元规律。',
        confidence: 30,
        techCost: 0,
        predict: (temp, visibleSuns) => {
            const years = Math.floor(Math.random() * 80) + 40;
            return `卦象显示“水火既济”，预测未来 ${years} 年为恒纪元，宜浸泡。`;
        }
    },
    {
        id: 'mozi',
        name: '墨子',
        school: '墨家光学',
        desc: '建造双层铜球观察室，利用小孔成像与光学模型预测近距离双日凌空。',
        confidence: 55,
        techCost: 15,
        predict: (temp, visibleSuns) => {
            if (visibleSuns >= 2) return `光球反射双日重影！预警：近期即将爆发双日凌空毁热灾难！`;
            return `光球轨迹稳定，预测未来 30 年内气候平稳。`;
        }
    },
    {
        id: 'newton',
        name: '牛顿 & 莱布尼茨',
        school: '经典力学',
        desc: '创立微积分与万有引力定律，试图求得二体与简易三体问题代数解。',
        confidence: 82,
        techCost: 45,
        predict: (temp, visibleSuns) => {
            if (temp > 80) return `引力微分方程发散！三体系统陷入极端共振，即将面临极端乱纪元！`;
            if (temp < -40) return `受长轨道远日点引力拖拽，预测即将进入“三日飞空”极寒冰封期！`;
            return `万有引力方程收敛，预测未来 180 年为稳定恒纪元。`;
        }
    },
    {
        id: 'von_neumann',
        name: '冯·诺依曼 & 秦始皇',
        school: '人肉计算机阵列',
        desc: '指挥三千万士兵组成与门、或门、非门电路，以海量并行算力数值求解积分。',
        confidence: 94,
        techCost: 75,
        predict: (temp, visibleSuns) => {
            const accuracy = (Math.random() * 4 + 95).toFixed(1);
            return `【人肉计算机输出】三体运动高阶数值解已算出，精度 ${accuracy}%。请及时调整脱水比例！`;
        }
    }
];
