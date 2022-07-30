import { kookGot } from "./got"
import { Response } from './kook.type'
import FormData from 'form-data'

type Assets = {
    url: string
}

export const assetsUpload = async (formdata: FormData) => {
    console.log(formdata.getHeaders())
    return kookGot("asset/create", {
        method: 'post',
        body: formdata,
        headers: {
            ...formdata.getHeaders()
        }
    }).json<Response<Assets>>().then(res => {
        console.log(res)
        if (res.code === 0) {
            return res.data.url
        } else {
            return ""
        }
    })
}