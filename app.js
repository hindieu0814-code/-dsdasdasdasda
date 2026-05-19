const API_URL = 'http://localhost:3001/api';

let currentData = null;
let currentResults = null;

// Snowflakes
function createSnowflake() {
  const sf = document.createElement('div');
  sf.className = 'snowflake';
  sf.textContent = '❄️';
  sf.style.left = Math.random() * 100 + '%';
  sf.style.animationDuration = (Math.random() * 10 + 10) + 's';
  document.getElementById('snowflakes').appendChild(sf);
  setTimeout(() => sf.remove(), 20000);
}
setInterval(createSnowflake, 500);

// Rules
const RULES_CONFIG = [
  { name: "Case", rules: ["1a", "1b", "1c"] },
  { name: "Numbers", rules: ["2a", "2b", "2c", "2d"] },
  { name: "Years", rules: ["3a", "3b", "3c", "3d"] },
  { name: "Special", rules: ["4a", "4b", "4c", "4d"] },
  { name: "Vietnamese", rules: ["5a", "5b", "5c", "5d", "5e", "5f", "5g"] },
  { name: "LEET", rules: ["6a", "6b", "6c", "6d", "6e", "6f"] }
];

const RULE_LABELS = {
  "1a": "lowercase", "1b": "UPPERCASE", "1c": "Capitalize",
  "2a": "+123", "2b": "+1234", "2c": "+12345", "2d": "+123456",
  "3a": "+1990", "3b": "+2000", "3c": "+2020", "3d": "+2024",
  "4a": "+@", "4b": "+!", "4c": "+#", "4d": "+$",
  "5a": "+vip", "5b": "+pro", "5c": "+cute", "5d": "+love", "5e": "+baby", "5f": "+hihi", "5g": "+kaka",
  "6a": "a→@", "6b": "o→0", "6c": "i→1", "6d": "e→3", "6e": "s→$", "6f": "t→7"
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initRules();
  setupTabs();
  setupFileUpload();
  setupEventListeners();
});

function initRules() {
  ['basic', 'advanced'].forEach(type => {
    const container = document.getElementById(`${type}RulesContainer`);
    RULES_CONFIG.forEach(group => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'rule-group';
      groupDiv.innerHTML = `<label>${group.name}</label><div class="subrules"></div>`;
      
      group.rules.forEach(ruleId => {
        const subrules = groupDiv.querySelector('.subrules');
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${ruleId}" data-type="${type}"> ${RULE_LABELS[ruleId]}`;
        subrules.appendChild(label);
      });
      
      container.appendChild(groupDiv);
    });
  });
}

function setupTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.getElementById(btn.dataset.tab).classList.add('active');
      btn.classList.add('active');
    });
  });
}

function setupFileUpload() {
  const fileInput = document.getElementById('fileInput');
  const uploadArea = document.getElementById('uploadArea');

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_URL}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      
      currentData = data;
      document.getElementById('statsFile').textContent = data.recordCount;
      showToast(`✅ Loaded ${data.recordCount} credentials`, 'success');
      updateButtons();
    } catch (err) {
      showToast('❌ Upload failed', 'error');
    }
  });

  uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.style.borderColor = '#00d4ff';
  });

  uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    fileInput.files = e.dataTransfer.files;
    fileInput.dispatchEvent(new Event('change'));
  });
}

function setupEventListeners() {
  document.getElementById('generateBasicBtn').addEventListener('click', () => generateVariants('basic'));
  document.getElementById('generateAdvBtn').addEventListener('click', () => generateVariants('advanced'));
  document.getElementById('generateCustomBtn').addEventListener('click', () => generateVariants('custom'));
  document.getElementById('downloadBtn').addEventListener('click', downloadResults);
  document.getElementById('copyBtn').addEventListener('click', copyResults);
  document.getElementById('clearBtn').addEventListener('click', clearAll);
}

async function generateVariants(mode) {
  if (!currentData) {
    showToast('❌ Please upload file', 'error');
    return;
  }

  const selectedRules = Array.from(document.querySelectorAll(`input[data-type="${mode}"]:checked`))
    .map(c => c.value);

  if (mode !== 'custom' && selectedRules.length === 0) {
    showToast('❌ Select at least one rule', 'error');
    return;
  }

  const progressSection = document.getElementById('progressSection');
  progressSection.style.display = 'block';

  try {
    const res = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentials: currentData.sampleData,
        mode,
        rules: selectedRules,
        customSuffixes: document.getElementById('customSuffixes').value.split('\n').filter(x => x),
        customPrefixes: document.getElementById('customPrefixes').value.split('\n').filter(x => x),
        maxResults: parseInt(document.getElementById('maxResults').value)
      })
    });

    const result = await res.json();
    currentResults = result.variants;

    displayResults(result.variants);
    document.getElementById('statsVariants').textContent = result.variants.length;
    showToast(`✅ Generated ${result.variants.length} variants`, 'success');
  } catch (err) {
    showToast('❌ Generation failed', 'error');
  } finally {
    progressSection.style.display = 'none';
  }
}

function displayResults(variants) {
  const preview = variants.slice(0, 1000);
  document.getElementById('output').textContent = preview.join('\n');
  document.getElementById('count').textContent = preview.length;
  document.getElementById('totalCount').textContent = variants.length;
}

async function downloadResults() {
  if (!currentResults) return;

  const format = document.getElementById('exportFormat').value;
  const res = await fetch(`${API_URL}/export/${format}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: currentResults })
  });

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `passwords.${format}`;
  a.click();
  showToast('✅ Downloaded', 'success');
}

function copyResults() {
  if (!currentResults) return;
  navigator.clipboard.writeText(currentResults.join('\n'));
  showToast('✅ Copied', 'success');
}

function clearAll() {
  currentData = null;
  currentResults = null;
  document.getElementById('fileInput').value = '';
  document.getElementById('output').textContent = 'No data';
  updateButtons();
  showToast('🗑️ Cleared', 'info');
}

function updateButtons() {
  const hasData = !!currentData;
  const hasResults = !!currentResults;
  document.getElementById('generateBasicBtn').disabled = !hasData;
  document.getElementById('generateAdvBtn').disabled = !hasData;
  document.getElementById('downloadBtn').disabled = !hasResults;
  document.getElementById('copyBtn').disabled = !hasResults;
  document.getElementById('clearBtn').disabled = !hasData;
}

function showToast(msg, type) {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}