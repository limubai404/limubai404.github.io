document.addEventListener('DOMContentLoaded', () => {
    const master = document.getElementById('master');
    const slave = document.getElementById('slave');
    const packet = document.getElementById('packet');
    const packetHeader = document.getElementById('packet-header');
    const packetData = document.getElementById('packet-data');
    const explanation = document.querySelector('#explanation p');
    const startBtn = document.getElementById('start-btn');

    const steps = [
        {
            action: 'prepareRequest',
            explanation: '主站准备构建一个请求帧，目标是从从站 1 读取数据。'
        },
        {
            action: 'sendRequest',
            explanation: '请求帧构建完成，主站通过 RS-485 总线将其发送出去。'
        },
        {
            action: 'processRequest',
            explanation: '从站 1 接收到数据帧，开始解析...'
        },
        {
            action: 'checkAddress',
            explanation: '首先，检查地址是否为本机地址 (01)。匹配成功！'
        },
        {
            action: 'checkCrcRequest',
            explanation: '接着，计算接收到数据的 CRC (循环冗余校验码)，与帧末尾的 CRC 进行比对。校验通过！'
        },
        {
            action: 'prepareResponse',
            explanation: '校验无误后，从站从内部存储器中读取请求的数据。'
        },
        {
            action: 'sendResponse',
            explanation: '响应帧构建完成，从站通过总线将其发送回主站。'
        },
        {
            action: 'processResponse',
            explanation: '主站接收到响应帧，开始解析...'
        },
        {
            action: 'checkCrcResponse',
            explanation: '主站计算响应数据的 CRC，并进行校验。校验通过！'
        },
        {
            action: 'finish',
            explanation: '数据接收成功！一次完整的 Modbus 通信周期结束。'
        }
    ];

    let currentStep = 0;

    function runAnimation() {
        if (currentStep >= steps.length) return;

        const step = steps[currentStep];
        explanation.textContent = step.explanation;

        switch (step.action) {
            case 'prepareRequest':
                packet.classList.remove('hidden');
                packet.style.left = '100px';
                packetHeader.textContent = '请求 (Request)';
                packetData.innerHTML = `
                    <p><b>从站地址:</b> 01</p>
                    <p><b>功能码:</b> 03 (读保持寄存器)</p>
                    <p><b>起始地址:</b> 0000 (对应 40001)</p>
                    <p><b>寄存器数:</b> 0002 (读取 2 个)</p>
                    <p id="req-crc"><b>CRC 校验:</b> 840A</p>
                `;
                setTimeout(runAnimation, 2500);
                break;

            case 'sendRequest':
                packet.style.left = '450px';
                setTimeout(runAnimation, 2500);
                break;

            case 'processRequest':
                slave.style.borderColor = '#ffc107';
                setTimeout(runAnimation, 1500);
                break;

            case 'checkAddress':
                slave.style.borderColor = '#28a745';
                setTimeout(() => { slave.style.borderColor = '#0056b3'; }, 1500);
                setTimeout(runAnimation, 2000);
                break;

            case 'checkCrcRequest':
                document.getElementById('req-crc').classList.add('crc-ok');
                setTimeout(runAnimation, 2000);
                break;

            case 'prepareResponse':
                slave.querySelector('.memory').classList.add('processing');
                setTimeout(() => { 
                    slave.querySelector('.memory').classList.remove('processing');
                    packetHeader.textContent = '响应 (Response)';
                    packetData.innerHTML = `
                        <p><b>从站地址:</b> 01</p>
                        <p><b>功能码:</b> 03 (无异常)</p>
                        <p><b>返回字节数:</b> 04 (2个寄存器 x 2字节)</p>
                        <p><b>数据 (40001):</b> ABCD</p>
                        <p><b>数据 (40002):</b> 1234</p>
                        <p id="resp-crc"><b>CRC 校验:</b> F18B</p>
                    `;
                    runAnimation();
                }, 2000);
                break;

            case 'sendResponse':
                packet.style.left = '100px';
                setTimeout(runAnimation, 2500);
                break;

            case 'processResponse':
                master.style.borderColor = '#ffc107';
                setTimeout(runAnimation, 1500);
                break;

            case 'checkCrcResponse':
                document.getElementById('resp-crc').classList.add('crc-ok');
                master.style.borderColor = '#28a745';
                setTimeout(() => { master.style.borderColor = '#0056b3'; }, 1500);
                setTimeout(runAnimation, 2000);
                break;

            case 'finish':
                packet.classList.add('hidden');
                startBtn.textContent = '重新开始';
                startBtn.disabled = false;
                currentStep = 0; // Reset for next run
                return; // Stop the chain
        }
        currentStep++;
    }

    startBtn.addEventListener('click', () => {
        startBtn.disabled = true;
        startBtn.textContent = '动画进行中...';
        explanation.textContent = '动画开始！';
        // Reset visual states before starting
        const crcReq = document.getElementById('req-crc');
        if(crcReq) crcReq.classList.remove('crc-ok');
        const crcResp = document.getElementById('resp-crc');
        if(crcResp) crcResp.classList.remove('crc-ok');

        runAnimation();
    });
});