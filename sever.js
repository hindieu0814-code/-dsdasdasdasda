const express = require("express");
const path = require("path");
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.static(".")); // Serve static files (HTML, CSS, JS)

// ============================================
// RULES IMPLEMENTATION (Backend)
// ============================================

const LEET_MAP = {
  a: ["@", "4"],
  o: ["0"],
  s: ["$", "5"],
  e: ["3"],
  i: ["1"],
  t: ["7"]
};

const MAX_LENGTH = 20;

function tokenize(pwd) {
  return pwd.match(/[A-Za-z]+|\d+|[^A-Za-z0-9]/g) || [];
}

function isPhoneNumber(str) {
  return /^0\d{9,10}$/.test(str.replace(/\D/g, ""));
}

function hasEntropyIssue(str) {
  if (/^(.)\1{3,}$/.test(str)) return true;
  
  for (let len = 1; len <= str.length / 2; len++) {
    const pattern = str.substring(0, len);
    let expected = "";
    for (let i = 0; i < str.length; i += len) {
      expected += pattern;
    }
    if (str === expected.substring(0, str.length) && str.length >= len * 2) {
      return true;
    }
  }
  
  return false;
}

function validVariant(variant, original) {
  if (!variant) return false;
  if (variant === original) return false;
  if (variant.length > MAX_LENGTH) return false;
  if (hasEntropyIssue(variant)) return false;
  return true;
}

// ============================================
// TRANSFORMATION RULES
// ============================================

const RULES = {
  "1a": (t) => [t.join("").toLowerCase()],
  "1b": (t) => [t.join("").toUpperCase()],
  "1c": (t) => {
    const str = t.join("");
    for (let i = 0; i < str.length; i++) {
      if (/[a-zA-Z]/.test(str[i])) {
        return [str.substring(0, i) + str[i].toUpperCase() + str.substring(i + 1)];
      }
    }
    return [];
  },
  "2a": (t) => [t.join("") + "123"],
  "2b": (t) => [t.join("") + "1234"],
  "2c": (t) => [t.join("") + "12345"],
  "2d": (t) => [t.join("") + "123456"],
  "2e": (t) => [t.join("") + "1234567"],
  "2f": (t) => [t.join("") + "12345678"],
  "2g": (t) => [t.join("") + "123456789"],
  "3a": (t) => [t.join("") + "1990"],
  "3b": (t) => [t.join("") + "2000"],
  "3c": (t) => [t.join("") + "2010"],
  "3d": (t) => [t.join("") + "2020"],
  "3e": (t) => [t.join("") + "2024"],
  "3f": (t) => [t.join("") + "90"],
  "3g": (t) => [t.join("") + "95"],
  "4a": (t) => [t.join("") + "@"],
  "4b": (t) => [t.join("") + "@@"],
  "4c": (t) => [t.join("") + "!"],
  "4d": (t) => [t.join("") + "!!"],
  "4e": (t) => [t.join("") + "#"],
  "4f": (t) => [t.join("") + "$"],
  "4g": (t) => [t.join("") + "."],
  "5a": (t) => [t.join("") + "vip"],
  "5b": (t) => [t.join("") + "pro"],
  "5c": (t) => [t.join("") + "cute"],
  "5d": (t) => [t.join("") + "love"],
  "5e": (t) => [t.join("") + "baby"],
  "5f": (t) => [t.join("") + "hihi"],
  "5g": (t) => [t.join("") + "kaka"],
  "6a": (t) => [t.join("").replace(/[aA]/g, "@")],
  "6b": (t) => [t.join("").replace(/[oO]/g, "0")],
  "6c": (t) => [t.join("").replace(/[iI]/g, "1")],
  "6d": (t) => [t.join("").replace(/[eE]/g, "3")],
  "6e": (t) => [t.join("").replace(/[sS]/g, "$")],
  "6f": (t) => [t.join("").replace(/[tT]/g, "7")],
  "7a": (t) => {
    const w = t.join("");
    const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
    if (m) {
      const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
      const digits = /\d/.test(m[1]) ? m[1] : m[2];
      return [letters + "_" + digits];
    }
    return [];
  },
  "7b": (t) => {
    const w = t.join("");
    const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
    if (m) {
      const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
      const digits = /\d/.test(m[1]) ? m[1] : m[2];
      return [letters + "-" + digits];
    }
    return [];
  },
  "7c": (t) => {
    const w = t.join("");
    const m = w.match(/^([A-Za-z]+)(\d+)$/) || w.match(/^(\d+)([A-Za-z]+)$/);
    if (m) {
      const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
      const digits = /\d/.test(m[1]) ? m[1] : m[2];
      return [letters + "." + digits];
    }
    return [];
  },
  "8a": (t) => [t.join("").split("").reverse().join("")],
  "8b": (t) => {
    const w = t.join("");
    const letters = w.match(/[A-Za-z]/g) || [];
    const nonLetters = w.match(/[^A-Za-z]/g) || [];
    return [letters.reverse().join("") + nonLetters.join("")];
  },
  "9a": (t) => {
    const w = t.join("");
    if ((w.length * 2) > MAX_LENGTH) return [];
    return [w + w];
  },
  "9b": (t) => {
    const w = t.join("");
    if ((w.length * 2) > MAX_LENGTH) return [];
    return [w + w];
  },
  "10a": (user) => {
    const base = user.split("@")[0];
    return base ? [base + "123"] : [];
  },
  "10b": (user) => {
    const base = user.split("@")[0];
    return base ? [base + "@"] : [];
  },
  "10c": (user) => {
    const base = user.split("@")[0];
    return base ? [base + "1999"] : [];
  },
  "10d": (user) => {
    const base = user.split("@")[0];
    return base ? [base + "@123"] : [];
  },
  "11a": (t) => {
    const w = t.join("");
    const lastNum = w.match(/\d+$/);
    if (lastNum) {
      const num = lastNum[0];
      const rest = w.substring(0, w.length - num.length);
      return [rest + num + num.charAt(0)];
    }
    return [];
  },
  "11b": (t) => {
    const w = t.join("");
    const firstNum = w.match(/^\d+/);
    if (firstNum) {
      const num = firstNum[0];
      return [num + num.charAt(0) + w.substring(num.length)];
    }
    return [];
  },
  "11c": (t) => {
    const w = t.join("");
    return [w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()];
  },
  "12a": (t) => {
    const w = t.join("");
    if (isPhoneNumber(w)) {
      return [w + "@"];
    }
    return [];
  },
  "12b": (t) => {
    const w = t.join("");
    if (isPhoneNumber(w)) {
      return [w + "123"];
    }
    return [];
  },
  "12c": (t) => {
    const w = t.join("");
    if (isPhoneNumber(w)) {
      return [w + "vip"];
    }
    return [];
  }
};

// ============================================
// API ENDPOINT
// ============================================

app.post("/api/generate", (req, res) => {
  try {
    const { mode, data, rules, customPatterns, depth, maxResults } = req.body;
    
    const variants = new Set();
    
    if (mode === "custom") {
      for (const item of data) {
        if (variants.size >= maxResults) break;
        
        const pass = item.pass;
        const user = item.user;
        
        // Suffixes
        for (const suffix of customPatterns.suffixes) {
          if (variants.size >= maxResults) break;
          const v = pass + suffix;
          if (validVariant(v, pass)) {
            variants.add(`${user.toLowerCase()}:${v}`);
          }
        }
        
        // Prefixes
        for (const prefix of customPatterns.prefixes) {
          if (variants.size >= maxResults) break;
          const v = prefix + pass;
          if (validVariant(v, pass)) {
            variants.add(`${user.toLowerCase()}:${v}`);
          }
        }
        
        // Separators
        for (const sep of customPatterns.separators) {
          if (variants.size >= maxResults) break;
          const m = pass.match(/^([A-Za-z]+)(\d+)$/) || pass.match(/^(\d+)([A-Za-z]+)$/);
          if (m) {
            const letters = /[a-zA-Z]/.test(m[1]) ? m[1] : m[2];
            const digits = /\d/.test(m[1]) ? m[1] : m[2];
            const v = letters + sep + digits;
            if (validVariant(v, pass)) {
              variants.add(`${user.toLowerCase()}:${v}`);
            }
          }
        }
      }
    } else {
      for (const item of data) {
        if (variants.size >= maxResults) break;
        
        const origPass = item.pass;
        const user = item.user;
        const tokens = tokenize(origPass);
        
        for (const ruleId of rules) {
          if (variants.size >= maxResults) break;
          
          const ruleFn = RULES[ruleId];
          if (!ruleFn) continue;
          
          try {
            const result = ruleId.startsWith("10") || ruleId.startsWith("12") 
              ? ruleFn(user) 
              : ruleFn(tokens);
            const variantsArray = Array.isArray(result) ? result : [result];
            
            for (const v of variantsArray) {
              if (variants.size >= maxResults) break;
              if (validVariant(v, origPass)) {
                variants.add(`${user.toLowerCase()}:${v}`);
              }
            }
          } catch (e) {
            console.error(`Error in rule ${ruleId}:`, e);
          }
        }
      }
    }
    
    res.json({
      success: true,
      variants: Array.from(variants),
      count: variants.size
    });
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});