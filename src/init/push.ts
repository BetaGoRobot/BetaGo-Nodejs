// 推送相关
import { pushTop } from './components/push/top'
import setting from '../configs/auth'
import { Mode } from '../commands/pixiv/type'
import moment from 'moment'

const ONE_DAY_GAP = 1000 * 60 * 60 * 24

export const push = async (mode: Mode) => {
    let triggerTime = Number(moment(moment().format('YYYY-MM-DD') + " " + setting.push_setting.time).format('x'))
    let now = Number(moment().format('x'))
    if (setting.push_setting.start) {
        pushTop(mode)
    }

    triggerTime += ONE_DAY_GAP
    const gap = triggerTime - now
    setTimeout(() => {
        pushTop(mode)
        setInterval(() => {
            console.log('开始推送日常')
            pushTop(Mode.DAY)
        }, ONE_DAY_GAP)
    }, gap)
}