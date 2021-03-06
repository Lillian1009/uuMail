import Vue from "vue";
import Router from "vue-router";
// 引入仓库
import Store from '../store'

// 封装一个函数，用来检测是否存在该地址
// some有一个真就返回真
function hasUrl (url){
  return Store.state.userInfo.menus_url.some(item=>item==url)
}

Vue.use(Router);

export let indexRoutes = [
  {
    path: "/menu",
    component: () => import("@/views/menu/menu"),
    name: "菜单管理",
    beforeEnter: (to, from, next) => { ('/menu') ? next() : next('/home') } 
  },
  {
    path: "/role",
    component: () => import("@/views/role/role"),
    name: "角色管理",
    beforeEnter:(to,from,next)=>{('/role') ? next() : next('/home')} 
  },
  {
    path: "/user",
    component: () => import("@/views/user/user"),
    name: "管理员管理",
    beforeEnter: (to, from, next) => { ('/user') ? next() : next('/home') } 
  },
  {
    path:'/cate',
    component:()=> import('@/views/cate/cate'),
    name: '商品分类',
    beforeEnter: (to, from, next) => { ('/cate') ? next() : next('/home') } 
  },
  {
    path: "/specs",
    component: () => import("@/views/specs/specs"),
    name: "商品规格",
    beforeEnter: (to, from, next) => { ('/specs') ? next() : next('/home') } 
  },
  {
    path: "/goods",
    component: () => import("@/views/goods/goods"),
    name: "商品管理",
    beforeEnter: (to, from, next) => { ('/goods') ? next() : next('/home') } 
  },
  {
    path: "/member",
    component: () => import("@/views/member/member"),
    name: "会员管理",
    beforeEnter: (to, from, next) => { ('/member') ? next() : next('/home') } 
  },
  {
    path: "/banner",
    component: () => import("@/views/banner/banner"),
    name: "轮播图管理",
    beforeEnter: (to, from, next) => { ('/role') ? next() : next('/home') } 
  },
  {
    path: "/seck",
    component: () => import("@/views/seck/seck"),
    name: "活动列表",
    beforeEnter: (to, from, next) => { ('/role') ? next() : next('/home') } 
  }
];
console.log(...indexRoutes, '展开')

const router = new Router({
  routes: [
    {
      path: "/login",
      component: () => import("@/pages/login")
    },
    {
      path: "/index",
      component: () => import("@/pages/index"),
      children: [
        {
          path: "/home",
          component: () => import("@/views/home")
        },
        ...indexRoutes,
        {
          //二级路由重定向
          path: "",
          redirect: "/menu"
        }
      ]
    },
    {
      //重定向
      path: "*",
      redirect: "/login"
    }
  ]
});

// 全局导航守卫之登录拦截
// 如果你去的是登录，就next；如果去的不是登录，那么就判断是否登录过。登录过，next；否则全部跳转到登录页
router.beforeEach((to,from,next)=>{
  if(to.path == '/login'){
    next()
    return
  }
  if(Store.state.userInfo){
    next()
    return
  }
  next('/login')
})

// 导出路由
export default router