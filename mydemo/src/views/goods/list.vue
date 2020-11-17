<template>
  <div>
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column prop="id" label="商品编号" width="80">
      </el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="130">
      </el-table-column>
      <el-table-column prop="price" label="商品价格" width="80">
      </el-table-column>
      <el-table-column prop="market_price" label="市场价格" width="80">
      </el-table-column>

      <!-- 图片 -->
      <el-table-column prop="img" label="图片" width="230">
        <template slot-scope="item">
          <div>
            <img :src="$imgUrl+item.row.img" class="img">
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="是否新品" width="80">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.isnew == 1" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column  label="是否热卖" width="80">
        <template slot-scope="item">
          <div>
            <el-tag v-if="item.row.ishot == 1" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="100">
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
    <el-pagination :page-size='goodsSize' background layout="prev, pager, next" :total="goodsCount" @current-change='currentChange'>
    </el-pagination>
  </div>
</template>

<script>
//引入辅助性函数
import { mapActions, mapGetters } from 'vuex'
//引入封装好的接口
import { getGoodsDelete } from '../../util/axios'
export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapGetters({
      goodsList: 'goods/getGoodsList',
      goodsCount: 'goods/getGoodsCount',
      goodsSize: 'goods/getGoodsSize'
    })
  },
  mounted () {
    //组件一加载触发行动
    this.getGoodsAction(),
    //调取总条数
    this.getCountAction()
  },
  methods: {
    //获取行动
    ...mapActions({
      getGoodsAction: 'goods/getGoodsAction',
      getCountAction:'goods/getCountAction',
      changePage:'goods/changePageAction'
    }),
    //封装一个删除事件
    del (id) {
      this.$confirm('确定要删除这一条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调取删除接口
        getGoodsDelete({ id })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg)
              //重新调取列表
              this.getGoodsAction()
              this.getCountAction()
              
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
    },
    //封装一个切换页码的事件
    currentChange (e) {
      console.log(e, '当前页')
      this.changePage(e)
    }
  },
};
</script>

<style lang="" scoped>
.img {
  width: 100px;
  height: 100px;
}
/* 分页样式 */
.el-pagination {
  float: right;
  margin: 20px 35px 0 0;
}
</style>
