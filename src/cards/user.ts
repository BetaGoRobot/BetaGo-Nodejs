// Pixiv-User 是用户也是画师作者
import { Card } from 'kbotify'
import { PixivUser } from '../commands/pixiv/pixiv.user.app/type'
import { getKookLinks, uploadImage } from '../commands/pixiv/components/illusts/kook-links'

const UP_LIMIT = 6

export namespace User {
    export const Intro = async (user: PixivUser) => {
        const userInfo = {
            ...user,
            kookLinks: await getKookLinks(user.pixivIllusts.slice(0,UP_LIMIT)),
            kookAvatar: (await uploadImage(user.avatar.replace("i.pximg.net", "i.pixiv.re"))).url
        }

        const comment = user.comment ? (user.comment.length > 50 ? user.comment.slice(0,50) + "..."  : user.comment) : ""
        const card = new Card({
            type: 'card',
            theme: 'info',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: `画师(${user.name})[https://www.pixiv.net/users/${user.id}]介绍`
                    }
                },
                {
                    type: 'divider'
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "kmarkdown",
                            content: `画师介绍: ${comment}`
                        }
                    ]
                },
                {
                    type: 'divider'
                },
                {
                    type: 'image-group',
                    elements: userInfo.kookLinks.map(item => ({
                        type: "image",
                        src: item.link
                    }))
                }
            ]
        })

        return card
    }    
}