import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { generateMemeCaption } from './ai';

import { Meme, UnsavedMeme } from '../../env';

const isMac = process.platform === 'darwin';
const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false;

export function initMemesHandler(mainWindow: BrowserWindow) {
    let memes: Meme[] = loadMemes();

    ipcMain.handle('getMemes', (e) => {
        return memes.map((m) => ({ ...m, path: 'memeimage://' + m.path }));
    });

    ipcMain.handle('addMeme', (e, meme: UnsavedMeme) => {
        const id = getNewId(memes);
        const savedPath = path.join(app.getPath('userData'), 'images', id.toString());
        fs.writeFileSync(savedPath, Buffer.from(meme.imageContents, 'base64'), 'binary');
        const savedMeme: Meme = { ...meme, id, path: savedPath };
        memes.push(savedMeme);
        saveMemes(memes);
    });

    ipcMain.handle('removeMeme', (e, id: number) => {
        memes = memes.filter((meme) => meme.id !== id);
        saveMemes(memes);
    });

    ipcMain.handle('generateCaption', (e, { name, tags }: { name: string; tags: string[] }): Promise<string> => {
        if (tags.length < 1) return Promise.reject('No tags provided');
        return generateMemeCaption({ name, tags });
    });

    app.on('before-quit', () => {
        saveMemes(memes);
    });
}

function getNewId(memes: Meme[]): number {
    if (memes.length === 0) return 1;
    return Math.max(...memes.map((meme) => meme.id)) + 1;
}

function loadMemes(): Meme[] {
    const defaultMemeImage = isDev
        ? path.join(__dirname, '../../../extraResources/defaultMeme.png')
        : path.join(process.resourcesPath, 'extraResources/defaultMeme.png');

    if (!fs.existsSync(path.join(app.getPath('userData'), 'images'))) {
        fs.mkdirSync(path.join(app.getPath('userData'), 'images'));
        fs.copyFileSync(defaultMemeImage, path.join(app.getPath('userData'), 'images/1'));
    }

    if (!fs.existsSync(path.join(app.getPath('userData'), 'memes.json'))) {
        const memes: Meme[] = [
            {
                id: 1,
                name: 'Nice Funny Software',
                tags: ['software', 'development', 'sucks'],
                caption: 'What actually happens in the software industry',
                path: path.join(app.getPath('userData'), 'images/1'),
            },
        ];
        fs.writeFileSync(path.join(app.getPath('userData'), 'memes.json'), JSON.stringify(memes), 'utf8');
    }

    const fileContents = fs.readFileSync(path.join(app.getPath('userData'), 'memes.json'), 'utf8');

    return JSON.parse(fileContents);
}

function saveMemes(memes: Meme[]) {
    fs.writeFileSync(path.join(app.getPath('userData'), 'memes.json'), JSON.stringify(memes), 'utf8');
}
