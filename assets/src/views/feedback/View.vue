<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";

    #feedback-view {
        @extend %content-container;

        background-color: #d9e0e7;
        border-color: #d9e0e7;
        padding: 0;

        .manage-container {
            @extend %right-top-btnContainer;
        }
        .el-row {
            margin-bottom: 20px;
            &:last-child {
                margin-bottom: 0;
            }
        }
        .el-col {
            border-radius: 4px;
        }
        .bg-white {
            background: #fff;
        }
        .bg-purple-dark {
            background: #99a9bf;
        }
        .bg-purple {
            background: #d3dce6;
        }
        .bg-purple-light {
            background: #e5e9f2;
        }
        .grid-content {
            border-radius: 4px;
            min-height: 36px;
        }
        .row-bg {
            padding: 10px 0;
            background-color: #f9fafc;
        }
        .box-card {
            margin-bottom: 15px;
            color: #333;
            box-shadow: none;
            .clearfix {
                text-align: left;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                font-size: 14px;
            }
            #lineChart {
                width: 100%;
                height: 300px;
            }
        }

        .pull-right {
            float: right;
        }

        dl {
            margin-top: 0;
            margin-bottom: 0;
            font-size: 12px;
        }
        dt,
        dd {
            line-height: 1.8;
            display: block;
        }
        dt:before,
        dd:before,
        dt:after,
        dd:after {
            display: table;
            content: " ";
        }
        dt:after,
        dd:after {
            clear: both;
        }
        dt {
            font-weight: bold;
        }
        dd {
            margin-left: 0;
        }
        .dl-horizontal dt {
            float: left;
            width: 60px;
            overflow: hidden;
            clear: left;
            text-align: right;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .dl-horizontal dd {
            margin-left: 80px;
        }
        ul.process-status {
            padding-left: 20px;
        }
        .text {
            font-size: 12px;
        }
        .text.light {
            color: lightgray;
        }
        .text.current {
            color: #13CE66;
        }
    }
</style>

<template>
    <article id="feedback-view">
        <div class="manage-container">
            <el-button type="info" @click="$router.push({name: 'feedback-index'})">返回列表</el-button>
        </div>

        <el-row :gutter="20">
            <el-col :span="18">
                <div class="grid-content">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            沟通记录
                            <el-button type="primary" size="mini" class="pull-right action-confirm" data-href="xxx">
                                确认已解决
                            </el-button>
                        </div>
                        <section id="lineChart"></section>
                    </el-card>
                </div>
            </el-col>

            <el-col :span="6">
                <div class="grid-content">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">工单信息</div>
                        <dl class="dl-horizontal">
                            <dt>企业名称</dt>
                            <dd>{{ data.company_name }}</dd>
                            <dt>门店名称</dt>
                            <dd>{{ data.department_name }} </dd>
                            <dt>提交人</dt>
                            <dd>{{ data.user_name }}</dd>
                            <dt>联系方式</dt>
                            <dd>{{ data.contact }}</dd>
                            <dt>问题类型</dt>
                            <dd>{{ data.category_name }}</dd>
                        </dl>
                    </el-card>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            处理进度
                        </div>
                        <ul class="process-status">
                            <li class="text current" v-if="data.status == 0">待分配</li>
                            <li class="text" v-else>已分配</li>
                            <template v-if="data.status < 4">
                                <li :class="{text: true, light: data.status == 0 ? true : false, current: data.status == 1 ? true : false}">处理中</li>
                                <li class="text current" v-if="data.status == 2">待补充</li>
                                <template v-if="data.status == 3">
                                    <li class="text">已补充</li>
                                    <li class="text current">待处理</li>
                                </template>
                            </template>
                            <template v-else>
                                <li class="text">已处理</li>
                            </template>
                            <template v-if="data.status < 5">
                                <li :class="{text: true, light: data.status == 4 ? false : true, current: data.status == 4 ? true : false}">待确认</li>
                            </template>
                            <template v-else>
                                <li class="text">已确认</li>
                            </template>
                            <li :class="{text: true, light: data.status == 9 ? false : true, current: data.status == 9 ? true : false}">已关闭</li>
                        </ul>
                    </el-card>
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            工单评价
                        </div>
                        <el-rate
                                v-model="value2"
                                :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
                        </el-rate>
                    </el-card>
                </div>
            </el-col>
        </el-row>

    </article>
</template>

<script>
    import feedbackService from '../../services/feedback/user'
    import {fillImgPath} from '../../utils/filterUtils'
    // import authUtils from '../../utils/authUtils'
    import UploadImages from '../component/upload/UploadImages.vue'
    export default {
        name: 'feedback-view',
        filters: {
            fillImgPath
        },
        components: {
            UploadImages
        },
        data() {
            return {
                value1: null,
                value2: null,
                id: 0,
                data: {
                    id: 0,
                    company_name: '',
                    department_name: '',
                    user_id: 0,
                    user_name: '',
                    user_avatar: '',
                    contact: '',
                    category_name: '',
                    content: '',
                    images: [],
                    status: 0,
                    create_time: 0,
                    create_time_name: '',
                }
            }
        },
        activated () {
            console.log('view-activated')
            console.log(this.$route.query)
            xmview.setContentLoading(false)
        },
        created() {
            console.log('view-created')
            console.log(this.$route.query)
            this.id = this.$route.query['feedback_id']
            feedbackService.view(this.id).then((ret) => {
                console.log(ret)
                this.data = ret.data
            }).catch((ret) => {
                xmview.showTip('error', ret.message)
            })
            xmview.setContentLoading(false)
        }
    }
</script>
