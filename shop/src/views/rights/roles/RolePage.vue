<!-- -->
<template>
  <div class='container'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addRole" size="small">添加角色</el-button>
      <el-table :data="tableData"
              style="width: 100%"
              border
              stripe
              highlight-current-row
              :height="tableHeight">
      <el-table-column type='expand' align="center" width="60px">
        <template slot-scope="scope">
          <!-- <pre>{{scope.row}}</pre> -->
          <el-row v-for="(item1, index1) in scope.row.children"
                  :key='index1'
                  :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']">
            <el-col :span="5">
              <el-tag closable @close='deleteRolebyid(scope.row, item1.id)'>{{item1.authName}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row v-for="(item2, index2) in item1.children"
                      :key='index2'
                      :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']">
                <el-col :span="6">
                  <el-tag type="success" closable @close='deleteRolebyid(scope.row, item2.id)'>{{item2.authName}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag v-for="(item3, index3) in item2.children" :key='index3' type="warning" closable @close='deleteRolebyid(scope.row, item3.id)'>{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type='index' align="center" width="60px"></el-table-column>
      <el-table-column align="center" header-align="center" prop="roleName" label="角色名称"></el-table-column>
      <el-table-column align="center" header-align="center" prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column align="center" header-align="center" label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top-start">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteClick(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="权限设置" placement="top-start">
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    </el-card>
    <role-create :roleModal='roleModal'
                @roleCreate-cancel='roleCreateCancel'
                @roleCreate-ok='roleCreateOk'></role-create>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
import RoleCreate from './components/RoleCreate.vue'
export default {
  name: 'RolePage',
  components: {
    RoleCreate
  },
  props: {},
  data () {
    return {
      tableData: [],
      blankHeight: 250,
      roleModal: {
        title: '',
        visible: false,
        current: {},
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
    getRolesList () {
      api.getRoles().then(res => {
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('获取角色列表失败！')
        } else {
          this.tableData = res.data ? res.data : []
        }
      })
    },
    addRole () {
      this.roleModal = {
        title: '添加角色',
        visible: true,
        current: {},
        types: 'create'
      }
    },
    roleCreateCancel () {
      this.roleModal = {
        title: '',
        visible: false,
        current: {},
        types: ''
      }
    },
    roleCreateOk (type, data, treeRef) {
      if (type === 'create') {
        api.addRoles(data).then(res => {
          if (res.meta.status !== 201) {
            this.$message.error('创建失败！')
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.roleModal.visible = false
            this.getRolesList()
          }
        })
      } else if (type === 'update') {
        api.editRoles(data).then(res => {
          if (res.meta.status !== 200) {
            this.$message.error('更新失败！')
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.roleModal.visible = false
            this.getRolesList()
          }
        })
      } else {
        const key = [
          ...treeRef.getCheckedKeys(),
          ...treeRef.getHalfCheckedKeys()
        ]
        // console.log(key)
        const str = key.join(',')
        api.setRoles(data.id, { rids: str }).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.roleModal.visible = false
            this.getRolesList()
          } else {
            this.$message({
              type: 'error',
              message: res.meta.msg
            })
          }
        })
      }
    },
    deleteRolebyid (role, rightId) {
      this.$confirm('此操作将会永久删除该角色，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteRoleById(role.id, rightId).then(res => {
          console.log(res)
          if (res.meta.status === 200) {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            // this.getRolesList()
            role.children = res.data
          } else {
            this.$message.error('取消权限失败！')
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    editClick (val) {
      this.roleModal = {
        title: '编辑角色',
        visible: true,
        current: val,
        types: 'update'
      }
    },
    deleteClick (val) {
      this.$confirm('此操作将会永久删除该角色，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteRoles(val.id).then(res => {
          if (res.meta.status !== 200) {
            this.$message.error('删除失败！')
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.getRolesList()
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    setRole (val) {
      this.roleModal = {
        title: '分配权限',
        visible: true,
        current: val,
        types: 'setRights'
      }
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang='scss' scoped>
  .el-tag {
    margin: 5px 10px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
