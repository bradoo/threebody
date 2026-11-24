const QUIZ_QUESTIONS = [
    {
        id: 'q_copernicus',
        philosopher: '哥白尼',
        question: '【日心说考问】若在夜空中同时观测到 3 颗飞星，且地表平均温度骤降至 -100°C，三体行星此时处于什么轨道？',
        options: [
            { text: 'A. “三日飞空”极寒冰封期 (正确推演)', correct: true, reward: '获得 15.0 科技点与 30% 算力加成！' },
            { text: 'B. 双日凌空过渡期', correct: false, penalty: '推演错误，陷入迷茫。' },
            { text: 'C. 稳定恒纪元轨', correct: false, penalty: '推演错误，判定偏差。' }
        ]
    },
    {
        id: 'q_von_neumann',
        philosopher: '冯·诺依曼',
        question: '【人肉计算机考问】三千万士兵阵列中，若输入信号 A 为白旗(1)，输入信号 B 为白旗(1)，与门(AND)中军阵列应举什么旗？',
        options: [
            { text: 'A. 举白旗 (1)', correct: true, reward: '与门逻辑校验成功！人肉计算机算力 +50%！' },
            { text: 'B. 举黑旗 (0)', correct: false, penalty: '信号逻辑颠倒，产生比特翻转。' }
        ]
    },
    {
        id: 'q_einstein',
        philosopher: '爱因斯坦',
        question: '【相对论考问】三体恒星的巨大质量使周围空间发生弯曲，导致后方光线发生偏折，这种现象被称为？',
        options: [
            { text: 'A. 引力透镜效应', correct: true, reward: '锁定引力透镜！彻底破除智子微观干涉！' },
            { text: 'B. 多普勒红移', correct: false, penalty: '概念混淆。' },
            { text: 'C. 霍金辐射', correct: false, penalty: '概念混淆。' }
        ]
    },
    {
        id: 'q_newton',
        philosopher: '牛顿',
        question: '【经典力学考问】两个质量分别为 M1 与 M2 的天体，若距离缩小为原来的 1/2，它们之间的万有引力变为原来的多少倍？',
        options: [
            { text: 'A. 4 倍 (平方反比律)', correct: true, reward: '微积分精确收敛！获得 20.0 科技点！' },
            { text: 'B. 2 倍', correct: false, penalty: '公式计算错误。' },
            { text: 'C. 1/4 倍', correct: false, penalty: '公式计算错误。' }
        ]
    },
    {
        id: 'q_sophon',
        philosopher: '面壁者罗辑',
        question: '【智子安全考问】半人马座智子利用高维展开对地表数据进行量子干扰时，什么学派的模型能够免受影响？',
        options: [
            { text: 'A. 爱因斯坦·广义相对论', correct: true, reward: '成功抵御智子干扰！锁定 300 年轨！' },
            { text: 'B. 周文王·易经卦象', correct: false, penalty: '易经占卜极易受量子噪声污染。' },
            { text: 'C. 亚里士多德·水晶球说', correct: false, penalty: '古典模型无法抵御智子。' }
        ]
    }
];

class InteractiveQuizManager {
    constructor(game) {
        this.game = game;
        this.currentQuiz = null;
        this.streak = 0;
    }

    triggerRandomQuiz() {
        if (this.game.activeDilemma) {
            this.game.hideDilemmaCard();
        }
        const quiz = QUIZ_QUESTIONS[Math.floor(Math.random() * QUIZ_QUESTIONS.length)];
        this.showQuizModal(quiz);
    }

    showQuizModal(quiz) {
        this.currentQuiz = quiz;
        const modal = document.getElementById('modal-quiz');
        const title = document.getElementById('quiz-title');
        const question = document.getElementById('quiz-question');
        const container = document.getElementById('quiz-options-container');

        if (!modal || !container) return;

        title.innerText = `❓ 智者考问与互动论道 — ${quiz.philosopher}`;
        question.innerText = quiz.question;

        container.innerHTML = '';
        quiz.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'btn-dilemma-option';
            btn.innerText = opt.text;

            btn.onclick = () => {
                if (opt.correct) {
                    this.streak++;
                    if (window.soundEngine) window.soundEngine.playOrb();
                    this.game.log('success', `🎉【回答正确！】${opt.reward} (答题连胜: ${this.streak})`);
                    if (quiz.id === 'q_copernicus' || quiz.id === 'q_newton') this.game.techLevel += 15.0;
                    if (quiz.id === 'q_von_neumann') this.game.computeBonus += 0.5;
                    if (quiz.id === 'q_einstein' || quiz.id === 'q_sophon') this.game.sophonActive = false;
                } else {
                    this.streak = 0;
                    if (window.soundEngine) window.soundEngine.playAlarm();
                    this.game.log('warn', `❌【回答错误】${opt.penalty}`);
                }
                this.closeQuizModal();
            };

            container.appendChild(btn);
        });

        modal.style.display = 'flex';
        modal.classList.add('active');
        if (window.soundEngine) window.soundEngine.playChime();
    }

    closeQuizModal() {
        const modal = document.getElementById('modal-quiz');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
        }
        this.currentQuiz = null;
    }
}

function openRandomQuiz() {
    if (window.game && window.game.quizManager) {
        window.game.quizManager.triggerRandomQuiz();
    } else {
        const quiz = new InteractiveQuizManager(window.game || {});
        quiz.triggerRandomQuiz();
    }
}

function closeQuizModal() {
    if (window.game && window.game.quizManager) {
        window.game.quizManager.closeQuizModal();
    } else {
        const modal = document.getElementById('modal-quiz');
        if (modal) modal.classList.remove('active');
    }
}

window.InteractiveQuizManager = InteractiveQuizManager;
window.openRandomQuiz = openRandomQuiz;
window.closeQuizModal = closeQuizModal;
