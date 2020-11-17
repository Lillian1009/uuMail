<template>
  <div>
    <el-dialog :title="addInfo.isAdd ? '添加商品管理' : '修改商品管理'" :visible.sync="addInfo.isShow" :before-close="cancel" center @opened='createEditor'>
      <el-form :model="form" ref="formDialog" :rules="rules">
        <el-form-item prop="first_cateid" label="一级分类" :label-width="formLabelWidth">
          <el-select v-model="form.first_cateid" @change='changeCate(false)'>
            <el-option label='请选择' disabled value></el-option>
            <!-- 下拉框循环我的菜单列表 -->
            <el-option v-for="item in cateList" :key="item.id" :label="item.catename" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="second_cateid" label="二级分类" :label-width="formLabelWidth">
          <el-select v-model="form.second_cateid">
            <el-option label='请选择' disabled value></el-option>
            <!-- 下拉框循环我的菜单列表 -->
            <el-option v-for="item in secondArr" :key="item.id" :label="item.catename" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="goodsname" label="商品名称:" :label-width="formLabelWidth">
          <el-input v-model="form.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="价格:" :label-width="formLabelWidth">
          <el-input v-model.number="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="market_price" label="市场价格:" :label-width="formLabelWidth">
          <el-input v-model.number="form.market_price" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片区域 -->
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload action="#" list-type="picture-card" :on-preview="onPreview" :on-remove="onRemove" :auto-upload="false" :on-change="onChange" :file-list="fileList" :limit='1' :on-exceed='onExceed'>
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="" />
          </el-dialog>
        </el-form-item>

        <el-form-item prop="specsid" label="商品规格" :label-width="formLabelWidth">
          <el-select v-model="form.specsid" @change='changeSpecs(false)'>
            <el-option label='请选择' value disabled></el-option>
            <!-- 下拉框循环我的菜单列表 -->
            <el-option v-for="item in specsList" :key="item.id" :label="item.specsname" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- prop="specsattr" -->
        <el-form-item label="规格属性" :label-width="formLabelWidth" prop="specsattr">
          <el-select v-model="form.specsattr" multiple>
            <el-option label='请选择' value disabled></el-option>
            <!-- 下拉框循环我的菜单列表 -->
            <el-option v-for="item in attrArr" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品:" :label-width="formLabelWidth">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖:" :label-width="formLabelWidth">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态:" :label-width="formLabelWidth">
          <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="2">
          </el-switch>
        </el-form-item>

        <el-form-item label="商品描述:" :label-width="formLabelWidth">
          <div id="editor"></div>
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
// 引入富文本编辑器
import E from 'wangeditor';
//引入辅助性函数
import { mapGetters, mapActions } from "vuex";
import { getGoodsAdd, getGoodsInfo, getGoodsEdit } from "../../util/axios";
export default {
  data () {
    return {
      editor: null, // 定义一个编辑器变量
      //表单对象
      form: {
        isnew: 1,
        ishot: 1,
        first_cateid: '',//一级分类编号
        second_cateid: '',//二级分类编号
        goodsname: '',//商品名称
        price: '',//商品价格
        market_price: '',//市场价格
        specsid: '',//商品规格编号
        specsattr: '',//商品规格属性
        status: 1,//状态1正常2禁用
        img: '', //图片(文件，一般用于二级管理)
        description: '',// 商品描述
      },
      //label宽度
      formLabelWidth: "100px",
      //规则验证
      rules: {
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 2, max: 8, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        first_cateid: [
          { required: true, message: "请选择一级分类", trigger: "blur" },
        ],
        second_cateid: [
          { required: true, message: "请选择二级分类", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "商品价格必须为数字" }
        ],
        market_price: [
          { required: true, message: "请输入市场价格", trigger: "blur" },
          { type: "number", message: "商品价格必须为数字" }
        ],
        specsid: [
          { required: true, message: "请输入商品规格", trigger: "blur" },
        ],
        specsattr: [
          { required: true, message: "请输入规格属性", trigger: "blur" },
        ],
      },
      dialogVisible: false, //预览图片的弹框
      dialogImageUrl: '', // 预览图片的地址
      fileList: [], //文件上传列表
      imgUrl: '', //用于接收图片信息
      secondArr: [], // 二级分类数组
      attrArr: [] // 规格属性的数组
    };
  },
  computed: {
    //获取菜单列表
    ...mapGetters({
      cateList: "cate/getCateList",
      specsList: "specs/getSpecsList"
    })
  },
  mounted () {
    // 组件一加载就调取分类列表以及规格属性列表
    this.getCateList()
    this.getSpecsList()
  },
  props: ["addInfo"],
  methods: {
    // 表单弹框一打开，就加载富文本编辑器
    createEditor () {
      console.log('富文本被创建');
      //先实例化富文本
      this.editor = new E('#editor');
      // 调用富文本编辑器 create方法
      this.editor.create();
      // 设置内容 设置表单描述信息参数
      this.editor.txt.html(this.form.description);
      console.log(this.editor, '编辑器对象');
    },

    // 点击一级分类触发change事件
    changeCate (n) {
      // 逻辑：select是双向数据绑定，点击切换的时候，可以发现change事件的默认事件源，与双向数据绑定值相同,这个change是个false，我就去清空二级分类的双向数据绑定值，否则我就不清空绑定，为什么不清空？当获取数据的时候，表单之所以有数据就是通过v-model双向数据绑定获得的
      console.log(this.form.first_cateid, '一级分类id');
      console.log(n, 'whowhowho'); // false
      // findIndex 查找条件匹配的索引
      let index = this.cateList.findIndex((item, i) => {
        console.log(item, i, '每一项');
        console.log(item.id, 'item.id');
        // 如果相等，相当于return一个id
        return this.form.first_cateid == item.id;
      })
      console.log(index, '索引');
      console.log(this.cateList[index], 'this.cateList[index]');
      this.secondArr = this.cateList[index].children;
      console.log(this.secondArr, '二级分类数组');
      // 进行联动判空。如果选择了别的一级，那么清空上一次二级的选择值
      if (!n) {
        console.log("false来了");
        // 清空联动二级的双向数据绑定
        this.form.second_cateid = '';
      }
    },
    // 点击商品规格触发change事件
    changeSpecs (n) {
      // this.changePage(false)
      console.log(this.specsList,'this.specsList');
      console.log(n, 'specsid');
      console.log(this.form.specsid, 'this.form.specsid');
      let index = this.specsList.findIndex(
        item => this.form.specsid == item.id
      )
      this.attrArr = this.specsList[index].attrs;
      // 清空二级联动信息
      if (!n) {
        this.form.specsattr = []
      }
    },
    //onChange 当图片上传时触发的文件
    onChange (file) {
      console.log(file, "文件");
      this.imgUrl = file.raw;
    },
    //图片预览
    onPreview (file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片移除
    onRemove (file, fileList) { },
    //文件上传限制
    onExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    //封装重置事件
    reset () {
      this.form = {
        isnew: 1,
        ishot: 1,
        first_cateid:"",//一级分类编号
        second_cateid:"",//二级分类编号
        goodsname:"",//商品名称
        price:"",//商品价格
        market_price:"",//市场价格
        specsid:"",//商品规格编号
        specsattr:"",//商品规格属性
        status: 1,//状态1正常2禁用
        img:"", //图片(文件，一般用于二级管理)
        description:"",// 商品描述
      };
      // 图片列表清空
      this.fileList = [];
      // 二级分类
      this.secondArr = [];
      // 属性数组
      this.attrArr = [];
      // 清空规则验证，当关闭弹框时，可以调取清空验证规则函数resetFields()
      console.log(this.$refs["formDialog"]);
      this.$refs["formDialog"].resetFields();
    },
    //点击取消修改父组件弹框事件
    cancel () {
      this.$emit("cancel", false);
      //调用重置
      this.reset();
    },
    //调取行动
    ...mapActions({
      getGoodsList: "goods/getGoodsAction",
      getCateList: 'cate/getCateListAction',
      getSpecsList: 'specs/getSpecsAction1',
      getGoodsCount: 'goods/getCountAction',
      changePageAction:'goods/changePageAction',
      
    }),
    //添加事件
    add (formName) {

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.specsattr = this.form.specsattr ? this.form.specsattr.join(',') : "";
          // 重新获取图片地址
          this.form.img = this.imgUrl;
          // 给描述信息设置内容
          //添加逻辑
          console.log(this.form, "商品管理的表单信息1");
          // 将编辑器的内容设置成我的描述参数
          this.form.description = this.editor.txt.html();
          console.log(this.form, "商品管理的表单信息2");
          // 因为有上传文件，所以不能是普通表单对象，要是formdata
          let data = this.form;
          let file = new FormData();
          //必须通过append 去添加它的属性
          for (let i in data) {
            file.append(i, data[i]);
          }

          //调取添加接口
          getGoodsAdd(file).then(res => {
            console.log(res, "添加响应");
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              //重新获取列表
              this.getGoodsList();
              // 重新调取总条数
              this.getGoodsCount();
              
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
    },

    //封装一个查看一条数据的方法
    look (id) {
      //调取查看接口
      getGoodsInfo({ id }).then(res => {
        console.log(res, "获取一条数据");
        if (res.data.code == 200) {
          let data = res.data.list;
          this.form = data;
          // 当前表单没有id，创建一个id，给确定提交使用
          this.form.id = id;
          // 图片形式进行转化
          this.fileList = this.form.img ? [{ url: this.$imgUrl + this.form.img }] : [];
          // 点击打开弹窗，给图片列表赋值
          this.fileList = this.form.img ? [{ url: this.$imgUrl + this.form.img }] : [];
          // 点击打开弹窗，给属性值进行二次数据整合
          this.form.specsattr = this.form.specsattr ? this.form.specsattr.split(',') : [];
          // 重新调取change事件
          // this.changePage(false);
          this.changeCate(true);
          // 防止规格属性概率问题
          this.changeSpecs(true)
        } else {
          this.$message.error(res.data.msg)
        }
      });
    },
    //编辑确定事件
    update (formName) {
      console.log(this.form);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form.specsattr = this.form.specsattr ? this.form.specsattr.join(',') : "";
          // 重新获取图片地址
          this.form.img = this.imgUrl? this.imgUrl : '';
          // 将编辑器的内容设置成我的描述参数
          this.form.description = this.editor.txt.html();
          console.log(this.form, "商品管理的表单信息2");
          // 因为有上传文件，所以不能是普通表单对象，要是formdata
          let data = this.form;
          let file = new FormData();
          //必须通过append 去添加它的属性
          for (let i in data) {
            file.append(i, data[i]);
          }
          getGoodsEdit(file).then(
            res => {
              console.log(res, '修改的响应啊');
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                // 关闭弹框
                this.cancel();
                // 重新调取总条数
                this.getGoodsCount();
                // 重新获取列表
                this.getGoodsList();
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
