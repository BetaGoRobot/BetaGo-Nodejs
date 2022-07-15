import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify'
import { Search } from '../../cards/search'
import { AbNormal } from '../../cards/error'
import { SearchLinks, SearchFinalLinks } from './type'
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
            
            const readyPicsInfo: SearchFinalLinks = []
            if (!links.length) {
                session.sendCard(Search.Failed('关键词图片貌似搜不到捏，要不换个词试试？'))
                return
            }

            for (let index = 0; index < links.length; index++){
                if (index === 0) {
                    const card = await Search.pics(readyPicsInfo, session)
                    await session.sendCard(card).then(res => {
                        console.log(res.msgSent?.msgId)
                        msgId = res.msgSent?.msgId || ''
                    }).catch(err => {
                        if (err) {
                            session.sendCard(AbNormal.error(err))
                            console.error(err);
                        }
                    })
                }

                // 走pixiv的cdn，可不需要代理
                const link = links[index].link.replace("i.pximg.net", "i.pixiv.re")
                const formdata = new FormData()
                const stream = await axios({
                    url: link,
                    responseType: 'stream'
                })

                let buffer = await sharp(await stream2buffer(stream.data)).resize(512).jpeg().toBuffer()
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
                    readyPicsInfo.push({
                        title: links[index].title,
                        id: links[index].id,
                        link: res.data.data.url,
                        origin: links[index].link
                    })
                }).catch(err => {
                    if (err) {
                        console.error(err)
                        session.sendCard(AbNormal.error(`上传第${index + 1}张图出现错误`))
                    }
                })
                // 进行更新
                if (msgId) {
                    const card = await Search.pics(readyPicsInfo, session)
                    console.log('searchCard', card)
                    session.updateMessage(msgId, [card]).catch(err => {
                        if (err) {
                            console.error(err)
                            session.sendCard(AbNormal.error(`更新第${index + 1}张图出现错误`))
                        }
                    })
                }
            }

        }

        if (!session.args.length) {
            session.sendCard(AbNormal.args('.pixiv search','请输入关键词, `.pixiv search [关键词]`'))
        } else {
            const keywords = session.args[0];
            await axios({
                // TODO 后续换成自己的接口，先用大佬的
                url: "http://pixiv.lolicon.ac.cn/topInTag",
                params: {
                    keyword: keywords
                }
            }).then(res => {
                const slice = res.data.slice(0, 9);
                sendPics(slice.map((item: any) => ({
                    id: item.id,
                    link: item.image_urls.large,
                    title: item.title
                })))
            }).catch(err => {
                if (err) {
                    console.error(err)
                    session.sendCard(AbNormal.error(err))
                }
            });
        }
    }
}

export const pixivSearch = new PixivSearch()