// 获取频道相关数据
import { kookGot } from './got'
import { Response } from './kook.type'

type ChannleList = {
    items: Array<{
        "id": string,
        "master_id": string,
        "parent_id": string,
        "name": string,
        "type": number,
        "level": number,
        "limit_amount": number,
        "is_category": boolean
    }>,
    meta: {
      "page": number,
      "page_total": number,
      "page_size": number,
      "total": number
    },
    sort: []
}


export enum ChannleType {
    '文字' = 1,
    '语音' = 2
}

export const channleList = (guild: string, type: ChannleType) => {
    return kookGot("channel/list", {
        method: 'post',
        json: {
            guild_id: guild,
            type
        }
    }).json<Response<ChannleList>>()
}