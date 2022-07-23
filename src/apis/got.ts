// got api setting
import got from 'got'
import auth from '../configs/auth'

export const kookGot = got.extend({
    prefixUrl: "https://www.kookapp.cn/api/v3", headers: {
    'Authorization': `Bot ${auth.khltoken}`,
}})