import { request } from '@/utils/request'

export async function queryProse(): Promise<any> {
  return request({ url: '/prose', method: 'get' })
}
