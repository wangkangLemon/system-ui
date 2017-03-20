<style lang='scss' rel='stylesheet/scss' scoped>
    @import "../utils/mixins/mixins";

    .index-container {
        background: #fff;
    }

    .header {
        height: 55px;
        text-align: center;

        .logo {
            text-align: left;
            padding-left: 28px;
            > * {
                display: inline-block;
                vertical-align: middle;
            }
            img {
                width: 20px;
                height: 20px;
            }

            h1 {
                font-size: 16px;
                font-weight: normal;
            }
        }
    }

    .content {
        position: absolute;
        width: 100%;
        min-height: 100%;

        .left-menu-container {
            width: 220px;
            z-index: 9;
            min-height: 100%;
            position: absolute;

            > div {
                font-size: 14px;
                color: #999;
                margin: 12px 20px 0;
            }
        }

        .right-content {
            position: absolute;
            padding: 20px 220px 20px 20px;
            width: 100%;
            background: #d9e0e7;
            height: 100%;
            top: 0;
        }
    }
</style>

<template>
    <article class="index-container">
        <!--头部部分-->
        <el-row class="header" type="flex">
            <el-col :span="8" class="logo">
                <img src="../assets/logo.png">
                <h1>药视通系统管理平台</h1>
            </el-col>

            <el-col :span="8">
                <h2>药视通</h2>
            </el-col>


            <el-col :span="8">
                <i>消息</i>
                <i>问题反馈11</i>
                <i>huanghuixin</i>
            </el-col>
        </el-row>

        <article class="content">
            <!--左边菜单栏-->
            <el-menu default-active="2" class="left-menu-container">
                <div>导航</div>
                <el-menu-item index="2"><i class="el-icon-menu"></i>主页</el-menu-item>
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-message"></i>系统</template>
                    <el-menu-item-group>
                        <el-menu-item index="1-1"><i class="el-icon-message"></i>管理员</el-menu-item>
                        <el-menu-item index="1-2"><i class="el-icon-message"></i>设置</el-menu-item>
                        <el-menu-item index="1-3"><i class="el-icon-message"></i>日志</el-menu-item>
                    </el-menu-item-group>

                    <el-submenu index="1-4">
                        <template slot="title">问题反馈</template>
                        <el-menu-item index="1-4-1">连锁后台</el-menu-item>
                        <el-menu-item index="1-4-2">客户端</el-menu-item>
                    </el-submenu>
                </el-submenu>
            </el-menu>

            <!--右边内容-->
            <section class="right-content">
                <div class="route-content">
                    <router-view></router-view>
                </div>

            </section>
        </article>

    </article>
</template>

<script lang='babel'>
    import * as userService from '../services/userService'
    export default{
        created () {
            userService.login('huanghx@vodjk.com', '123456').then(ret => {
                console.info(ret, 'index.vue')
            }).catch(err => {
                xmview.closeTip()
                console.info('index.vue', err)
            })
        }
    }
</script>
