<template>
  <div id="app">
    <router-view :key="$route.fullPath"/>
  </div>
</template>

<script>
import { getSocket } from '@/utils/socket'

const socket = getSocket()

export default {
  name: 'App',
  created () {
    const self = this
    socket.on('receive private chat invite', ({ sendNickname, receiveNickname }) => {
      let notify = this.$notify({
        message: `${sendNickname} 邀请你私聊`,
        duration: 5000,
        onClick () {
          notify.close()
          self.$router.push({
            name: 'chatPrivate',
            params: { friendNickname: sendNickname }
          })
        }
      })
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
