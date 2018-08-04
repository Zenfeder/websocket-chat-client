import io from 'socket.io-client'
import apiConfig from '@/api/path.config'

export function getSocket () {
  if (window._socket) {
    return window._socket
  } else {
    window._socket = io(apiConfig['socketRoot']())
    return window._socket
  }
}
