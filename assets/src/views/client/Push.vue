<!--企业列表-管理员-->
<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";

    .client-push-container {
        border: 1px solid #ededed;
        .add {
            background: #f0f3f5;
            padding: 10px 20px;
            border-bottom: 1px solid #ededed;
            text-align: right;
        }
        .main-container {
            background: #fff;
            padding: 20px;
            .search {
               @extend %top-search-container;
            }
            .block {
                text-align: right;
                margin-top: 10px;
            }
        }
        .showDetail {
            .info {
                display: inline-block;
                vertical-align: top;
                p {
                    line-height: 30px;
                    span {
                        display: inline-block;
                        width: px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                    }
                }
            }
        }
    }
</style>
<template>
    <article class="client-push-container">
        <!--详情-->
        <el-dialog class="showDetail" title="推送详情" v-model="showDetail">
            <div class="info">
                <p><span>标题 </span>{{details.title}}</p>
                <p><span>内容 </span>{{details.content}}</p>
                <p><span>类型 </span>{{details.ModelName}}</p>
                <p v-if="details.courses"><span>课程名称 </span>{{details.courses}}</p>
                <p v-if="details.links"><span>课程名称 </span>{{details.links}}</p>
                <div v-if="details.Tags != null">
                    <p v-for="item in details.Tags"><span>{{item.Name}} </span>{{item.Value}}</p>
                </div>
            </div>
        </el-dialog>
        <section class="add">
            <router-link tag="el-button" icon="plus" :to="{name: 'client-push-create'}">新建推送</router-link>
        </section>
        <div class="main-container">
            <section class="search">
                <section>
                    <i>推送方式</i>
                    <el-select clearable v-model="search.target" @change="getData">
                        <el-option label="全局推送" value="all"></el-option>
                        <el-option label="条件推送" value="tag"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>类型</i>
                    <el-select clearable v-model="search.modelid" @change="getData">
                        <el-option label="全部" :value="100"></el-option>
                        <el-option label="文本" :value="0"></el-option>
                        <el-option label="课程" :value="5"></el-option>
                        <el-option label="链接" :value="20"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>状态</i>
                    <el-select clearable v-model="search.status" @change="getData">
                        <el-option label="待发送" :value="0"></el-option>
                        <el-option label="成功" :value="1"></el-option>
                        <el-option label="失败" :value="2"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>关键字</i>
                    <el-input @change="getData" class="name" v-model="search.keyword"/>
                </section>
                <DateRange title="日期查找" :start="search.time_start" :end="search.time_end"
                           v-on:changeStart="val=>search.time_start=val"
                           v-on:changeEnd="val=>search.time_end"
                           :change="getData">
                </DateRange>
            </section>
            <el-table border v-loading="loading" :data="pushData">
                <el-table-column
                        prop="target_type"
                        label="推送方式"
                        width="150">
                    <template scope="scope">
                        {{scope.row.target_type == 'TAG' ? '条件推送' : '全局推送'}}
                    </template>
                </el-table-column>
                <el-table-column
                        prop="model_name"
                        label="类型"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="标题"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="content"
                        label="内容"
                        width="300">
                </el-table-column>
                <el-table-column
                        prop="devices"
                        label="平台"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="send_time"
                        label="发送时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="admin"
                        label="管理员"
                        width="200">
                </el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="checkDetail(scope.$index, scope.row)">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <section class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, ->, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </section>
        </div>
    </article>
</template>
<script>
    import DateRange from '../component/form/DateRangePicker.vue'
    import pushService from '../../services/pushService'
    export default {
        components: {
            DateRange,
        },
        data () {
            return {
                loading: false,
                // 查看店员详情
                details: {
                    name: '',          // 姓名
                    department: '',       // 门店
                    mobile: '',        // 手机
                    pass: '',          // 密码
                    address: '',       // 地址
                    sex: 0,            // 性别
                    birthday: '',          // 生日
                    create_time_name: ''
                },
                showDetail: false,     // 是否显示详情对话框
                currentPage: 1, // 分页当前显示的页数
                total: 0,
                pageSize: 15,
                search: { // 搜索的姓名
                    keyword: '',
                    target: '', // 推送方式
                    modelid: '', // 推送内容类型
                    status: '', // 状态
                    time_start: '',
                    time_end: '',
                },
                pushData: []
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            getData () {
                this.loading = true
                return pushService.getPushList({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    keyword: this.search.keyword,
                    target: this.search.target,
                    modelid: this.search.modelid,
                    status: this.search.status,
                    time_start: this.search.time_start,
                    time_end: this.search.time_end
                }).then((ret) => {
                    this.pushData = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            // 查看店员详情
            checkDetail (index, row) {
                pushService.getPushDetail(row.id).then((ret) => {
                    this.details = ret.data
                }).then(() => {
                    this.showDetail = true
                })
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            goBack () {
                window.history.back()
            }
        }
    }
</script>
