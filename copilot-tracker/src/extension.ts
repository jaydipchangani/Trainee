import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let copilotUsageSeconds = 0;
let totalUsageSeconds = 0;
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

    // Track VS Code total active time
    vscode.window.onDidChangeWindowState((state) => {
        if (state.focused) {
            console.log("🟢 VS Code Active");
            lastActiveTimestamp = Date.now();
        } else {
            console.log("🔴 VS Code Inactive");
            updateTotalUsageTime();
        }
    });

    // Listen for Copilot completions
    vscode.workspace.onDidChangeTextDocument(handleTextChange, null, context.subscriptions);

    // Save usage every 5 seconds
    setInterval(() => {
        updateTotalUsageTime();
        saveUsageData();
    }, 5000);

    let disposable = vscode.commands.registerCommand('copilotTracker.start', () => {
        vscode.window.showInformationMessage("Copilot Tracker started tracking!");
    });

    context.subscriptions.push(disposable);
}

function handleTextChange(event: vscode.TextDocumentChangeEvent) {
    if (event.contentChanges.length === 0) return;

    const changeText = event.contentChanges[0].text;
    if (changeText.length > 5) {  // Copilot usually inserts longer text
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

function updateTotalUsageTime() {
    if (lastActiveTimestamp !== null) {
        const timeDiff = (Date.now() - lastActiveTimestamp) / 1000;
        totalUsageSeconds += Math.round(timeDiff);
        console.log(`⏳ Total VS Code Usage: ${formatTime(totalUsageSeconds)}`);
    }
    lastActiveTimestamp = Date.now();
}

function saveUsageData() {
    try {
        const today = getFormattedDate();
        const data = fs.existsSync(storagePath) ? JSON.parse(fs.readFileSync(storagePath, 'utf8')) : {};

        data[today] = {
            Copilot: formatTime(copilotUsageSeconds),
            totalUsageTime: formatTime(totalUsageSeconds),
        };

        fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
        console.log("✅ Data saved:", JSON.stringify(data[today]));
    } catch (error) {
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
                totalUsageSeconds = timeToSeconds(data[today].totalUsageTime) || 0;
                console.log("📊 Loaded previous data:", data[today]);
            }
        }
    } catch (error) {
        console.error("⚠️ Error loading data:", error);
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

function getFormattedDate(): string {
    const date = new Date();
    return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
}

export function deactivate() {
    console.log("❌ Copilot Tracker: Extension DEACTIVATED!");
    updateTotalUsageTime();
    saveUsageData();
}
