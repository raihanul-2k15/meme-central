import { app, BrowserWindow, Menu, Tray } from 'electron';
import path from 'path';

const isMac = process.platform === 'darwin';
const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false;

export function initTray(mainWindow: BrowserWindow) {
    let isQuitting = false;

    const menu = Menu.buildFromTemplate([
        {
            label: 'Show App',
            click: function () {
                mainWindow.show();
            },
        },
        {
            label: 'Quit',
            click: function () {
                isQuitting = true;
                app.quit();
            },
        },
    ]);

    const tray = new Tray(path.join(__dirname, '../../../dist/favicon.ico'));
    tray.setToolTip('meme-central');
    tray.setToolTip('meme-central tooltip');
    tray.setContextMenu(menu);

    tray.on('double-click', () => {
        mainWindow.show();
    });

    mainWindow.on('close', function (e) {
        if (isDev) {
            console.log('Did not minimize to system tray bcz in dev mode');
            return;
        }
        if (!isQuitting) {
            e.preventDefault();
            mainWindow.hide();
        }
    });
}
