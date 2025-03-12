import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let totalUsageSeconds = 0;  // Store time in seconds
let lastActiveTimestamp: number | null = null;
let storagePath: string;

export function activate(context: vscode.ExtensionContext) {
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

function handleTextChange(event: vscode.TextDocumentChangeEvent) {
    if (event.contentChanges.length === 0) {
        return;  // No actual text changes
    }

    // Check if the change is likely from Copilot
    const changeText = event.contentChanges[0].text;
    if (changeText.length > 5) {  // Copilot usually inserts longer text
        console.log("🤖 Copilot suggestion detected!");
        updateUsageTime();
    }
}

function updateUsageTime() {
    const currentTime = Date.now();
    if (lastActiveTimestamp !== null) {
        const timeDiff = (currentTime - lastActiveTimestamp) / 1000;  // Convert to seconds
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
    } catch (error) {
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
    } catch (error) {
        console.error("⚠️ Error loading previous usage data:", error);
    }
}

function formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function timeToSeconds(timeStr: string): number {
    if (!timeStr) return 0;
    const [hours, minutes, seconds] = timeStr.split(":").map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
}

export function deactivate() {
    console.log("❌ Copilot Tracker: Extension DEACTIVATED!");
    saveUsageData();
}
