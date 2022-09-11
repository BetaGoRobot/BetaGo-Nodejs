import { AppCommand, AppFunc, BaseSession } from 'kbotify'
import axios from 'axios'
import { AbNormal } from '../../../cards/error'
import { PixivUser } from './type'
import { User, Loading } from '../../../cards'

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
            ]).then(async (res) => {
                const userInfo = res[0].data.data
                const userIllusts = res[1].data.data
                const user: PixivUser = {
                    name: userInfo.user.name,
                    id: userId,
                    avatar: userInfo.user.profile_image_urls.medium,
                    comment: userInfo.user.comment,
                    twitter: userInfo.profile.twitter_url,
                    // @ts-ignore
                    pixivIllusts: userIllusts.illusts.map(item => {
                        return {
                            title: item.title,
                            id: item.id,
                            image_urls: {
                                large: item.image_urls.large
                            }
                        }
                    })
                }

                session.replyCard(Loading.AnotherCard('用户/画师信息正在寻找中，请稍等'), {})
                session.replyCard((await User.Intro(user)), {})
            })
            .catch(err => {
                if (err) {
                    console.error(err)
                }
                session.replyCard(AbNormal.error("搜索画师信息出现错误，请联系开发者"), {})
            })
        }
    }
}

export const pixivUserIllusts = new PixivUserIllusts()