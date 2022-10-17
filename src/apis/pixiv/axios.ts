import axios from 'axios'

// if (process.env.NODE_ENV === 'production') {
//     axios.defaults.baseURL = "http://127.0.0.1:8000"
// } else if (process.env.NODE_ENV === 'development') {
//     axios.defaults.baseURL = "https://api.pixiv.runtus.top"
// }
axios.defaults.baseURL = "http://8.210.131.57:8000"

export const pAxios = axios