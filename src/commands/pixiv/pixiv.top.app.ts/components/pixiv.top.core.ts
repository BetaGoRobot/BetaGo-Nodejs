import { AppFunc, BaseSession } from 'kbotify'
import axios from 'axios'
import FormData from 'form-data'
import { Cache } from '../../components/cache/pixiv-illusts-kook'
import { Top } from '../../../../cards/top'
import { AbNormal } from '../../../../cards/error';
import { KookApi } from '../../../../apis'
import { Mode, TopLinks } from '../../type'

//TODO: 使用该域名前缀将会避开GWF  replace("i.pximg.net", "i.pixiv.re")
const TIME_OUT = 5000

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
    await axios.get(`http://127.0.0.1:8000/ranks/${mode}`).then(async (res) => {
        const pics = res.data.data.illusts.slice(0, number);
        const date = res.data.data.date;
        await session.sendCard(Top.loading(date, mode))
        const links: TopLinks = []
        for (let i = 0; i < pics.length; i++){
            const illust = pics[i]
            if (Cache.getCache(illust.id)) {
                links.push({
                    id: illust.id,
                    link: Cache.getCache(illust.id),
                    title: illust.title,
                    top: i + 1
                })
            } else {
                const stream = await axios({
                    url: illust.image_urls.large.replace("i.pximg.net", "i.pixiv.re"),
                    responseType: 'stream',
                    timeout: TIME_OUT
                }).catch(err => {
                    if (err) {
                        console.error(err)
                        session.sendCard(AbNormal.error(`网络问题，下载pid=[${illust.id}](https://www.pixiv.net/artworks/${illust.id})出现错误`))
                    }
                    return err;
                })

                if (stream.status !== 200) {
                    links.push({
                        id: '0',
                        link: 'https://img.kaiheila.cn/emojis/3757937292559087/qK1gHuxGo40u00t5.png',
                        title: `top[${i + 1}]图片下载失败`,
                        top: 114514
                    })
                    continue
                }
                const formData = new FormData()
                formData.append('file', stream.data, '1.jpg')
                await KookApi.upload(formData)
                    .then(url => {
                        links.push({
                            id: illust.id,
                            link: url,
                            title: illust.title,
                            top: i + 1
                        })
                        Cache.setCache(illust.id, url)
                    })
                    .catch(err => {
                        if (err) {
                            console.error(err)
                            links.push({
                                id: '0',
                                link: 'https://img.kaiheila.cn/emojis/3757937292559087/qK1gHuxGo40u00t5.png',
                                title: `top[${i + 1}]图片上传失败`,
                                top: 114514
                            })
                        }
                    })
            }
        }
        session.sendCard(Top.pics(links, date, mode))
    })
    .catch(err => {
        if (err) {
            console.error(err);
            session.sendCard(Top.failed('网络异常，请求失败'))
        }
    })
}
