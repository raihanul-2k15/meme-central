import { join } from 'path';
import { app, BrowserWindow, ipcMain, protocol } from 'electron';
// import gkm from 'gkm';
import { initAppMenu } from './menus';
import { initTray } from './tray';
import { initMemesHandler } from './memes';
import { initPaymentStatusHandler } from './paymentStatus';

const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false;
const isMac = process.platform === 'darwin';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 600,
        webPreferences: {
            webSecurity: true,
            preload: join(__dirname, '../preload/preload.js'),
        },
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000'); // Open the DevTools.
        // mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(join(__dirname, '../../index.html'));
    }
    initAppMenu();
    initMemesHandler(mainWindow);
    initPaymentStatusHandler(mainWindow);
}

app.whenReady().then(() => {
    protocol.registerFileProtocol('memeimage', (req, cb) => {
        const url = req.url.substring('memeimage://'.length);
        cb(url);
    });
    createWindow();
    mainWindow?.on('closed', () => (mainWindow = null));
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});
