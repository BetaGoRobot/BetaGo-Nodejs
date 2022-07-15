// 该文件用于测试该ts是否可靠
import FormData, {Stream} from 'form-data'
import axios from 'axios'
import sharp from 'sharp'
import { NSFW } from "./tsflow" 

async function stream2buffer(stream: Stream): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        const _buf = Array<any>();
        stream.on("data", chunk => _buf.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(_buf)));
        stream.on("error", err => reject(`error converting stream - ${err}`));
    });
}

async function main() {
    const formdata = new FormData()
                const stream = await axios({
                    url: "https://img.kookapp.cn/assets/2022-07/15/Hg3Pt53yEY0e80lc.jpg",
                    responseType: 'stream'
                })

                let buffer = await sharp(await stream2buffer(stream.data)).resize(512).jpeg().toBuffer()
    const result = await NSFW(buffer)
    console.log(result)
}

main()