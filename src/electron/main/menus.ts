import { app, Menu, nativeTheme } from 'electron';

const isMac = process.platform === 'darwin';
const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false;

export function initAppMenu() {
    const themSubMenu: Electron.MenuItem | Electron.MenuItemConstructorOptions = {
        label: 'Theme',
        submenu: [
            {
                label: 'System',
                type: 'radio',
                checked: nativeTheme.themeSource === 'system',
                click: () => (nativeTheme.themeSource = 'system'),
            },
            {
                label: 'Light',
                type: 'radio',
                checked: nativeTheme.themeSource === 'light',
                click: () => (nativeTheme.themeSource = 'light'),
            },
            {
                label: 'Dark',
                type: 'radio',
                checked: nativeTheme.themeSource === 'dark',
                click: () => (nativeTheme.themeSource = 'dark'),
            },
        ],
    };

    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [
                  {
                      label: app.name,
                      submenu: [
                          { role: 'about' },
                          { type: 'separator' },
                          { role: 'services' },
                          { type: 'separator' },
                          { role: 'hide' },
                          { role: 'hideOthers' },
                          { role: 'unhide' },
                          { type: 'separator' },
                          { role: 'quit' },
                      ],
                  },
              ]
            : []),
        // { role: 'fileMenu' }
        {
            label: 'File',
            submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
        },
        // { role: 'editMenu' }
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                ...(isMac
                    ? [
                          { role: 'pasteAndMatchStyle' },
                          { role: 'delete' },
                          { role: 'selectAll' },
                          { type: 'separator' },
                          {
                              label: 'Speech',
                              submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
                          },
                      ]
                    : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
            ],
        },
        // { role: 'viewMenu' }
        {
            label: 'View',
            submenu: [
                themSubMenu,
                { type: 'separator' },
                ...(isDev
                    ? [{ role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }, { type: 'separator' }]
                    : []),
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' },
            ],
        },
        // { role: 'windowMenu' }
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [{ type: 'separator' }, { role: 'front' }, { type: 'separator' }, { role: 'window' }]
                    : [{ role: 'close' }]),
            ],
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'Learn More',
                    click: async () => {
                        const { shell } = require('electron');
                        await shell.openExternal('https://electronjs.org');
                    },
                },
                { role: 'about' },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template as any);
    Menu.setApplicationMenu(menu);
}
