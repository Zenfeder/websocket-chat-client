<template>
  <div class="app-layout page-chat_private">
    <div class="fixed-panel-top cl-white fx-align-center fx-space-between fz-18">
      <i class="el-icon-arrow-left fz-22 goback" @click="$router.go(-1)"></i>
      <span>{{ groupName }}</span>
      <span></span>
    </div>
    <div class="content">
      <template v-for="(item, index) in messages">
        <p
          class="msg-item"
          :class="{
            'tx-right': item.nickname === nickname,
            'cl-green': item.nickname === nickname,
            'cl-white': item.nickname !== nickname
          }"
          :key="index">
          <template v-if="item.nickname !== nickname">
            <span class="user-nickname" @click="chatPrivateInvite(item.nickname)">
              {{item.nickname}}
            </span>
            <span class="cl-gray-dark">&nbsp;说&nbsp;</span>
          </template>
          {{item.message}}
        </p>
      </template>
    </div>
    <div class="fixed-panel-bottom fx-space-between fx-align-center">
      <span class="cl-blue fz-20 fw-800">></span>
      <el-input
        class="input"
        v-model="groupMsg"
        size="medium"
        placeholder="少侠，有话请在这儿讲..."
        :autofocus="true"
        @keyup.native.enter="submitGroupMsg"></el-input>
      <el-button type="primary" size="small" @click="submitGroupMsg">发送</el-button>
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
      messages: [],
      groupMsg: ''
    }
  },
  computed: {
    nickname () {
      return session.get('nickname')
    },
    groupName () {
      return this.$route.params.groupName
    }
  },
  created () {
    this.checkLoginStatus()
    socket.on('user join group', ({ nickname, groupName }) => {
      this.$notify({ message: `${nickname} 加入群聊`, duration: 1500 })
    })
    socket.on('receive group message', ({ sendNickname, message }) => {
      this.messages.push({ nickname: sendNickname, message })
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
      // this.$notify({ message, duration: 1500 })
      if (!success) {
        this.$router.push({ name: 'index' })
      }
    })
  },
  methods: {
    checkLoginStatus () {
      if (!session.get('nickname')) {
        this.$router.push({ name: 'index' })
      }
    },
    submitGroupMsg () {
      let groupMsg = this.groupMsg.trim()
      if (!groupMsg) {
        return false
      }
      // this.messages.push({ nickname: this.nickname, message: groupMsg })
      socket.emit('send group message', {
        sendNickname: this.nickname,
        groupName: this.groupName,
        message: groupMsg
      })
      this.groupMsg = ''
    },
    chatPrivateInvite (receiveNickname) {
      socket.emit('send private chat invite', { sendNickname: this.nickname, receiveNickname })
      this.$router.push({
        name: 'chatPrivate',
        params: { friendNickname: receiveNickname }
      })
    }
  }
}
</script>

<style lang="less">
@import '~@/assets/color.less';

.page-chat_private {
  .fixed-panel-top {
    position: fixed;
    box-sizing: border-box;
    padding: 20px 15px;
    width: 100%;
    height: 50px;
    right: 0;
    top: 0;
    background: @black;
    border-bottom: 1px solid @gray-dark;
    z-index: 10;
    .goback:hover {
      cursor: pointer;
    }
  }
  .fixed-panel-bottom {
    position: fixed;
    box-sizing: border-box;
    width: 100%;
    height: 50px;
    padding: 20px 15px;
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
    padding: 60px 15px 60px;
    overflow-y: auto;
    .msg-item {
      margin: 10px 0;
    }
    .user-nickname {
      cursor: pointer;
      color: @white;
      font-weight: 600;
      &:hover {
        color: @gray-light;
      }
    }
  }
}
</style>
