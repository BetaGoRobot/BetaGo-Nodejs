// 请参考echo文件夹内的用法
import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify'
import axios from 'axios'

class PixivTop extends AppCommand {
    code = 'day';
    trigger = 'day';
    help = '.pixiv day 查看当日top10图片'
    intro = 'pixiv top榜';
    func: AppFunc<BaseSession> = async (session) => {
        console.log('收到post请求')
        if (!session.args.length) {
            return session.reply('指令有误，请输入.pixiv top x')
        }

        if (isNaN(Number(session.args[0]))) {
            return session.reply('用数字wdnmd')
        }

        if ((Number(session.args[0])) > 25) {
            return session.reply('由于开黑啦限制，top最多为20')
        }

        const number = session.args[0] || 10;
        const response = await axios({
            method: 'get',
            url: `http://127.0.0.1:8000/oss/day`
        })

        const pics = response.data;
        const metaUrls = pics.data.slice(0,number);
        const card = new Card()
        // @ts-ignore
        metaUrls.forEach((item, index) => {
            card.addText(`pixiv top${index + 1}: ${item.title}. pid: ${item.id}`)
            card.addImage(item.url)
        })

        return session.sendCard(card)
    }
}

export const pixivTop = new PixivTop();