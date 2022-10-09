<!-- -->
<template>
  <div class='container'>
    <el-dialog :title='paramsModal.title'
                :visible='paramsModal.visible'
                @close="handleClose"
                @open="beforeOpen"
                :close-on-click-modal="false">
      <template>
        <el-form ref="paramsRef" :model="paramsForm" :rules="rules" label-width="100px">
          <template v-if="paramsModal.activeName === 'many'">
            <el-form-item label="动态参数:" prop="attr_name">
              <el-input placeholder="请输入动态参数" v-model="paramsForm.attr_name" clearable></el-input>
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="静态属性:" prop="attr_name">
              <el-input placeholder="请输入动态参数" v-model="paramsForm.attr_name" clearable></el-input>
            </el-form-item>
          </template>
        </el-form>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="small">取 消</el-button>
        <el-button type="primary" @click="ok" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ParamsCreate',
  components: {},
  props: ['paramsModal'],
  data () {
    return {
      paramsForm: {},
      rules: {
        attr_name: [
          { required: true, message: '请输入动态参数', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  methods: {
    handleClose () {
      this.$emit('paramsModal-cancel')
      if (this.$refs.paramsRef) {
        this.$refs.paramsRef.resetFields()
      }
    },
    beforeOpen () {
      if (this.paramsModal.types === 'update') {
        this.paramsForm = JSON.parse(JSON.stringify(this.paramsModal.current))
        console.log(this.paramsForm)
      }
    },
    ok () {
      this.$refs.paramsRef.validate(valid => {
        if (!valid) {
          return 0
        } else {
          const data = {
            ...this.paramsForm
          }
          const type = this.paramsModal.types
          const activeName = this.paramsModal.activeName
          this.$emit('paramsModal-ok', data, type, activeName)
        }
      })
    }
  },
  created () {}
}
</script>

<style lang='scss' scoped>
</style>
