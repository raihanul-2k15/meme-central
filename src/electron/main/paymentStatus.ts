import { app, BrowserWindow, dialog, ipcMain, ipcRenderer, nativeTheme } from 'electron';
import path from 'path';
import fs from 'fs';
import { paymentStatusApiUrl } from './config';
import axios from 'axios';

const isMac = process.platform === 'darwin';
const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false;

export async function initPaymentStatusHandler(mainWindow: BrowserWindow) {
    const paymentStatPath = path.join(app.getPath('userData'), 'paymentStatus.json');
    const annoyingMsgPath = isDev
        ? path.join(__dirname, '../../../devResources/annoyingMessages.json')
        : path.join(process.resourcesPath, 'extraResources/annoyingMessages.json');

    if (!(await isPaid())) {
        await showAnnoyingMessage();
    } else {
        await markPaid();
    }

    async function isPaid(): Promise<boolean> {
        if (isDev) return true;

        let stat = false;
        if (fs.existsSync(paymentStatPath)) {
            const payObj = JSON.parse(fs.readFileSync(paymentStatPath).toString());
            stat = payObj['paid'];
        }

        if (!stat) {
            try {
                const payObj: any = (await axios.get(paymentStatusApiUrl + '/paymentStatus')).data;
                stat = payObj['paid'];
            } catch (e) {
                console.error('failed to get payment status from api', e);
            }
        }

        return stat;
    }

    async function markPaid(): Promise<void> {
        fs.writeFileSync(paymentStatPath, JSON.stringify({ paid: true }));
    }

    async function showAnnoyingMessage(): Promise<void> {
        const messages: string[] = JSON.parse(fs.readFileSync(annoyingMsgPath).toString());

        for (let m of messages) {
            await dialog.showMessageBox(mainWindow, {
                title: 'Please Pay',
                message: m,
                type: getRandom(['info', 'error', 'question', 'warning']),
            });
        }
    }
}

function getRandom(list: string[]) {
    return list[Math.floor(Math.random() * list.length)];
}
