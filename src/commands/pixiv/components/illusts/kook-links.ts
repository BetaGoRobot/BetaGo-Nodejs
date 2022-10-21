// 将外链转换为kook内部链接
import { spawn, Thread, Worker } from 'threads'
import { KookApi } from '../../../../apis/kook'
import { PixivIllustLink, KookLink } from '../../type'
import FormData from 'form-data'
import axios from 'axios'

const WORKERS_NUMBER = 4

const TIME_OUT = 10000

// 获取Kook链接
export const getKookLinks = async (pics: Array<PixivIllustLink>, retry?: number) => {
    const start = new Date().getTime()
    const workers = await Promise.all(
        new Array(WORKERS_NUMBER).fill('').map(() => (
            spawn(new Worker("./worker.ts"))
        ))
    )

    // 任务分发
    const workers_map = () => {
        const length = pics.length;
        const split_number = Math.floor(length / WORKERS_NUMBER)
        return workers.map((item, index) =>
            (item.getLinks(pics.slice(index * split_number, index + 1 === WORKERS_NUMBER ? length : (index + 1) * split_number)))
        )
    }
    // 结果合并
    const workers_reduce = (result: Array<Array<KookLink>>) => {
        const reduce = [...result.reduce((pre, next) => [...pre, ...next], [])].map((item, index) => {
            item.top = index + 1
            return item
        })
        return reduce
    }

    const result = (await Promise.all(workers_map())) as Array<Array<KookLink>>;
    console.log('经过了', new Date().getTime() - start, 'ms')
    // 数组扁平化
    return workers_reduce(result)
}

// 将外链转化为kook链接
export const uploadImage = async (url: string) => {
    const stream = await axios({
        url,
        headers: {
            "Referer": "https://www.pixiv.net/"
        },
        // proxy: {
        //     host: '127.0.0.1',
        //     port: 7890
        // },
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