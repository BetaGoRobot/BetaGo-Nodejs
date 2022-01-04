import { AppCommand, AppFunc, BaseSession, KBotify, TextMessage, Card } from 'kbotify';
import axios from 'axios'

class EchoKmd extends AppCommand {
    code = 'kmd'; // 只是用作标记
    trigger = 'kmd'; // 用于触发的文字
    help = '`.echo kmd 内容`'; // 帮助文字
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppFunc<BaseSession> = async (session) => {
        if (!session.args.length) {
            return session.reply(this.help);
        }
        const response = await axios({
            method: 'get',
            url: 'http://127.0.0.1:3000/illusts'
        })

        const card = new Card().addImage(response.data.imageUrl)

        return session.sendCard(card)
        // session.setTextTrigger('',6e4,(msg) => session.send(msg.content))
        // return session.reply('超市你')
    };
}

export const echoKmd = new EchoKmd();
