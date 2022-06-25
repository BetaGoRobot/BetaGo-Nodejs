import { AppFunc, BaseSession, Card } from 'kbotify'
import axios from 'axios'
import moment from 'moment'
import { Mode, DateSpace, Desc } from '../type'


export const PixivMenu: (mode: Mode) => AppFunc<BaseSession> = (mode) => async (session) => {
    if (!session.args.length) {
        return session.reply(`指令有误，请输入.pixiv ${mode} x`);
    }

    if (isNaN(Number(session.args[0]))) {
        return session.reply('用数字wdnmd')
    }

    if ((Number(session.args[0])) > 20) {
        return session.reply('由于开黑啦限制，每次图片最多展示20张')
    }

    const number = session.args[0] || 10;
    const response = await axios({
        method: 'get',
        url: `http://127.0.0.1:8000/oss/${mode}`
    })

    const pics = response.data.data;
    const metaUrls = pics.slice(0, number);
    const card = new Card();
    const end = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const begin = moment().subtract(DateSpace[mode], 'day').format('YYYY-MM-DD');
    const range = mode === Mode.DAY ? `${end}` : `${begin} ~ ${end}`;    
    card.addTitle(`Pixiv${Desc[mode]} ${range}`, true);
    // @ts-ignore
    metaUrls.forEach((item, index) => {
        card.addText(`top${index + 1}: ${item.title}. pid: ${item.id}. author: ${item.author}`)
        card.addImage(item.url)
    })

    return session.sendCard(card)
}