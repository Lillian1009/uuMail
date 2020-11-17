//引入封装好的接口
import { getSeckList} from '../../util/axios'

//state
const state = {
  seckList: [],
  
}

//getters
const getters = {
  //导出用户列表
  getSeckList () {
    return state.seckList
  }
}

//mutations
const mutations = {
  //去修改state中管理员列表
  REQ_SECKLIST (state, payload) {
    state.seckList = payload
  }
}

//actions
const actions = {
  //封装一个获取管理员列表的行动
  getSeckAction ({commit}) {
    getSeckList()
      .then(res => {
        console.log(res, '响应')
        if (res.data.code == 200) {
          //提交一个mutation以及携带参数，参数就是返回的数据
          commit("REQ_SECKLIST", res.data.list)
        }
      })
      .catch(err => {
        console.log(err, '错误响应')
      })
  },

  

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