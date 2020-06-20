<template>
  <div class="app-layout page-chat_broadcast">
    <div class="fixed-panel-top fx-space-between fx-align-center">
      <span @click="joinGroup" class="join-group">加入群聊</span>
      <span class="fz-22">广播室</span>
      <span class="cl-blue">{{nicknameList.length}}人在线</span>
    </div>
    <div class="content">
      <template v-for="(item, index) in messages">
        <p
          class="msg-item user-msg"
          :class="{ 'tx-right': item.value.nickname === nickname }"
          v-if="item.type === 'user'"
          :key="index">
          <template v-if="item.value.nickname !== nickname">
            <span class="user-nickname" @click="chatPrivateInvite(item.value.nickname)">
              {{item.value.nickname}}
            </span>
            <span class="cl-gray-dark">&nbsp;说&nbsp;</span>
          </template>
          <span :class="{
            'cl-green': item.value.nickname === nickname,
            'cl-white': item.value.nickname !== nickname
          }">{{item.value.message}}</span>
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
      <el-button type="primary" size="small" @click="submitBroadcast">发送</el-button>
    </div>
  </div>
</template>

<script>
import { getSocket } from '@/utils/socket'
import session from '@/utils/session'
import storage from '@/utils/storage'

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
    this.checkLoginStatus()
    this.initSystemTips()
    this.updateOnlineInfo()

    socket.on('push connected user list', nicknameList => {
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
    socket.on('user broadcast message', ({ nickname, message }) => {
      this.messages.push({
        type: 'user',
        value: { nickname, message }
      })
    })
    socket.on('user reconnected', nickname => {
      this.messages.push({
        type: 'system',
        value: `${nickname} 重新建立连接`
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
    updateOnlineInfo () {
      socket.emit('pull connected user list')
    },
    initSystemTips () {
      if (!storage.get('hideSystemTips')) {
        this.$notify({
          message: '点击用户昵称可进行私聊',
          duration: 1500,
          onClose () {
            storage.set('hideSystemTips', true)
          }
        })
      }
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
    },
    chatPrivateInvite (receiveNickname) {
      socket.emit('send private chat invite', { sendNickname: this.nickname, receiveNickname })
      this.$router.push({
        name: 'chatPrivate',
        params: { friendNickname: receiveNickname }
      })
    },
    joinGroup () {
      this.$prompt('请输入群组名称', '加入群聊', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入1-10位中文、字母、数字',
        inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}$/
      }).then(({ value }) => {
        socket.emit('join group', { nickname: this.nickname, groupName: value })
        socket.on('join group success', () => {
          this.$router.push({
            name: 'chatGroup',
            params: {
              groupName: value
            }
          })
        })
      }).catch(() => {})
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
    padding: 20px 15px;
    width: 100%;
    height: 50px;
    right: 0;
    top: 0;
    background: @black;
    border-bottom: 1px solid @gray-dark;
    z-index: 10;
    .join-group {
      cursor: pointer;
      color: @white;
      &:hover {
        color: @gray-light;
      }
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
    .system-msg {
      color: @gray-dark;
      text-align: center;
      font-size: 13px;
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
