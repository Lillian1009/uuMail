<template>
  <div>
    <el-container>
      <el-header>
        XXX大型后台管理项目
        <div class="userInfo">
          欢迎{{getUserInfo.username}}登录
          <el-button @click="logout" type="danger" size="small">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 引入导航菜单 -->
          <v-nav></v-nav>
        </el-aside>
        <el-main>
          <!-- 二级路由出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import {mapGetters,mapActions} from 'vuex'
//引入nav导航组件
import vNav from "../components/nav";
export default {
  data() {
    return {};
  },
  components: {
    vNav
  },
  computed: {
    ...mapGetters(['getUserInfo'])
  },
  methods: {
    ...mapActions(['changeUserInfoAction']),
    // logout退出事件
   logout(){
      this.changeUserInfoAction(null)
      // 退出后强制跳转登录页
      this.$router.push('/login')
   }
  },
};
</script>

<style lang="stylus" scoped>
@import '../stylus/index.styl'
.el-header
    background $thirdBgColor
    text-align center
    font-size 20px
    line-height 60px
.userInfo  
    float right 
    font-size 15px
    // color blue 
    button 
      background-color grey
      // margin-left 5px
</style>
