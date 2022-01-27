// 请参考echo文件夹内的用法
import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify'
import axios from 'axios'

class PixivTop extends AppCommand {
    code = 'top';
    trigger = 'top';
    help = '.pixiv top 查看当日top10图片'
    intro = 'pixiv top榜';
    func: AppFunc<BaseSession> = async (session) => {
        if (!session.args.length) {
            return session.reply(this.help)
        }

        if (isNaN(Number(session.args[0]))) {
            return session.reply('用数字wdnmd')
        }

        if ((Number(session.args[0])) > 25) {
            return session.reply('由于开黑啦限制，最多展示20张图片')
        }

        const number = session.args[0] || 10
        const response = await axios({
            method: 'get',
            url: `http://127.0.0.1:3000/illusts/top?tops=${number}`
        })

        const metaUrls = response.data;
        console.log(metaUrls)
        const card = new Card()
        // @ts-ignore
        metaUrls.pixiv.imageUrls.forEach((item, index) => {
            card.addText(`pixiv top${index + 1}: ${item.title}. pid: ${item.id}`)
            card.addImage(item.url)
        })

        return session.sendCard(card)
    }
}

export const pixivTop = new PixivTop();