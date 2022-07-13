import { Card } from "kbotify"

export namespace AbNormal {
    export const error = (inf: string) => {
        return new Card({
            type: "card",
            theme: "danger",
            size: "lg",
            modules: [
                {
                    type: "section",
                    text: {
                        type: "kmarkdown",
                        content: "Internal Error"
                    }
                },
                {
                    type: "divider"
                },
                {
                    type: "context",
                    elements: [
                        {
                            type: "plain-text",
                            content: "请联系开发者"
                        }
                    ]
                },
                {
                    type: "section",
                    text: {
                        type: "kmarkdown",
                        content: `\`\`\`\n${inf}\n\`\`\``
                    }
                }
            ]
        })
    }

    export const args = (instr: string, inf: string) => (new Card({
        type: "card",
        theme: "warning",
        size: "lg",
        modules: [
            {
                type: "header",
                text: {
                    type: "plain-text",
                    content : `${instr} 命令出错`
                }
            },
            {
                type: "section",
                text: {
                    type: "kmarkdown",
                    content: `${inf}`
                }
            }
        ]
    }))
}
