import smCrypto from 'sm-crypto'

class Sm4Crypto {
  private key: Uint8Array

  constructor() {
    const secretKey = import.meta.env.VITE_APP_SECRET_KEY || ''
    const encoder = new TextEncoder() // 创建 TextEncoder 实例
    this.key = encoder.encode(secretKey) // 将字符串编码为 Uint8Array;
  }

  /**
   * 使用 SM4 ECB 模式对数据进行加密
   * @param data - 要加密的数据
   * @returns 加密后的字符串
   */
  encrypt(data: string): string {
    return smCrypto.sm4.encrypt(data, this.key)
  }

  /**
   * 使用 SM4 ECB 模式对数据进行解密
   * @param encryptedData - 要解密的数据
   * @returns 解密后的字符串
   */
  decrypt(encryptedData: string): string {
    return smCrypto.sm4.decrypt(encryptedData, this.key)
  }
}

export const sm4Crypto = new Sm4Crypto()
