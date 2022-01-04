import { KBotify } from 'kbotify';
import auth from '../configs/auth';

export const bot = new KBotify({
    mode: 'websocket',
    token: auth.khltoken,
    port: auth.khlport,
    ignoreDecryptError: true,
});
