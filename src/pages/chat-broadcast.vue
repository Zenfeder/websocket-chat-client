<template>
  <div class="app-layout page-chat_broadcast">
    <div class="fixed-panel-top cl-green">
      {{nicknameList.length}}人在线
    </div>
    <div class="content">
      <template v-for="(item, index) in messages">
        <p
          class="msg-item user-msg"
          :class="{ 'tx-right': item.value.nickname === nickname }"
          v-if="item.type === 'user'"
          :key="index">
          <template v-if="item.value.nickname !== nickname">
            <span class="user-nickname">
              {{item.value.nickname}}
            </span>
            &nbsp;说&nbsp;
          </template>
          <span class="user-message">{{item.value.message}}</span>
        </p>
        <p
          class="msg-item system-msg"
          v-else
          :key="index">
          {{item.value}}
        </p>
      </template>
    </div>
    <div class="fixed-panel-bottom fx-space-between fx-align-center">
      <span class="cl-blue fz-20 fw-800">></span>
      <el-input
        class="input"
        v-model="broadcastMsg"
        size="medium"
        placeholder="少侠，有话请在这儿讲..."
        :autofocus="true"
        @keyup.native.enter="submitBroadcast"></el-input>
    </div>
  </div>
</template>

<script>
import { getSocket } from '@/utils/socket'
import session from '@/utils/session'

const socket = getSocket()

export default {
  data () {
    return {
      nicknameList: [],
      broadcastMsg: '',
      messages: []
    }
  },
  computed: {
    nickname () {
      return session.get('nickname')
    }
  },
  created () {
    socket.on('get all connected nickname', nicknameList => {
      this.nicknameList = nicknameList
    })
    socket.on('user join broadcast', nickname => {
      this.messages.push({
        type: 'system',
        value: `${nickname} 上车了`
      })
    })
    socket.on('user exit broadcast', nickname => {
      this.messages.push({
        type: 'system',
        value: `${nickname} 下车了`
      })
    })
    socket.on('user typing broadcast message', nickname => {
      this.messages.push({
        type: 'system',
        value: `${nickname} 正在输入...`
      })
    })
    socket.on('user broadcast message', ({ nickname, message }) => {
      this.messages.push({
        type: 'user',
        value: { nickname, message }
      })
    })
  },
  beforeMount () {
    let existNickname = session.get('nickname')
    window.onload = () => {
      if (existNickname) {
        socket.emit('join reconnect', existNickname)
      }
    }
    socket.on('self reconnect response', ({ success, message }) => {
      this.$notify({ message })
      if (!success) {
        this.$router.push({ name: 'index' })
      }
    })
    socket.on('user reconnected', nickname => {
      this.messages.push({
        type: 'system',
        value: `${nickname} 重新建立连接`
      })
    })
  },
  methods: {
    typing () {
      socket.emit('typing broadcast message', this.nickname)
    },
    submitBroadcast () {
      if (!this.broadcastMsg.trim()) {
        return false
      }
      socket.emit('broadcast message', { nickname: this.nickname, message: this.broadcastMsg })
      this.messages.push({
        type: 'user',
        value: { nickname: this.nickname, message: this.broadcastMsg }
      })
      this.broadcastMsg = ''
    }
  },
  watch: {
    broadcastMsg (newVal, oldVal) {
      if (!oldVal.trim() && newVal.trim()) {
        this.typing()
      }
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/color.less';

.page-chat_broadcast {
  .fixed-panel-top {
    position: fixed;
    box-sizing: border-box;
    padding: 10px;
    height: 30px;
    right: 0;
    top: 0;
    background: @black;
    z-index: 10;
  }
  .fixed-panel-bottom {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding: 10px;
    left: 0;
    bottom: 0;
    background: @black;
    z-index: 10;
    .input {
      width: 100%;
    }
    .el-input__inner {
      background-color: #000 !important;
      color: @gray;
      border-radius: 0;
      border: none;
      height: 30px;
      font-size: 16px;
    }
  }
  .content {
    box-sizing: border-box;
    height: 100vh;
    padding: 30px 10px 50px;
    overflow-y: auto;
    .msg-item {
      margin: 10px 0;
    }
    .system-msg {
      color: @gray-dark;
      text-align: center;
      font-size: 13px;
    }
    .user-nickname {
      cursor: pointer;
      color: @blue;
      font-weight: 600;
      &:hover {
        color: @blue + #333;
      }
    }
    .user-message {
      color: @gray;
    }
  }
}
</style>
