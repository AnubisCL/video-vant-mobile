import type { AxiosError, InternalAxiosRequestConfig, AxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import {localStorage} from "@/utils/local-storage";
// 这里是用于设定请求后端时，所用的 Token KEY
// 可以根据自己的需要修改，常见的如 Access-Token，Authorization
// 需要注意的是，请尽量保证使用中横线`-` 来作为分隔符，
// 避免被 nginx 等负载均衡器丢弃了自定义的请求头

// 创建 axios 实例
const axiosInstance = axios.create({
  // API 请求的默认前缀
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
})

export type RequestError = AxiosError<{
  message?: string
  result?: any
  errorMessage?: string
}>

// 异常拦截处理器
function errorHandler(error: RequestError): Promise<any> {
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 403 无权限
    if (status === 403) {
      showNotify({
        type: 'danger',
        message: (data && data.message) || statusText,
      })
    }
    // 401 未登录/未授权
    if (status === 401 && data.result && data.result.isLogin) {
      showNotify({
        type: 'danger',
        message: '未授权登录',
      })
      location.replace('/login')
    }
  }
  return Promise.reject(error)
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  const savedToken = localStorage.get(STORAGE_TOKEN_KEY)
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (savedToken)
    config.headers[STORAGE_TOKEN_KEY] = savedToken

  return config
}

// Add a request interceptor
axiosInstance.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器
function responseHandler(response: { data: any }) {
  return response.data
}

// Add a response interceptor
axiosInstance.interceptors.response.use(responseHandler, errorHandler)

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message: string
}

export async function request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  /*
   *  then和catch里面返回的数据必须加as const，否则调用方无法推断出类型
   * */
  return axiosInstance.request<T>(config)
    .then(({ code, msg, data }) => {
      if (code == 1 && msg === '登录已失效') {
        localStorage.set(STORAGE_TOKEN_KEY, '')
        showNotify({
          type: 'danger',
          message: msg
        })
      }
      return { success: code == 0, data: data, message: msg } as const
    })
    .catch((err) => {
      return { success: false, data: err, message: err.message } as const
    })
}