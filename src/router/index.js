import Vue from 'vue'
import Router from 'vue-router'

import index from '@/pages/index'
import chatBroadcast from '@/pages/chat-broadcast'
import chatPrivate from '@/pages/chat-private'
import chatGroup from '@/pages/chat-group'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/chat/broadcast',
      name: 'chatBroadcast',
      component: chatBroadcast
    },
    {
      path: '/chat/private/:friendNickname',
      name: 'chatPrivate',
      component: chatPrivate
    },
    {
      path: '/chat/group/:groupName',
      name: 'chatGroup',
      component: chatGroup
    },
    {
      path: '*',
      redirect: {
        name: 'index'
      }
    }
  ]
})
