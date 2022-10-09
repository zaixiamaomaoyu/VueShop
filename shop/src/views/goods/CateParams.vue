<!-- -->
<template>
  <div class='container'>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-alert :closable='false' title="注意：只允许为第三级分类设置相关参数！" show-icon type="warning">
          </el-alert>
        </el-col>
      </el-row>
      <el-row>
        <el-col style="margin: 20px 0">
          <span>选择商品分类：</span>
          <el-cascader
              v-model="paramsKeys"
              :options="options"
              @change="handleChange"
              :props='paramsProps'
              clearable></el-cascader>
        </el-col>
      </el-row>
      <el-row>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="动态参数" name="many">
            <el-row>
              <el-col>
                <el-button :disabled='isDisable' type="primary" size="mini" @click="addClick('params')">添加参数</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-table :data="paramData"
                          border
                          stripe>
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag closable v-for="(item, index) in scope.row.attr_vals"
                              :key='index'
                              @close="handleClose(scope.row, index)">
                        {{item}}
                      </el-tag>
                      <el-input
                        style="width: 100px"
                        class="input-new-tag"
                        v-if="scope.row.inputVisible"
                        v-model="scope.row.inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm(scope.row)"
                        @blur="handleInputConfirm(scope.row)"
                      >
                      </el-input>
                      <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">
                        + New Tag
                      </el-button>
                    </template>
                  </el-table-column>
                  <el-table-column type="index"></el-table-column>
                  <el-table-column align="center" header-align="center" prop="attr_name" label="参数名称"></el-table-column>
                  <el-table-column align="center" header-align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="small" icon="el-icon-edit" @click="editClick(scope.row, 'params')">编辑</el-button>
                      <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteClick(scope.row, 'params')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-row>
              <el-col>
                <el-button :disabled='isDisable' type="primary" size="mini" @click="addClick('attr')">添加属性</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col>
                <el-table :data="attrData"
                          border
                          stripe>
                  <el-table-column type="expand">
                    <template slot-scope="scope">
                      <el-tag closable
                              v-for="(item, index) in scope.row.attr_vals"
                              :key='index'
                              @close='handleClose(scope.row, index)'>
                        {{item}}
                      </el-tag>
                        <el-input
                          style="width: 100px"
                          class="input-new-tag"
                          v-if="scope.row.inputVisible"
                          v-model="scope.row.inputValue"
                          ref="saveTagInput"
                          size="small"
                          @keyup.enter.native="handleInputConfirm(scope.row)"
                          @blur="handleInputConfirm(scope.row)"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column type="index"></el-table-column>
                  <el-table-column align="center" header-align="center" prop="attr_name" label="属性名称"></el-table-column>
                  <el-table-column align="center" header-align="center" label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="small" icon="el-icon-edit" @click="editClick(scope.row, 'attr')">编辑</el-button>
                      <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteClick(scope.row, 'attr')">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-row>
    </el-card>
    <params-create :paramsModal='paramsModal'
                    @paramsModal-cancel='paramsModalCancel'
                    @paramsModal-ok='paramsModalOk'></params-create>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
import ParamsCreate from './component/ParamsCreate.vue'
export default {
  name: 'CateParams',
  components: {
    ParamsCreate
  },
  props: {},
  data () {
    return {
      activeName: 'many',
      paramsKeys: [],
      options: [],
      paramsProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      paramData: [],
      attrData: [],
      paramsModal: {
        title: '',
        visible: false,
        current: {},
        types: ''
      },
      inputVisible: false,
      inputValue: ''
    }
  },
  computed: {
    cateId: function () {
      if (this.paramsKeys.length === 3) {
        return this.paramsKeys[2]
      } else {
        return false
      }
    },
    isDisable: function () {
      if (this.paramsKeys.length === 3) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    getParamsList () {
      api.getCateList({
        type: 3
      }).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取失败！')
        } else {
          this.options = res.data ? res.data : []
        }
      })
    },
    getCategoriesList () {
      api.getCategories(this.cateId, {
        sel: this.activeName
      }).then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('请先选择第三级商品分类！')
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          item.inputVisible = false
          item.inputValue = ''
        })
        if (this.activeName === 'many') {
          this.paramData = res.data ? res.data : []
        } else {
          this.attrData = res.data ? res.data : []
        }
      })
    },
    handleChange () {
      // const catId = this.paramsKeys[this.paramsKeys.length - 1]
      if (this.paramsKeys.length === 3) {
        this.getCategoriesList()
      } else {
        this.paramData = []
        this.attrData = []
      }
    },
    handleClick () {
      this.getCategoriesList()
    },
    addClick (val) {
      this.paramsModal = {
        visible: true,
        current: {},
        types: 'create'
      }
      if (val === 'params') {
        this.paramsModal.title = '添加动态参数'
        this.paramsModal.activeName = 'many'
      } else {
        this.paramsModal.title = '添加静态属性'
        this.paramsModal.activeName = 'only'
      }
    },
    editClick (val, type) {
      this.paramsModal = {
        visible: true,
        current: val,
        types: 'update'
      }
      if (type === 'params') {
        this.paramsModal.title = '编辑动态参数'
        this.paramsModal.activeName = 'many'
      } else {
        this.paramsModal.title = '编辑静态属性'
        this.paramsModal.activeName = 'only'
      }
    },
    deleteClick (val, type) {
      this.$confirm('此操作将永久删除改选项，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (type === 'params') {
          api.deletePaOrAttr(val).then(res => {
            if (res.meta.status !== 200) {
              this.$message({
                type: 'error',
                message: res.meta.msg
              })
            } else {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
              this.getCategoriesList()
              this.paramsModal.visible = false
            }
          })
        }
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    paramsModalCancel () {
      this.paramsModal = {
        title: '',
        types: '',
        visible: false,
        current: {}
      }
    },
    paramsModalOk (data, type, activeName) {
      if (type === 'create') {
        api.addPaOrAttr(this.cateId, {
          ...data,
          attr_sel: this.activeName
        }).then(res => {
          if (res.meta.status !== 201) {
            this.$message({
              type: 'error',
              message: res.meta.msg
            })
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.getCategoriesList()
            this.paramsModal.visible = false
          }
        })
      } else {
        api.editPaOrAttr(data).then(res => {
          if (res.meta.status !== 200) {
            this.$message({
              type: 'error',
              message: res.meta.msg
            })
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.getCategoriesList()
            this.paramsModal.visible = false
          }
        })
      }
    },
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return 0
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputVisible = false
      row.inputValue = ''
      this.getEditPaOrAttr(row)
    },
    getEditPaOrAttr (row) {
      api.editPaOrAttr(row, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }).then(res => {
        if (res.meta.status !== 200) {
          console.log(res.meta.msg)
          this.$message({
            type: 'error',
            message: res.meta.msg
          })
        } else {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
      })
    },
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (val, index) {
      val.attr_vals.splice(index, 1)
      this.getEditPaOrAttr(val)
    }
  },
  created () {
    this.getParamsList()
  }
}
</script>

<style lang='scss' scoped>
  .el-tag {
    margin: 10px;
  }
</style>
