// 将外链转换为kook内部链接
import { KookLink } from '../../type'
import { Cache } from '../../components/cache/pixiv-illusts-kook'
import { KookApi } from '../../../../apis'
import FormData from 'form-data'
import axios from 'axios'

const TIME_OUT = 10000
const RETRY_LIMIT = 5

// 获取Kook链接
export const getKookLinks = async (pics: any, retry?: number) => {
    let links: Array<KookLink> = []
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
            const res = await uploadImage(illust.image_urls.large.replace("i.pximg.net", "i.pixiv.re"))
            if (res.status === 'error') {
                links.push({
                    id: '0',
                    link: 'https://img.kaiheila.cn/emojis/3757937292559087/qK1gHuxGo40u00t5.png',
                    title: `图片id为[${illust.id}](https://www.pixiv.net/artworks/${illust.id})下载/上传异常`,
                    top: 114514
                })
                continue
            } else {
                links.push({
                    id: illust.id,
                    link: res.url,
                    title: illust.title,
                    top: i + 1
                })
                Cache.setCache(illust.id, res.url)
            }
        }
    }
    // 若有图片下载失败，重新下载，因为有缓存，所以不用担心请求过多的问题
    if (links.find(item => item.id === '0') && (retry || 0) < RETRY_LIMIT) {
        console.log('重复请求中~~')
        links = await getKookLinks(pics, (retry || 0) + 1)
    }
    return links
}

// 将外链转化为kook链接
export const uploadImage = async (url: string) => {
    const stream = await axios({
        url,
        responseType: 'stream',
        timeout: TIME_OUT
    }).catch(err => {
        if (err) {
            console.error('请求流失败',err)
        }
        return err;
    })

    if (stream.status !== 200) {
        return {
            status: 'error',
            url: 'https://img.kaiheila.cn/emojis/3757937292559087/qK1gHuxGo40u00t5.png'
        }
    }

    const formData = new FormData()
    formData.append('file', stream.data, '1.jpg')
    const kookUrl = await KookApi.Media.upload(formData)
        .catch(err => {
            if (err) {
                console.error('上传Formdata至开黑啦服务器时出现异常', err)
                return ""
            }
    })

    if (!kookUrl) {
        return {
            status: 'error',
            url: 'https://img.kaiheila.cn/emojis/3757937292559087/qK1gHuxGo40u00t5.png'
        }
    }

    return {
        status: 'success',
        url: kookUrl
    }    
}