import { Card } from 'kbotify'
import { TopLinks, Mode, Desc } from '../commands/pixiv/type'

export namespace Top {
    export const pics = (links: TopLinks, date: string, mode: Mode) => {
        const card = new Card();
        card.addTitle(`Pixiv 📅${date} ${Desc[mode]}Top排行榜`);
        links.forEach((item, index) => {
            card.addText(`Top${index + 1} >> title: ${item.title}, pid: [${item.id}](https://www.pixiv.net/artworks/${item.id})`)
            card.addImage(item.link)
        })
        console.log(card)

        return card;
    }

    export const loading = (date: string, mode: Mode) => (new Card({
        type: "card",
        theme: "info",
        size: "lg",
        modules: [
            {
                type: "header",
                text: {
                    type: "plain-text",
                    content: "~~~~图片稍后就来~~~~"
                }
            },
            {
                type: "divider"
            },
            {
                type: 'image-group',
                elements: [{
                    "type": "image",
                    "src": "https://img.kaiheila.cn/assets/2022-07/4x9hNK7Syn034034.gif"
                }]
            }
        ]
    }))

    export const failed = (inf: string) => new Card({
        type: "card",
        theme: "warning",
        size: "lg",
        modules: [
            {
                type: "header",
                text: {
                    type: "plain-text",
                    content: "空空如也捏~"
                }
            },
            {
                type: "divider"
            },
            {
                type: "context",
                elements: [
                    {
                        type: "kmarkdown",
                        content: `${inf}`
                    }
                ]
            }
        ]
    })
}