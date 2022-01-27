import { Card, MenuCommand } from 'kbotify'

class WyyMenu extends MenuCommand {
    code = 'wyy';
    trigger = 'wyy';
    help = '.wyy 查看网易云具体的命令'
    intro = '这是网易云的查询菜单'
    useCardMenu = true
}