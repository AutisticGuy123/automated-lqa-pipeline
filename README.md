# 🚀 Automated Localization QA Pipeline

## 📌 Project Overview
A robust, automated Localization Quality Assurance (LQA) script engineered to streamline the translation pipeline between Google Drive and Crowdin. This tool eliminates manual copy-pasting and automatically detects critical technical formatting errors (missing variables, broken HTML tags) in target translations before they reach the production environment.

## 🛠️ Tech Stack & Tools
* **Language:** JavaScript / Google Apps Script (GAS)
* **API Integration:** Crowdin API v2 (RESTful), Google Drive API
* **Algorithms:** Regex (Regular Expressions) for string validation
* **Data Format:** JSON parsing, ZIP extraction in memory

## ⚙️ How It Works
1. **Source Synchronization:** Fetches the source `en.json` file directly from Google Drive and pushes it to a Crowdin project using `POST` and `PUT` endpoints.
2. **Asynchronous Build:** Triggers a translation build on Crowdin servers, utilizing a `while` loop to poll the build status until completion.
3. **Memory Extraction:** Downloads the compiled `.zip` package from Crowdin and extracts the target language JSON file directly within the virtual memory space (avoiding local storage limitations).
4. **Automated Validation (The Core):** Cross-references source and target strings using a custom Regex engine to ensure 100% integrity of placeholders (e.g., `{playerName}`) and HTML tags (e.g., `<b>`).

## 📊 Impact & Results
* **Time Efficiency:** Reduces manual LQA checks by over 90%. What takes a human hours to verify is completed in under 2 seconds.
* **Bug Prevention:** Successfully caught 23 injected technical errors in a mock test environment, preventing fatal UI crashes in software localization.
