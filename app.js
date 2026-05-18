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
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("progressPercent").textContent = percent + "%";
}

// ============================================
// UI INITIALIZATION
// ============================================

function initializeUI() {
  const basicContainer = document.getElementById("basicRulesContainer");
  const advancedContainer = document.getElementById("advancedRulesContainer");
  
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
  const hasFile = lastData !== null;
  const hasBasicRules = document.querySelectorAll('#basicRulesContainer input:checked').length > 0;
  const hasAdvRules = document.querySelectorAll('#advancedRulesContainer input:checked').length > 0;
  
  document.getElementById("generateBasicBtn").disabled = !hasFile || !hasBasicRules;
  document.getElementById("generateAdvBtn").disabled = !hasFile || !hasAdvRules;
  document.getElementById("clearBasicBtn").disabled = lastResult === "";
  document.getElementById("downloadBtn").disabled = lastResult === "";
  document.getElementById("copyBtn").disabled = lastResult === "";
}

function switchTab(tab) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
  
  document.getElementById(tab).classList.add("active");
  event.target.classList.add("active");
}

function filterRules(tab) {
  const search = document.getElementById(`search${tab.charAt(0).toUpperCase() + tab.slice(1)}`).value.toLowerCase();
  const container = document.getElementById(`${tab}RulesContainer`);
  
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
    document.getElementById("statsFile").textContent = lastData.length;
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
  
  if (isProcessing) return;
  isProcessing = true;
  shouldStop = false;
  
  document.getElementById("generateBasicBtn").disabled = true;
  document.getElementById("generateAdvBtn").disabled = true;
  document.getElementById("stopBtn").style.display = "inline-flex";
  document.getElementById("progressSection").classList.add("active");
  
  try {
    let chosen = [];
    let customPatterns = {};
    
    if (mode === "custom") {
      customPatterns = {
        suffixes: document.getElementById("customSuffixes").value.split("\n").filter(x => x.trim()),
        prefixes: document.getElementById("customPrefixes").value.split("\n").filter(x => x.trim()),
        separators: document.getElementById("customSeparators").value.split("\n").filter(x => x.trim())
      };
    } else {
      const selector = mode === "basic" ? "#basicRulesContainer" : "#advancedRulesContainer";
      chosen = Array.from(document.querySelectorAll(`${selector} input:checked`))
        .map((c) => c.value);
      
      if (chosen.length === 0) {
        showToast("❌ Vui lòng chọn ít nhất một quy tắc!", "error");
        isProcessing = false;
        document.getElementById("generateBasicBtn").disabled = false;
        document.getElementById("generateAdvBtn").disabled = false;
        document.getElementById("stopBtn").style.display = "none";
        document.getElementById("progressSection").classList.remove("active");
        return;
      }
    }
    
    const payload = {
      mode: mode,
      data: lastData,
      rules: chosen,
      customPatterns: customPatterns,
      depth: parseInt(document.getElementById("mutationDepth").value),
      chunkSize: parseInt(document.getElementById("chunkSize").value),
      maxResults: parseInt(document.getElementById("maxResults").value)
    };
    
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    
    const result = await response.json();
    allResults.clear();
    
    result.variants.forEach(variant => {
      allResults.set(variant, true);
    });
    
    displayResults();
    
    const ratio = lastData.length > 0 ? (allResults.size / lastData.length).toFixed(1) : 0;
    document.getElementById("statsVariants").textContent = allResults.size;
    document.getElementById("statsRatio").textContent = ratio + "x";
    
    showToast(
      `✅ Tạo ${allResults.size} variants từ ${lastData.length} cặp!`,
      "success"
    );
    
  } catch (error) {
    console.error("Error:", error);
    showToast(`❌ Lỗi: ${error.message}`, "error");
  } finally {
    isProcessing = false;
    shouldStop = false;
    document.getElementById("generateBasicBtn").disabled = false;
    document.getElementById("generateAdvBtn").disabled = false;
    document.getElementById("stopBtn").style.display = "none";
    document.getElementById("progressSection").classList.remove("active");
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
  document.getElementById("output").textContent = output || "Không có kết quả.";
  document.getElementById("count").textContent = items.length;
  document.getElementById("totalCount").textContent = allResults.size;
}

function stopProcessing() {
  shouldStop = true;
  isProcessing = false;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function downloadResults() {
  if (allResults.size === 0) return;
  
  const format = document.getElementById("exportFormat").value;
  let content, filename, type;
  
  const items = Array.from(allResults.keys());
  
  if (format === "csv") {
    content = "username,password\n" + items.map(line => {
      const [user, pass] = line.split(":");
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
  if (!lastResult) return;
  
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
  document.getElementById("fileInput").value = "";
  document.querySelectorAll(".rules input:checked").forEach((c) => {
    c.checked = false;
  });
  document.getElementById("output").textContent = "Chưa có dữ liệu. Vui lòng tải file lên.";
  document.getElementById("count").textContent = "0";
  document.getElementById("totalCount").textContent = "0";
  document.getElementById("progressBar").style.width = "0%";
  document.getElementById("statsFile").textContent = "0";
  document.getElementById("statsVariants").textContent = "0";
  document.getElementById("statsRatio").textContent = "0x";
  updateButtonStates();
  showToast("🗑️ Đã xóa tất cả dữ liệu!", "info");
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  initializeUI();
  setupFileUpload();
  updateButtonStates();
});