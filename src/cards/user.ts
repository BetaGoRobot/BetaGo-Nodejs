// Pixiv-User 是用户也是画师作者
import { Card } from 'kbotify';
import { PixivUser } from '../commands/pixiv/pixiv.user.app/type';
import {
    getKookLinks,
    uploadImage,
} from '../commands/pixiv/components/illusts/kook-links';

const UP_LIMIT = 6;

export namespace User {
    export const Intro = async (user: PixivUser) => {
        const userInfo = {
            ...user,
            kookLinks: await getKookLinks(user.pixivIllusts.slice(0, UP_LIMIT)),
            kookAvatar: (
                await uploadImage(
                    // i.pixiv.re 出现些问题，暂时先用原链接替代
                    // user.avatar.replace('i.pximg.net', 'i.pixiv.re')
                    user.avatar
                )
            ).url,
        };

        const comment = user.comment
            ? user.comment.length > 50
                ? user.comment.slice(0, 50) + '...'
                : user.comment
            : '';
        const format = comment.split('\r\n').reduce((pre, cur) => {
            if (cur !== '') {
                return `${pre}**${cur}**\n`;
            } else {
                return pre;
            }
        }, '');

        console.log('format',format)

        const card = new Card({
            type: 'card',
            theme: 'info',
            size: 'lg',
            modules: [
                {
                    type: 'header',
                    text: {
                        type: 'plain-text',
                        content: `画师-${user.name}`,
                    },
                },
                {
                    type: 'context',
                    elements: [
                        {
                            type: 'image',
                            src: userInfo.kookAvatar,
                            size: 'lg',
                        },
                        {
                            type: 'kmarkdown',
                            content: `**[${userInfo.name}](https://www.pixiv.net/users/${userInfo.id})**`,
                        },
                    ],
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    mode: 'right',
                    text: {
                        type: 'kmarkdown',
                        content: `画师介绍:  ${format}`,
                    },
                    emoji: true,
                },
                {
                    type: 'divider',
                },
                {
                    type: 'section',
                    mode: 'right',
                    text: {
                        type: 'kmarkdown',
                        content: `***画师作品***🌟🌟`
                    }
                },
                {
                    type: 'image-group',
                    elements: userInfo.kookLinks.map((item) => ({
                        type: 'image',
                        src: item.link,
                    })),
                },
            ],
        });

        return card;
    }
}
