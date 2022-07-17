import fs from 'fs';
import path from 'path'

let cache: any = {}

export namespace Cache {
    export const init = () => {
        if (fs.existsSync(path.join(__dirname, './pixiv-kook.json'))) {
            cache = JSON.parse(fs.readFileSync(path.join(__dirname, './pixiv-kook.json'), 'utf-8'))
        } else {
            fs.writeFileSync(path.join(__dirname, './pixiv-kook.json'), JSON.stringify({}))
            cache = {}
        }
    }

    export const getCache = (id: string) => {
        return cache[id] || ''
    }

    export const setCache = (id: string, link: string) => {
        cache[id] = link
    }

    export const save = () => {
        fs.writeFile(path.join(__dirname, './pixiv-kook.json'), JSON.stringify(cache), (err) => {
            if (err) {
                console.error('Cache存储失败', err)
            } else {
                console.log('Cache存储成功')
            }
        })
    }
}