<style lang='scss' rel='stylesheet/scss' scoped>
    @import "../utils/mixins/mixins";

    .index-container {
        background: #fff;
    }

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
                .question {
                    margin: 0 5px 0 15px
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
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        @media (max-width: 767px) {
            margin-top: 55px;
        }

        .left-menu-container {
            width: 220px;
            z-index: 11;
            height: 100%;
            position: absolute;
            overflow-y: auto;
            transition: all 300ms ease;
            transform: translateX(0);
            @media (max-width: 767px) {
                transform: translateX(-100%);
                top: -55px;
            }
            @media (min-width: 768px) {
                top: 55px;
            }

            > div {
                font-size: 14px;
                color: #999;
                margin: 12px 20px 0;
            }

            &.isShowMenue {
                transform: translateX(0);
            }
        }

        .right-content {
            position: absolute;
            padding: 75px 20px 20px 240px;
            width: 100%;
            background: #d9e0e7;
            min-height: 100%;
            top: 0;
            @media (max-width: 767px) {
                padding: 75px 20px 20px;
                position: absolute;
                /*top: 110px;*/
            }

            .right-title {
                font-size: 24px;
                > small {
                    font-weight: 300;
                    font-size: 70%;
                    display: inline-block;
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
                <div><i class="iconfont icon-xiaoxizhongxin"></i> <em>消息</em></div>
                <div class="question"><i class="iconfont icon-wenti"></i> <em>问题反馈</em></div>
                <el-dropdown trigger="click" @command="handleNickname">
                      <span class="el-dropdown-link nickname">
                        <img src="./images/user-default-male.jpg"> huanghuixin <i
                              class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                    <el-dropdown-menu slot="dropdown" class="nickname-dropdown">
                        <el-dropdown-item>个人信息</el-dropdown-item>
                        <el-dropdown-item>企业信息</el-dropdown-item>
                        <el-dropdown-item>修改密码</el-dropdown-item>
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
                    <div class="question"><i class="iconfont icon-wenti"></i> <em></em></div>
                    <el-dropdown trigger="click" @command="handleNickname">
                      <span class="el-dropdown-link nickname">
                        <img src="./images/user-default-male.jpg"><i
                              class="el-icon-caret-bottom el-icon--right"></i>
                      </span>
                        <el-dropdown-menu slot="dropdown" class="nickname-dropdown">
                            <el-dropdown-item>个人信息</el-dropdown-item>
                            <el-dropdown-item>企业信息</el-dropdown-item>
                            <el-dropdown-item>修改密码</el-dropdown-item>
                            <el-dropdown-item :divided="true"></el-dropdown-item>
                            <el-dropdown-item command="loginout">退出登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </section>

        <article class="content">
            <!--左边菜单栏-->
            <el-menu default-active="2" class="left-menu-container" :class="{ 'isShowMenue':isShowMenue }"
                     :router="true">
                <div>导航</div>
                <el-menu-item index="/index/main"><i class="el-icon-menu"></i>主页</el-menu-item>
                <el-submenu index="">
                    <template slot="title"><i class="el-icon-message"></i>客户端</template>
                    <el-submenu index="1-4">
                        <template slot="title">内容推荐</template>
                        <el-menu-item index="/client/contentManage">内容维护</el-menu-item>
                        <el-menu-item index="/client/blockManage">区块管理</el-menu-item>
                        <el-menu-item index="">分类管理</el-menu-item>
                    </el-submenu>
                    <el-menu-item-group index="">
                        <el-menu-item index=""><i class="el-icon-message"></i>消息推送</el-menu-item>
                        <el-menu-item index=""><i class="el-icon-message"></i>启动广告</el-menu-item>
                        <el-menu-item index="/client/bootad"><i class="el-icon-message"></i>企业Logo</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <!--数据分析-->
                <el-submenu index="dataAnalysis">
                    <template slot="title"><i class="el-icon-message"></i>数据分析</template>
                    <el-menu-item-group>
                        <el-menu-item index="/dataAnalysis/export"><i class="el-icon-message"></i>导出</el-menu-item>
                        <el-menu-item index="/dataAnalysis/contractMessage"><i class="el-icon-message"></i>企业签约信息
                        </el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="system">
                    <template slot="title"><i class="el-icon-message"></i>系统</template>
                    <el-menu-item-group>
                        <el-menu-item index="/system/admin"><i class="el-icon-message"></i>管理员</el-menu-item>
                        <el-menu-item index="/system/set"><i class="el-icon-message"></i>设置</el-menu-item>
                        <el-menu-item index="/system/log"><i class="el-icon-message"></i>日志</el-menu-item>
                    </el-menu-item-group>

                    <el-submenu index="1-4">
                        <template slot="title">问题反馈</template>
                        <el-menu-item index="/system/feedBack/chainBack">连锁后台</el-menu-item>
                        <el-menu-item index="/system/feedBack/app">客户端</el-menu-item>
                    </el-submenu>
                </el-submenu>
                <!--//-->
            </el-menu>

            <!--右边内容-->
            <section class="right-content" @click="handleIsShowMenue(false)">
                <h2 class="right-title">
                    考试记录
                    <small>成绩</small>
                </h2>

                <div class="route-content" v-loading="contentLoading">
                    <router-view></router-view>
                </div>
            </section>
        </article>
    </article>
</template>

<script lang='babel'>
    import * as userService from '../services/userService'
    import config from '../utils/config'
    export default {
        data () {
            return {
                isMobile: config.isMobile(),
                isShowMenue: false,
                contentLoading: false
            }
        },
        created () {
            xmview.setContentLoading = this.setContentLoading.bind(this)
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
            // 注销登录
            handleNickname (type) {
                /* eslint-disable indent  */
                console.info(type)
                switch (type) {
                    case 'loginout': {
                        userService.loginout()
                        this.$router.push({name: 'login'})
                        break
                    }
                    case 2: {
                        console.info('2')
                        break
                    }
                    default: {
                        console.info('3')
                    }
                }
            },
            proces () {

            },
            setContentLoading (loading) {
                this.contentLoading = loading
            }
        }
    }
</script>
