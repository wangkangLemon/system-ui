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
        .show-detail {
            .sub-title {
                color: #999;
                font-size: 12px;
                margin-left: 10px;
            }
        }
    }
</style>
<template>
    <article class="company-department">
        <!--详情-->
        <el-dialog width="30%" v-if="show.detail" class="show-detail" title="查看门店" :visible.sync="show.showDetail">
            <div class="info">
                <h2>{{show.detail.name}}<i class="sub-title">{{show.detail.company}}</i></h2>
                <p><i class="title">店长：</i><span class="value">{{show.detail.contact || '无'}}</span></p>
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
            <Region title="地区"
                    :province="fetchParam.provinceSelect"
                    :city="fetchParam.citySelect"
                    :area="fetchParam.areaSelect"
                    v-on:provinceChange="val => fetchParam.provinceSelect = val"
                    v-on:cityChange="val => fetchParam.citySelect = val"
                    v-on:areaChange="val => fetchParam.areaSelect = val"
                    :change="getData"></Region>
            <section>
                <i>连锁</i>
                <IndustryCompanySelect :type="2" v-model="fetchParam.companySelect"
                                       v-on:change="val=>fetchParam.companySelect=val"
                                       :change="getData">
                </IndustryCompanySelect>
            </section>
            <DateRange title="创建时间" :start="fetchParam.createTime" :end="fetchParam.endTime"
                       v-on:changeStart="val=> fetchParam.createTime=val"
                       v-on:changeEnd="val=> fetchParam.endTime=val"
                       :change="getData">
            </DateRange>
            <section>
                <i>名称：</i>
                <el-input @keyup.enter.native="getData" v-model="fetchParam.name" auto-complete="off"></el-input>
            </section>
            <section>
                <i>店长：</i>
                <el-input @keyup.enter.native="getData" v-model="fetchParam.contact" auto-complete="off"></el-input>
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
                    min-width="180"
                    prop="company"
                    label="连锁">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="area_name"
                    label="地区">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="contact"
                    label="店长">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="user_count"
                    label="店员数量">
            </el-table-column>
            <el-table-column
                    width="130"
                    prop="mobile"
                    label="手机">
            </el-table-column>
            <el-table-column
                    width="170"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="operate"
                    label="操作"
                    fixed="right"
                    align="center">
                <template slot-scope="scope">
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

    function clearFn() {
        return {
            companySelect: '',
            provinceSelect: '',
            citySelect: '',
            areaSelect: '',
            name: '', // 名称
            contact: '' // 店长
        }
    }
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
                fetchParam: {
                    companySelect: '',
                    createTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    endTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    provinceSelect: '',
                    citySelect: '',
                    areaSelect: '',
                    name: '', // 名称
                    contact: '' // 店长
                }
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {

            initFetchParam() {
                this.fetchParam = clearFn()
                this.currentPage = 1
            },
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
                    province: this.fetchParam.provinceSelect,
                    city: this.fetchParam.citySelect,
                    area: this.fetchParam.areaSelect,
                    company_id: this.fetchParam.companySelect,
                    time_start: date2Str(this.fetchParam.createTime),
                    time_end: date2Str(this.fetchParam.endTime),
                    keyword: this.fetchParam.name,
                    contact: this.fetchParam.contact
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
                    province: this.fetchParam.provinceSelect,
                    city: this.fetchParam.citySelect,
                    area: this.fetchParam.areaSelect,
                    company_id: this.fetchParam.companySelect,
                    time_start: date2Str(this.fetchParam.createTime),
                    time_end: date2Str(this.fetchParam.endTime),
                    keyword: this.fetchParam.name,
                    contact: this.fetchParam.contact
                })
            }
        }
    }
</script>
