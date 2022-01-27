import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify'
import axios from 'axios'
import { search_default } from 'NeteaseCloudMusicApi'


class WyySearch extends AppCommand {
    code = 'search';
    trigger = 'search';
    func: AppFunc<BaseSession> = async (session) => {
        
    }
}