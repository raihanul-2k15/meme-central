import dotenv from 'dotenv';
import path from 'path';

const isDev = process.env.npm_lifecycle_event === 'app:dev' ? true : false;

const envPath = isDev
    ? path.join(__dirname, '../../../devResources/.env')
    : path.join(process.resourcesPath, 'extraResources/.env');

dotenv.config({ path: envPath });

export const openAiApiKey = process.env.OPENAI_API_KEY || '';
export const paymentStatusApiUrl = process.env.PAYMENT_STATUS_API_URL || '';

console.log(openAiApiKey, paymentStatusApiUrl);
