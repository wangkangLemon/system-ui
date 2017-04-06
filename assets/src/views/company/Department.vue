<!--门店-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
    .company-department {
        .showDetail {
            h2 {
                margin-bottom: 10px;
            }
            p {
                span {
                    display: inline-block;
                    width: 90px;
                    margin-right: 10px;
                    text-align: right;
                }
            }
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
    <article class="company-department">
        <!--详情-->
        <el-dialog class="showDetail" title="查看门店" v-model="show.showDetail">
            <div class="info">
                <p><span>测试营销员</span></p>
                <p><span>店长：</span>{{show.detail.concact}}</p>
                <p><span>手机：</span>{{show.detail.mobile}}</p>
                <p><span>电话：</span>{{show.detail.phone}}</p>
                <p><span>传真：</span>{{show.detail.fax}}</i></p>
                <p><span>地区：</span>{{show.detail.area_name}}</p>
                <p><span>地址：</span>{{show.detail.address}}</p>
                <p><span>邮编：</span>{{show.detail.postcode}}</p>
                <p><span>描述：</span>{{show.detail.introduce}}</p>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <el-button @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
            </div>
            <section class="search">
                <Region v-on:provinceChange="val => searchParams.provinceSelect = val"
                        v-on:cityChange="val => searchParams.citySelect = val"
                        v-on:areaChange="val => searchParams.areaChange = val"
                        :change="getData"></Region>
                <IndustryCompanySelect :type="2" v-model="searchParams.companySelect"
                                       v-on:change="val=>searchParams.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
                <DateRange title="创建时间" :start="searchParams.createTime" :end="searchParams.endTime"
                           v-on:changeStart="val=> searchParams.createTime=val"
                           v-on:changeEnd="val=> searchParams.endTime"
                           :change="getData">
                </DateRange>
                <section>
                    <i>名称：</i>
                    <el-input @change="getData" v-model="searchParams.name" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>店长：</i>
                    <el-input @change="getData" v-model="searchParams.concact" auto-complete="off"></el-input>
                </section>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="historyData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="门店"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="company"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="area_name"
                        label="地区">
                </el-table-column>
                <el-table-column
                        prop="concact"
                        label="店长">
                </el-table-column>
                <el-table-column
                        prop="user_count"
                        label="店员数量">
                </el-table-column>
                <el-table-column
                        prop="user_name"
                        label="店员">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机">
                </el-table-column>
                <el-table-column
                        prop="emial"
                        label="邮箱">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="show.showDetail = true">
                            详情
                        </el-button>
                        <el-button type="text" size="small" @click="deletDialog = true">
                            删除
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
        <!--删除弹窗-->
        <delete-dialog :text="itemName" v-model="deletDialog" v-on:callback="deleteItem"></delete-dialog>
    </article>
</template>
<script lang="babel">
    import {history, exportData} from '../../services/fianace/finance'
    import {date2Str} from '../../utils/timeUtils'
    import IndustryCompanySelect from '../component/select/IndustryCompany'
    import DateRange from '../component/form/DateRangePicker.vue'
    import Region from '../component/select/Region.vue'
    import deleteDialog from '../component/dialog/Delete'
    export default {
        components: {
            IndustryCompanySelect,
            DateRange,
            Region,
            deleteDialog
        },
        data () {
            return {
                deletDialog: false,
                itemName: '',
                show: {
                    detail: {
                        concact: '',
                        mobile: '',
                        phone: '',
                        fax: '',
                        areaName: '',
                        address: '',
                        postcode: '',
                        introduce: ''
                    },
                    showDetail: false, // 显示详情
                },
                loading: false,
                currentPage: 1,
                pageSize: 10,
                historyData: [],
                total: 0,
                searchParams: {
                    companySelect: '',
                    createTime: '',
                    endTime: '',
                    provinceSelect: '',
                    citySelect: '',
                    areaSelect: '',
                    name: '', // 名称
                    concact: '' // 店长
                }
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            deleteItem (confirm) {
                this.deletDialog = false
                if (!confirm) {
                    return false
                }
                // 以下执行接口删除动作
                console.log(11)
            },
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
            },
            exportData () {
                exportData({
                    course_id: this.courseSelect,
                    company_id: this.companySelect,
                    time_start: date2Str(this.createTime),
                    time_end: date2Str(this.endTime),
                    user_id: this.userSelect
                }).then((ret) => {
                    console.log(ret)
                })
            }
        }
    }
</script>
