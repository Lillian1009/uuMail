<template>
  <div>
    <el-dialog :title="addInfo.isAdd ? '添加轮播图列表' : '修改轮播图列表'" :visible.sync="addInfo.isShow" :before-close="cancel" center>
      <el-form :model="form" :rules="rules" ref="formDialog">
        <el-form-item prop="title" label="标题:" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片区域 -->
        <el-form-item label="图片" :label-width="formLabelWidth">
          <!--   
          el-upload 上传文件 
          action必选参数，上传的地址 ，我们的项目不需要上传地址，我们会把图片地址储存到数据库
          list-type	文件列表的类型	string	text/picture/picture-card
          on-preview	点击文件列表中已上传的文件时的钩子	function(file)
          on-remove	文件列表移除文件时的钩子
          auto-upload	是否在选取文件后立即进行上传 ,在我们的项目中取消自动上传
          on-change	文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
          file-list	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
          on-exceed	文件超出个数限制时的钩子	function(files, fileList)
          limit	最大允许上传个数	number
          通过设置limit和on-exceed来限制上传文件的个数和定义超出限制时的行为
      -->
          <el-upload action="#" list-type="picture-card" :on-preview="onPreview" :on-remove="onRemove" :auto-upload="false" :on-change="onChange" :file-list="fileList" :limit='1' :on-exceed='onExceed'>
            <i class="el-icon-plus"></i>
          </el-upload>
          <!-- <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog> -->
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
import { getBannerAdd, getBannerInfo, getBannerEdit } from "../../util/axios";
export default {
  data () {
    return {
      //表单对象
      form: {
        title: "", // 分类名称
        status: 1 ,//状态1正常2禁用
        img:'', //图片(文件，一般用于二级分类)
      },
      //label宽度
      formLabelWidth: "120px",
      //规则验证
      rules: {
        title: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ]
      },
      dialogVisible:'', //预览图片的弹框
      dialogImageUrl:'', // 预览图片的地址
      fileList:[], //文件上传列表
      imgUrl:'' //用于接收图片信息
    };
  },
  computed: {
    //获取菜单列表
    ...mapGetters({
      bannerList: "banner/getBannerList"
    })
  },
  props: ["addInfo"],
  methods: {
    //onChange 当图片上传时触发的文件
    onChange(file) {
      console.log(file, "文件");
      this.imgUrl = file.raw;
    },
    //图片预览
    onPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片移除
    onRemove(file, fileList) {},
    //文件上传限制
    onExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
    //封装重置事件
    reset () {
      this.form = {
       title: "", // 分类名称
        status: 1 ,//状态1正常2禁用
        img:'', //图片(文件，一般用于二级分类)
      };
      this.imgUrl = '', //图片(文件，一般用于二级分类)
      this.dialogVisible='', //预览图片的弹框
      this.dialogImageUrl='', // 预览图片的地址
      this.fileList=[]//文件上传列表
    },
    //点击取消修改父组件弹框事件
    cancel () {
      this.$emit("cancel", false);
      //调用重置
      this.reset();
    },
    //调取行动
    ...mapActions({
      getBannerList: "banner/getBannerListAction",
    }),
    //添加事件
    add (formName) {

      this.$refs[formName].validate(valid => {
        if (valid) {
          //添加逻辑
          console.log(this.form, "表单提交");
          //我们的参数不能用form表单，我们要FormData对象形式
          //把普通表单改成FormData
          let data = this.form;
          let file = new FormData();
          //必须通过append 去添加它的属性
          for (let i in data) {
            file.append(i, data[i]);
          }
          //添加img参数
          file.append("img", this.imgUrl);
          //直接打印FormData不好用，要用get去取值
          //console.log(file.get('catename'),'文件')

          //调取添加接口
          getBannerAdd(file).then(res => {
            console.log(res, "添加响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //关闭弹框
              this.cancel();
              //重新获取列表
              this.getBannerList();
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
      getBannerInfo({ id }).then(res => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          this.form = res.data.list;
          // 当前表单没有id，创建一个id，给确定提交使用
          this.form.id = id;
          // 图片形式进行转化
          this.fileList = this.form.img ? [{url:`${this.$imgUrl}${this.form.img}`}]:[];
        } else {
          this.$message.error(res.data.msg)
        }
      });
    },
    //编辑确定事件
    update (formName) {
      console.log(this.form);
      this.$refs[formName].validate(valid => {
        if(valid){
          // 修改逻辑
          // 调取修改接口
          // 将数据修改成为formDate形式
          let data = this.form;
          let file = new FormData();
          for(let i in data){
            file.append(i,data[i]);
          }
          // 如果新上传了图片this.imgUrl就有值，则就赋值给了this.imgUrl。如果没有新添加的图片，就用上一次的图片
          this.imgUrl = this.imgUrl ? this.imgUrl:this.form.img;
          file.append("img",this.imgUrl);
          getBannerEdit(file).then(
            res => {
              console.log(res,'修改的响应啊');
              if(res.data.code == 200){
                this.$message.success(res.data.msg);
                // 重新获取列表
                this.getBannerList();
                // 关闭弹框
                this.cancel();
                
              }else {
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
