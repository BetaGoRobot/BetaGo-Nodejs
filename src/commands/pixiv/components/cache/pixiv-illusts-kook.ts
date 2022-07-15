import fs from 'fs';
import path from 'path'

let map: any = {}

export namespace Cache {
    export const init = () => {
        map = JSON.parse(fs.readFileSync(path.join(__dirname, './pixiv-kook.json'), 'utf-8'))
    }

    export const getCache = (id: string) => {
        return map[id] || ''
    }

    export const setCache = (id: string, link: string) => {
        map[id] = link
    }

    export const save = () => {
        fs.writeFile(path.join(__dirname, './pixiv-kook.json'), JSON.stringify(map), (err) => {
            if (err) {
                console.error('Cache存储失败', err)
            } else {
                console.log('Cache存储成功')
            }
        })
    }
}