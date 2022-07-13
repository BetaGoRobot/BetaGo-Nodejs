// 这部分图像识别代码出自大佬 potatopotat0
// url: https://github.com/potatopotat0/kook-pixiv-chan/blob/master/src/commands/pixiv/common/nsfwjs/index.ts
const nsfw = require('nsfwjs')
const tf = require('@tensorflow/tfjs-node');

let model: any 

export const NSFW = async (buffer: Buffer) => {
    model = await nsfw.load();
    
    const detect = async (buffer: Buffer) => {
        const image = await tf.node.decodeImage(buffer, 3);
        const predictions = await model.classify(image);
        image.dispose();
        return predictions;
    }
    let blurAmount = 0;
    let NSFW = false;
        await detect(buffer).then((res) => {
            for (let val of res) {
                switch (val.className) {
                    case "Hentai":
                    case "Porn":
                        // 根据识别结果，增加不同的模糊度
                        if (val.probability > 0.9) blurAmount += 42;
                        else if (val.probability > 0.7) blurAmount += 35;
                        else if (val.probability > 0.5) blurAmount += 21;
                        else if (val.probability > 0.3) blurAmount += 7;
                        if (val.probability > 0.3) NSFW = true;
                        break;
                    case "Sexy":
                        if (val.probability > 0.8) blurAmount += 21;
                        else if (val.probability > 0.6) blurAmount += 7;
                        if (val.probability > 0.6) NSFW = true;
                        break;
                    case "Drawing":
                    case "Natural":
                    default:
                        break;
                }
            }
        }).catch((e) => {
            console.log(e);
        });
        return {
            blur: blurAmount,
            reason: {
                terrorism: false,
                ad: false,
                live: false,
                porn: blurAmount > 0 ? true : false
            }
        };

}