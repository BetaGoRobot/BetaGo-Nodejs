import { bot } from './init/client';
import { echoMenu } from './commands/echo/echo.menu';
import { pixivMenu } from './commands/pixiv/pixiv.menu'
import { Cache } from './commands/pixiv/components/cache/pixiv-illusts-kook'
import { push } from './init/push'
import { Mode } from './commands/pixiv/type';


bot.messageSource.on('message', (e) => {
    bot.logger.debug(`received:`, e);
});

bot.logger.info(`pixiv-bot init`)

// 缓存初始化
Cache.init()
setInterval(() => {
    console.log('缓存保存')
    Cache.save()
}, 1000 * 60 * 5)

bot.addCommands(echoMenu)
bot.addCommands(pixivMenu)

bot.connect()


// 日推挂载
push(Mode.DAY)

