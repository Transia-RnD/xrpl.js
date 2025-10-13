import WebSocket from '@xrplf/isomorphic/ws'

export interface ISelect<T = string> {
  label: string
  value: T
}

enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  RECONNECTING = 'RECONNECTING',
  CLOSED = 'CLOSED',
}

interface DebugStreamConfig {
  reconnectAttempts?: number
  reconnectDelay?: number
  connectionTimeout?: number
  // logFilePath?: string
}

export class DebugStreamManager {
  private socket: WebSocket | null = null
  private batchId: ISelect | null = null
  private connectionState: ConnectionState = ConnectionState.DISCONNECTED
  private reconnectAttempts: number
  private reconnectDelay: number
  private connectionTimeout: number
  // private logFilePath: string
  private currentReconnectAttempt: number = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private connectionTimer: NodeJS.Timeout | null = null

  constructor(config: DebugStreamConfig = {}) {
    this.reconnectAttempts = config.reconnectAttempts ?? 3
    this.reconnectDelay = config.reconnectDelay ?? 5000
    this.connectionTimeout = config.connectionTimeout ?? 10000
    // this.logFilePath = config.logFilePath ?? 'debug.log'

    this.setupProcessHandlers()
  }

  public connect(batchId: ISelect | null, filter: string[] = []): void {
    if (!batchId?.value) {
      console.error('Cannot connect: batch ID is required')
      return
    }

    if (this.isConnectedToBatch(batchId.value)) {
      console.log(`Debug stream already open for batch ${batchId.value}`)
      return
    }

    this.batchId = batchId
    // this.activeFilters = filter
    this.currentReconnectAttempt = 0
    this.establishConnection()
  }

  public disconnect(): void {
    this.connectionState = ConnectionState.CLOSED
    this.clearTimers()
    this.closeSocket()
    this.batchId = null
    // this.activeFilters = []
    console.log('Debug stream disconnected')
  }

  public getConnectionState(): ConnectionState {
    return this.connectionState
  }

  public getSelectedBatch(): ISelect | null {
    return this.batchId
  }

  private isConnectedToBatch(batchIdValue: string): boolean {
    return (
      this.socket !== null &&
      this.connectionState === ConnectionState.CONNECTED &&
      this.batchId?.value === batchIdValue
    )
  }

  private establishConnection(): void {
    if (!this.batchId?.value) {
      return
    }

    try {
      this.connectionState = ConnectionState.CONNECTING
      this.closeSocket()
      process.env.HOOKS_DEBUG_HOST = 'ws://79.110.60.99:8080'

      const url = `${process.env.HOOKS_DEBUG_HOST}/batch/${this.batchId.value}`
      console.log(`Connecting to debug stream: ${url}`)

      this.socket = new WebSocket(url)

      this.setupSocketListeners()
      this.startConnectionTimeout()
    } catch (error) {
      console.error('Failed to establish connection:', error)
      this.handleReconnect()
    }
  }

  private setupSocketListeners(): void {
    if (!this.socket) return

    this.socket.addEventListener('open', this.handleOpen)
    this.socket.addEventListener('close', this.handleClose)
    this.socket.addEventListener('error', this.handleError)
    this.socket.addEventListener('message', this.handleMessage)
  }

  private removeSocketListeners(): void {
    if (!this.socket) return

    this.socket.removeEventListener('open', this.handleOpen)
    this.socket.removeEventListener('close', this.handleClose)
    this.socket.removeEventListener('error', this.handleError)
    this.socket.removeEventListener('message', this.handleMessage)
  }

  private handleOpen = (): void => {
    this.clearConnectionTimeout()
    this.connectionState = ConnectionState.CONNECTED
    this.currentReconnectAttempt = 0
    console.log(`Debug stream opened for batch ${this.batchId?.value}`)
  }

  private handleClose = (event: any): void => {
    this.clearConnectionTimeout()

    if (event.code === 4999) {
      // Intentional close
      this.connectionState = ConnectionState.CLOSED
      return
    }

    console.error(`Connection closed unexpectedly. [code: ${event.code}]`)

    if (this.connectionState !== ConnectionState.CLOSED) {
      this.handleReconnect()
    }
  }

  private handleError = (event: any): void => {
    console.error('WebSocket error:', event.message || 'Unknown error')
    this.clearConnectionTimeout()
  }

  private handleMessage = (event: { data: any }): void => {
    try {
      this.logMessage(event.data)
    } catch (error) {
      console.error('Error processing message:', error)
    }
  }

  private logMessage(message: string): void {
    try {
      if (process.env.NODE_ENV === 'production') {
        // fs.appendFileSync(this.logFilePath, `${message}\n`)
      } else {
        console.log(message)
      }
    } catch (error) {
      console.error('Failed to log message:', error)
    }
  }

  private handleReconnect(): void {
    if (this.currentReconnectAttempt >= this.reconnectAttempts) {
      console.error(
        `Failed to reconnect after ${this.reconnectAttempts} attempts. Giving up.`,
      )
      this.connectionState = ConnectionState.DISCONNECTED
      return
    }

    this.currentReconnectAttempt++
    this.connectionState = ConnectionState.RECONNECTING

    console.log(
      `Reconnecting... (attempt ${this.currentReconnectAttempt}/${this.reconnectAttempts})`,
    )

    this.reconnectTimer = setTimeout(() => {
      this.establishConnection()
    }, this.reconnectDelay)
  }

  private startConnectionTimeout(): void {
    this.connectionTimer = setTimeout(() => {
      if (this.connectionState === ConnectionState.CONNECTING) {
        console.error('Connection timeout')
        this.closeSocket()
        this.handleReconnect()
      }
    }, this.connectionTimeout)
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer)
      this.connectionTimer = null
    }
  }

  private clearTimers(): void {
    this.clearConnectionTimeout()

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private closeSocket(): void {
    if (this.socket) {
      this.removeSocketListeners()

      if (
        this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING
      ) {
        this.socket.close(4999)
      }

      this.socket = null
    }
  }

  private setupProcessHandlers(): void {
    const cleanup = () => {
      this.disconnect()
      process.exit(0)
    }

    process.on('SIGINT', cleanup)
    process.on('SIGTERM', cleanup)
  }

  public removeListeners(): void {
    this.disconnect()
  }
}

export const debugStreamManager = new DebugStreamManager()
