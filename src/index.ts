import { bot } from './init/client';
import { echoMenu } from './commands/echo/echo.menu';
import { pixivMenu } from './commands/pixiv/pixiv.menu'
import { Cache } from './commands/pixiv/components/cache/pixiv-illusts-kook'


bot.messageSource.on('message', (e) => {
    
});

Cache.init()


setInterval(() => {
    Cache.save()
}, 1000 * 30)


bot.addCommands(echoMenu);
bot.addCommands(pixivMenu);


bot.connect();


