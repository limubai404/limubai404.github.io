document.addEventListener('DOMContentLoaded', () => {
    const svg = document.getElementById('svg-plot');
    const sampleDot = document.getElementById('sample-dot');
    const binaryVal = document.getElementById('binary-val');
    const decimalVal = document.getElementById('decimal-val');
    const explanation = document.querySelector('#explanation p');
    const startBtn = document.getElementById('start-btn');

    const width = 700;
    const height = 300;
    const resolution = 16; // 4-bit ADC
    const stepY = height / resolution;

    function drawInitialState() {
        svg.innerHTML = ''; // Clear previous drawings
        // Draw quantization levels
        for (let i = 1; i < resolution; i++) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', 0);
            line.setAttribute('y1', i * stepY);
            line.setAttribute('x2', width);
            line.setAttribute('y2', i * stepY);
            line.setAttribute('stroke', '#eee');
            line.setAttribute('stroke-dasharray', '4 2');
            svg.appendChild(line);
        }

        // Draw analog signal (sine wave)
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let d = 'M 0 ' + height / 2;
        for (let x = 0; x <= width; x++) {
            const y = height / 2 - Math.sin(x / width * 2 * Math.PI) * (height / 2 * 0.8);
            d += ` L ${x} ${y}`;
        }
        path.setAttribute('d', d);
        path.setAttribute('stroke', '#007bff');
        path.setAttribute('stroke-width', 3);
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
    }

    const steps = [
        { time: 0.15, explanation: '第一步：采样。ADC 在特定时间点测量模拟信号的瞬时电压值。' },
        { time: 0.25, explanation: '第二步：量化。将采样值“取整”到最接近的离散等级。' },
        { time: 0.35, explanation: '第三步：编码。将该等级转换为一个二进制数字。' },
        { time: 0.5, explanation: '不断重复“采样-量化-编码”的过程... ' },
        { time: 0.65, explanation: '最终，用一系列离散的数字来近似描述原始的模拟信号。' },
        { time: 0.8, explanation: '动画结束。增加采样率和分辨率，可以使数字信号更逼近原始信号。' },
    ];

    let currentStepIndex = 0;

    function runAnimationStep() {
        if (currentStepIndex >= steps.length) {
            startBtn.textContent = '重新开始';
            startBtn.disabled = false;
            currentStepIndex = 0;
            return;
        }

        const step = steps[currentStepIndex];
        explanation.textContent = step.explanation;

        const sampleX = width * step.time;
        const analogY = height / 2 - Math.sin(step.time * 2 * Math.PI) * (height / 2 * 0.8);

        // Show sample dot
        sampleDot.style.display = 'block';
        sampleDot.style.left = `${sampleX}px`;
        sampleDot.style.top = `${analogY}px`;
        sampleDot.style.backgroundColor = '#dc3545'; // Red for sampling

        setTimeout(() => { // Quantization
            const quantizedLevel = Math.round(analogY / stepY);
            const quantizedY = quantizedLevel * stepY;
            sampleDot.style.top = `${quantizedY}px`;
            sampleDot.style.backgroundColor = '#ffc107'; // Yellow for quantization

            setTimeout(() => { // Encoding
                const decimalValue = resolution - 1 - quantizedLevel;
                const binaryValue = decimalValue.toString(2).padStart(4, '0');
                binaryVal.textContent = binaryValue;
                decimalVal.textContent = decimalValue;
                sampleDot.style.backgroundColor = '#28a745'; // Green for encoded

                // Draw the final digital point
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', sampleX - 10);
                rect.setAttribute('y', quantizedY);
                rect.setAttribute('width', 20);
                rect.setAttribute('height', stepY);
                rect.setAttribute('fill', 'rgba(40, 167, 69, 0.5)');
                svg.appendChild(rect);

                currentStepIndex++;
                setTimeout(runAnimationStep, 2000);

            }, 1500);

        }, 1500);
    }

    startBtn.addEventListener('click', () => {
        startBtn.disabled = true;
        startBtn.textContent = '动画进行中...';
        drawInitialState();
        sampleDot.style.display = 'none';
        binaryVal.textContent = '----';
        decimalVal.textContent = '--';
        explanation.textContent = '动画开始！准备转换模拟信号...';
        setTimeout(() => {
            currentStepIndex = 0;
            runAnimationStep();
        }, 1000);
    });

    drawInitialState();
});