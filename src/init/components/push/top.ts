// 每日top自动推送
import got from 'got'
import { Mode } from '../../../commands/pixiv/type'
import { getKookLinks } from '../../../commands/pixiv/components/links/kook-links'
import { Top, AbNormal } from '../../../cards'
import { KookApi, KookType } from '../../../apis'
import auth from '../../../configs/auth'

export const pushTop = async (mode: Mode) => {
    got(`http://127.0.0.1:8000/ranks/${mode}`, {
        method: 'get'
    }).json<any>().then(async (res) => {
        const pics = res.data.illusts.slice(0, 10);
        const date = res.data.date;
        const links = await getKookLinks(pics);
        const cards = Top.pics(links, date, mode).toString()
        auth.push_setting.recommendChannelIds.forEach(item => {
            KookApi.Channel.sendMessage(cards, item, KookType.MessageType.card)
            .catch(err => {
                KookApi.Channel.sendMessage(AbNormal.error(`Error: 每日推荐推送出错. date: ${err}`).toString(), item, KookType.MessageType.card)
            })
        })
    }).catch(err => {
        if (err) {
            console.error(err)
            auth.push_setting.recommendChannelIds.forEach(item => {
                KookApi.Channel.sendMessage(AbNormal.error(`日推图片下载失败，请联系开发者`).toString(), item, KookType.MessageType.card)
            })
        }
    })
}
