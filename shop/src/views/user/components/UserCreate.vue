<!-- -->
<template>
  <div class='container'>
    <el-dialog :title="userModel.title"
              :visible="userModel.visible"
              width="50%"
              @close="handleClose"
              @open="beforeOpen"
              :close-on-click-modal="false">
      <template>
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
    </el-dialog>
  </div>
</template>

<script>
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
      }
    }
  },
  computed: {},
  methods: {
    handleClose () {
      this.$emit('userModel-cancel')
      this.$refs.userForm.clearValidate()
    },
    beforeOpen () {
      if (this.userModel.types === 'create') {
        this.userForm = {}
      } else {
        this.userForm = this.userModel.current
        console.log(this.userForm)
        console.log(this.userModel)
      }
    },
    ok () {
      const self = this
      self.$refs.userForm.validate(valid => {
        if (!valid) {
          return 0
        } else {
          const data = {
            ...self.userForm
          }
          console.log(data)
          self.$emit('userModel-ok', self.userModel.types, data)
        }
      })
    }
  },
  created () {}
}
</script>

<style lang='scss' scoped>
</style>
