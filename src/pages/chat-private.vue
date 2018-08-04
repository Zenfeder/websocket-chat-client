<template>
  <div class="app-layout page-chat_private">
    <h1>私聊页</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messages: [],
      inputVal: '',
      username: ''
    }
  },
  methods: {
    // sendPrivateMsg () {
    //   if (!this.inputVal.trim()) {
    //     return false
    //   }
    //   this.messages.push({
    //     type: 'user',
    //     value: {
    //       nickname: this.username,
    //       socketId: this.socketId,
    //       message: this.inputVal
    //     }
    //   })

    //   socket.emit('privateMsg', {
    //     fromNickname: this.username,
    //     toSocketId: this.friendSocketId,
    //     message: this.inputVal
    //   })
    //   this.inputVal = ''
    // }
  }
}
</script>

<style lang="less" scoped>
.page-chat_private {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background: #000000;
  h1 {
    color: #ffffff;
  }
}
</style>
