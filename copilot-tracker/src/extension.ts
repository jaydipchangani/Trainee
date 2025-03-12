import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

let startTime: number | null = null;
let totalUsageTime = 0;
let storagePath: string;

function loadPreviousData() {
    try {
        if (fs.existsSync(storagePath)) {
            const data = JSON.parse(fs.readFileSync(storagePath, "utf8"));
            totalUsageTime = data.totalUsageTime || 0;
        }
    } catch (error) {
        console.error("Error loading previous data:", error);
    }
}

function saveUsageData() {
    try {
        const data = { totalUsageTime };
        fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error saving usage data:", error);
    }
}

export function activate(context: vscode.ExtensionContext) {
	console.log("===== Copilot Tracker Extension ACTIVATED =====");

    // Get the path for storage

    let disposable = vscode.commands.registerCommand('copilotTracker.start', () => {
        console.log("🚀 Copilot Tracker START command executed");
        vscode.window.showInformationMessage("Copilot Tracker started tracking!");
    });
    storagePath = path.join(context.globalStorageUri.fsPath, "copilot_usage.json");

    console.log("Storage Path:", storagePath); // Debugging: Check storage path

    // Ensure directory exists
    if (!fs.existsSync(context.globalStorageUri.fsPath)) {
        console.log("Creating storage directory...");
        fs.mkdirSync(context.globalStorageUri.fsPath, { recursive: true });
    }

    loadPreviousData();

    const startTracking = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === "javascript" || event.document.languageId === "typescript") {
            if (!startTime) {
                console.log("Copilot usage started...");
                startTime = Date.now();
            }
        }
    });

    const stopTracking = vscode.window.onDidChangeVisibleTextEditors(() => {
        if (startTime) {
            totalUsageTime += Math.floor((Date.now() - startTime) / 1000);
            console.log(`Copilot usage stopped. Total time: ${totalUsageTime} seconds`);
            startTime = null;
            saveUsageData();
        }
    });

    context.subscriptions.push(startTracking, stopTracking);
}
export function deactivate() {
    if (startTime) {
        totalUsageTime += Math.floor((Date.now() - startTime) / 1000);
        saveUsageData();
    }
}
