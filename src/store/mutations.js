import * as mutTypes from './mutation-types'

const mutations = {
  [mutTypes.SET_GLOBAL_CONFIG] (state, userInfo) {
    state.userInfo = userInfo
  }
}

export default mutations
