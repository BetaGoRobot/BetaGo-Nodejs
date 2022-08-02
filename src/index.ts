import { bot } from './init/client';
import { echoMenu } from './commands/echo/echo.menu';
import { pixivMenu } from './commands/pixiv/pixiv.menu'
import { Cache } from './commands/pixiv/components/cache/pixiv-illusts-kook'
import { push } from './init/push'
import { Mode } from './commands/pixiv/type';


bot.messageSource.on('message', (e) => {

});

// 缓存
Cache.init()
setInterval(() => {
    Cache.save()
}, 1000 * 60 * 5)

// 日推挂载
push(Mode.DAY)

bot.addCommands(echoMenu);
bot.addCommands(pixivMenu);





bot.connect();


