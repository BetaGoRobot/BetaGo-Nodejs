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

export type SearchLinks = Array<{
    title: string,
    link: string,
    id: string
}>