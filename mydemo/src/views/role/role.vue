<template>
    <div>
      <!-- 面包屑 -->
      <el-bread></el-bread>
      <!-- 添加按钮 -->
      <el-button type="primary" plain size='small' @click='add'>添加</el-button>
      <!-- 列表渲染 -->
      <v-table @edit='edit'></v-table>
      <!-- 弹框 -->
      <v-dialog ref='dialog' @cancel='cancel' :addInfo='addInfo'></v-dialog>
    </div>
</template>

<script>
import elBread from '../../components/el-bread'
import vTable from './list'
import vDialog from './add'
export default {
    data() {
        return {
          addInfo:{
            isShow:false,//弹框打开关闭
            isAdd:true,//添加还是编辑
          }
        };
    },
  components:{
      elBread,
      vTable,
      vDialog
  },
  methods: {
    //点击添加打开弹框
    add(){
      this.addInfo.isShow = true
      this.addInfo.isAdd = true;
    },
    //子组件触发的父组件修改弹框状态
    cancel(){
      this.addInfo.isShow =false
    },
    //子组件触发父组件联动编辑
    edit(e){
      this.addInfo.isShow =true 
      this.addInfo.isAdd = false
      this.$refs.dialog.look(e)
    }
  },
  mounted() {
    console.log(this.$store,'444444');
  },
};
</script>

<style  lang="stylus" scoped>
.el-button
  margin-bottom 20px
</style>
