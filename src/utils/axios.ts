import axios from 'axios'
const baseURL: string = import.meta.env.VITE_API_BASE_URL
const request = axios.create({
  baseURL: baseURL,
  timeout: 30000, // request timeout
})

// 发起请求之前的拦截器
request.interceptors.request.use(
  (config: any) => {

    return config
  },
  (error) => Promise.reject(error)
)
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    if (response.status !== 200) {
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  (error) => {
    return Promise.reject(error)
  }
)
export default request
