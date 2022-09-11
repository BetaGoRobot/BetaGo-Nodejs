// kook官方提供的api集合
import { assetsUpload } from "./assets"
import * as Message from './message'
import * as Channels from './channle'

export namespace KookApi {
    export namespace Media {
        export const upload = assetsUpload
    }

    export namespace Channel {
        export const sendMessage = Message.sendChannleMessage
        export const list = Channels.channleList
    }
}


export namespace KookType {
    export const MessageType = Message.TypeNumber
    export const ChannleType = Channels.ChannleType
}
