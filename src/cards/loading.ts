import { Card } from 'kbotify'

export namespace Loading {
    // 提示卡片和内容卡片是不同的卡片
    export const AnotherCard = (info: string) => (new Card({
        type: "card",
        theme: "info",
        size: "lg",
        modules: [
            {
                type: "header",
                text: {
                    type: "plain-text",
                    content: info
                }
            },
            {
                type: "divider"
            },
            {
                type: 'image-group',
                elements: [{
                    "type": "image",
                    "src": "https://img.kaiheila.cn/assets/2022-07/4x9hNK7Syn034034.gif"
                }]
            }
        ]
    }))

    // 提示卡片和内容卡片是相同的卡片
    export const RefreshCard = () => {

    }
}