import { expose } from 'threads/worker'
import { Cache } from '../cache/pixiv-illusts-kook'
import { PixivIllustLink, KookLink } from '../../type'
import { uploadImage } from './kook-links'

const RETRY_LIMIT = 5

expose({
    async getLinks(pics: Array<PixivIllustLink>) {
        console.log('Work已启动')
        const download = async (retry ?: number) => {
            let result: Array<KookLink> = []
            for (let i = 0; i < pics.length; i++){
                const illust = pics[i]
                if (Cache.getCache(illust.id)) {
                    result.push({
                        id: illust.id,
                        link: Cache.getCache(illust.id),
                        title: illust.title,
                        top: i + 1
                    })
                } else {
                    const res = await uploadImage(illust.image_urls.large)
                    if (res.status === 'error') {
                        result.push({
                            id: '0',
                            link: 'https://img.kaiheila.cn/emojis/3757937292559087/qK1gHuxGo40u00t5.png',
                            title: `图片id为[${illust.id}](https://www.pixiv.net/artworks/${illust.id})下载/上传异常`,
                            top: 114514
                        })
                        continue
                    } else {
                        result.push({
                            id: illust.id,
                            link: res.url,
                            title: illust.title,
                            top: i + 1
                        })
                        Cache.setCache(illust.id, res.url)
                    }
                }
            }

            if (result.find(item => item.id === '0') && (retry || 0) < RETRY_LIMIT) {
                console.log('重复请求中~~')
                result = await download((retry || 0) + 1)
            }
            return result
        }
        
        return download()
    }
})