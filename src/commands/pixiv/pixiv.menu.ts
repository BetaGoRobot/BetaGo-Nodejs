import { Card, MenuCommand } from 'kbotify'
import { pixivTop } from './pixiv.top.app'
import { pixivTest } from './pixiv.test.app'

class PixivMenu extends MenuCommand {
    code = 'pixiv';
    trigger = 'pixiv';
    help = '.pixiv 查看具体的命令'
    intro = '这是pixiv的查询菜单'
    menu = new Card().addTitle('查看命令').addText('top命令查询每日排行捏').toString();
    useCardMenu = true;
}

export const pixivMenu = new PixivMenu(pixivTop, pixivTest)