import axios from 'axios'

if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = "http://localhost:8000"
} else if (process.env.NODE_ENV === 'production') {
    axios.defaults.baseURL = "https://api.pixiv.runtus.top"
}

export const pAxios = axios