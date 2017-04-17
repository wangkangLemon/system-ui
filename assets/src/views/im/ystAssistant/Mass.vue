<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #im-ystassistant-mass {
        //        @extend %content-container;
        .search {
            @extend %top-search-container
        }

        // 新建消息
        .create-msg {
            .el-tabs {
                margin-bottom: 15px;
            }
            // 图文消息
            .news-msg {
                > section {
                    text-align: center;
                    border: 1px solid #ededed;
                    color: #666;
                    width: 40%;
                    height: 300px;
                    font-size: 22px;
                    display: inline-block;
                    cursor: pointer;
                    margin-left: 6%;
                    padding-top: 40px;

                    &:hover {
                        color: #333;
                        border-color: #ddd;
                    }
                    div {
                        line-height: 100px;
                        font-size: 100px;
                        display: block;
                    }
                    h5 {
                        line-height: 22px;
                    }
                }
            }
        }
    }
</style>

<template>
    <article id="im-ystassistant-mass">
        <el-tabs type="border-card" v-model="activedTab" @tab-click="handleClick">
            <el-tab-pane label="新建消息" name="new" class="create-msg">
                <article class="search">
                    <section><i>发送对象</i>
                        <el-select v-model="fetchParamSend.receiver">
                            <el-option value="" label="全部"></el-option>
                            <el-option value="manager" label="店长"></el-option>
                            <el-option value="employee" label="店员"></el-option>
                        </el-select>
                    </section>
                </article>

                <!--<el-tabs v-model="fetchParamSend.type" type="border-card">-->
                <el-tabs v-model="fetchParamSend.type">
                    <el-tab-pane name="news">
                        <span slot="label"><i class="el-icon-menu"></i> 图文消息</span>

                        <article class="news-msg">
                            <section>
                                <div>+</div>
                                <br>
                                <h5>从素材库中选择</h5>
                            </section>
                            <router-link :to="{name:'im-ystAssistant-material'}" tag="section">
                                <div>+</div>
                                <br>
                                <h5>新建图文消息</h5>
                            </router-link>
                        </article>
                    </el-tab-pane>
                    <el-tab-pane name="text">
                        <span slot="label"><i class="el-icon-document"></i> 文本消息</span>
                        <article>配置管理</article>
                    </el-tab-pane>
                    <el-tab-pane label="图片消息" name="image">
                        <span slot="label"><i class="el-icon-picture"></i> 图片消息</span>
                        <article></article>
                    </el-tab-pane>
                </el-tabs>

                <el-button type="primary">群发</el-button>
            </el-tab-pane>
            <el-tab-pane label="已发送" name="sended">配置管理</el-tab-pane>
        </el-tabs>
    </article>
</template>

<script>
    export default{
        data () {
            return {
                activedTab: 'new',
                fetchParamSend: {
                    type: 'news',
                    receiver: ''
                }
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            handleClick (tab) {
                console.info('选中tab', tab, this.activedTab)
            }
        },
        components: {}
    }
</script>
