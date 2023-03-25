import { contextBridge, ipcRenderer } from 'electron';

export type IpcRendererListener = (event: Electron.IpcRendererEvent, ...args: any[]) => void;

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel: string, ...args: any[]) => ipcRenderer.send(channel, ...args),
    on: (channel: string, func: IpcRendererListener) => ipcRenderer.on(channel, func),
    off: (channel: string, func: IpcRendererListener | null) => ipcRenderer.off(channel, func as any),
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
});

// themeHandler
(function () {
    function getPreferredTheme(): 'dark' | 'light' {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function setTheme(theme: 'dark' | 'light'): void {
        document.body.setAttribute('data-bs-theme', theme);
    }

    function setThemeHandler(): void {
        setTheme(getPreferredTheme());
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            setTheme(getPreferredTheme());
        });
    }

    window.addEventListener('DOMContentLoaded', setThemeHandler);
})();
