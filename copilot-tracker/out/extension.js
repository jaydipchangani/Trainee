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
let totalUsageSeconds = 0; // Store time in seconds
let lastActiveTimestamp = null;
let storagePath;
function activate(context) {
    console.log("🔥 Copilot Tracker: Extension ACTIVATED!");
    vscode.window.showInformationMessage("Copilot Tracker Loaded!");
    storagePath = path.join(context.globalStorageUri.fsPath, "copilot_usage.json");
    console.log("📂 Storage Path:", storagePath);
    // Ensure storage directory exists
    if (!fs.existsSync(context.globalStorageUri.fsPath)) {
        fs.mkdirSync(context.globalStorageUri.fsPath, { recursive: true });
    }
    // Load saved data
    loadUsageData();
    // Listen for Copilot completions
    vscode.workspace.onDidChangeTextDocument(handleTextChange, null, context.subscriptions);
    // Save usage every 5 seconds
    setInterval(saveUsageData, 5000);
    let disposable = vscode.commands.registerCommand('copilotTracker.start', () => {
        console.log("🚀 Copilot Tracker: START command executed");
        vscode.window.showInformationMessage("Copilot Tracker started tracking!");
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function handleTextChange(event) {
    if (event.contentChanges.length === 0) {
        return; // No actual text changes
    }
    // Check if the change is likely from Copilot
    const changeText = event.contentChanges[0].text;
    if (changeText.length > 5) { // Copilot usually inserts longer text
        console.log("🤖 Copilot suggestion detected!");
        updateUsageTime();
    }
}
function updateUsageTime() {
    const currentTime = Date.now();
    if (lastActiveTimestamp !== null) {
        const timeDiff = (currentTime - lastActiveTimestamp) / 1000; // Convert to seconds
        totalUsageSeconds += Math.round(timeDiff);
        console.log(`⏳ Updated Copilot time: ${formatTime(totalUsageSeconds)}`);
    }
    lastActiveTimestamp = currentTime;
}
function saveUsageData() {
    try {
        const formattedTime = formatTime(totalUsageSeconds);
        const data = { totalUsageTime: formattedTime };
        fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
        console.log("✅ Copilot usage time saved!", formattedTime);
    }
    catch (error) {
        console.error("❌ Error saving usage data:", error);
    }
}
function loadUsageData() {
    try {
        if (fs.existsSync(storagePath)) {
            const data = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
            totalUsageSeconds = timeToSeconds(data.totalUsageTime) || 0;
            console.log("📊 Loaded previous Copilot usage:", formatTime(totalUsageSeconds));
        }
    }
    catch (error) {
        console.error("⚠️ Error loading previous usage data:", error);
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
function deactivate() {
    console.log("❌ Copilot Tracker: Extension DEACTIVATED!");
    saveUsageData();
}
exports.deactivate = deactivate;
