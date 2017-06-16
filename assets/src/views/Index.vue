<style lang='scss' rel='stylesheet/scss'>
    @import "../utils/mixins/mixins";

    .index-container {
        background: #d9e0e7;

        @media (max-width: 767px) {
            .header-wap {
                display: block;
            }
            .header-pc {
                display: none;
            }
            .wap-header {
                border-bottom: 1px solid #ededed;
            }
        }

        @media (min-width: 768px) {
            .header-wap {
                display: none;
            }
            .header-pc {
                display: block;
            }
        }

        .header {
            height: 55px;
            line-height: 55px;
            text-align: center;
            z-index: 11;
            background: #fff;

            .logo {
                text-align: left;
                padding-left: 28px;
                > * {
                    display: inline-block;
                    vertical-align: middle;
                }
                img {
                    width: 30px;
                    height: 30px;
                }

                h1 {
                    font-size: 16px;
                    font-weight: normal;
                }
            }

            // 右边部分
            @at-root {
                .header-right {
                    text-align: right;

                    > * {
                        text-align: center;
                        display: inline-block;

                        > em {
                            display: inline-block;
                            vertical-align: middle;
                        }
                    }

                    // 问题反馈
                    .feedback {
                        cursor: pointer;
                        margin: 0 5px 0 15px
                    }

                    @at-root {
                        .feedback-dropdown {
                            top: 35px !important;
                            width: 120px;
                        }
                    }

                    .nickname {
                        cursor: pointer;
                        margin-right: 30px;
                        img {
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                            vertical-align: middle;
                            margin-right: 2px;
                        }
                    }

                    @at-root {
                        .nickname-dropdown {
                            top: 35px !important;
                            width: 160px;
                        }
                    }
                }
            }
        }

        .content {
            @media (max-width: 767px) {
                margin-top: 55px;
            }

            .left-menu-container {
                width: 220px;
                z-index: 10;
                /*height: 100%;*/
                /*overflow-y: auto;*/
                transition: all 300ms ease;
                transform: translateX(0);

                // 左边菜单的样式
                .el-menu-item, .el-submenu__title {
                    height: 40px;
                    line-height: 40px;
                    font-size: 14px;
                }
                @media (max-width: 767px) {
                    transform: translateX(-100%);
                    top: -55px;
                    z-index: 12;
                }

                > div.nav-title {
                    font-size: 14px;
                    color: #999;
                    margin: 12px 20px 0;
                }

                &.isShowMenue {
                    transform: translateX(0);
                }
            }

            .index-right-content {
                position: absolute;
                padding: 75px 20px 20px 240px;
                width: 100%;
                background: #d9e0e7;
                min-height: 100%;
                top: 0;
                height: 100%;
                overflow: auto;
                @media (max-width: 767px) {
                    padding: 75px 20px 20px;
                    position: absolute;
                    /*top: 110px;*/
                }

                .back-btn {
                    cursor: pointer;
                    color: #58B7FF;
                    &:hover {
                        text-decoration: underline;
                    }
                }

                .right-title {
                    font-size: 24px;
                    margin-bottom: 15px;
                    > small {
                        font-weight: 300;
                        font-size: 70%;
                        display: inline-block;
                    }
                }
            }
        }
    }

</style>

<template>
    <article class="index-container">
        <!--头部部分 pc端-->
        <el-row class="header header-pc" type="flex">
            <el-col :span="10" class="logo">
                <img src="../assets/logo.png">
                <h1>药视通系统管理平台</h1>
            </el-col>
            <el-col :span="6">
                <h2>药视通</h2>
            </el-col>
            <el-col :span="8" class="header-right">
                <div><i class="iconfont icon-bell"></i> <em>消息</em></div>
                <el-dropdown trigger="click" @command="handleFeedback">
                    <span class="el-dropdown-link feedback">
                        <i class="iconfont icon-service"></i> <em>问题反馈</em> <i class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown" class="feedback-dropdown">
                        <el-dropdown-item command="index">我的反馈</el-dropdown-item>
                        <el-dropdown-item command="add">提交问题</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown trigger="click" @command="handleNickname">
                      <span class="el-dropdown-link nickname">
                        <img v-if="userInfo.avatar"
                             :src="{url:userInfo.avatar, sex: userInfo.sex} | defaultAvatar"> {{userInfo.name}} <i
                              class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown" class="nickname-dropdown">
                        <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                        <el-dropdown-item command="company">企业信息</el-dropdown-item>
                        <el-dropdown-item command="password">修改密码</el-dropdown-item>
                        <el-dropdown-item command="safeset">安全设置</el-dropdown-item>
                        <el-dropdown-item :divided="true"></el-dropdown-item>
                        <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
        <!--头部部分 wap端-->
        <section class="header-wap">
            <el-row class="header wap-header" type="flex">
                <el-col :span="20" class="logo">
                    <img src="../assets/logo.png">
                    <h1>药视通系统管理平台</h1>
                </el-col>
                <el-col :span="4">
                    <i class="iconfont icon-list" @click="handleIsShowMenue(!isShowMenue)"></i>
                </el-col>
            </el-row>
            <el-row class="header" type="flex">
                <el-col :span="8" :offset="2">
                    <h2>药视通</h2>
                </el-col>
                <el-col :span="24" class="header-right">
                    <div><i class="iconfont icon-xiaoxizhongxin"></i> <em></em></div>
                    <div class="feedback"><i class="iconfont icon-wenti"></i> <em></em></div>
                    <el-dropdown trigger="click" @command="handleNickname">
                      <span class="el-dropdown-link nickname">
                        <img src="./images/user-default-male.jpg"><i
                              class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown" class="nickname-dropdown">
                            <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                            <el-dropdown-item command="company">企业信息</el-dropdown-item>
                            <el-dropdown-item command="password">修改密码</el-dropdown-item>
                            <el-dropdown-item :divided="true"></el-dropdown-item>
                            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </section>

        <article class="content">
            <!--左边菜单栏-->
            <el-menu :default-active="navMenueActive" class="left-menu-container" :class="{ 'isShowMenue':isShowMenue }"
                     :unique-opened="true"
                     @select="handleMenuClick"
                     :router="true">
                <div class="nav-title">导航</div>
                <MenuTree v-for="item in navMenus" :icons="icons" :data="item" :key="item.item.id"></MenuTree>
            </el-menu>

            <!--右边内容-->
            <section class="index-right-content" @click="handleIsShowMenue(false)">
                <h2 class="right-title">
                    <i class="back-btn" v-show="isShowBack" @click="$router.back()">返回</i> <i v-show="isShowBack">|</i>
                    {{mainTitle}}
                    <!--asd-->
                    <small>{{subTitle}}</small>
                </h2>

                <div class="route-content" v-loading="contentLoading">
                    <router-view></router-view>
                </div>
            </section>
        </article>
    </article>
</template>

<script>
    import * as userService from '../services/userService'
    import MenuTree from './component/tree/MenuTree.vue'
    import authUtils from '../utils/authUtils'

    export default {
        data () {
            return {
                isShowMenue: false,
                contentLoading: false,
                mainTitle: this.$store.state.index.webpathMain,
                subTitle: this.$store.state.index.webpathSub,
                icons: {},
                isShowBack: false
            }
        },
        computed: {
            userInfo () {
                return authUtils.getUserInfo()
            },
            // 当前用户可见de所有的菜单
            navMenus () {
                return this.$store.state.index.navMenu
            },
            // 激活的菜单选项
            navMenueActive () {
                return this.$store.state.index.navMenueActive
            }
        },
        watch: {
            '$store.state.index.webpathMain': function () {
                this.mainTitle = this.$store.state.index.webpathMain
            },
            '$store.state.index.webpathSub': function () {
                this.subTitle = this.$store.state.index.webpathSub
            }
        },
        created () {
            this.icons.main = require('./images/main.png')
            this.icons.course = require('./images/course.png')
            this.icons.company = require('./images/company.png')
            this.icons.finance = require('./images/finance.png')
            this.icons.sale = require('./images/sale.png')
            this.icons.client = require('./images/client.png')
            this.icons.data = require('./images/data.png')
            this.icons.system = require('./images/system.png')
            this.icons.service = require('./images/service.png')
            this.icons.article = require('./images/article.png')
            this.icons.user = require('./images/user.png')

            authUtils.authRefreshtoken() // 开启自动更新token
            xmview.setContentLoading = this.setContentLoading.bind(this)
            xmview.setContentBack = this.showContentBack.bind(this)
            // this.$store.dispatch('setIndexMenuActive', this.$route.path) // 设置选中的菜单
            this.$store.dispatch('setIndexNavMenu', {menu: authUtils.getNavMenu()}) // 获取菜单
        },
        mounted () {
            window.onresize = () => {
                this.handleIsShowMenue(document.documentElement.clientWidth > 767)
            }
        },
        beforeDestroy() {
            window.onresize = null
        },
        methods: {
            handleIsShowMenue (val) {
                this.isShowMenue = val
            },
            handleFeedback (type) {
                /* eslint-disable indent  */
                switch (type) {
                    case 'index':
                        this.$router.push({name: 'feedback-index'})
                        break
                    case 'add':
                        this.$router.push({name: 'feedback-add'})
                        break
                    default:
                        console.error('handleFeedback not support type')
                        break
                }
            },
            // 注销登录
            handleNickname (type) {
                /* eslint-disable indent  */
                switch (type) {
                    case 'loginout': {
                        userService.loginout()
                        this.$router.push({name: 'login'})
                        break
                    }
                    case 'safeset': {
                        this.$router.push({name: 'user-safeset'})
                        break
                    }
                    case 'profile': {
                        this.$router.push({name: 'user-profile'})
                        break
                    }
                    case 'company': {
                        this.$router.push({name: 'user-company'})
                        break
                    }
                    case 'password': {
                        this.$router.push({name: 'user-password'})
                        break
                    }
                    default: {
                        throw new Error('index.vue, handleNickname not support type')
                    }
                }
            },
            // 菜单点击
            handleMenuClick (item) {
                this.$store.dispatch('clearFetchParam', true)
                if (item === this.$route.path) {
                    this.$router.replace({name: this.$route.name, query: {refreshId: Date.now()}})
                    xmview.setContentLoading(false)
                } else {
                    this.$router.push({path: item})
                }
            },
            setContentLoading (loading) {
                if (!loading) {
                    this.$nextTick(() => {
                        setTimeout(() => {
                            this.contentLoading = loading
                        }, 300)
                    })
                } else {
                    this.contentLoading = loading
                }
            },
            // 是否显示
            showContentBack (isShow) {
                this.isShowBack = isShow
            },
        },
        components: {
            MenuTree
        }
    }
</script>
