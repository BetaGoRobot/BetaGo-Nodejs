import { AppFunc, BaseSession, Card } from 'kbotify'
import axios from 'axios'
import moment from 'moment'
import { Top } from '../../../../cards/top'
import { AbNormal } from '../../../../cards/error';
import { Mode, TopLinks } from '../../type'

//TODO: 使用该域名前缀将会避开GWF  replace("i.pximg.net", "i.pixiv.re")

export const PixivMenu: (mode: Mode) => AppFunc<BaseSession> = (mode) => async (session) => {
    if (!session.args.length) {
        // return session.reply(`指令有误，请输入.pixiv ${mode} x`);
        return session.sendCard(AbNormal.args(`.pixiv ${mode}`, '请输入 `.pixiv ' + mode + ' 「number」` 进行top榜查询'))
    }

    if (isNaN(Number(session.args[0]))) {
        return session.sendCard(AbNormal.args(`.pixiv ${mode}`, '`「number」必须是数字`'))
    }

    if ((Number(session.args[0])) > 20) {
        session.reply('由于开黑啦限制，每次图片最多展示20张')
    }

    const number = (Number(session.args[0]) > 20 ? 20 : session.args[0]) || 10;



    // TODO 后续换成域名接口
    await axios.get(`http://127.0.0.1:8000/ranks/${mode}`).then(res => {
        const pics = res.data.data.illusts.slice(0, number);
        const date = res.data.data.date;
        session.sendCard(Top.loading(date, mode));
        const links: TopLinks = pics.map((item: any) => ({
            title: item.title,
            id: item.id,
            link: item.image_urls.large.replace("i.pximg.net", "i.pixiv.re")
        }))
        session.sendCard(Top.pics(links, date, mode))
    })
    .catch(err => {
        if (err) {
            console.error(err);
            session.sendCard(Top.failed('网络异常，请求失败'))
        }
    })
}
