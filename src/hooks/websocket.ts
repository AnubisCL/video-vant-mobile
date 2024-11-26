import { onUnmounted } from 'vue'

// 消息
interface WSMessage {
  type: string
  msgType?: string
  msg?: string
}

// 设置
interface SocketOptions {
  // 心跳间隔
  heartbeatInterval?: number
  // 超时重传
  reconnectInterval?: number
  // 最大重传次数
  maxReconnectAttempts?: number
}

class Socket {
  // 路径
  url: string
  ws: WebSocket | null = null
  opts: SocketOptions
  // 重传次数
  reconnectAttempts: number = 0
  listeners: { [key: string]: Function[] } = {}
  // 心跳间隔
  heartbeatInterval: number | null = null
  // 构造函数
  constructor(url: string, opts: SocketOptions = {}) {
    this.url = url
    this.opts = {
      // 心跳间隔
      heartbeatInterval: 30000,
      // 超时重传
      reconnectInterval: 5000,
      // 最大重传次数
      maxReconnectAttempts: 5,
      ...opts,
    }

    this.init()
  }

  // 初始化
  init() {
    this.ws = new WebSocket(this.url)
    this.ws.onopen = this.onOpen.bind(this)
    this.ws.onmessage = this.onMessage.bind(this)
    this.ws.onerror = this.onError.bind(this)
    this.ws.onclose = this.onClose.bind(this)
  }

  // 打开
  onOpen(event: Event) {
    console.log('WebSocket opened:', event)
    this.reconnectAttempts = 0
    this.startHeartbeat()
    this.emit('open', event)
  }

  // 收到的WebSocket消息
  onMessage(event: MessageEvent) {
    // console.log('WebSocket message received:', event.data);
    const message: WSMessage = JSON.parse(event.data)
    this.emit('message', message)
  }

  // 错误
  onError(event: Event) {
    console.error('WebSocket error:', event)
    this.emit('error', event)
  }

  // 重连逻辑中，在连接失败后自动重新连接
  onClose(event: CloseEvent) {
    console.log('WebSocket closed:', event)
    this.stopHeartbeat()
    this.emit('close', event)
    // 重连逻辑中，在连接失败后自动重新连接，但会限制重连的次数和每次重连之间的间隔时间
    if (this.opts.maxReconnectAttempts !== 0 && this.reconnectAttempts < this.opts.maxReconnectAttempts!) {
      setTimeout(() => {
        this.reconnectAttempts++
        this.init()
      }, this.opts.reconnectInterval)
    }
  }

  // 开始心跳检测
  startHeartbeat() {
    if (!this.opts.heartbeatInterval)
      return

    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        const heartbeatMessage: WSMessage = {
          type: 'HEART',
          msgType: 'default',
          msg: 'ping',
        }
        this.ws.send(JSON.stringify(heartbeatMessage))
      }
    }, this.opts.heartbeatInterval)
  }

  // 停止心跳检测
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }

  // 发送消息
  send(message: WSMessage) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
    else {
      console.error('WebSocket is not open. Cannot send:', message)
    }
  }

  // 事件监听器注册功能的实现
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)
  }

  // 从事件监听器中移除
  off(event: string) {
    if (this.listeners[event]) {
      delete this.listeners[event]
    }
  }

  // 在事件监听器中触发一个指定的事件
  emit(event: string, data: any) {
    this.listeners[event]?.forEach(callback => callback(data))
  }
}

export function useSocket(url: string, opts?: SocketOptions) {
  const socket = new Socket(url, opts)

  onUnmounted(() => {
    socket.off('open')
    socket.off('message')
    socket.off('error')
    socket.off('close')
    socket.ws?.close() // 关闭WebSocket连接
  })

  return {
    socket,
    send: socket.send.bind(socket),
    on: socket.on.bind(socket),
    off: socket.off.bind(socket),
  }
}
