// 计算器应用
class Calculator {
    constructor(containerEl) {
        this.container = containerEl;
        this.initUI();
        this.initEventListeners();
    }

    // 初始化UI
    initUI() {
        const calcHTML = `
            <div class="calc-display">
                <input type="text" id="calc-input" readonly value="0">
            </div>
            <div class="calc-buttons">
                <button class="calc-btn" data-val="AC">AC</button>
                <button class="calc-btn" data-val="DEL">DEL</button>
                <button class="calc-btn" data-val="%">%</button>
                <button class="calc-btn operator" data-val="/">÷</button>
                <button class="calc-btn num" data-val="7">7</button>
                <button class="calc-btn num" data-val="8">8</button>
                <button class="calc-btn num" data-val="9">9</button>
                <button class="calc-btn operator" data-val="*">×</button>
                <button class="calc-btn num" data-val="4">4</button>
                <button class="calc-btn num" data-val="5">5</button>
                <button class="calc-btn num" data-val="6">6</button>
                <button class="calc-btn operator" data-val="-">-</button>
                <button class="calc-btn num" data-val="1">1</button>
                <button class="calc-btn num" data-val="2">2</button>
                <button class="calc-btn num" data-val="3">3</button>
                <button class="calc-btn operator" data-val="+">+</button>
                <button class="calc-btn num" data-val="0">0</button>
                <button class="calc-btn num" data-val=".">.</button>
                <button class="calc-btn operator" data-val="=">=</button>
            </div>
        `;
        this.container.innerHTML = calcHTML;
    }

    // 初始化事件监听
    initEventListeners() {
        const input = this.container.querySelector('#calc-input');
        this.container.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const val = e.target.dataset.val;
                switch (val) {
                    case 'AC':
                        input.value = '0';
                        break;
                    case 'DEL':
                        input.value = input.value.length > 1 ? input.value.slice(0, -1) : '0';
                        break;
                    case '=':
                        try {
                            // 替换×/÷为标准运算符
                            let expr = input.value.replace('×', '*').replace('÷', '/');
                            input.value = eval(expr);
                        } catch (err) {
                            input.value = 'Error';
                        }
                        break;
                    default:
                        input.value = input.value === '0' ? val : input.value + val;
                        break;
                }
            });
        });
    }
}

// 监听计算器窗口初始化事件
window.addEventListener('app:calc:init', (e) => {
    const windowEl = e.detail;
    const contentEl = windowEl.querySelector('.content');
    new Calculator(contentEl);
});
