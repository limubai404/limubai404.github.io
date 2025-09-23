class BubbleSortAnimation {
    constructor() {
        this.array = [];
        this.originalArray = [];
        this.isRunning = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.comparisons = 0;
        this.swaps = 0;
        this.round = 0;
        this.animationSpeed = 1000;
        
        this.initializeElements();
        this.attachEventListeners();
        this.generateRandomArray();
    }
    
    initializeElements() {
        this.arrayDisplay = document.getElementById('array-display');
        this.comparisonsEl = document.getElementById('comparisons');
        this.swapsEl = document.getElementById('swaps');
        this.roundEl = document.getElementById('round');
        this.statusEl = document.getElementById('status');
        this.explanationEl = document.getElementById('step-explanation');
        
        this.generateBtn = document.getElementById('generate-btn');
        this.startBtn = document.getElementById('start-btn');
        this.stepBtn = document.getElementById('step-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.presetSelect = document.getElementById('preset-select');
    }
    
    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateArray());
        this.startBtn.addEventListener('click', () => this.startSorting());
        this.stepBtn.addEventListener('click', () => this.stepSorting());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.presetSelect.addEventListener('change', () => this.generateArray());
    }
    
    generateArray() {
        const preset = this.presetSelect.value;
        let newArray;
        
        switch(preset) {
            case 'random':
                newArray = this.generateRandomArray();
                break;
            case 'sorted':
                newArray = Array.from({length: 10}, (_, i) => i + 1);
                break;
            case 'reverse':
                newArray = Array.from({length: 10}, (_, i) => 10 - i);
                break;
            case 'duplicates':
                newArray = [5, 3, 8, 3, 1, 5, 9, 2, 5, 7];
                break;
            default:
                newArray = this.generateRandomArray();
        }
        
        this.array = [...newArray];
        this.originalArray = [...newArray];
        this.renderArray();
        this.resetStats();
    }
    
    generateRandomArray() {
        return Array.from({length: 10}, () => Math.floor(Math.random() * 100) + 1);
    }
    
    renderArray() {
        this.arrayDisplay.innerHTML = '';
        this.array.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.textContent = value;
            element.dataset.index = index;
            this.arrayDisplay.appendChild(element);
        });
    }
    
    resetStats() {
        this.comparisons = 0;
        this.swaps = 0;
        this.round = 0;
        this.currentStep = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.updateStats();
        this.updateStatus('就绪');
        this.updateExplanation('点击"开始排序"或"单步执行"来观看冒泡排序的过程');
        this.startBtn.disabled = false;
        this.stepBtn.disabled = false;
    }
    
    updateStats() {
        this.comparisonsEl.textContent = this.comparisons;
        this.swapsEl.textContent = this.swaps;
        this.roundEl.textContent = this.round;
    }
    
    updateStatus(status) {
        this.statusEl.textContent = status;
    }
    
    updateExplanation(explanation) {
        this.explanationEl.textContent = explanation;
    }
    
    highlightElements(index1, index2, type = 'comparing') {
        const elements = this.arrayDisplay.children;
        if (elements[index1]) elements[index1].classList.add(type);
        if (elements[index2]) elements[index2].classList.add(type);
    }
    
    removeHighlights() {
        const elements = this.arrayDisplay.children;
        Array.from(elements).forEach(el => {
            el.classList.remove('comparing', 'swapping', 'current');
        });
    }
    
    markSorted(index) {
        const elements = this.arrayDisplay.children;
        if (elements[index]) {
            elements[index].classList.add('sorted');
        }
    }
    
    async startSorting() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startBtn.disabled = true;
        this.stepBtn.disabled = true;
        this.generateBtn.disabled = true;
        
        await this.bubbleSort();
        
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.stepBtn.disabled = false;
        this.generateBtn.disabled = false;
        this.updateStatus('排序完成');
        this.updateExplanation('冒泡排序完成！数组已按升序排列。');
    }
    
    async stepSorting() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.stepBtn.disabled = true;
        this.generateBtn.disabled = true;
        
        await this.bubbleSortStep();
        
        this.isRunning = false;
        this.stepBtn.disabled = false;
        this.generateBtn.disabled = false;
    }
    
    async bubbleSort() {
        const n = this.array.length;
        let swapped;
        
        for (let i = 0; i < n - 1; i++) {
            this.round = i + 1;
            this.updateStats();
            this.updateStatus(`第 ${this.round} 轮排序`);
            this.updateExplanation(`开始第 ${this.round} 轮排序，比较相邻元素...`);
            
            swapped = false;
            
            for (let j = 0; j < n - 1 - i; j++) {
                this.removeHighlights();
                this.highlightElements(j, j + 1, 'comparing');
                
                this.comparisons++;
                this.updateStats();
                this.updateExplanation(`比较 arr[${j}] = ${this.array[j]} 和 arr[${j + 1}] = ${this.array[j + 1]}`);
                
                await this.sleep(this.animationSpeed);
                
                if (this.array[j] > this.array[j + 1]) {
                    this.removeHighlights();
                    this.highlightElements(j, j + 1, 'swapping');
                    this.updateExplanation(`arr[${j}] > arr[${j + 1}]，需要交换位置`);
                    
                    await this.sleep(this.animationSpeed / 2);
                    
                    // 交换元素
                    [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                    this.swaps++;
                    this.updateStats();
                    
                    // 更新显示
                    this.renderArray();
                    this.highlightElements(j, j + 1, 'swapping');
                    this.updateExplanation(`已交换 arr[${j}] 和 arr[${j + 1}]，交换次数: ${this.swaps}`);
                    
                    swapped = true;
                    await this.sleep(this.animationSpeed / 2);
                } else {
                    this.updateExplanation(`arr[${j}] <= arr[${j + 1}]，无需交换`);
                    await this.sleep(this.animationSpeed / 2);
                }
            }
            
            // 标记已排序的元素
            this.markSorted(n - 1 - i);
            this.updateExplanation(`第 ${this.round} 轮完成，元素 ${this.array[n - 1 - i]} 已到达正确位置`);
            
            if (!swapped) {
                this.updateExplanation('没有发生交换，数组已有序，提前结束排序');
                break;
            }
            
            await this.sleep(this.animationSpeed);
        }
        
        // 标记所有元素为已排序
        for (let i = 0; i < n; i++) {
            this.markSorted(i);
        }
    }
    
    async bubbleSortStep() {
        const n = this.array.length;
        
        if (this.currentStep === 0) {
            this.round = 1;
            this.updateStats();
            this.updateStatus(`第 ${this.round} 轮排序`);
            this.updateExplanation(`开始第 ${this.round} 轮排序，比较相邻元素...`);
        }
        
        const i = Math.floor(this.currentStep / (n - 1));
        const j = this.currentStep % (n - 1);
        
        if (i >= n - 1) {
            this.updateStatus('排序完成');
            this.updateExplanation('冒泡排序完成！数组已按升序排列。');
            return;
        }
        
        if (j < n - 1 - i) {
            this.removeHighlights();
            this.highlightElements(j, j + 1, 'comparing');
            
            this.comparisons++;
            this.updateStats();
            this.updateExplanation(`比较 arr[${j}] = ${this.array[j]} 和 arr[${j + 1}] = ${this.array[j + 1]}`);
            
            if (this.array[j] > this.array[j + 1]) {
                this.removeHighlights();
                this.highlightElements(j, j + 1, 'swapping');
                this.updateExplanation(`arr[${j}] > arr[${j + 1}]，需要交换位置`);
                
                // 交换元素
                [this.array[j], this.array[j + 1]] = [this.array[j + 1], this.array[j]];
                this.swaps++;
                this.updateStats();
                
                // 更新显示
                this.renderArray();
                this.highlightElements(j, j + 1, 'swapping');
                this.updateExplanation(`已交换 arr[${j}] 和 arr[${j + 1}]，交换次数: ${this.swaps}`);
            } else {
                this.updateExplanation(`arr[${j}] <= arr[${j + 1}]，无需交换`);
            }
        } else {
            // 轮次结束
            this.markSorted(n - 1 - i);
            this.updateExplanation(`第 ${this.round} 轮完成，元素 ${this.array[n - 1 - i]} 已到达正确位置`);
            this.round++;
            this.currentStep = 0;
            return;
        }
        
        this.currentStep++;
    }
    
    reset() {
        this.array = [...this.originalArray];
        this.renderArray();
        this.removeHighlights();
        this.resetStats();
    }
    
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 初始化动画
document.addEventListener('DOMContentLoaded', () => {
    new BubbleSortAnimation();
});
