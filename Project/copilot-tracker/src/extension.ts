import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let copilotUsageStart: number | null = null;
let totalCopilotUsage = 0;
const logFile = path.join(__dirname, "copilot_usage_log.json");

export function activate(context: vscode.ExtensionContext) {
    vscode.window.onDidChangeTextEditorVisibleRanges((event) => {
        if (event.textEditor.document.languageId === 'copilot') {
            if (copilotUsageStart === null) {
                copilotUsageStart = Date.now();
            }
        } else {
            if (copilotUsageStart !== null) {
                totalCopilotUsage += Date.now() - copilotUsageStart;
                copilotUsageStart = null;
                saveUsageData();
            }
        }
    });

    context.subscriptions.push(vscode.commands.registerCommand('extension.showCopilotUsage', () => {
        const usageInSeconds = Math.floor(totalCopilotUsage / 1000);
        vscode.window.showInformationMessage(`Copilot used for: ${convertToHHMMSS(usageInSeconds)}`);
    }));
}

export function deactivate() {
    if (copilotUsageStart !== null) {
        totalCopilotUsage += Date.now() - copilotUsageStart;
        saveUsageData();
    }
}

function saveUsageData() {
    fs.writeFileSync(logFile, JSON.stringify({ copilotUsage: totalCopilotUsage }, null, 2));
}

function convertToHHMMSS(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
