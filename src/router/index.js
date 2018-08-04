import Vue from 'vue'
import Router from 'vue-router'

import index from '@/pages/index'
import chatBroadcast from '@/pages/chat-broadcast'
import chatGroup from '@/pages/chat-group'
import chatPrivate from '@/pages/chat-private'
import addMemberGroup from '@/pages/add-member-group'
import addMemberPrivate from '@/pages/add-member-private'

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
      path: '/chat/group',
      name: 'chatGroup',
      component: chatGroup
    },
    {
      path: '/chat/private',
      name: 'chatPrivate',
      component: chatPrivate
    },
    {
      path: '/add/member/group',
      name: 'addMemberGroup',
      component: addMemberGroup
    },
    {
      path: '/add/member/private',
      name: 'addPrivateMember',
      component: addMemberPrivate
    },
    {
      path: '*',
      redirect: {
        name: 'index'
      }
    }
  ]
})
