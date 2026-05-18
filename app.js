// ============================================
// CONFIG & CONSTANTS
// ============================================
const MAX_LENGTH = 20;

const RULES_CONFIG = [
  {
    id: 1,
    name: "📝 Viết thường/hoa/Capitalize",
    rules: [
      { id: "1a", label: "Viết thường (lowercase)" },
      { id: "1b", label: "Viết hoa (UPPERCASE)" },
      { id: "1c", label: "Hoa đầu tiên (Capitalize)" }
    ]
  },
  {
    id: 2,
    name: "🔢 Thêm số phổ biến",
    rules: [
      { id: "2a", label: "+123" },
      { id: "2b", label: "+1234" },
      { id: "2c", label: "+12345" },
      { id: "2d", label: "+123456" },
      { id: "2e", label: "+1234567" },
      { id: "2f", label: "+12345678" },
      { id: "2g", label: "+123456789" }
    ]
  },
  {
    id: 3,
    name: "📅 Thêm năm phổ biến",
    rules: [
      { id: "3a", label: "+1990" },
      { id: "3b", label: "+2000" },
      { id: "3c", label: "+2010" },
      { id: "3d", label: "+2020" },
      { id: "3e", label: "+2024" },
      { id: "3f", label: "+90" },
      { id: "3g", label: "+95" }
    ]
  },
  {
    id: 4,
    name: "🔣 Thêm ký tự đặc biệt",
    rules: [
      { id: "4a", label: "+@" },
      { id: "4b", label: "+@@" },
      { id: "4c", label: "+!" },
      { id: "4d", label: "+!!" },
      { id: "4e", label: "+#" },
      { id: "4f", label: "+$" },
      { id: "4g", label: "+." }
    ]
  },
  {
    id: 5,
    name: "🎯 Hậu tố kiểu Việt",
    rules: [
      { id: "5a", label: "+vip" },
      { id: "5b", label: "+pro" },
      { id: "5c", label: "+cute" },
      { id: "5d", label: "+love" },
      { id: "5e", label: "+baby" },
      { id: "5f", label: "+hihi" },
      { id: "5g", label: "+kaka" }
    ]
  },
  {
    id: 6,
    name: "💠 Chuyển sang LEET speak",
    rules: [
      { id: "6a", label: "a→@" },
      { id: "6b", label: "o→0" },
      { id: "6c", label: "i→1" },
      { id: "6d", label: "e→3" },
      { id: "6e", label: "s→$" },
      { id: "6f", label: "t→7" }
    ]
  },
  {
    id: 7,
    name: "➖ Thêm dấu phân cách",
    rules: [
      { id: "7a", label: "chèn _" },
      { id: "7b", label: "chèn -" },
      { id: "7c", label: "chèn ." }
    ]
  },
  {
    id: 8,
    name: "🔄 Đảo ngược",
    rules: [
      { id: "8a", label: "Reverse toàn bộ" },
      { id: "8b", label: "Reverse chữ, giữ số" }
    ]
  },
  {
    id: 9,
    name: "📦 Nhân đôi & Lặp lại",
    rules: [
      { id: "9a", label: "Double (xxx→xxxxx)" },
      { id: "9b", label: "+Pass 2x" }
    ]
  },
  {
    id: 10,
    name: "👤 Từ Username",
    rules: [
      { id: "10a", label: "User+123" },
      { id: "10b", label: "User+@" },
      { id: "10c", label: "User+1999" },
      { id: "10d", label: "User@123" }
    ]
  },
  {
    id: 11,
    name: "🔗 Ghép & Biến đổi",
    rules: [
      { id: "11a", label: "Thêm số cuối (111→1111)" },
      { id: "11b", label: "Thêm số đầu (111→1111)" },
      { id: "11c", label: "CamelCase (hello→Hello)" }
    ]
  },
  {
    id: 12,
    name: "☎️ Biến đổi số điện thoại",
    rules: [
      { id: "12a", label: "SĐT+@" },
      { id: "12b", label: "SĐT+123" },
      { id: "12c", label: "SĐT+vip" }
    ]
  }
];

let lastResult = "";
let allResults = new Map();
let lastData = null;
let isProcessing = false;
let shouldStop = false;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function updateProgress(current, total) {
  const percent = Math.round((current / total) * 100);
  const progressBar = document.getElementById("progressBar");
  const progressPercent = document.getElementById("progressPercent");
  
  if (progressBar) progressBar.style.width = percent + "%";
  if (progressPercent) progressPercent.textContent = percent + "%";
}

// ============================================
// UI INITIALIZATION
// ============================================

function initializeUI() {
  const basicContainer = document.getElementById("basicRulesContainer");
  const advancedContainer = document.getElementById("advancedRulesContainer");
  
  if (!basicContainer || !advancedContainer) {
    console.error("❌ Missing rule containers in HTML!");
    return;
  }
  
  basicContainer.innerHTML = "";
  advancedContainer.innerHTML = "";
  
  RULES_CONFIG.forEach((group) => {
    const groupDiv1 = createRuleGroup(group, "basic");
    basicContainer.appendChild(groupDiv1);
    
    const groupDiv2 = createRuleGroup(group, "advanced");
    advancedContainer.appendChild(groupDiv2);
  });
}

function createRuleGroup(group, tab) {
  const groupDiv = document.createElement("div");
  groupDiv.className = "rule-group";
  groupDiv.dataset.group = group.name;
  
  const label = document.createElement("label");
  label.textContent = group.name;
  groupDiv.appendChild(label);
  
  const subrules = document.createElement("div");
  subrules.className = "subrules";
  
  group.rules.forEach((rule) => {
    const ruleLabel = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = rule.id;
    checkbox.dataset.tab = tab;
    checkbox.addEventListener("change", updateButtonStates);
    
    ruleLabel.appendChild(checkbox);
    ruleLabel.appendChild(document.createTextNode(rule.label));
    subrules.appendChild(ruleLabel);
  });
  
  groupDiv.appendChild(subrules);
  return groupDiv;
}

function updateButtonStates() {
  const hasFile = lastData !== null && lastData.length > 0;
  const hasBasicRules = document.querySelectorAll('#basicRulesContainer input:checked').length > 0;
  const hasAdvRules = document.querySelectorAll('#advancedRulesContainer input:checked').length > 0;
  
  // Check Custom Patterns
  const suffixes = document.getElementById("customSuffixes") ? document.getElementById("customSuffixes").value.trim() : "";
  const prefixes = document.getElementById("customPrefixes") ? document.getElementById("customPrefixes").value.trim() : "";
  const separators = document.getElementById("customSeparators") ? document.getElementById("customSeparators").value.trim() : "";
  const hasCustomPatterns = suffixes || prefixes || separators;
  
  // Update button states
  const generateBasicBtn = document.getElementById("generateBasicBtn");
  const generateAdvBtn = document.getElementById("generateAdvBtn");
  const generateCustomBtn = document.getElementById("generateCustomBtn");
  const clearBasicBtn = document.getElementById("clearBasicBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtn = document.getElementById("copyBtn");
  
  if (generateBasicBtn) generateBasicBtn.disabled = !hasFile || !hasBasicRules;
  if (generateAdvBtn) generateAdvBtn.disabled = !hasFile || !hasAdvRules;
  if (generateCustomBtn) generateCustomBtn.disabled = !hasFile || !hasCustomPatterns;
  if (clearBasicBtn) clearBasicBtn.disabled = lastResult === "" || !hasFile;
  if (downloadBtn) downloadBtn.disabled = lastResult === "";
  if (copyBtn) copyBtn.disabled = lastResult === "";
}

function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-button").forEach(el => el.classList.remove("active"));
  
  const tabContent = document.getElementById(tab);
  if (tabContent) tabContent.classList.add("active");
  
  const activeBtn = document.querySelector(`.tab-button[data-tab="${tab}"]`);
  if (activeBtn) activeBtn.classList.add("active");
}

function filterRules(tab) {
  const searchId = tab.charAt(0).toUpperCase() + tab.slice(1);
  const searchEl = document.getElementById(`search${searchId}`);
  const container = document.getElementById(`${tab}RulesContainer`);
  
  if (!searchEl || !container) return;
  
  const search = searchEl.value.toLowerCase();
  
  container.querySelectorAll(".rule-group").forEach(group => {
    const name = group.dataset.group.toLowerCase();
    const visible = name.includes(search) || 
                   Array.from(group.querySelectorAll("label")).some(l => 
                     l.textContent.toLowerCase().includes(search)
                   );
    group.style.display = visible ? "" : "none";
  });
}

// ============================================
// FILE HANDLING
// ============================================

function setupFileUpload() {
  const fileInput = document.getElementById("fileInput");
  const uploadArea = document.getElementById("uploadArea");
  
  if (!fileInput || !uploadArea) {
    console.error("❌ Missing file upload elements!");
    return;
  }
  
  fileInput.addEventListener("change", handleFileSelect);
  
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.style.background = "#f0f2f5";
  });
  
  uploadArea.addEventListener("dragleave", () => {
    uploadArea.style.background = "";
  });
  
  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.style.background = "";
    if (e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      handleFileSelect();
    }
  });
}

function handleFileSelect() {
  const file = document.getElementById("fileInput").files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    lastData = parseFileContent(content);
    
    const statsFile = document.getElementById("statsFile");
    if (statsFile) statsFile.textContent = lastData.length;
    
    updateButtonStates();
    showToast(`✅ Tải ${lastData.length} cặp dữ liệu thành công!`, "success");
  };
  reader.onerror = () => {
    showToast("❌ Lỗi khi đọc file", "error");
  };
  reader.readAsText(file, "utf-8");
}

function parseFileContent(content) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && line.includes(":"))
    .map(line => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return null;
      return {
        user: line.substring(0, colonIndex).trim(),
        pass: line.substring(colonIndex + 1).trim()
      };
    })
    .filter(x => x && x.user && x.pass);
}

// ============================================
// PROCESSING - Call Backend
// ============================================

async function generateVariants(mode) {
  if (!lastData || lastData.length === 0) {
    showToast("❌ Vui lòng tải file trước!", "error");
    return;
  }
  
  if (isProcessing) {
    showToast("⏳ Đang xử lý... vui lòng chờ!", "info");
    return;
  }
  
  isProcessing = true;
  shouldStop = false;
  
  const generateBasicBtn = document.getElementById("generateBasicBtn");
  const generateAdvBtn = document.getElementById("generateAdvBtn");
  const generateCustomBtn = document.getElementById("generateCustomBtn");
  const stopBtn = document.getElementById("stopBtn");
  const progressSection = document.getElementById("progressSection");
  
  if (generateBasicBtn) generateBasicBtn.disabled = true;
  if (generateAdvBtn) generateAdvBtn.disabled = true;
  if (generateCustomBtn) generateCustomBtn.disabled = true;
  if (stopBtn) stopBtn.style.display = "inline-flex";
  if (progressSection) progressSection.style.display = "block";
  
  try {
    let chosen = [];
    let customPatterns = {};
    
    if (mode === "custom") {
      const suffixesEl = document.getElementById("customSuffixes");
      const prefixesEl = document.getElementById("customPrefixes");
      const separatorsEl = document.getElementById("customSeparators");
      
      customPatterns = {
        suffixes: suffixesEl ? suffixesEl.value.split("\n").map(x => x.trim()).filter(x => x) : [],
        prefixes: prefixesEl ? prefixesEl.value.split("\n").map(x => x.trim()).filter(x => x) : [],
        separators: separatorsEl ? separatorsEl.value.split("\n").map(x => x.trim()).filter(x => x) : []
      };
      
      if (!customPatterns.suffixes.length && !customPatterns.prefixes.length && !customPatterns.separators.length) {
        showToast("❌ Vui lòng nhập ít nhất một pattern!", "error");
        throw new Error("No custom patterns provided");
      }
    } else {
      const selector = mode === "basic" ? "#basicRulesContainer" : "#advancedRulesContainer";
      chosen = Array.from(document.querySelectorAll(`${selector} input:checked`))
        .map((c) => c.value);
      
      if (chosen.length === 0) {
        showToast("❌ Vui lòng chọn ít nhất một quy tắc!", "error");
        throw new Error("No rules selected");
      }
    }
    
    const mutationDepthEl = document.getElementById("mutationDepth");
    const maxResultsEl = document.getElementById("maxResults");
    
    const payload = {
      mode: mode,
      data: lastData,
      rules: chosen,
      customPatterns: customPatterns,
      depth: mutationDepthEl ? parseInt(mutationDepthEl.value) || 2 : 2,
      chunkSize: 500,
      maxResults: maxResultsEl ? parseInt(maxResultsEl.value) || 100000 : 100000
    };
    
    console.log("📤 Sending request:", { mode, rulesCount: chosen.length, dataCount: lastData.length });
    
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error("❌ Server error:", errorData);
      throw new Error(`Server error: ${response.status} - ${errorData}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || "Unknown error from server");
    }
    
    allResults.clear();
    
    if (result.variants && Array.isArray(result.variants)) {
      result.variants.forEach(variant => {
        allResults.set(variant, true);
      });
    }
    
    displayResults();
    
    const ratio = lastData.length > 0 ? (allResults.size / lastData.length).toFixed(1) : 0;
    const statsVariants = document.getElementById("statsVariants");
    const statsRatio = document.getElementById("statsRatio");
    
    if (statsVariants) statsVariants.textContent = allResults.size;
    if (statsRatio) statsRatio.textContent = ratio + "x";
    
    showToast(
      `✅ Tạo ${allResults.size} variants từ ${lastData.length} cặp!`,
      "success"
    );
    
  } catch (error) {
    console.error("❌ Error:", error);
    showToast(`❌ Lỗi: ${error.message}`, "error");
  } finally {
    isProcessing = false;
    shouldStop = false;
    
    if (generateBasicBtn) generateBasicBtn.disabled = false;
    if (generateAdvBtn) generateAdvBtn.disabled = false;
    if (generateCustomBtn) generateCustomBtn.disabled = false;
    if (stopBtn) stopBtn.style.display = "none";
    if (progressSection) progressSection.style.display = "none";
    
    updateButtonStates();
  }
}

function displayResults() {
  const previewLines = 1000;
  const items = Array.from(allResults.keys()).slice(0, previewLines);
  
  let output = "";
  for (const item of items) {
    output += item + "\n";
  }
  
  lastResult = output;
  
  const outputEl = document.getElementById("output");
  const countEl = document.getElementById("count");
  const totalCountEl = document.getElementById("totalCount");
  
  if (outputEl) outputEl.textContent = output || "Không có kết quả.";
  if (countEl) countEl.textContent = items.length;
  if (totalCountEl) totalCountEl.textContent = allResults.size;
}

function stopProcessing() {
  shouldStop = true;
  isProcessing = false;
  showToast("⏹️ Đã dừng xử lý!", "info");
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function downloadResults() {
  if (allResults.size === 0) {
    showToast("❌ Không có dữ liệu để tải!", "error");
    return;
  }
  
  const formatEl = document.getElementById("exportFormat");
  const format = formatEl ? formatEl.value : "txt";
  let content, filename, type;
  
  const items = Array.from(allResults.keys());
  
  if (format === "csv") {
    content = "username,password\n" + items.map(line => {
      const colonIdx = line.indexOf(":");
      const user = line.substring(0, colonIdx);
      const pass = line.substring(colonIdx + 1);
      return `"${user}","${pass}"`;
    }).join("\n");
    filename = `passwords_${Date.now()}.csv`;
    type = "text/csv;charset=utf-8";
  } else if (format === "json") {
    const data = items.map(line => {
      const colonIndex = line.indexOf(":");
      return {
        username: line.substring(0, colonIndex),
        password: line.substring(colonIndex + 1)
      };
    });
    content = JSON.stringify(data, null, 2);
    filename = `passwords_${Date.now()}.json`;
    type = "application/json;charset=utf-8";
  } else {
    content = items.join("\n");
    filename = `passwords_${Date.now()}.txt`;
    type = "text/plain;charset=utf-8";
  }
  
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
  showToast("✅ Tải file thành công!", "success");
}

function copyToClipboard() {
  if (!lastResult) {
    showToast("❌ Không có dữ liệu để copy!", "error");
    return;
  }
  
  navigator.clipboard.writeText(lastResult).then(() => {
    showToast("✅ Đã copy vào clipboard!", "success");
  }).catch(() => {
    showToast("❌ Lỗi khi copy!", "error");
  });
}

function clearAll() {
  lastResult = "";
  allResults.clear();
  lastData = null;
  
  const fileInput = document.getElementById("fileInput");
  if (fileInput) fileInput.value = "";
  
  document.querySelectorAll(".rules input:checked").forEach((c) => {
    c.checked = false;
  });
  
  // Clear Custom Patterns
  const customSuffixes = document.getElementById("customSuffixes");
  const customPrefixes = document.getElementById("customPrefixes");
  const customSeparators = document.getElementById("customSeparators");
  
  if (customSuffixes) customSuffixes.value = "";
  if (customPrefixes) customPrefixes.value = "";
  if (customSeparators) customSeparators.value = "";
  
  // Reset display
  const output = document.getElementById("output");
  const count = document.getElementById("count");
  const totalCount = document.getElementById("totalCount");
  const ratioCount = document.getElementById("ratioCount");
  const progressBar = document.getElementById("progressBar");
  const statsFile = document.getElementById("statsFile");
  const statsVariants = document.getElementById("statsVariants");
  const statsRatio = document.getElementById("statsRatio");
  
  if (output) output.textContent = "Không có dữ liệu. Vui lòng tải file lên.";
  if (count) count.textContent = "0";
  if (totalCount) totalCount.textContent = "0";
  if (ratioCount) ratioCount.textContent = "0x";
  if (progressBar) progressBar.style.width = "0%";
  if (statsFile) statsFile.textContent = "0";
  if (statsVariants) statsVariants.textContent = "0";
  if (statsRatio) statsRatio.textContent = "0x";
  
  updateButtonStates();
  showToast("🗑️ Đã xóa tất cả dữ liệu!", "info");
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 Initializing app...");
  
  initializeUI();
  setupFileUpload();
  updateButtonStates();
  
  // Add tab click handlers
  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });
  
  // Add event listeners to custom patterns
  const customTextareas = ["customSuffixes", "customPrefixes", "customSeparators"];
  customTextareas.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("change", updateButtonStates);
      el.addEventListener("input", updateButtonStates);
    }
  });
  
  console.log("✅ App initialized!");
});
