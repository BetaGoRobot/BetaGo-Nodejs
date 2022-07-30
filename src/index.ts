import moment from 'moment'
import { Mode } from './commands/pixiv/type'
import { bot } from './init/client';
import { echoMenu } from './commands/echo/echo.menu';
import { pixivMenu } from './commands/pixiv/pixiv.menu'
import { Cache } from './commands/pixiv/components/cache/pixiv-illusts-kook'
import { pushTop } from './commands/pixiv/push/top'

const setting = {
    time: '08:00:00',
    start: true
}


const interval = () => {
    console.log('日推开始运行')
    let triggerTime = Number(moment(moment().format('YYYY-MM-DD') + " " + setting.time).format('x'))
    let now = Number(moment().format('x'))
    if (setting.start) {
        pushTop(Mode.DAY)
        triggerTime += 1000 * 60 * 60 * 24
    }
    const gap = triggerTime - now
    setTimeout(() => {
        setInterval(() => {
            console.log('开始推送日常')
            pushTop(Mode.DAY)
        }, 1000 * 60 * 60 * 24)
    }, gap)
}


bot.messageSource.on('message', (e) => {

});

Cache.init()


interval()

setInterval(() => {
    Cache.save()
}, 1000 * 60 * 5)

bot.addCommands(echoMenu);
bot.addCommands(pixivMenu);





bot.connect();


