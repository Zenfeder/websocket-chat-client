<template>
  <div class="app-layout page-index fx-center">
    <el-input
      class="input"
      v-model="nickname"
      size="medium"
      placeholder="报上大名赶紧上车..."
      :autofocus="true"
      @keyup.native.enter="join"></el-input>
    <el-button type="primary" size="small" @click="join">上车</el-button>
  </div>
</template>

<script>
import { getSocket } from '@/utils/socket'
import session from '@/utils/session'

let socket = getSocket()

export default {
  data () {
    return {
      nickname: ''
    }
  },
  created () {
    session.clear()
  },
  methods: {
    join () {
      let nickname = this.nickname.trim()
      if (!nickname) {
        return false
      }
      socket.emit('join broadcast', nickname)
      socket.on('self join response', ({ success, message }) => {
        if (success) {
          session.set('nickname', this.nickname.trim())
          this.$router.push({ name: 'chatBroadcast' })
        } else {
          this.$notify({ message })
        }
      })
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
