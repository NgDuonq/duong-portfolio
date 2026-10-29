'use strict';
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
function syncThemeButton() {
  const dark = root.dataset.theme === 'dark';
  themeIcon.textContent = dark ? '☀' : '◐';
  themeToggle.setAttribute('aria-label', dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  themeToggle.setAttribute('aria-pressed', String(dark));
}
syncThemeButton();
themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (error) { /* Theme remains usable without storage. */ }
  syncThemeButton();
});
document.getElementById('year').textContent = new Date().getFullYear();

// Accumulate as BigInt to preserve every digit, including values above 2^53.
function parseInteger(text, base) {
  let digits = text.trim().replace(/^−/, '-');
  if (!digits) throw new Error('Nhập một số để bắt đầu.');
  if (digits.length > 512) throw new Error('Vui lòng nhập tối đa 512 ký tự.');
  let sign = 1n;
  if (digits[0] === '-' || digits[0] === '+') {
    if (digits[0] === '-') sign = -1n;
    digits = digits.slice(1);
  }
  const prefix = { 2: /^0b/i, 8: /^0o/i, 16: /^0x/i }[base];
  if (prefix) digits = digits.replace(prefix, '');
  const pattern = { 2: /^[01]+$/, 8: /^[0-7]+$/, 10: /^[0-9]+$/, 16: /^[0-9a-f]+$/i }[base];
  if (!pattern || !pattern.test(digits)) {
    const allowed = { 2: '0 và 1', 8: '0–7', 10: '0–9', 16: '0–9 và A–F' }[base];
    throw new Error(`Hệ ${base} chỉ nhận các chữ số ${allowed}, có thể thêm dấu âm ở đầu.`);
  }
  let result = 0n;
  for (const digit of digits.toUpperCase()) result = result * BigInt(base) + BigInt('0123456789ABCDEF'.indexOf(digit));
  return result * sign;
}
const numberInput = document.getElementById('number-input');
const baseInput = document.getElementById('base-input');
const errorText = document.getElementById('input-error');
const copyStatus = document.getElementById('copy-status');
const copyButtons = document.querySelectorAll('[data-copy]');
const numberMode = document.getElementById('number-mode');
const bitWidth = document.getElementById('bit-width');
const inputKind = document.getElementById('input-kind');
const modeHelp = document.getElementById('mode-help');
const learningPanel = document.getElementById('learning-panel');
function interpretInteger(raw, mode, width, kind, base) {
  if (mode === 'math') return { value: raw, pattern: null };
  const modulus = 1n << BigInt(width);
  const half = modulus >> 1n;
  if (kind === 'pattern') {
    if (base === 10) throw new Error('Mẫu bit dùng hệ 2, 8 hoặc 16. Với hệ 10, hãy nhập giá trị số.');
    if (raw < 0n || raw >= modulus) throw new Error(`Mẫu bit phải nằm trong 0…${modulus - 1n} (${width} bit). Không tự cắt bỏ bit thừa.`);
    return { pattern: raw, value: mode === 'signed' && raw >= half ? raw - modulus : raw };
  }
  const min = mode === 'signed' ? -half : 0n;
  const max = mode === 'signed' ? half - 1n : modulus - 1n;
  if (raw < min || raw > max) throw new Error(`Vượt phạm vi ${mode === 'signed' ? 'bù hai' : 'không dấu'} ${width} bit: ${min}…${max}. Hãy tăng độ rộng hoặc chọn số nguyên không giới hạn bit.`);
  return { value: raw, pattern: raw < 0n ? raw + modulus : raw };
}
function addStep(title, content) {
  const heading = document.createElement('h5');
  heading.textContent = title;
  const body = document.createElement('pre');
  body.textContent = content;
  document.getElementById('step-content').append(heading, body);
}
function renderLearning(raw, converted, base, mode, width, kind) {
  const { value, pattern } = converted;
  const magnitude = value < 0n ? -value : value;
  const represented = pattern === null ? magnitude : pattern;
  let bits = represented.toString(2);
  bits = bits.padStart(pattern === null ? Math.ceil(bits.length / 4) * 4 : width, '0');
  const groups = document.getElementById('bit-groups');
  groups.replaceChildren();
  const chunks = bits.match(/.{4}/g);
  for (const chunk of chunks.slice(0, 64)) {
    const group = document.createElement('div');
    group.className = 'bit-group';
    const label = document.createElement('span'); label.textContent = chunk;
    const hex = document.createElement('strong'); hex.textContent = `↕ ${parseInt(chunk, 2).toString(16).toUpperCase()}`;
    group.append(label, hex); groups.append(group);
  }
  document.getElementById('bit-caption').textContent = (pattern === null
    ? `Mỗi nhóm 4 bit ứng với một chữ số hex. Thêm 0 ở đầu để đủ nhóm. ${value < 0n ? 'Đang nhóm trị tuyệt đối; dấu âm được giữ riêng, chưa phải biểu diễn bù hai.' : ''}`
    : `${width} bit · mẫu bit không dấu: ${pattern} · giá trị ${mode === 'signed' ? 'có dấu (bù hai)' : 'không dấu'}: ${value}. BIN/OCT/HEX hiển thị mẫu bit; DEC hiển thị giá trị.`)
    + (chunks.length > 64 ? ' Chỉ minh họa 64 nhóm đầu; kết quả đầy đủ vẫn ở trên.' : '');
  const steps = document.getElementById('step-content'); steps.replaceChildren();
  const digits = (raw < 0n ? -raw : raw).toString(base).toUpperCase();
  const terms = [...digits].slice(0, 20).map((digit, index) => {
    const exponent = digits.length - index - 1;
    return `${digit} (${parseInt(digit, base)}) × ${base}^${exponent}`;
  });
  addStep('1. Đổi đầu vào sang giá trị thập phân', `${terms.join(' + ')}${digits.length > 20 ? ' + … (rút gọn sau 20 chữ số)' : ''}\n${raw < 0n ? 'Áp dụng dấu âm sau khi cộng các trọng số.\n' : ''}Kết quả đầu vào: ${raw}.`);
  if (pattern !== null) {
    const modulus = 1n << BigInt(width);
    addStep('2. Áp dụng độ rộng và cách hiểu đầu vào', kind === 'pattern'
      ? `Đầu vào là mẫu bit ${raw}, trong ${width} bit.\n${mode === 'signed' ? `Bit cao nhất ${pattern >= modulus / 2n ? 'là 1: giá trị = ' + pattern + ' − ' + modulus + ' = ' + value : 'là 0: giá trị = ' + value}` : `Số không dấu: giá trị = ${value}`}\nKhông tự cắt bit vượt phạm vi.`
      : `Đầu vào là giá trị ${value}.\n${value < 0n ? `Bù hai ${width} bit: mẫu bit = 2^${width} + (${value}) = ${pattern}.\nCũng có thể lấy trị tuyệt đối, đảo đủ ${width} bit rồi cộng 1.` : `Mẫu bit = ${pattern}, thêm các bit 0 ở đầu cho đủ ${width} bit.`}`);
  }
  for (const target of [2, 8, 16]) {
    let n = represented;
    const lines = [];
    do {
      const quotient = n / BigInt(target); const remainder = n % BigInt(target);
      lines.push(`${n} ÷ ${target} = ${quotient}, dư ${remainder.toString(16).toUpperCase()}`);
      n = quotient;
    } while (n > 0n && lines.length < 24);
    const truncated = n > 0n;
    addStep(`Chia liên tiếp cho ${target}`, `${lines.join('\n')}\n${truncated ? '… Rút gọn sau 24 phép chia; tiếp tục chia tới thương 0.\n' : ''}Đọc các số dư từ dưới lên${pattern === null && value < 0n ? ', thêm dấu âm' : ''}.\nKết quả: ${document.getElementById(`out-${target}`).textContent}`);
  }
  learningPanel.hidden = false;
}
function convert() {
  copyStatus.textContent = '';
  const mode = numberMode.value;
  const width = Number(bitWidth.value);
  const base = Number(baseInput.value);
  bitWidth.disabled = mode === 'math';
  inputKind.disabled = mode === 'math' || base === 10;
  if (base === 10 || mode === 'math') inputKind.value = 'value';
  const kind = inputKind.value;
  if (mode === 'math') modeHelp.textContent = 'Giá trị số thông thường: −1 vẫn là −1 ở mọi hệ. Giới hạn nhập 512 ký tự; không dùng bù hai.';
  else {
    const half = 1n << BigInt(width - 1);
    const max = mode === 'signed' ? half - 1n : (half << 1n) - 1n;
    modeHelp.textContent = `Phạm vi giá trị: ${mode === 'signed' ? -half : 0n}…${max}. ${kind === 'pattern' ? 'Đọc mẫu bit không dấu rồi diễn giải theo chế độ đã chọn.' : 'Nhập giá trị số; không tự diễn giải FF là −1.'} BIN/OCT/HEX là mẫu bit, DEC là giá trị.`;
  }
  try {
    const raw = parseInteger(numberInput.value, base);
    const converted = interpretInteger(raw, mode, width, kind, base);
    for (const target of [2, 8, 10, 16]) {
      let result = (target === 10 || converted.pattern === null ? converted.value : converted.pattern).toString(target).toUpperCase();
      if (target !== 10 && converted.pattern !== null) result = result.padStart(Math.ceil(width / Math.log2(target)), '0');
      document.getElementById(`out-${target}`).textContent = result;
    }
    errorText.textContent = '';
    numberInput.removeAttribute('aria-invalid');
    copyButtons.forEach(button => { button.disabled = false; });
    renderLearning(raw, converted, base, mode, width, kind);
  } catch (error) {
    errorText.textContent = error.message;
    numberInput.setAttribute('aria-invalid', 'true');
    for (const target of [2, 8, 10, 16]) document.getElementById(`out-${target}`).textContent = '—';
    copyButtons.forEach(button => { button.disabled = true; });
    learningPanel.hidden = true;
  }
}
[numberMode, bitWidth, inputKind].forEach(control => control.addEventListener('change', convert));
numberInput.addEventListener('input', convert);
baseInput.addEventListener('change', convert);
document.querySelectorAll('[data-example]').forEach(button => {
  button.addEventListener('click', () => {
    numberMode.value = button.dataset.mode || 'math';
    bitWidth.value = '8';
    inputKind.value = button.dataset.kind || 'value';
    numberInput.value = button.dataset.example;
    baseInput.value = button.dataset.base;
    convert();
  });
});
copyButtons.forEach(button => button.addEventListener('click', async () => {
  const value = document.getElementById(`out-${button.dataset.copy}`).textContent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = `Đã sao chép kết quả hệ ${button.dataset.copy}.`;
  } catch (error) {
    const output = document.getElementById(`out-${button.dataset.copy}`);
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(output);
    selection.removeAllRanges();
    selection.addRange(range);
    copyStatus.textContent = 'Đã chọn kết quả. Nhấn Ctrl+C hoặc ⌘C để sao chép.';
  }
}));
convert();
