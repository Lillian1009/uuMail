<template>
  <div>
    <el-dialog :title="addInfo.isAdd ? '添加管理员' : '修改管理员'" :visible.sync="addInfo.isShow" :before-close="cancel" center>
      <el-form :model="form" :rules="rules">
        <el-form-item label="所属角色" :label-width="formLabelWidth" prop="roleid">
          <el-select v-model="form.roleid" placeholder="请选择">
            <!-- 下拉框循环菜单图标 -->
            <el-option v-for="item in roleList" :key="item.id" :label="item.rolename" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="username" label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item prop="password" label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="addInfo.isAdd" @click="add" type="primary">添 加</el-button>
        <el-button v-else @click="update" type="primary">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
import { getUserAdd, getUserInfo, getUserEdit } from "../../util/axios";
export default {
  data () {
    return {
      //表单对象
      form: {
        roleid:"",
        username:"",
        password:"",
        status: 1 //状态1正常2禁用
      },
      //label宽度
      formLabelWidth: "120px",
      //规则验证
      rules: {
        username: [
          { required: true, message: "请输入管理员名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        roleid:[
          { required: true, message: "请选择所属角色", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    //获取菜单列表
    ...mapGetters({
      roleList: "role/getRoleList"
    })
  },
  mounted () {
    //减少对服务器的交互
    if (this.roleList.length == 0) {
      this.getRoleList();
    }
  },
  props: ["addInfo"],
  methods: {
    //封装重置事件
    reset () {
      this.form = {
        roleid:"",
        username:"", // 管理员名称
        rolename: "", // 角色名称
        status: 1 //状态1正常2禁用
      };
    },
    //点击取消修改父组件弹框事件
    cancel () {
      this.$emit("cancel", false);
      //调用重置
      this.reset();
    },
    //调取行动
    ...mapActions({
      getUserList: "user/getUserAction",
      getRoleList: "role/getRoleAction",
      getCountAction:"user/getCountAction",
      // changePage: 'user/changePageAction'
    }),
    //添加事件
    add () {
      //转化menu的数据类型
      console.log(this.form,'表单信息');
      
      //调取添加接口
      getUserAdd(this.form).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getUserList();
          this.getCountAction();
          //  this.changePage();
           this.cancel();
          //关闭弹框
          
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    //封装一个查看一条数据的方法
    look (uid) {
      //调取查看接口
      getUserInfo({uid}).then(res => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {  
          this.form = res.data.list;
          this.form.uid = uid;
        }
      });
    },
    //编辑确定事件
    update () {    
      // console.log(this.form,'表单信息')
      //调取添加接口
      getUserEdit(this.form).then(res => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          //重新调取接口
          this.getUserList();
          // 重新获取总条数
          this.getCountAction()
          //  this.changePage()
          //关闭弹框
          this.cancel();
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="" scoped></style>
