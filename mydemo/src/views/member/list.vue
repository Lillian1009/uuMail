<template>
  <div>
    <el-table :data="memberList" border style="width: 100%">
      <el-table-column prop="uid" label="用户编号" width="180">
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="status" label="状态">
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
            <el-button type="info" plain @click='edit(item.row.uid)'>编辑</el-button>
            <!-- <el-button @click='del(item.row.uid)' type="danger" plain>删除</el-button> -->
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
import { getMemberDelete } from '../../util/axios'
export default {
  data () {
    return {
    };
  },
  computed: {
    ...mapGetters({
      memberList: 'member/getMemberList',
    })
  },
  mounted () {
    //组件一加载触发行动
    // 调取用户列表
    this.getMemberAction();
  },
  methods: {
    //获取行动
    ...mapActions({
      getMemberAction: 'member/getMemberAction',
    }),
    //封装一个删除事件
    // del (uid) {
    //   this.$confirm('确定要删除这一条数据吗？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     //调取删除接口
    //     getMemberDelete({ uid })
    //       .then(res => {
    //         if (res.data.code == 200) {
    //           this.$message.success(res.data.msg)
    //           //重新调取列表
    //           this.getMemberAction()
    //         }
    //       })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     });
    //   });
    // },
    //封装一个编辑传id事件
    edit (uid) {
      this.$emit('edit', uid)
    }
  },
};
</script>

<style lang="" scoped>

</style>
