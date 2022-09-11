// 获取服务器相关信息的接口
import { kookGot } from './got'
import { Response } from './kook.type'

type List = {
    items: Array<{
        "id": string,
        "name": string,
        "topic": string,
        "master_id": string,
        "icon": string,
        "notify_type": number,
        "region": string,
        "enable_open": true,
        "open_id": string,
        "default_channel_id": string,
        "welcome_channel_id": string,
        "boost_num": number,
        "level": number
    }>,
    meta: {
        "page": number,
        "page_total": number,
        "page_size": number,
        "total": number
    },
    sort: {
        id: number
    }
}

export const guildList = () => {
    return kookGot("guild/list", {
        method: 'post'
    }).json<Response<List>>()
}


