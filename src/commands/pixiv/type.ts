export enum Mode {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month'
}

export enum DateSpace {
    day = 1,
    week = 7,
    month = 30
}

export enum Desc {
    day = '日榜',
    week = '周榜',
    month = '月榜'
}

export type PixivIllustLink = {
    id: string,
    title: string,
    image_urls: {
        medium: string,
        large: string
    }
}

type SearchLink = {
    title: string,
    link: string,
    id: string,
}

export type SearchLinks = Array<SearchLink>

export type SearchFinalLinks = Array<SearchLink & { origin: string }>

export type KookLink = {top : number} & SearchLink

export type KookLinks = Array<KookLink>




