// 请参考echo文件夹内的用法
import { AppCommand, AppFunc, BaseSession } from 'kbotify'
import { PixivMenu } from './components/pixiv.top.core'
import { Mode } from '../type'

class PixivTop extends AppCommand {
    code = 'month';
    trigger = 'month';
    help = '.pixiv month 查看上个月top图片'
    intro = 'pixiv top榜';
    func: AppFunc<BaseSession> = PixivMenu(Mode.MONTH)
}

export const pixivMonth = new PixivTop();