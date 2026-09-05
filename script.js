const screen      = document.getElementById('screen');
const clearBtn    = document.getElementById('clear-btn');
const equalBtn    = document.getElementById('equal-btn');

let currentInput = '0';
let storedValue  = 0;
let activeOp     = '';
let isTyping     = false;

let isProgrammingMode = false;
let isForceReady      = false;
let forceTargetValue  = "0";

// Secret combo: +/- → % → +/-
const ENTER_COMBO = ['sign', 'pct', 'sign'];
let comboProgress = 0;

// %% abort tracking
let percentCount = 0;

// ── Touch: kill 300ms delay ───────────────────────────────────────────────
document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('touchend', function(e) {
        e.preventDefault();
        this.click();
    }, { passive: false });

    btn.addEventListener('click', function() {
        flashBtn(this);
    });
});

// ── Force visual (no persistent state — pop handles all feedback) ─────────
const OP_IDS = ['op-divide', 'op-multiply', 'op-subtract', 'op-add', 'equal-btn'];

function setForceVisual(armed) {
    if (armed) {
        // = goes darker amber — subtle "something is loaded"
        equalBtn.style.backgroundColor = '#c97800';
        // AC gets a barely-there warm tint
        clearBtn.style.backgroundColor = '#b0a09a';
    } else {
        equalBtn.style.backgroundColor = '';
        clearBtn.style.backgroundColor = '';
    }
}

// Quick pop animation on a button
function flashBtn(btn) {
    btn.classList.remove('btn-pop');
    void btn.offsetWidth; // restart animation
    btn.classList.add('btn-pop');
    btn.addEventListener('animationend', () => btn.classList.remove('btn-pop'), { once: true });
}

// ── Secret combo detector ─────────────────────────────────────────────────
function pushCombo(key) {
    if (key === ENTER_COMBO[comboProgress]) {
        comboProgress++;
        if (comboProgress === ENTER_COMBO.length) {
            comboProgress = 0;
            return 'combo';
        }
        return 'partial';
    } else {
        comboProgress = 0;
        if (key === ENTER_COMBO[0]) {
            comboProgress = 1;
            return 'partial';
        }
        return 'normal';
    }
}

function handleEnterCombo() {
    if (!isProgrammingMode && !isForceReady) {
        isProgrammingMode = true;
        currentInput = '0';
        percentCount = 0;
        updateDisplay('0');
        updateClearButtonLabel();
        // Orange flash on AC = mode entered
        clearBtn.style.backgroundColor = '#ff9f0a';
        setTimeout(() => { clearBtn.style.backgroundColor = '#a5a5a5'; }, 350);

    } else if (isProgrammingMode) {
        forceTargetValue  = currentInput.replace(/,/g, '');
        isProgrammingMode = false;
        isForceReady      = true;
        currentInput = '0';
        storedValue  = 0;
        activeOp     = '';
        isTyping     = false;
        percentCount = 0;
        updateDisplay('0');
        updateClearButtonLabel();
        setForceVisual(true);
    }
}

// ── Backspace ─────────────────────────────────────────────────────────────
function handleBackspace() {
    if (!isTyping || currentInput === '0') return;
    if (currentInput.length === 1 || (currentInput.length === 2 && currentInput[0] === '-')) {
        currentInput = '0';
        isTyping = false;
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay(currentInput);
    updateClearButtonLabel();
}

// ── Number input ──────────────────────────────────────────────────────────
function pressNum(num) {
    if (currentInput === "Error" || currentInput === "NaN") currentInput = '0';

    if (currentInput === '0' || !isTyping) {
        currentInput = num === '.' ? '0.' : num;
        isTyping = true;
    } else {
        if (num === '.' && currentInput.includes('.')) return;
        if (currentInput.replace(/[^0-9]/g, '').length < 9) {
            currentInput += num;
        }
    }
    percentCount  = 0;
    comboProgress = 0;
    updateDisplay(currentInput);
    updateClearButtonLabel();
}

// ── Operator ──────────────────────────────────────────────────────────────
function setOp(op) {
    if (isProgrammingMode) return;

    const btn = document.getElementById(opToId(op));
    flashBtn(btn);

    // Swap operator if no new number typed yet
    if (!isTyping && activeOp !== '') {
        activeOp = op;
        return;
    }

    let cleanVal = currentInput.replace(/,/g, '');
    if (cleanVal === "Error" || cleanVal === "NaN") cleanVal = "0";

    // Chain: if there's already a pending op and new input, calculate first
    if (activeOp !== '' && isTyping) {
        doMath();
        cleanVal = currentInput.replace(/,/g, '');
    }

    storedValue   = parseFloat(cleanVal);
    activeOp      = op;
    isTyping      = false;
    percentCount  = 0;
    comboProgress = 0;

    updateClearButtonLabel();
}

function opToId(op) {
    return op === '+' ? 'op-add' : op === '−' ? 'op-subtract' : op === '×' ? 'op-multiply' : 'op-divide';
}

// ── Clear ─────────────────────────────────────────────────────────────────
function handleClear() {
    currentInput      = '0';
    storedValue       = 0;
    activeOp          = '';
    isTyping          = false;
    percentCount      = 0;
    isProgrammingMode = false;
    comboProgress     = 0;
    updateDisplay('0');
    updateClearButtonLabel();
}

function updateClearButtonLabel() {
    clearBtn.innerText = (currentInput !== '0' || isTyping) ? 'C' : 'AC';
}

// ── +/- ───────────────────────────────────────────────────────────────────
function toggleSign() {
    const result = pushCombo('sign');
    if (result === 'combo')   { handleEnterCombo(); return; }
    if (result === 'partial') return;

    if (isProgrammingMode) return;
    const cleanVal = currentInput.replace(/,/g, '');
    if (cleanVal === "Error" || cleanVal === "NaN") return;
    currentInput = (parseFloat(cleanVal) * -1).toString();
    isTyping = true;
    updateDisplay(currentInput);
}

// ── % ─────────────────────────────────────────────────────────────────────
function applyPercent() {
    const cleanVal = currentInput.replace(/,/g, '');
    if (cleanVal === "Error" || cleanVal === "NaN") return;

    const result = pushCombo('pct');
    if (result === 'combo')   { handleEnterCombo(); return; }
    if (result === 'partial') return;

    // Abort: 737 + %%
    if (cleanVal === "737") {
        percentCount++;
        if (percentCount >= 2) {
            isForceReady      = false;
            isProgrammingMode = false;
            forceTargetValue  = "0";
            percentCount      = 0;
            comboProgress     = 0;
            setForceVisual(false);
            clearBtn.style.backgroundColor = '#ff3b30';
            setTimeout(() => { clearBtn.style.backgroundColor = '#a5a5a5'; }, 400);
            handleClear();
            return;
        }
        return;
    }

    if (!isTyping && percentCount > 0) return;

    percentCount++;
    currentInput = (parseFloat(cleanVal) / 100).toString();
    updateDisplay(currentInput);
}

// ── = ─────────────────────────────────────────────────────────────────────
function passThroughEqual() {
    if (isProgrammingMode) return;
    flashBtn(equalBtn);
    calculate();
}

function calculate() {
    comboProgress = 0;

    if (isForceReady) {
        currentInput = forceTargetValue;
        isForceReady = false;
        setForceVisual(false);
    } else {
        if (activeOp === '') return;
        doMath();
    }

    activeOp     = '';
    isTyping     = false;
    percentCount = 0;
    updateDisplay(currentInput);
    updateClearButtonLabel();
}

function doMath() {
    const a = storedValue;
    const b = parseFloat(currentInput.replace(/,/g, ''));
    if (isNaN(a) || isNaN(b)) return;

    let result;
    switch (activeOp) {
        case '+':  result = a + b; break;
        case '−':  result = a - b; break;
        case '×':  result = a * b; break;
        case '÷':  result = b !== 0 ? a / b : "Error"; break;
        default: return;
    }
    currentInput = result.toString();
    storedValue  = result;
}

// ── Display ───────────────────────────────────────────────────────────────
function formatWithCommas(str) {
    if (str === "Error" || str === "NaN") return str;
    const parts = str.split('.');
    parts[0] = parts[0].replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

function updateDisplay(val) {
    const formatted = formatWithCommas(val);
    screen.innerText = formatted;
    fitDisplay();
}

// Hidden canvas for text measurement
const _canvas = document.createElement('canvas');
const _ctx    = _canvas.getContext('2d');

function measureText(text, size) {
    _ctx.font = `300 ${size}px -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif`;
    return _ctx.measureText(text).width;
}

function fitDisplay() {
    const maxW = screen.parentElement.clientWidth - 32;
    const text = screen.innerText;

    // Binary search: largest size where text fits maxW
    let lo = 16, hi = 80;
    while (lo < hi - 1) {
        const mid = (lo + hi) >> 1;
        if (measureText(text, mid) <= maxW) lo = mid;
        else hi = mid;
    }
    screen.style.fontSize = lo + 'px';
}

window.addEventListener('resize', fitDisplay);

// ── Init ──────────────────────────────────────────────────────────────────
updateDisplay('0');
