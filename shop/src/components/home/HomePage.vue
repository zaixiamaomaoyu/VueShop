<!-- -->
<template>
  <div class='container'>
    <el-container>
      <el-header>
        <div class="title">
          <img src="~assets/image/heima.png" alt="">
          <h4>电商管理系统</h4>
        </div>
        <div class="btns">
          <el-button type="info" size="mini" @click="exit">退出</el-button>
        </div>
      </el-header>
      <el-container>
        <el-aside :width="iscollapse ? '64px' : '200px'">
          <div class="toggle-button" @click="toggleClick">|||</div>
          <el-menu :default-active="activePath"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#4489EB"
                unique-opened
                router
                :collapse='iscollapse'
                :collapse-transition='false'>
            <el-submenu :index="item1.path + ''"
                        v-for="item1 in menusList"
                        :key='item1.id'>
              <template slot="title">
                <i :class="iconLists[item1.id]"></i>
                <span>{{item1.authName}}</span>
              </template>
              <el-menu-item :index="item2.path + ''"
                            v-for="item2 in item1.children"
                            :key='item2.id'
                            @click="changeItem('/'+item2.path)">
                {{item2.authName}}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import api from '@/api/apiMethods'
export default {
  name: 'HomePage',
  components: {},
  props: {},
  data () {
    return {
      menusList: [],
      iconLists: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activePath: '/users',
      iscollapse: false
    }
  },
  computed: {},
  methods: {
    exit () {
      this.$router.push('/login')
      window.sessionStorage.clear()
      this.$message.success('已退出登录~')
    },
    getList () {
      api.getMenusList().then(res => {
        if (res.meta.status !== 200) {
          this.$message.error('获取菜单列表失败！')
        } else {
          this.menusList = res.data
          console.log(this.menusList)
        }
      })
    },
    toggleClick () {
      this.iscollapse = !this.iscollapse
    },
    changeItem (path) {
      console.log(path)
      window.sessionStorage.setItem('activePath', path)
      // this.activePath = path
    }
  },
  created () {
    this.getList()
    // for (var k in this.iconLists) {
    //   console.log(k)
    //   console.log(this.iconLists[k])
    // }
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang='scss' scoped>
  .container {
    height: 100%;
    .el-container {
      height: 100%;
      .el-header {
        background-color: #363D40;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 5px;
        .title {
          display: flex;
          justify-content: space-around;
          align-items: center;

          h4 {
            margin-left: 10px;
            color: rgb(252, 242, 242);
          }
        }
      }

      .el-container {
        .el-aside {
          background-color: #343642;
          .toggle-button {
            text-align: center;
            color: #fff;
            background-color: #4a5064;
            letter-spacing: 0.2rem;
            cursor: pointer;
          }
          .el-menu {
            border-right: 0px;
            .el-submenu {
              i {
                margin-right: 8px;
              }
              .el-menu-item {

              }
            }
          }
        }
      }
    }
  }
</style>
