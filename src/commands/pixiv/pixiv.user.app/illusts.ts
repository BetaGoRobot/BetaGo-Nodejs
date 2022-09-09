import { AppCommand, AppFunc, BaseSession } from 'kbotify'
import axios from 'axios'
import { AbNormal } from '../../../cards/error'
import { PixivUser } from './type'



// TODO: 后期增加漫画选项
class PixivUserIllusts extends AppCommand {
    code = "user"
    trigger = "user"
    intro = "user illusts"
    func: AppFunc<BaseSession> = async (session) => {
        if (!session.args.length) {
            session.sendCard(AbNormal.args('.pixiv user', '请输入用户的id: `.pixiv user [user_id]`'))
        } else {
            const userId = session.args[0]
            await Promise.all([
                axios.get(`http://127.0.0.1:8000/user/detail?id=${userId}`),
                axios.get(`http://127.0.0.1:8000/user/illusts?id=${userId}`)
            ]).then(res => {
                const userInfo = res[0].data.data
                const userIllusts = res[1].data.data
                const user: PixivUser = {
                    name: userInfo.user.name,
                    id: userId,
                    avatar: userInfo.user.profile_image_urls.medium,
                    comment: userInfo.user.comment,
                    twitter: userInfo.profile.twitter_url,
                    pixivIllusts: []
                }
            })
        }
    }
}