<!-- -->
<template>
  <div class='container'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter='20'>
        <el-col :span="12" style="padding: 0">
          <el-input v-model="userList.query" clearable @clear='getUsers'>
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-table :data="tableData"
                  style="width: 100%"
                  border
                  stripe
                  :height="tableHeight">
          <el-table-column header-align='center' align='center' label="姓名" prop="username"></el-table-column>
          <el-table-column header-align='center' align='center' label="邮箱" prop="email"></el-table-column>
          <el-table-column header-align='center' align='center' label="电话" prop="mobile"></el-table-column>
          <el-table-column header-align='center' align='center' label="角色" prop="role_name"></el-table-column>
          <el-table-column header-align='center' align='center' label="状态" prop="mg_state">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change='stateChange(scope.row)'></el-switch>
            </template>
          </el-table-column>
          <el-table-column width="200px" label="操作" header-align='center' align='center'>
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteClick(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="设置" placement="top-start">
                <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="userList.pagenum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="userList.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="float: right">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <user-create :userModel='userModel'
                @userModel-cancel='userModelCancel'
                @userModel-ok='userModelOk'></user-create>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
import UserCreate from './components/UserCreate'
export default {
  name: 'UserPage',
  components: {
    UserCreate
  },
  props: {},
  data () {
    return {
      tableData: [],
      userList: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      blankHeight: 290,
      userModel: {
        title: '',
        current: {},
        visible: false,
        types: ''
      }
    }
  },
  computed: {
    tableHeight: function () {
      return document.documentElement.clientHeight - this.blankHeight
    }
  },
  methods: {
    getUsers () {
      api.getUsersList(this.userList).then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data && res.data.users ? res.data.users : []
          this.total = res.data.total
        }
      })
    },
    handleSizeChange (val) {
      this.userList.pagesize = val
      this.getUsers()
    },
    handleCurrentChange (val) {
      this.userList.pagenum = val
      this.getUsers()
    },
    stateChange (row) {
      api.getUserStatus(row).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        } else {
          this.$message.error('设置状态失败~')
        }
      })
    },
    // 添加用户
    addUser () {
      this.userModel = {
        title: '添加用户',
        current: {},
        visible: true,
        types: 'create'
      }
    },
    userModelCancel () {
      this.userModel = {
        title: '',
        current: {},
        visible: false,
        types: ''
      }
    },
    userModelOk (type, data) {
      if (type === 'create') {
        api.addUser(data).then(res => {
          if (res.meta.status !== 201) {
            this.$message.error('添加用户失败！')
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.getUsers()
            this.userModel.visible = false
          }
        })
      } else if (type === 'update') {
        api.updateUser(data).then(res => {
          console.log(res)
          if (res.meta.status !== 200) {
            this.$message.error('更新失败！')
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.getUsers()
            this.userModel.visible = false
          }
        })
      }
    },
    editClick (val) {
      this.userModel = {
        title: '编辑用户',
        current: val,
        visible: true,
        types: 'update'
      }
    },
    deleteClick (row) {
      this.$confirm('此操作将永久删除该用户，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteUser(row.id).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.getUsers()
          } else {
            this.$message.error('删除失败！')
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    }
  },
  created () {
    this.getUsers()
  }
}
</script>

<style lang='scss' scoped>
</style>
