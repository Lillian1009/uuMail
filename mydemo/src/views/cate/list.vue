<template>
  <div>
    <el-table :data="cateList" border style="width: 100%" row-key="id" default-expand-all :tree-props="{ children: 'children' }">
      <el-table-column prop="id" label="分类编号" width="180">
      </el-table-column>
      <el-table-column prop="catename" label="分类名称" width="180">
      </el-table-column>

      <!-- 图片 -->
      <el-table-column prop="img" label="图片" width="230">
        <template slot-scope="item">
          <div>
            <img :src="$imgUrl+item.row.img" class="img">
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="180">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.status == 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="item">
          <div>
            <el-button type="info" plain @click='edit(item.row.id)'>编辑</el-button>
            <el-button @click='del(item.row.id)' type="danger" plain>删除</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//引入辅助性函数
import { mapActions, mapGetters } from 'vuex'
//引入封装好的接口
import { getCateDelete } from '../../util/axios'
export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapGetters({
      cateList: 'cate/getCateList'
    })
  },
  mounted () {
    //组件一加载触发行动
    this.getCateAction()
  },
  methods: {
    //获取行动
    ...mapActions({
      getCateAction: 'cate/getCateListAction'
    }),
    //封装一个删除事件
    del (id) {
      this.$confirm('确定要删除这一条数据吗？？？！！！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调取删除接口
        getCateDelete({ id })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg)
              //重新调取列表
              this.getCateAction()
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //封装一个编辑传id事件
    edit (id) {
      this.$emit('edit', id)
    }
  },
};
</script>

<style lang="" scoped>
.img {
  width: 100px;
  height: 100px;
}
</style>
