import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify'
import { Failed } from '../../cards/search'
import { SearchLinks } from './type'
import { Search } from '../../cards/search'
import { NSFW } from './components/nsfw'
import auth from '../../configs/auth'
import FormData, { Stream } from 'form-data'
import sharp, { format } from "sharp"
import axios from 'axios'

async function stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const _buf = Array<any>();
        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));
    });
}


class PixivSearch extends AppCommand {
    code = "search"
    trigger = "search"
    intro = "search illustrations"
    func: AppFunc<BaseSession> = async (session) => {
        let msgId: string

        const sendPics = async (links: SearchLinks) => {
            
            const readyLinks: string[] = []
            const readyPids: string[] = []
            if (!links.length) {
                session.sendCard(Failed('关键词请求为空'))
                return
            }

            for (let index = 0; index < links.length; index++){
                if (index === 0) {
                    const card = await Search(readyLinks, readyPids)
                    await session.sendCard(card).then(res => {
                        console.log(res.msgSent?.msgId)
                        msgId = res.msgSent?.msgId || '';
                    });
                }

                // 走pixiv的cdn，可不需要代理
                const link = links[index].link.replace("i.pximg.net", "i.pixiv.re")
                const formdata = new FormData()
                const stream = await axios({
                    url: link,
                    responseType: 'stream'
                })

                let buffer = await sharp(await stream2buffer(stream.data)).resize(512).jpeg().toBuffer()
                console.log(buffer)
                const result = await NSFW(buffer)
                const nsfw = result.blur > 0
                if (nsfw) {
                    buffer = await sharp(buffer).blur(result.blur).jpeg().toBuffer()
                }
                formdata.append('file', buffer, "1.jpg")
                // 上传图片至开黑啦
                await axios({
                    method: "post",
                    url: "https://www.kookapp.cn/api/v3/asset/create",
                    data: formdata,
                    headers: {
                        'Authorization': `Bot ${auth.khltoken}`,
                        ...formdata.getHeaders()
                    }
                }).then(res => {
                    readyLinks.push(res.data.data.url)
                    readyPids.push(links[index].id)
                }).catch(err => {

                })
                // 进行更新
                if (msgId) {
                    const card = await Search(readyLinks, readyPids)
                    session.updateMessage(msgId, [card])
                }
            }

        }

        if (!session.args.length) {
            session.sendCard(new Card({
                type: "card",
                theme: "warning",
                size: "lg",
                modules: [
                    {
                        type: "header",
                        text: {
                            type: "plain-text",
                            content : "Pixiv search 命令出错"
                        }
                    },
                    {
                        type: "section",
                        text: {
                            type: "kmarkdown",
                            content: "请输入关键词，正确用法应为 `.pixiv search [关键词]`"
                        }
                    }
                ]
            }))
        } else {
            const keywords = session.args[0];
            const res = await axios({
                url: "http://pixiv.lolicon.ac.cn/topInTag",
                params: {
                    keyword: keywords
                }
            });

            sendPics(res.data.map((item: any) => ({
                id: item.id,
                link: item.image_urls.large,
                title: item.title
            })))
        }
    }
}

export const pixivSearch = new PixivSearch()