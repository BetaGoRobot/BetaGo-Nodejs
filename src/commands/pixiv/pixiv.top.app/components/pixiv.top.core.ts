import { AppFunc, BaseSession } from 'kbotify'
import { Pixiv } from '../../../../apis/pixiv'
import { Top } from '../../../../cards/top'
import { AbNormal } from '../../../../cards/error';
import { KookLinks, Mode } from '../../type'
import { getKookLinks } from '../../components/illusts/kook-links'


export const PixivMenu: (mode: Mode) => AppFunc<BaseSession> = (mode) => async (session) => {
    if (!session.args.length) {
        // return session.reply(`指令有误，请输入.pixiv ${mode} x`);
        return session.sendCard(AbNormal.args(`.pixiv ${mode}`, '请输入 `.pixiv ' + mode + ' 「number」` 进行top榜查询'))
    }

    if (isNaN(Number(session.args[0]))) {
        return session.sendCard(AbNormal.args(`.pixiv ${mode}`, '`「number」必须是数字`'))
    }

    if ((Number(session.args[0])) > 20) {
        session.reply('由于开黑啦（Kook）限制，每次图片最多展示20张')
    }

    const number = (Number(session.args[0]) > 20 ? 20 : session.args[0]) || 10;

    // TODO 后续换成域名接口
    await Pixiv.request.get(`/ranks/${mode}`).then(async (res) => {
        const pics = res.data.data.illusts.slice(0, number);
        const date = res.data.data.date;
        await session.sendCard(Top.loading(date, mode))
        let links: KookLinks = await getKookLinks(pics)
        await session.sendCard(Top.pics(links, date, mode))
    })
    .catch(err => {
        if (err) {
            console.error(err);
            session.sendCard(Top.failed('网络异常，请求失败'))
        }
    })
}
