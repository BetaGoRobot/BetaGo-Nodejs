// 请参考echo文件夹内的用法
import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify'
import axios from 'axios'

class PixivTest extends AppCommand {
    code = 'Test';
    trigger = 'test';
    func: AppFunc<BaseSession> = async (session) => {
        const card = new Card()
        card.addText('http://m8.music.126.net/20220107223807/b5336dde4fd807005c447a044e22dbc8/ymusic/0509/025d/0353/2ceb24b5b9579fe5aa2149c1cb048e55.mp3')
        return session.sendCard(card)
    }
}

export const pixivTest = new PixivTest();