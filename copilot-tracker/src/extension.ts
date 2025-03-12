import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let totalUsageTime = 0;  // Total time in seconds
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
        totalUsageTime += Math.round(timeDiff);
        console.log(`⏳ Updated Copilot time: ${totalUsageTime} seconds`);
    }
    lastActiveTimestamp = currentTime;
}

function saveUsageData() {
    try {
        const data = { totalUsageTime };
        fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
        console.log("✅ Copilot usage time saved!", totalUsageTime, "seconds");
    } catch (error) {
        console.error("❌ Error saving usage data:", error);
    }
}

function loadUsageData() {
    try {
        if (fs.existsSync(storagePath)) {
            const data = JSON.parse(fs.readFileSync(storagePath, 'utf8'));
            totalUsageTime = data.totalUsageTime || 0;
            console.log("📊 Loaded previous Copilot usage:", totalUsageTime, "seconds");
        }
    } catch (error) {
        console.error("⚠️ Error loading previous usage data:", error);
    }
}

export function deactivate() {
    console.log("❌ Copilot Tracker: Extension DEACTIVATED!");
    saveUsageData();
}
