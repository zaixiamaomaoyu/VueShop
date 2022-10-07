<!-- -->
<template>
  <div class='container'>
    <el-dialog :title="roleModal.title"
              :visible="roleModal.visible"
              width="50%"
              @close="handleClose"
              @open="beforeOpen"
              :close-on-click-modal="false">
      <template v-if="roleModal.types === 'create' || roleModal.types === 'update'">
        <el-form :rules="rules" :model="roleFrom" ref="roleFrom" label-width="100px">
          <el-form-item label="角色名称:" prop="roleName">
            <el-input v-model="roleFrom.roleName" clearable></el-input>
          </el-form-item>
          <el-form-item label="角色描述:" prop="roleDesc">
            <el-input v-model="roleFrom.roleDesc" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="ok">确 定</el-button>
        </span>
      </template>
      <template v-else-if="roleModal.types === 'setRights'">
        <div style="height: 56vh;
                    overflow-y: auto;">
          <el-tree :data="rightsData"
                    ref='treeRef'
                  :props="defaultProps"
                  show-checkbox
                  node-key='id'
                  default-expand-all
                  :default-checked-keys='treeKeys'>
          </el-tree>
          <span slot="footer" class="dialog-footer" style="float: right; margin-right: 20px">
            <el-button @click="handleClose" size="mini">取 消</el-button>
            <el-button type="primary" @click="ok" size="mini">确 定</el-button>
          </span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
export default {
  name: 'RoleCreate',
  components: {},
  props: ['roleModal'],
  data () {
    return {
      roleFrom: {},
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 - 6 个字符之间！', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 6, max: 24, message: '长度在 6 - 24 个字符之间！', trigger: 'blur' }
        ]
      },
      rightsData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      treeKeys: []
    }
  },
  computed: {},
  methods: {
    handleClose () {
      this.$emit('roleCreate-cancel')
      if (this.roleModal.types === 'create' || this.roleModal.types === 'update') {
        this.$refs.roleFrom.clearValidate()
      } else {
        this.treeKeys = []
      }
    },
    ok () {
      if (this.roleModal.types === 'create' || this.roleModal.types === 'create') {
        this.$refs.roleFrom.validate(valid => {
          if (!valid) {
            return 0
          } else {
            console.log(this.roleFrom)
            const data = {
              ...this.roleFrom
            }
            this.$emit('roleCreate-ok', this.roleModal.types, data)
          }
        })
      } else {
        const data = {
          ...this.roleModal.current
        }
        this.$emit('roleCreate-ok', this.roleModal.types, data, this.$refs.treeRef)
      }
    },
    beforeOpen () {
      if (this.roleModal.types === 'create') {
        this.roleFrom = {}
      } else if (this.roleModal.types === 'update') {
        this.roleFrom = this.roleModal.current
      } else {
        this.getRightsTree()
        this.getLeafKeys(this.roleModal.current, this.treeKeys)
      }
    },
    getRightsTree () {
      api.getRightsByTree().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取权限列表失败!')
        } else {
          // this.$message({
          //   type: 'success',
          //   message: res.meta.msg
          // })
          this.rightsData = res.data ? res.data : []
          console.log(this.rightsData)
        }
      })
    },
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    }
  },
  created () {}
}
</script>

<style lang='scss' scoped>
</style>
