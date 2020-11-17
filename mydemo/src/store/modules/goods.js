//引入封装好的接口
import { getGoodsList, getGoodsCount } from '../../util/axios'

//state
const state = {
  goodsList: [],
  page: 1, // 页码
  size: 2, // 每个组件渲染的条数
  total: 0, // 总条数
}

//getters
const getters = {
  //导出用户列表
  getGoodsList () {
    return state.goodsList
  },
  // 导出总条数
  getGoodsCount () {
    return state.total;
  },
  // 导出每页渲染条数
  getGoodsSize () {
    return state.size;
  },
  // 导出page
  // getGoodsPage () {
  //   return state.page
  // }
}

//mutations
const mutations = {
  //去修改state中管理员列表
  REQ_GOODSLIST (state, payload) {
    state.goodsList = payload
  },
  // 修改state中的total总数
  REQ_GOODSCOUNT (state, payload) {
    state.total = payload
  },
  // 修改page
  REQ_PAGE (state, payload) {
    state.page = payload
  }
}

//actions
const actions = {
  //封装一个获取管理员列表的行动
  getGoodsAction (context) {
    console.log(context, 'context');
    getGoodsList({
      size: context.state.size,
      page: context.state.page
    })
      .then(res => {
        console.log(res, '响应')
        if (res.data.code == 200) {
          console.log(res, "响应数据");
          //转化数据
          let data = res.data.list ? res.data.list : []
          //提交一个mutations
          context.commit("REQ_GOODSLIST", data);
          //判断一下，当前是不是第一页 如果不是并且你当前的这个列表等于0
          if (context.state.page != 1 && data.length == 0) {
            //重新调取修改页码的行动
            context.dispatch('changePageAction', context.state.page - 1)
            //重新调取列表
            context.dispatch('getGoodsAction')
            return
          }
          // else if ( data.length > 2) {
          //   //重新调取修改页码的行动
          //   context.dispatch('changePageAction', context.state.page + 2)
          //   //重新调取列表
          //   context.dispatch('getGoodsAction')
          //   return
          // }
        }
      });
  },
  // 封装一个获取总条数的事件
  getCountAction ({ commit }) {
    getGoodsCount().then(res => {
      if (res.data.code == 200) {
        console.log(res, 'res响应');
        commit("REQ_GOODSCOUNT", res.data.list[0].total);
      }
    })
  },

  // 封装一个修改page的action
  changePageAction (context, payload) {
    console.log(context, '页码');//注context上有dispatch

    context.commit('REQ_PAGE', payload)
    // 重新调取列表接口
    context.dispatch('getGoodsAction')
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