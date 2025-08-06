document.addEventListener('DOMContentLoaded', () => {
    const vinLevel = document.getElementById('vin-level');
    const vdacLevel = document.getElementById('vdac-level');
    const sarBits = [...Array(8).keys()].map(i => document.getElementById(`bit${7 - i}`));
    const binaryVal = document.getElementById('binary-val');
    const decimalVal = document.getElementById('decimal-val');
    const explanation = document.querySelector('#explanation p');
    const startBtn = document.getElementById('start-btn');
    const components = { // For visual feedback
        sah: document.getElementById('sah'),
        comparator: document.getElementById('comparator'),
        sar: document.getElementById('sar'),
        dac: document.getElementById('dac'),
        eoc: document.getElementById('eoc-flag')
    };

    let vin = 0;
    let digitalValue = 0;
    let currentBit = 7;

    function reset() {
        vin = Math.random() * 255; // Random Vin between 0-255
        vinLevel.style.height = `${(vin / 255) * 100}%`;
        digitalValue = 0;
        vdacLevel.style.height = '0%';
        sarBits.forEach(b => { b.textContent = '?'; b.className = 'bit'; });
        binaryVal.textContent = '--------';
        decimalVal.textContent = '---';
        components.eoc.style.display = 'none';
        Object.values(components).forEach(c => c.classList.remove('active'));
        startBtn.disabled = false;
        startBtn.textContent = '开始转换';
    }

    async function runAnimation() {
        startBtn.disabled = true;
        explanation.textContent = '第一步：采样和保持。锁定输入的模拟电压 Vin。';
        components.sah.classList.add('active');
        await sleep(1500);
        components.sah.classList.remove('active');

        currentBit = 7;
        digitalValue = 0;

        for (let i = 7; i >= 0; i--) {
            explanation.textContent = `测试 Bit ${i}...`;
            components.sar.classList.add('active');
            sarBits[7 - i].classList.add('testing');
            await sleep(1000);

            digitalValue |= (1 << i); // Set current bit to 1
            vdacLevel.style.height = `${(digitalValue / 255) * 100}%`;
            explanation.textContent = `将 Bit ${i} 设为 1，通过 DAC 输出 Vdac。`;
            components.dac.classList.add('active');
            await sleep(1500);
            components.dac.classList.remove('active');

            explanation.textContent = '比较 Vin 和 Vdac...';
            components.comparator.classList.add('active');
            await sleep(1000);

            if (vin >= digitalValue) {
                explanation.textContent = `Vin >= Vdac，此位 '1' 被保留。`;
                sarBits[7 - i].classList.replace('testing', 'kept');
                sarBits[7 - i].textContent = '1';
            } else {
                explanation.textContent = `Vin < Vdac，此位 '1' 过高，被清除为 '0'。`;
                digitalValue &= ~(1 << i); // Clear bit
                vdacLevel.style.height = `${(digitalValue / 255) * 100}%`;
                sarBits[7 - i].classList.replace('testing', 'cleared');
                sarBits[7 - i].textContent = '0';
            }
            components.comparator.classList.remove('active');
            await sleep(2000);
        }

        explanation.textContent = '所有位测试完毕，转换完成！';
        components.eoc.style.display = 'block';
        binaryVal.textContent = digitalValue.toString(2).padStart(8, '0');
        decimalVal.textContent = digitalValue;
        startBtn.disabled = false;
        startBtn.textContent = '再来一次';
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    startBtn.addEventListener('click', () => {
        reset();
        runAnimation();
    });

    reset(); // Initial state
});