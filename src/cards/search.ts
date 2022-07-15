import { Card } from "kbotify"
import { SearchFinalLinks } from '../commands/pixiv/type'
import { BaseSession } from 'kbotify'

export namespace Search {
    export const Failed = (inf: string) => {
        return new Card({
            type: "card",
            theme: "warning",
            size: "lg",
            modules: [
                {
                    type: "header",
                    text: {
                        type: "plain-text",
                        content: "搜索出现了一点点问题"
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

    export const pics = async (links: SearchFinalLinks, session: BaseSession, searchLength: number) => {
        const cards = new Card();
        const upper = searchLength >= 9 ? 9 : searchLength;
        cards.addTitle(`${session.args[0]} 相关的热门插图`)
        links.forEach(item => {
            cards.addText(`title: ${item.title}, pid: [${item.id}](https://www.pixiv.net/artworks/${item.id})`)
            cards.addImage(item.link)
        })
        for (let i = links.length; i < upper; i++) {
            cards.addText(`~~~~~加载中~~~~~`)
            cards.addImage('https://img.kaiheila.cn/assets/2022-07/mxYbindKDX0u90xc.png')
        }

        return cards;
    }

}



