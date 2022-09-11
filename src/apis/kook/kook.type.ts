// 请求kook官方API的消息结构

export type Response<T> = {
    code: 0 | 1,
    message: string,
    data: T
}
