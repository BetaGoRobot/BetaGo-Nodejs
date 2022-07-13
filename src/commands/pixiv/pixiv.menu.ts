import { Card, MenuCommand } from 'kbotify'
import { pixivSearch } from './pixiv.search.app'
import { pixivDay } from './trigger/pixiv.top.day.app'
import { pixivMonth } from './trigger/pixiv.top.month.app'
import { pixivWeek } from './trigger/pixiv.top.week.app'

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
                "type": "header",
                "text": {
                    "type": "plain-text",
                    "content": "Pixiv 命令"
                }
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "kmarkdown",
                        "content": "Test [Bot Market](https://www.botmarket.cn/bots?id=8) 留下一个五星好评！\n[问题反馈&建议](https://kook.top/iOOsLu)"
                    }
                ]
            },
            {
                "type": "divider"
            },
            {
                "type": "section",
                "text": {
                    "type": "kmarkdown",
                    "content": "`.pixiv top [标签] ?` 获取本周 [标签] 标签的人气前九的图片，若 [标签] 缺省则为全站排名"
                }
            },
        ]
    }).toString()
    useCardMenu = true;
}

export const pixivMenu = new PixivMenu(pixivSearch, pixivDay, pixivWeek, pixivMonth)