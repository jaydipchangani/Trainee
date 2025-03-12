import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let copilotUsageStart: number | null = null;
let totalCopilotUsage = 0;
const logFile = path.join(__dirname, "..", "copilot_usage_log.json");

export function activate(context: vscode.ExtensionContext) {
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.contentChanges.length > 0 && event.document.languageId !== 'plaintext') {
            trackCopilotUsage();
        }
    });

    context.subscriptions.push(vscode.commands.registerCommand('extension.showCopilotUsage', () => {
        const usageInSeconds = Math.floor(totalCopilotUsage / 1000);
        vscode.window.showInformationMessage(`Copilot used for: ${convertToHHMMSS(usageInSeconds)}`);
    }));

    loadPreviousUsage();
}

export function deactivate() {
    if (copilotUsageStart !== null) {
        totalCopilotUsage += Date.now() - copilotUsageStart;
        saveUsageData();
    }
}

function trackCopilotUsage() {
    if (copilotUsageStart === null) {
        copilotUsageStart = Date.now();
    }
    setTimeout(() => {
        if (copilotUsageStart !== null) {
            totalCopilotUsage += Date.now() - copilotUsageStart;
            copilotUsageStart = Date.now();
            saveUsageData();
        }
    }, 5000);  // Logs time every 5 seconds while using Copilot
}

function saveUsageData() {
    const data = { copilotUsage: totalCopilotUsage };
    fs.writeFileSync(logFile, JSON.stringify(data, null, 2));
}

function loadPreviousUsage() {
    if (fs.existsSync(logFile)) {
        const data = JSON.parse(fs.readFileSync(logFile, "utf-8"));
        totalCopilotUsage = data.copilotUsage || 0;
    }
}

function convertToHHMMSS(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
