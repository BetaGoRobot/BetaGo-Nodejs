import auth from '../configs/auth'
import axios from 'axios'
import FormData from 'form-data'

export const assetsUpload = async (formdata: FormData) => {
    return axios({
        method: 'post',
        url: 'https://www.kookapp.cn/api/v3/asset/create',
        data: formdata,
        headers: {
            'Authorization': `Bot ${auth.khltoken}`,
            ...formdata.getHeaders()
        }
    }).then(res => {
        return res.data.data.url
    })
}