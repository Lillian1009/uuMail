<template>
  <div>
    <el-dialog title="修改会员信息" :visible.sync="addInfo.isShow" :before-close="cancel" center>
      <el-form :model="form" :rules="rules" ref="dialogForm">
        <el-form-item prop="phone" label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item prop="nickname" label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>

        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('dialogForm')">取 消</el-button>
        <el-button @click="update('dialogForm')" type="primary">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
import { getMemberInfo, getMemberEdit } from "../../util/axios";
export default {
  data () {
    var valid = (rule, value, callback) => {
      var re = { tel: /^1\d{10}$/ }
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else if (!(re.tel.test(this.form.phone))) {
        callback(new Error('请输入11位正确的手机号'));
      }
    };
    return {
      //表单对象
      form: {
        phone: "",
        nickname: "",
        password: "",
        status: 1 //状态1正常2禁用
      },
      //label宽度
      formLabelWidth: "120px",
      //规则验证
      rules: {
        nickname: [
          { required: true, message: "请输入会员昵称", trigger: "blur" }         
        ],
        phone: [
          { required: true, message: "请填写手机号", trigger: "blur" }         
        ]
      },

    };
  },
  props: ["addInfo"],
  computed: {
    //获取菜单列表
    ...mapGetters({
      memberList: "member/getMemberList"
    })
  },
  mounted () {
    //减少对服务器的交互
    if (this.memberList.length == 0) {
      this.getMemberList();
    }
  },
  methods: {
    //封装重置事件
    reset (formName) {
      this.form = {
        phone: "",
        nickname: "",
        password: "",
        status: 1 //状态1正常2禁用
      };
      this.$refs[formName].resetFields();
      // 清空规则验证，当关闭弹框时，可以调取清空验证规则函数resetFields()
      console.log(this.$refs["formDialog"]);
      this.$refs["formDialog"].resetFields();
    },
    //点击取消修改父组件弹框事件
    cancel (formName) {
      this.$emit("cancel", false);
      //调用重置
      this.reset(formName);
    },
    //调取行动
    ...mapActions({
      getMemberList: "member/getMemberAction",

    }),

    //封装一个查看一条数据的方法
    look (uid) {
      //调取查看接口
      getMemberInfo({ uid }).then(res => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          this.form = res.data.list;
          this.form.uid = uid;
        }
      });
    },
    //编辑确定事件
    update (formName) {
      console.log(this.$refs[formName], '88888');
      this.$refs[formName].validate(valid => {
        if (valid) {
          //添加逻辑
          console.log(this.form, "表单提交");

          // console.log(this.form,'表单信息')
          //调取添加接口
          getMemberEdit(this.form).then(res => {
            if (res.data.code == 200) {
              // this.isShow = false;
              this.$message.success(res.data.msg);
              //重新调取接口
              this.getMemberList();
              //关闭弹框
              this.cancel();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }




  }
};
</script>

<style lang="" scoped></style>
