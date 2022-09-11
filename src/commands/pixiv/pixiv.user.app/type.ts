import { PixivIllustLink } from '../type'

export type PixivUser = {
    name: string, // 用户（画师）名称
    id: string,
    avatar: string, // 头像链接
    pixivIllusts: Array<PixivIllustLink>,
    comment ?: string,  // 用户（画师）介绍
    twitter ?: string
}