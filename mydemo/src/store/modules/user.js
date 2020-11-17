//引入封装好的接口
import { getUserList, getUserCount } from '../../util/axios'

//state
const state = {
  userList: [],
  page:1, // 页码
  size:2, // 每个组件渲染的条数
  total:0, // 总条数
}

//getters
const getters = {
  //导出用户列表
  getUserList () {
    return state.userList
  },
  // 导出总条数
  getUserCount(){
    return state.total;
  },
  // 导出每页渲染条数
  getUserSize(){
    return state.size;
  },
  // // 导出page
  // getUserPage(){
  //   return state.page
  // }
}

//mutations
const mutations = {
  //去修改state中管理员列表
  REQ_USERLIST (state, payload) {
    state.userList = payload
  },
  // 修改state中的total总数
  REQ_USERCOUNT(state,payload){
    state.total = payload
  },
  // 修改page
  REQ_PAGE(state,payload){
    state.page = payload
  }
}

//actions
const actions = {
  //封装一个获取管理员列表的行动
  getUserAction (context) {
    console.log(context,'context');
    getUserList({
      size:context.state.size,
      page:context.state.page
    })
      .then(res => {
        console.log(res, '响应')
        if (res.data.code == 200) {
          //提交一个mutation以及携带参数，参数就是返回的数据
          let data = res.data.list ? res.data.list : []
          context.commit("REQ_USERLIST", data)
          //判断一下，当前是不是第一页 如果不是并且你当前的这个列表等于0
          if (context.state.page != 1 && data.length == 0) {
            //重新调取修改页码的行动
            context.dispatch('changePageAction', context.state.page - 1)
            //重新调取列表
            context.dispatch('getUserAction')
            return
          }
        }
      })
      .catch(err => {
        console.log(err, '错误响应')
      })
  },

  // 封装一个获取总条数的事件
  getCountAction({commit}){
    getUserCount().then(res=>{
      if(res.data.code == 200){
        console.log(res,'res响应');
        commit("REQ_USERCOUNT",res.data.list[0].total);
      }
    })
  },

  // 封装一个修改page的action
  changePageAction(context,payload){
    console.log(context,'页码');//注context上有dispatch
    
    context.commit('REQ_PAGE',payload)
    // 重新调取列表接口
    context.dispatch('getUserAction')
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