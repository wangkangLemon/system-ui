<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .company-user-list {
        .showDetail {
            .avatar {
                border: 1px solid #ededed;
                display: inline-block;
                vertical-align: top;
            }
            .info {
                display: inline-block;
                vertical-align: top;
                > p {
                    > span {
                        display: inline-block;
                        width:px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                    }
                }
            }
        }
        .status {
            padding: 2px 5px;
            background: #00acac;
            border-radius: 5px;
            color: #fff;
        }
        .box-card {
            margin-bottom: 20px;
            .clearfix {
                text-align: right;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                .icon-iconfontexcel {
                    position: relative;
                    top: -2px;
                    margin-right: 5px;
                }
            }
            .search {
                @extend %top-search-container;
            }
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="company-user-list">
        <!--详情-->
        <el-dialog class="showDetail" title="查看店员" v-model="showDetail">
            <div class="avatar">
                <img src="http://sys.yst.vodjk.dev/assets/img/user-default-female.jpg?00da903dc4d95b13b46f" />
            </div>
            <div class="info">
                <p><span>测试营销员</span></p>
                <p><span>所属门店：</span>111</p>
                <p><span>Mobile：</span> <i class="iconfont icon-oslash"></i>222</p>
                <p><span>Email：</span> <i class="el-icon-message"></i>333</p>
                <p><span>状态：</span> <i class="status">444</i></p>
                <p><span>性别：</span> 555</p>
                <p><span>生日：</span>666</p>
                <p><span>地址：</span> 777</p>
                <p><span>注册时间：</span>888</p>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>姓名</i>
                    <el-input @change="getData" v-model="searchParams.name" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>手机</i>
                    <el-input @change="getData" v-model="searchParams.mobile" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>邮箱</i>
                    <el-input @change="getData" v-model="searchParams.email" auto-complete="off"></el-input>
                </section>
                <IndustryCompanySelect :type="2" v-model="searchParams.companySelect"
                                       v-on:change="val=>searchParams.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
                <section>
                    <i>属性</i>
                    <el-select v-model="searchParams.status" @change="getData">
                        <el-option label="店员" value="0"></el-option>
                        <el-option label="注册用户" value="1"></el-option>
                    </el-select>
                </section>
                <DateRange title="创建时间" :start="searchParams.createTime" :end="searchParams.endTime"
                           v-on:changeStart="val=> searchParams.createTime = val"
                           v-on:changeEnd="val=> searchParams.endTime = val"
                           :change="getData">
                </DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="historyData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="姓名">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机">
                </el-table-column>
                <el-table-column
                        prop="company"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="dep_name"
                        label="门店">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="注册时间">
                </el-table-column>
                <el-table-column
                        prop="disabled"
                        label="状态">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showDetail = true">
                            详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 30, 60, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>
    </article>
</template>
<script lang="babel">
    import {history} from '../../../services/fianace/finance'
    import {date2Str} from '../../../utils/timeUtils'
    import IndustryCompanySelect from '../../component/select/IndustryCompany'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            IndustryCompanySelect,
            DateRange
        },
        data () {
            return {
                showDetail: false,
                loading: false,
                currentPage: 1,
                pageSize: 10,
                historyData: [],
                total: 0,
                searchParams: {
                    companySelect: '',
                    createTime: '',
                    endTime: '',
                    name: '',
                    mobile: '',
                    status: '',
                    email: ''
                }
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    course_id: this.courseSelect,
                    company_id: this.companySelect,
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime),
                    user_id: this.userSelect
                }
                return history(params).then((ret) => {
                    this.historyData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
