import { Card, MenuCommand } from 'kbotify'
import { pixivDay } from './trigger/pixiv.top.day.app'
import { pixivMonth } from './trigger/pixiv.top.month.app'
import { pixivWeek } from './trigger/pixiv.top.week.app'

class PixivMenu extends MenuCommand {
    code = 'pixiv';
    trigger = 'pixiv';
    help = '.pixiv 查看具体的命令'
    intro = '这是pixiv的查询菜单'
    menu = new Card().addTitle('查看命令').addText('top命令查询每日排行捏').toString();
    useCardMenu = true;
}

export const pixivMenu = new PixivMenu(pixivDay, pixivWeek, pixivMonth)