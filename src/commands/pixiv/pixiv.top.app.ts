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

        const response = await axios({
            method: 'get',
            url: 'http://127.0.0.1:3000/illusts'
        })

        const card = new Card()
        // @ts-ignore
        response.data.data.imageUrls.forEach((item, index) => {
            card.addText(`pixiv top${index + 1}: ${item.title}`)
            card.addImage(item.url)
        })

        return session.sendCard(card)
    }
}

export const pixivTop = new PixivTop();