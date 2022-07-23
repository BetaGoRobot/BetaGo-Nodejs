// 频道消息相关接口
import { kookGot } from './got'
import { Response } from './kook.type'

type Message = {
    msg_id: string,
    msg_timestamp: number,
    nonce: string
}

export enum TypeNumber {
    'plain' = 1,
    'kmarkdown' = 9,
    'card' = 10
}

export const sendChannleMessage = (message: string, channle: string, type: TypeNumber) => {
    return kookGot("message/create", {
        method: 'post',
        // 官方文档：没有特殊说明，一律传递 application/json
        json: {
            type,
            target_id: channle,
            content: message
        }
    }).json<Response<Message>>()
}