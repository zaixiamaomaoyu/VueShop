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
        <el-col style="margin-bottom: 20px">
          <el-button type="primary" size="small" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <tree-table :data='treeData'
                      :columns='treeColumns'
                      :selection-type='false'
                      :expand-type='false'
                      show-index
                      border
                      index-text='#'
                      :max-height='tableHeight'>
            <template slot="isOk" slot-scope="scope">
              <i v-if="scope.row.cat_deleted === false" class="el-icon-circle-check" style="color: lightgreen"></i>
              <i v-else class="el-icon-circle-close" style="color: red"></i>
            </template>
            <template slot="order" slot-scope="scope">
              <el-tag type="primary" size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
              <el-tag type="warning" size="mini" v-else>三级</el-tag>
            </template>
            <template slot="opera" slot-scope="scope">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editClick(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-edit" @click="deleteClick(scope.row)">删除</el-button>
            </template>
          </tree-table>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <el-pagination
            style="float: right; margin-top: 20px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryInfo.pagenum"
            :page-sizes="[2, 5, 10, 20]"
            :page-size="queryInfo.pagesize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-card>
    <cate-create :cateModal='cateModal'
                  @cateModal-cancel='cateModalCancel'
                  @cateModal-ok='cateModalOk'></cate-create>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
import CateCreate from './component/CateCreate.vue'
export default {
  name: 'GoodsCate',
  components: {
    CateCreate
  },
  props: {},
  data () {
    return {
      treeData: [],
      queryInfo: {
        type: '3',
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      treeColumns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          align: 'center',
          headerAlign: 'center'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          prop: 'cat_level',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          // prop: 'cat_level',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'opera'
        }
      ],
      blankHeight: 520,
      cateModal: {
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
    getTreeData () {
      api.getCateList(this.queryInfo).then(res => {
        if (res.meta.status !== 200) {
          this.$message({
            type: 'error',
            message: res.meta.msg
          })
        } else {
          console.log(res)
          this.treeData = res.data && res.data.result ? res.data.result : []
          this.total = res.data.total
        }
      })
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getTreeData()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getTreeData()
    },
    addCate () {
      this.cateModal = {
        title: '添加分类',
        current: {},
        visible: true,
        types: 'create'
      }
    },
    cateModalCancel () {
      this.cateModal = {
        title: '',
        current: {},
        visible: false,
        types: ''
      }
    },
    editClick (val) {
      this.cateModal = {
        title: '编辑',
        current: val,
        visible: true,
        types: 'update'
      }
    },
    deleteClick (val) {
      this.$confirm('此操作将会永久删除改分类，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        api.deleteCate(val).then(res => {
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
            this.cateModal.visible = false
            this.getTreeData()
          }
        })
      }).catch(() => {
        this.$message.info('已取消删除！')
      })
    },
    cateModalOk (type, data) {
      if (type === 'create') {
        api.addCate(data).then(res => {
          if (res.meta.status !== 201) {
            this.$message.error('添加失败！')
          } else {
            this.$message({
              type: 'success',
              message: res.meta.msg
            })
            this.getTreeData()
            this.cateModal.visible = false
          }
        })
      } else {
        api.editCate(data).then(res => {
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
            this.getTreeData()
            this.cateModal.visible = false
          }
        })
      }
    }
  },
  created () {
    this.getTreeData()
  }
}
</script>

<style lang='scss' scoped>
</style>
