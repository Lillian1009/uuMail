//引入封装好的接口
import { getRoleList } from '../../util/axios'

//state
const state = {
  roleList: []
}

//getters
const getters = {
  //封装了一个state中菜单列表
  getRoleList (state) {
    return state.roleList
  }
}

//mutations
const mutations = {
  //去修改state中菜单列表
  REQ_MENULIST (state, payload) {
    state.roleList = payload
  }
}

//actions
const actions = {
  //获取菜单列表
  getRoleAction ({ commit }) {
    getRoleList({
      istree: true
    })
      .then(res => {
        console.log(res, '响应')
        if (res.data.code == 200) {
          //提交一个mutation以及携带参数，参数就是返回的数据
          commit("REQ_MENULIST", res.data.list)
        }
      })
      .catch(err => {
        console.log(err, '错误响应')
      })
  }
}


//默认导出所有的内容
export default {
  state,
  getters,
  mutations,
  actions,
  //命名空间
  namespaced: true
}