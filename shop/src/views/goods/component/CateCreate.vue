<!-- -->
<template>
  <div class='container'>
    <el-dialog :title="cateModal.title"
              :visible="cateModal.visible"
              width="50%"
              @close="handleClose"
              @open="beforeOpen"
              :close-on-click-modal="false">
      <template>
        <el-form ref="cateRef" :model="cateForm" :rules="rules" label-width="100px">
          <el-row :gutter="10">
            <el-col :span='18'>
              <el-form-item label="分类名称:" prop="cat_name">
                <el-input v-model="cateForm.cat_name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span='18'>
              <el-form-item label="父级分类:">
                <el-cascader
                    v-model="parentSelectId"
                    :options="parentsCateList"
                    :props='parentProps'
                    clearable
                    @change='handleChange'>
                </el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
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
import api from '@/api/apiMethods'
export default {
  name: 'CateCreate',
  components: {},
  props: ['cateModal'],
  data () {
    return {
      cateForm: {
        cat_pid: 0,
        cat_level: 0
      },
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentSelectId: [],
      parentsCateList: [],
      parentProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  computed: {},
  methods: {
    handleClose () {
      this.$emit('cateModal-cancel')
      this.$refs.cateRef.clearValidate()
      this.parentSelectId = []
      this.cateForm.cat_pid = 0
      this.cateForm.cat_level = 0
    },
    beforeOpen () {
      this.getList()
      if (this.cateModal.types === 'create') {
        this.cateForm = {}
      } else {
        this.cateForm = JSON.parse(JSON.stringify(this.cateModal.current))
        console.log(this.cateModal)
        this.parentSelectId.push(this.cateForm.cat_pid)
      }
    },
    ok () {
      this.$refs.cateRef.validate(valid => {
        if (!valid) {
          return 0
        } else {
          const data = {
            ...this.cateForm,
            cat_pid: this.cateForm.cat_pid,
            cat_level: this.cateForm.cat_level
          }
          console.log(data)
          this.$emit('cateModal-ok', this.cateModal.types, data)
        }
      })
    },
    getList () {
      api.getCateList({
        type: 2
      }).then(res => {
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('获取失败！')
        } else {
          this.parentsCateList = res.data ? res.data : []
        }
      })
    },
    handleChange () {
      if (this.parentSelectId.length > 0) {
        this.cateForm.cat_pid = this.parentSelectId[this.parentSelectId.length - 1]
        this.cateForm.cat_level = this.parentSelectId.length
        console.log(this.cateForm)
      } else {
        this.cateForm.cat_pid = 0
        this.cateForm.cat_level = 0
        console.log(this.cateForm)
      }
      console.log(this.parentSelectId)
    }
  },
  created () {}
}
</script>

<style lang='scss' scoped>
  .el-cascader {
    width: 100%;
  }
</style>
