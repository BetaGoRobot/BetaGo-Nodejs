// 每日top自动推送
import got from 'got'
import { Mode } from '../type'
import { getTopCards } from '../pixiv.top.app.ts/components/pixiv.top.core'
import { Top, AbNormal } from '../../../cards'
import { KookApi, KookType } from '../../../apis'
import auth from '../../../configs/auth'
import moment from 'moment'

export const pushTop = async (mode: Mode) => {
    got(`http://127.0.0.1:8000/ranks/${mode}`, {
        method: 'get'
    }).json<any>().then(async (res) => {
        console.log(res.data.illusts)
        const pics = res.data.illusts.slice(0, 10);
        const date = res.data.date;
        const links = await getTopCards(pics);
        const cards = Top.pics(links, date, mode).toString()
        KookApi.Channel.sendMessage(cards, auth.recommendChannelId, KookType.MessageType.card)
    }).catch(err => {
        if (err) {
            console.error('error')
            KookApi.Channel.sendMessage(AbNormal.error(`Error: 每日推荐推送出错. date: ${err}`).toString(), auth.recommendChannelId, KookType.MessageType.card)
        }
    })
}
