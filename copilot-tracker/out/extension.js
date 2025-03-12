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
let startTime = null;
let totalUsageTime = 0;
let storagePath;
function loadPreviousData() {
    try {
        if (fs.existsSync(storagePath)) {
            const data = JSON.parse(fs.readFileSync(storagePath, "utf8"));
            totalUsageTime = data.totalUsageTime || 0;
        }
    }
    catch (error) {
        console.error("Error loading previous data:", error);
    }
}
function saveUsageData() {
    try {
        const data = { totalUsageTime };
        fs.writeFileSync(storagePath, JSON.stringify(data, null, 2));
    }
    catch (error) {
        console.error("Error saving usage data:", error);
    }
}
function activate(context) {
    console.log("Copilot Tracker Activated");
    console.log("===== Copilot Tracker Extension ACTIVATED =====");
    // Get the path for storage
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
function deactivate() {
    if (startTime) {
        totalUsageTime += Math.floor((Date.now() - startTime) / 1000);
        saveUsageData();
    }
}
//# sourceMappingURL=extension.js.map