import { AppCommand, AppFunc, BaseSession } from 'kbotify'
import { Search } from '../../cards/search'
import { AbNormal } from '../../cards/error'
import { SearchLinks, SearchFinalLinks } from './type'
import { NSFW } from './components/nsfw'
import { Cache } from './components/cache/pixiv-illusts-kook'
import { KookApi } from '../../apis'
import FormData, { Stream } from 'form-data'
import sharp from "sharp"
import axios from 'axios'

const TIME_OUT = 5000;

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

            const updateIllusts = async (index: number) => {
                const card = await Search.pics(readyPicsInfo, session, links.length)
                await session.updateMessage(msgId, [card]).catch(err => {
                    if (err) {
                        console.error(err)
                        session.sendCard(AbNormal.error(`更新第${index + 1}张图出现错误`))
                    }
                })
            }

            for (let index = 0; index < links.length; index++){
                const illust = links[index]
                console.log('循环开始')
                if (index === 0) {
                    const card = await Search.pics(readyPicsInfo, session, links.length)
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

                // 判断缓存
                if (Cache.getCache(illust.id)) {
                    readyPicsInfo.push({
                        id: illust.id,
                        link: Cache.getCache(illust.id),
                        origin: illust.link,
                        title: illust.title
                    })
                    console.log(readyPicsInfo)
                    await updateIllusts(index)
                    continue
                }

                // 走pixiv的cdn，可不需要代理
                const link = illust.link.replace("i.pximg.net", "i.pixiv.re")
                const formdata = new FormData()
                console.log('开始下载')
                const stream = await axios({
                    url: link,
                    responseType: 'stream',
                    timeout: TIME_OUT
                }).catch(err => {
                    if (err) {
                        console.error(err)
                        session.sendCard(AbNormal.error(`网络问题，下载pid=[${illust.id}](https://www.pixiv.net/artworks/${illust.id})出现错误`))
                    }
                    return err
                })

                if (stream.status !== 200) {
                    readyPicsInfo.push({
                        title: `第${index + 1}张图下载失败`,
                        id: '0',
                        link: 'https://img.kookapp.cn/assets/2022-07/GuIK4BUe6P0li0i0.jpeg',
                        origin: ''
                    })
                    continue;
                }

                let buffer = await sharp(await stream2buffer(stream.data)).resize(512).jpeg().toBuffer()
                console.log('Sharp处理完毕')
                const result = await NSFW(buffer)
                console.log('nsfw识别完毕')
                const nsfw = result.blur > 0
                if (nsfw) {
                    buffer = await sharp(buffer).blur(result.blur).jpeg().toBuffer()
                }
                formdata.append('file', buffer, "1.jpg")
                await KookApi.Media.upload(formdata).then(url => {
                    readyPicsInfo.push({
                        title: illust.title,
                        id: illust.id,
                        link: url,
                        origin: illust.link
                    })
                    Cache.setCache(illust.id, url)
                })
                .catch(err => {
                    if (err) {
                        console.error(err)
                        session.sendCard(AbNormal.error(`上传第${index + 1}张图出现错误`))
                    }
                })
                // 进行更新
                if (msgId) {
                    console.log('ready',readyPicsInfo)
                    await updateIllusts(index)
                }
                console.log('循环结束')
            }

        }

        if (!session.args.length) {
            session.sendCard(AbNormal.args('.pixiv search','请输入关键词, `.pixiv search [关键词]`'))
        } else {
            const keywords = session.args.join(" ");
            await axios({
                url: "http://127.0.0.1:8000/illusts/search",
                params: {
                    keyword: keywords
                }
            }).then(res => {
                const slice = res.data.data.slice(0, 9);
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