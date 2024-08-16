import { request } from '@/utils/request'
import { sm4Crypto } from '@/utils/sm4Util'

export function uploadAvatar(params?: any, data?: any) {
  // 注意这里的内容类型
  return request({
    url: '/user/upload-avatar',
    method: 'post',
    params,
    data,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export function getAvatar(params?: any, data?: any) {
  return request({ url: '/user/get-avatar', method: 'get', params, data })
}

export function updateUserInfo(params?: any, data?: any) {
  const sm4Res: string = sm4Crypto.encrypt(JSON.stringify(data))
  const _data: any = { encryptData: sm4Res }
  return request({ url: '/user/updateUserInfo', method: 'post', params, data: _data })
}
