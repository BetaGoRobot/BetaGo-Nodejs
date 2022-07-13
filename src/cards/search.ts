import { Card } from "kbotify"

export const Failed = (inf: string) => {
    return new Card({
        "type": "card",
        "theme": "warning",
        "size": "lg",
        "modules": [
            {
                "type": "header",
                "text": {
                    "type": "plain-text",
                    "content": "**关键词搜索失败**"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "kmarkdown",
                        "content": "关键词图片貌似搜不到捏，要不换个词试试？"
                    }
                ]
            }
        ]
    })
}

export const Search = async (links: string[], pid: string[]) => new Card({
    type : "card",
    theme : "info",
    size : "lg",
    modules : [
        {
            type: "header",
            text: {
                type: "plain-text",
                content: "插画"
                // "content": `${session.args.length == 0 ? "全站热门插画" : `「${session.args[0]}」的热门插画`}`
            }
        },
        {
            type : "divider"
        },
        {
            type : "image-group",
            elements : (() => {
                const images: any[] = [];
                let cnt = 0;

                for (const val of links) {
                    if (cnt >= 9) break;
                    images.push({
                        type: "image",
                        src: val
                    })
                    cnt++;
                }
                while (images.length < 9) {
                    // 后续会换
                    images.push({
                        type: "image",
                        src: "https://img.kookapp.cn/assets/2022-07/vlOSxPNReJ0dw0dw.jpg"
                    })
                }
                return images;
            })()
        },
    ]
})