<template>
  <div>
    <el-dialog :title="addInfo.isAdd ? '添加商品管理' : '修改商品管理'" :visible.sync="addInfo.isShow" :before-close="cancel" center>

      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item prop="title" label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="活动期限" :label-width="formLabelWidth">
          <el-date-picker v-model="timer" type="datetimerange" range-separator="至" start-placeholde="开始日期" end-placeholde="结束日期"></el-date-picker>
        </el-form-item>

        <el-form-item label="一级分类" :label-width="formLabelWidth">
          <el-select v-model="form.first_cateid" @change="changeCate()">
            <el-option label='请选择' value disabled></el-option>
            <!-- 下拉框循环我的菜单列表 -->
            <el-option v-for="item in cateList" :key="item.id" :label="item.catename" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" :label-width="formLabelWidth">
          <el-select v-model="form.second_cateid" @change="changeGoods()">
            <el-option label='请选择' value disabled></el-option>
            <!-- 下拉框循环我的菜单列表 -->
            <el-option v-for="item in secondArr" :key="item.id" :label="item.catename" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品" :label-width="formLabelWidth">
          <el-select v-model="form.goodsid">
            <el-option label='请选择' value disabled></el-option>
            <!-- 下拉框循环我的菜单列表 -->
            <el-option v-for="item in goodsArr" :key="item.id" :label="item.goodsname" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button v-if="addInfo.isAdd" @click="add('formDialog')" type="primary">添 加</el-button>
        <el-button v-else @click="update('formDialog')" type="primary">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
import { getSeckAdd, getSeckInfo, getSeckEdit, getGoodsList } from "../../util/axios";
export default {
  data () {
    return {
      //表单对象
      form: {
        title: '',
        begintime: '',
        endtime: '',
        first_cateid: '',//一级分类编号
        second_cateid: '',//二级分类编号
        goodsid: '',//商品名称
        status: 1,//状态1正常2禁用
      },
      timer: "", //日期
      //label宽度
      formLabelWidth: "100px",
      //规则验证
      rules: {
        title: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ]
      },
      // 创建一个二级分类数组
      secondArr: [],
      // 创建一个商品数组
      goodsArr: []
    };
  },

  computed: {
    //获取菜单列表
    ...mapGetters({
      cateList: "cate/getCateList",
    })
  },
  mounted () {
    // 减少对服务器的交互
    if (this.cateList.length == 0) {
      this.getCateList()
    }
  },
  props: ["addInfo"],
  methods: {
    // 点击一级分类获取二级分类列表
    changeCate (n) {
      let index = this.cateList.findIndex(
        item => item.id == this.form.first_cateid
      );
      this.secondArr = this.cateList[index].children;
      // 清空二级双向数据绑定还要清空三级
      if (!n) {
        this.form.second_cateid = '';
        this.form.goodsid = '';
      }
    },
    // 点击二级分类调取商品列表
    changeGoods (n) {
      // 调取商品列表接口
      getGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid
      }).then(res=>{
        if(res.data.code == 200){
          this.goodsArr = res.data.list;
          // 清空二级和三级双向数据绑定
          if(!n){
            this.form.goodsid = '';
          }
        }
      })
    },
    //封装重置事件
    reset () {
      this.form = {
        title: '',
        begintime: '',
        endtime: '',
        first_cateid: 0,//一级分类编号
        second_cateid: 0,//二级分类编号
        goodsid: '',//商品名称
        status: 1,//状态1正常2禁用
      };
      this.timer = ''
    },
    //点击取消修改父组件弹框事件
    cancel () {
      this.$emit("cancel", false);
      //调用重置
      this.reset();
    },
    //调取行动
    ...mapActions({
      getSeckList: "seck/getSeckAction",
      getCateList: "cate/getCateListAction",
    }),
    //添加事件
    add (formName) {

      this.$refs[formName].validate(valid => {
        if (valid) {
          //添加逻辑
          // 给开始时间和结束时间赋值
          this.form.begintime = new Date(this.timer[0]).getTime();
          this.form.endtime = new Date(this.timer[1]).getTime();
          console.log(this.form, "表单提交");


          //调取添加接口
          getSeckAdd(this.form).then(res => {
            console.log(res, "添加响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              //重新获取列表
              this.getSeckList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //封装一个查看一条数据的方法
    look (id) {
      //调取查看接口
      // 调取查看列表
      getSeckInfo({ id }).then(res => {
        if (res.data.code == 200) {
          this.form = res.data.list;
          //当前表单没有id 创建一个id，给确定提交用
          this.form.id = id;
          this.timer = [new Date(parseFloat(this.form.begintime)),new Date(parseFloat(this.form.endtime))]
          // 清空之前的双向数据绑定
          this.changeCate(true)
          this.changeGoods(true)
        } else {
          this.$message.error(res.data.msg)
        }
      })

    },
    //编辑确定事件
    update (formName) {
      console.log(this.form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 修改逻辑
          // 调取修改接口

          getSeckEdit(this.form).then(
            res => {
              console.log(res, '修改的响应啊');
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                // 关闭弹框
                this.cancel();
                // 重新获取列表
                this.getSeckList();
              } else {
                this.$message.error(res.data.msg)
              }
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      })
    },
  }
};
</script>

<style lang="" scoped></style>
