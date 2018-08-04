<template>
  <div class="app-layout page-index fx-center">
    <el-input
      class="input"
      v-model="nickname"
      size="medium"
      placeholder="报上大名赶紧上车..."
      :autofocus="true"
      @keyup.native.enter="join"></el-input>
  </div>
</template>

<script>
import { getSocket } from '@/utils/socket'
import session from '@/utils/session'

const socket = getSocket()

export default {
  data () {
    return {
      nickname: ''
    }
  },
  created () {
    socket.on('self join response', ({ success, message }) => {
      if (success) {
        session.set('nickname', this.nickname.trim())
        this.$router.push({ name: 'chatBroadcast' })
      } else {
        this.$notify({ message })
      }
    })
  },
  methods: {
    join () {
      let nickname = this.nickname.trim()
      if (!nickname) {
        return false
      }
      socket.emit('join broadcast', nickname)
    }
  }
}
</script>

<style lang="less">
.page-index {
  .input {
    width: 50%;
    .el-input__inner {
      background: #000;
      color: #fff;
      border-radius: 0;
      border-top: none;
      border-left: none;
      border-right: none;
      height: 50px;
      font-size: 20px;
    }
  }
}
</style>
