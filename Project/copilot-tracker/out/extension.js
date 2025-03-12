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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let copilotUsageStart = null;
let totalCopilotUsage = 0;
const logFile = path.join(__dirname, "..", "copilot_usage_log.json");
function activate(context) {
    vscode.workspace.onDidChangeTextDocument((event) => {
        console.log("Copilot activity detected.");
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
function deactivate() {
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
    }, 5000); // Logs time every 5 seconds while using Copilot
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
function convertToHHMMSS(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
//# sourceMappingURL=extension.js.map