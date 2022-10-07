<!-- -->
<template>
  <div class='login_container'>
    <div class="login_box">
      <div class="login_avater">
        <img src="~assets/image/logo.png" alt="">
        <h4>电商管理系统</h4>
      </div>
      <div class="login_form">
        <el-form ref="loginRef" :model='loginForm' label-width='90px' :rules='rules'>
          <!-- <el-row :gutter='20'>
            <el-col :span='22'> -->
              <el-form-item label='用户名' prop='username'>
                <el-input type="text" prefix-icon="iconfont icon-user" clearable v-model='loginForm.username'></el-input>
              </el-form-item>
            <!-- </el-col>
          </el-row> -->
          <!-- <el-row :gutter='20'>
            <el-col :span='22'> -->
              <el-form-item label='密码' prop='password'>
                <el-input type="password" prefix-icon="iconfont icon-3702mima" clearable v-model='loginForm.password'></el-input>
              </el-form-item>
            <!-- </el-col>
          </el-row> -->
          <!-- <el-row :gutter='20'> -->
            <el-form-item class="btns">
              <el-button type='primary' @click="login">登录</el-button>
              <el-button type='info' @click="reset">重置</el-button>
            </el-form-item>
          <!-- </el-row> -->
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    login () {
      const self = this
      self.$refs.loginRef.validate(valid => {
        if (!valid) {
          return 0
        } else {
          api.getLogin(self.loginForm).then(res => {
            if (res.meta.status !== 200) {
              self.$message.error('登录失败！')
            } else {
              self.$message.success('登录成功！')
              window.sessionStorage.setItem('token', res.data.token)
              self.$router.push('/home')
            }
          })
        }
      })
    },
    reset () {
      this.$refs.loginRef.resetFields()
    }
  },
  created () {}
}
</script>

<style lang='scss' scoped>
  .login_container {
    height: 100%;
    background-color: #2b4b6b;
    // position: relative;

    .login_box {
      width: 480px;
      height: 320px;
      background-color: #fff;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);

      .login_avater {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        border: 1px solid #eee;
        padding: 6px;
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        background-color: #fff;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;

        img {
          width: 100%;
          border-radius: 50%;
          background-color: #eee;
        }
        h4 {
          font-size: 20px;
          color: rgb(100, 95, 95);
          margin: 10px 0 0;
        }
      }
      .login_form {
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;

        .btns {
          float: right;
        }
      }
    }
  }
</style>
