// 请参考echo文件夹内的用法
import { AppCommand, AppFunc, BaseSession } from 'kbotify'
import { PixivMenu } from './components/pixiv.top.core'
import { Mode } from '../type'

class PixivTop extends AppCommand {
    code = 'week';
    trigger = 'week';
    help = '.pixiv week 查看上周top图片'
    intro = 'pixiv top榜';
    func: AppFunc<BaseSession> = PixivMenu(Mode.WEEK)
}

export const pixivWeek = new PixivTop();