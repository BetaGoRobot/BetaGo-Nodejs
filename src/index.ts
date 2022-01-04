import { bot } from 'init/client';
import { echoMenu } from './commands/echo/echo.menu';
import { pixivMenu } from './commands/pixiv/pixiv.menu'


bot.messageSource.on('message', (e) => {
    // console.log(e)
    
});


bot.addCommands(echoMenu);
bot.addCommands(pixivMenu);


bot.connect();


