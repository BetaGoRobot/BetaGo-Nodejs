import { Card } from "kbotify"

export const error = (inf: string) => {
    return new Card({
        "type": "card",
        "theme": "danger",
        "size": "lg",
        "modules": [
            {
                "type": "section",
                "text": {
                    "type": "kmarkdown",
                    "content": "**内部错误 | Internal Error**"
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "context",
                "elements": [
                    {
                        "type": "plain-text",
                        "content": "貌似出现了一些错误"
                    }
                ]
            },
            {
                "type": "section",
                "text": {
                    "type": "kmarkdown",
                    "content": `\`\`\`\n${inf}\n\`\`\``
                }
            }
        ]
    })
}