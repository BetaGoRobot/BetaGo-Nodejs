import { KBotify } from 'kbotify';
import auth from '../configs/auth';

export const bot = new KBotify({
    mode: 'webhook',
    token: auth.khltoken,
    verifyToken: auth.khlverify,
    port: auth.khlport,
    ignoreDecryptError: true,
});
