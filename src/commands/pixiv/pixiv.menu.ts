import { Card, MenuCommand } from 'kbotify'
import { pixivSearch } from './pixiv.search.app'
import { pixivDay, pixivMonth, pixivWeek} from './pixiv.top.app'

class PixivMenu extends MenuCommand {
    code = 'pixiv';
    trigger = 'pixiv';
    intro = '这是pixiv的查询菜单'
    menu = new Card({
        type: "card",
        theme: "warning",
        size: "lg",
        modules: [
            {
                type: "header",
                text: {
                    type: "plain-text",
                    content: "Pixiv 命令"
                }
            },
            {
                type: "context",
                elements: [
                    {
                        type: "kmarkdown",
                        content: "Test"
                    }
                ]
            },
            {
                type: "divider"
            },
            {
                type: "section",
                text: {
                    type: "kmarkdown",
                    content: "`.pixiv search [关键词]` 获得关键词相关热门插画九张"
                }
            },
            {
                type: "divider"
            },
            {
                type: "section",
                text: {
                    type: "kmarkdown",
                    content: "`.pixiv [day/week/month] [number]` 获得**每日/每周/每月**的热门插画, `number`表示展示top插画数量"
                }
            },
            {
                type: "divider"
            },
            {
                type: "section",
                text: {
                    type: "kmarkdown",
                    content: "`.pixiv user [id]` 获得**指定用户**的插画作品"
                }
            }
        ]
    }).toString()
    useCardMenu = true;
}

export const pixivMenu = new PixivMenu(pixivSearch, pixivDay, pixivWeek, pixivMonth)