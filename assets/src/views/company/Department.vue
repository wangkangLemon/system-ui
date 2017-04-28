<!--门店-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";
    @import "../../utils/mixins/showDetail";
    .company-department {
        @extend %content-container;
        .header-button {
            @extend %right-top-btnContainer;
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
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="company-department">
        <!--详情-->
        <el-dialog size="small" v-if="show.detail" class="showDetail" title="查看门店" v-model="show.showDetail">
            <div class="info">
                <h2>测试营销员</h2>
                <p><i class="title">店长：</i><span class="value">{{show.detail.concact || '无'}}</span></p>
                <p><i class="title">手机：</i><span class="value">{{show.detail.mobile || '无'}}</span></p>
                <p><i class="title">电话：</i><span class="value">{{show.detail.tel || '无'}}</span></p>
                <p><i class="title">传真：</i><span class="value">{{show.detail.fax || '无'}}</span></p>
                <p><i class="title">地区：</i><span class="value">{{show.detail.area_name || '无'}}</span></p>
                <p><i class="title">地址：</i><span class="value">{{show.detail.address || '无'}}</span></p>
                <p><i class="title">邮编：</i><span class="value">{{show.detail.zip || '无'}}</span></p>
                <p><i class="title">描述：</i><span class="value">{{show.detail.description || '无'}}</span></p>
            </div>
        </el-dialog>
        <div class="header-button">
            <el-button @click="exportData" type="warning"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
        </div>
        <section class="search">
            <Region title="地区" v-on:provinceChange="val => searchParams.provinceSelect = val"
                    v-on:cityChange="val => searchParams.citySelect = val"
                    v-on:areaChange="val => searchParams.areaChange = val"
                    :change="getData"></Region>
            <section>
                <i>连锁</i>
                <IndustryCompanySelect :type="2" v-model="searchParams.companySelect"
                                       v-on:change="val=>searchParams.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
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
                :data="departmentData"
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
                    <el-button type="text" size="small" @click="showFn(scope.$index, scope.row)">
                        详情
                    </el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.row)">
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
    </article>
</template>
<script>
    import departmentService from '../../services/departmentService'
    import {date2Str} from '../../utils/timeUtils'
    import IndustryCompanySelect from '../component/select/IndustryCompany'
    import DateRange from '../component/form/DateRangePicker.vue'
    import Region from '../component/select/Region.vue'
    export default {
        components: {
            IndustryCompanySelect,
            DateRange,
            Region
        },
        data () {
            return {
                show: {
                    detail: null,
                    showDetail: false, // 显示详情
                },
                loading: false,
                currentPage: 1,
                pageSize: 15,
                departmentData: [],
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
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            // 显示详情
            showFn (index, row) {
                this.show.showDetail = true
                departmentService.getDepInfo(row.id).then((ret) => {
                    this.show.detail = ret.data
                })
            },
            handleDelete (row) {
                xmview.showDialog(`你将要删除门店<i style="color:red">${row.name}</i>并且同时删除店长 操作不可恢复确认吗？`, () => {
                    // 以下执行接口删除动作
                    departmentService.depDelete(row.id).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
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
                    province: this.searchParams.provinceSelect,
                    city: this.searchParams.citySelect,
                    area: this.searchParams.areaSelect,
                    company_id: this.searchParams.companySelect,
                    time_start: date2Str(this.searchParams.createTime),
                    time_end: date2Str(this.searchParams.endTime),
                    keyword: this.searchParams.name,
                    concact: this.searchParams.concact
                }
                return departmentService.getDepartment(params).then((ret) => {
                    this.departmentData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            exportData () {
                departmentService.exportDepartment({
                    province: this.searchParams.provinceSelect,
                    city: this.searchParams.citySelect,
                    area: this.searchParams.areaSelect,
                    company_id: this.searchParams.companySelect,
                    time_start: date2Str(this.searchParams.createTime),
                    time_end: date2Str(this.searchParams.endTime),
                    keyword: this.searchParams.name,
                    concact: this.searchParams.concact
                })
            }
        }
    }
</script>
