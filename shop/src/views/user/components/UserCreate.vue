<!-- -->
<template>
  <div class='container'>
    <el-dialog :title="userModel.title"
              :visible="userModel.visible"
              width="50%"
              @close="handleClose"
              @open="beforeOpen"
              :close-on-click-modal="false">
      <template v-if="userModel.types === 'create' || userModel.types === 'update'">
        <el-form :rules="rules" :model="userForm" ref="userForm" label-width="80px">
          <template v-if="userModel.types === 'create'">
            <el-form-item label="用户名:" prop='username'>
              <el-input v-model="userForm.username" clearable></el-input>
            </el-form-item>
          </template>
          <template v-if="userModel.types === 'update'">
            <el-form-item label="用户名:" prop='username'>
              <el-input v-model="userForm.username" clearable disabled></el-input>
            </el-form-item>
          </template>
          <template v-if="userModel.types === 'create'">
            <el-form-item label="密码:" prop="password">
              <el-input v-model="userForm.password" clearable></el-input>
            </el-form-item>
          </template>
          <el-form-item label="邮箱:" prop="email">
            <el-input v-model="userForm.email" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号:" prop="mobile">
            <el-input v-model="userForm.mobile" clearable></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button type="primary" @click="ok">确 定</el-button>
        </span>
      </template>
      <template v-else>
        <el-form :model="userInfo">
          <el-row :gutter="10">
            <el-col :span='12'>
              <el-form-item label="角色名称:">
                <p>{{userInfo.username}}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span='12'>
              <el-form-item label="角色名称:">
                <p>{{userInfo.role_name}}</p>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span='20'>
              <el-form-item label="分配新角色:">
                <el-select v-model="roleId" placeholder="请选择">
                  <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose" size="mini">取 消</el-button>
          <el-button type="primary" @click="ok" size="mini">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
export default {
  name: 'UserCreate',
  components: {},
  props: ['userModel'],
  data () {
    var checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('邮箱不能为空！'))
      } else {
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!reg.test(value)) {
          return callback(new Error('请输入正确的邮箱号！'))
        } else {
          callback()
        }
      }
    }
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空！'))
      } else {
        const reg = /^1[3456789]\d{9}$/
        if (!reg.test(value)) {
          return callback(new Error('请输入有效的手机号！'))
        } else {
          callback()
        }
      }
    }
    return {
      userForm: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 - 6 个字符之间！', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 - 12 个字符之间！', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          // { min: 3, max: 6, message: '长度在 3 - 6 个字符之间！', trigger: 'blur' }
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          // { pattern: /(^((\+86)|(86))?(1[3-9])\d{9}$)|(^(0\d{2,3})-?(\d{7,8})$)/, message: '输入的手机号码格式不正确，请重新输入', trigger: 'blur' }
          { validator: checkPhone, trigger: 'blur' }
        ]
      },
      userInfo: {},
      roleList: [],
      roleId: ''
    }
  },
  computed: {},
  methods: {
    handleClose () {
      this.$emit('userModel-cancel')
      if (this.userModel.types === 'create' || this.userModel.types === 'update') {
        this.$refs.userForm.clearValidate()
      } else {
        this.roleId = ''
      }
    },
    beforeOpen () {
      if (this.userModel.types === 'create') {
        this.userForm = {}
      } else if (this.userModel.types === 'update') {
        this.userForm = this.userModel.current
      } else {
        this.userInfo = this.userModel.current
        this.roleId = this.userInfo.role_name
        this.getRolesList()
      }
    },
    ok () {
      const self = this
      if (this.userModel.types === 'create' || this.userModel.types === 'update') {
        self.$refs.userForm.validate(valid => {
          if (!valid) {
            return 0
          } else {
            const data = {
              ...self.userForm
            }
            self.$emit('userModel-ok', self.userModel.types, data)
          }
        })
      } else {
        self.$emit('userModel-ok', self.userModel.types, this.userInfo, this.roleId)
      }
    },
    getRolesList () {
      api.getRoles().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取失败！')
        } else {
          this.roleList = res.data ? res.data : []
        }
      })
    }
  },
  created () {}
}
</script>

<style lang='scss' scoped>
</style>
