"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let copilotUsageSeconds = 0;
let totalUsageSeconds = 0;
let vscodeStartTime = null;
let lastActiveTimestamp = null;
let storagePath;
let isExtensionDevHost = vscode.env.appName.includes("Code - OSS Dev"); // Detect Extension Dev Mode
function activate(context) {
    console.log("🔥 Copilot Tracker: Extension ACTIVATED!");
    vscode.window.showInformationMessage("Copilot Tracker Loaded!");
    storagePath = path.join(context.globalStorageUri.fsPath, "copilot_usage.json");
    console.log("📂 Storage Path:", storagePath);
    if (!fs.existsSync(context.globalStorageUri.fsPath)) {
        fs.mkdirSync(context.globalStorageUri.fsPath, { recursive: true });
    }
    loadUsageData();
    if (isExtensionDevHost) {
        console.log("🟢 Tracking active time in Extension Development Mode.");
        if (!vscodeStartTime) {
            vscodeStartTime = Date.now();
            console.log("🚀 VS Code Started At:", new Date(vscodeStartTime).toLocaleTimeString());
        }
        // ✅ Track VS Code open time when the window is active
        vscode.window.onDidChangeWindowState((state) => {
            if (state.focused) {
                console.log("🟢 VS Code Active");
                if (!vscodeStartTime) {
                    vscodeStartTime = Date.now(); // Capture the exact start time only once
                }
                lastActiveTimestamp = Date.now(); // Update last active timestamp
            }
            else {
                console.log("🔴 VS Code Inactive");
                updateTotalUsageTime();
            }
        });
        // ✅ Ensure total VS Code usage time is only counted when the window is active
        setInterval(() => {
            if (vscode.window.state.focused) {
                if (lastActiveTimestamp !== null) {
                    totalUsageSeconds += Math.round((Date.now() - lastActiveTimestamp) / 1000);
                    lastActiveTimestamp = Date.now();
                }
            }
        }, 1000);
    }
    vscode.workspace.onDidChangeTextDocument(handleTextChange, null, context.subscriptions);
    setInterval(() => {
        if (isExtensionDevHost) {
            updateTotalUsageTime();
        }
        saveUsageData();
    }, 5000);
    let disposable = vscode.commands.registerCommand('copilotTracker.start', () => {
        vscode.window.showInformationMessage("Copilot Tracker started tracking!");
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function handleTextChange(event) {
    if (event.contentChanges.length === 0)
        return;
    const changeText = event.contentChanges[0].text;
    if (changeText.length > 5) { // Copilot usually inserts longer text
        console.log("🤖 Copilot suggestion detected!");
        updateCopilotUsageTime();
    }
}
function updateCopilotUsageTime() {
    const currentTime = Date.now();
    if (lastActiveTimestamp !== null) {
        const timeDiff = (currentTime - lastActiveTimestamp) / 1000;
        copilotUsageSeconds += Math.round(timeDiff);
        console.log(`⏳ Copilot Usage: ${formatTime(copilotUsageSeconds)}`);
    }
    lastActiveTimestamp = currentTime;
}
// ✅ Modify `updateTotalUsageTime` to count time only when VS Code was active
function updateTotalUsageTime() {
    if (vscodeStartTime !== null && lastActiveTimestamp !== null) {
        totalUsageSeconds += Math.round((Date.now() - lastActiveTimestamp) / 1000);
        lastActiveTimestamp = Date.now(); // Reset timestamp
    }
}
// ✅ Modify `saveUsageData` to correctly store total VS Code usage time
function saveUsageData() {
    try {
        const today = getFormattedDate();
        const data = fs.existsSync(storagePath) ? JSON.parse(fs.readFileSync(storagePath, 'utf8')) : {};
        data[today] = {
            Copilot: formatTime(copilotUsageSeconds),
            totalUsageTime: formatTime(totalUsageSeconds) // Always store active usage time
        };
        fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
        console.log("✅ Data saved:", JSON.stringify(data[today]));
    }
    catch (error) {
        console.error("❌ Error saving data:", error);
    }
}
function loadUsageData() {
    try {
        if (fs.existsSync(storagePath)) {
            const data = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
            const today = getFormattedDate();
            if (data[today]) {
                copilotUsageSeconds = timeToSeconds(data[today].Copilot) || 0;
                totalUsageSeconds = isExtensionDevHost ? timeToSeconds(data[today].totalUsageTime) || 0 : 0;
                console.log("📊 Loaded previous data:", data[today]);
            }
        }
    }
    catch (error) {
        console.error("⚠️ Error loading data:", error);
    }
}
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function timeToSeconds(timeStr) {
    if (!timeStr)
        return 0;
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
}
function getFormattedDate() {
    const date = new Date();
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}
function deactivate() {
    console.log("❌ Copilot Tracker: Extension DEACTIVATED!");
    if (isExtensionDevHost)
        updateTotalUsageTime();
    saveUsageData();
}
exports.deactivate = deactivate;
