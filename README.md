# 🔑 Password Variant Tool PRO

**Multi-Stage Mutation Engine v2.0**

All your Passwords in one place. Fast, Easy & Queue-free.

## ✨ Features

- ⚡ **Fast Processing**: Efficiently generate thousands of variants
- 🔧 **Advanced Rules**: 12 categories of mutation rules
- 🎯 **Custom Patterns**: Create your own prefix/suffix/separator patterns
- 📊 **Real-time Stats**: Track generation progress
- 💾 **Multiple Export**: TXT, CSV, JSON formats
- 🌙 **Dark UI**: Modern, eye-friendly interface
- 📱 **Responsive**: Works on desktop and mobile

## 🚀 Quick Start

### Installation

```bash
git clone <repository-url>
cd password-variant-tool-pro
```

### Running Locally

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## 📝 Usage

### 1. Upload File
- Format: `username:password` (one per line)
- Supports .txt and .csv files

### 2. Choose Generation Mode

#### Basic Rules
- Apply single-stage transformations
- Best for quick generation

#### Advanced Mode
- Multi-stage mutation chain
- Adjust depth (1-4) for more variants

#### Custom Patterns
- Add custom prefixes/suffixes
- Define custom separators

### 3. Configure Settings
- **Mutation Depth**: How many layers of mutations (1-4)
- **Chunk Size**: Process batch size (100-5000)
- **Max Results**: Maximum variants to generate
- **Export Format**: Choose output format

### 4. Generate & Download
- Click Generate button
- Preview first 1000 results
- Download in TXT/CSV/JSON format

## 📋 Available Rules

### Category 1: Case Transformations
- Lowercase
- UPPERCASE
- Capitalize

### Category 2-3: Number/Date Suffixes
- Common sequences: 123, 1234, 12345...
- Popular years: 1990, 2000, 2010, 2020, 2024...

### Category 4: Special Characters
- Symbols: @, !, #, $, .

### Category 5: Vietnamese Suffixes
- vip, pro, cute, love, baby, hihi, kaka

### Category 6: LEET Speak
- a→@, o→0, i→1, e→3, s→$, t→7

### Category 7: Separators
- Insert _, -, . between letters and numbers

### Category 8: Reverse
- Full reverse
- Reverse letters only

### Category 9: Duplication
- Double the password

### Category 10-12: Advanced
- Username-based mutations
- Number manipulations
- Phone number transformations

## ⚙️ Technical Details

### Architecture
```
js/
├── app.js          # Main initialization
├── config.js       # Constants and configuration
├── utils.js        # Utility functions
├── rules.js        # Transformation rules
├── mutations.js    # Advanced mutation logic
├── ui.js           # UI management
├── filehandler.js  # File upload/parsing
└── processing.js   # Main processing logic

css/
├── style.css       # Main styles
├── animations.css  # Animation definitions
└── responsive.css  # Responsive breakpoints
```

### Performance
- Non-blocking async processing
- Chunked file processing
- Real-time progress updates
- Result caching with Set

## 🛡️ Security

- 100% Client-side processing
- No data sent to server
- No cookies or tracking
- Supports offline usage

## 📱 Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License

## 👨‍💻 Author

Created by @teddyvrp  
Made with ❤️ by TEDDYTOOLS.DEV