<!-- -->
<template>
  <div class='container'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="tableData"
              style="width: 100%"
              border
              stripe
              highlight-current-row
              :height="tableHeight">
      <el-table-column type='index' align="center" width="60px"></el-table-column>
      <el-table-column align="center" header-align="center" prop="authName" label="权限名称"></el-table-column>
      <el-table-column align="center" header-align="center" prop="path" label="路径"></el-table-column>
      <el-table-column align="center" header-align="center" prop="level" label="权限等级">
        <template slot-scope="scope">
          <span v-if="scope.row.level === '0'"><el-tag>一级</el-tag></span>
          <span v-else-if="scope.row.level === '1'"><el-tag type="success">二级</el-tag></span>
          <span v-else><el-tag type="warning">三级</el-tag></span>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
export default {
  name: 'RightPage',
  components: {},
  props: {},
  data () {
    return {
      tableData: [],
      blankHeight: 220
    }
  },
  computed: {
    tableHeight: function () {
      return document.documentElement.clientHeight - this.blankHeight
    }
  },
  methods: {
    getRightsList () {
      api.getRights().then(res => {
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('获取权限列表失败！')
        } else {
          this.tableData = res.data ? res.data : []
        }
      })
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>

<style lang='scss' scoped>
</style>
