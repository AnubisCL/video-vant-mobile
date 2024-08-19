import type { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'
import { showNotify } from 'vant'
import { STORAGE_TOKEN_KEY } from '@/stores/mutation-type'
import { localStorage } from '@/utils/local-storage'
import router from '@/router'
import { translateMessage } from '@/utils/i18n'

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

// 异常拦截处理器 不管异常还是正常请求统一返回 AxiosResponse
function errorHandler(error: RequestError): AxiosResponse {
  if (error.response) {
    const { data = {}, status, statusText } = error.response
    // 500 服务端报错提示
    if (status === 500) {
      showNotify({
        type: 'danger',
        message: translateMessage('error.500'),
      })
    }
    if (status === 400) {
      showNotify({
        type: 'danger',
        message: translateMessage('error.400'),
      })
    }
    // fixme 其他报错提示处理(重试，幂等，限流，降级，熔断)
    showNotify({
      type: 'danger',
      message: (data && data.message) || statusText,
    })
  }
  return {
    data: error.response.data,
    status: error.response.status,
    statusText: error.message,
  } as AxiosResponse
}

// 请求拦截器
function requestHandler(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> {
  const savedToken = localStorage.get(STORAGE_TOKEN_KEY)
  // 让每个请求携带自定义 token, 请根据实际情况修改
  if (savedToken)
    config.headers[STORAGE_TOKEN_KEY] = savedToken
  config.headers['Access-Control-Allow-Origin'] = ' *'
  return config
}

// Add a request interceptor
axiosInstance.interceptors.request.use(requestHandler, errorHandler)

// 响应拦截器 这边不需要考虑服务端直接报错，在errorHandler处理报错
function responseHandler(response: { data: any }) {
  return {
    data: response.data.data,
    status: response.data.code,
    statusText: response.data.msg,
  } as AxiosResponse
}

// Add a response interceptor
axiosInstance.interceptors.response.use(responseHandler, errorHandler)

export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message: string
}

export async function request<T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
  // then和catch里面返回的数据必须加as const，否则调用方无法推断出类型
  return axiosInstance.request<T>(config)
    .then(({ data, status, statusText }) => {
      // 服务端业务报错处理
      if (status === 1 && statusText === '登录已失效') {
        localStorage.set(STORAGE_TOKEN_KEY, '')
        showNotify({
          type: 'danger',
          message: translateMessage('error.403'),
        })
        // 登录失效直接跳转到登录
        router.replace('/login')
      }
      return { success: status === 0, data, message: statusText } as const
    }).catch(({ data, statusText }) => {
      // 经过 errorHandler 后续返回给具体请求
      return { success: false, data, message: statusText } as const
    })
}
