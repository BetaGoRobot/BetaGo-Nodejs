// 请参考echo文件夹内的用法
import { AppCommand, AppFunc, BaseSession } from 'kbotify'
import { PixivMenu } from '../components/pixiv.top.core'
import { Mode } from '../type'

class PixivTop extends AppCommand {
    code = 'day';
    trigger = 'day';
    help = '.pixiv day 查看当日top10图片'
    intro = 'pixiv top榜';
    func: AppFunc<BaseSession> = PixivMenu(Mode.DAY)
}

export const pixivDay = new PixivTop();