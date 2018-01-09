<!--企业列表-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";
    @import "../../utils/mixins/showDetail";

    .company-index {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
        .addForm {
            .tip {
                text-align: center;
                border-top: 1px solid #ddd;
                color: #ff0000;
                line-height: 50px;
            }
        }
    }
</style>
<template>
    <article class="company-index">
        <!--详情-->
        <el-dialog size="small" v-if="details != null" class="show-detail" v-model="showDetail" title="企业信息">
            <div class="info">
                <h2>
                    {{details.name}}
                    <el-tag type="success">{{companyType[details.category]}}</el-tag>
                </h2>
                <p><i class="title">门店数量：</i><span class="value">{{details.department_count || '无'}}</span></p>
                <p><i class="title">店员数量：</i><span class="value">{{details.user_count || '无'}}</span></p>
                <p><i class="title">联系人：</i><span class="value">{{details.contact || '无'}}</span></p>
                <p><i class="title">联系人手机：</i><span class="value">{{details.mobile || '无'}}</span></p>
                <p><i class="title">联系人邮箱：</i><span class="value">{{details.email || '无'}}</span></p>
                <p><i class="title">企业电话：</i><span class="value">{{details.tel || '无'}}</span></p>
                <p><i class="title">传真：</i><span class="value">{{details.fax || '无'}}</span></p>
                <p><i class="title">地区：</i><span class="value">{{details.area_name || '无'}}</span></p>
                <p><i class="title">地址：</i><span class="value">{{details.address || '无'}}</span></p>
                <p><i class="title">邮编：</i><span class="value">{{details.zip || '无'}}</span></p>
                <p><i class="title">企业网址：</i><span class="value">{{details.url || '无'}}</span></p>
                <p><i class="title">企业介绍：</i><span class="value">{{details.description || '无'}}</span></p>
            </div>
            <!--<div slot="footer" class="dialog-footer">-->
                <!--<el-button type="primary" @click="showDetail = false">关 闭</el-button>-->
            <!--</div>-->
        </el-dialog>
        <div class="add">
            <el-button type="primary" icon="plus" class="recharge" @click="add">添加</el-button>
        </div>
        <section class="search">
            <section>
                <i>类型</i>
                <el-select @change="getData" clearable v-model="fetchParam.typeSelect" placeholder="未选择">
                    <el-option
                            v-for="(item, index) in types"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id">
                    </el-option>
                </el-select>
            </section>
            <Region :province="fetchParam.provinceSelect"
                    :city="fetchParam.citySelect"
                    :area="fetchParam.areaSelect"
                    title="地区" v-on:provinceChange="val => fetchParam.provinceSelect = val"
                    v-on:cityChange="val => fetchParam.citySelect = val"
                    v-on:areaChange="val => fetchParam.areaSelect = val"
                    :change="getData"></Region>
            <section>
                <i>名称：</i>
                <el-input @keyup.enter.native="getData" v-model="fetchParam.name" auto-complete="off"></el-input>
            </section>
            <DateRange title="创建时间" :start="fetchParam.createTime" :end="fetchParam.endTime"
                       v-on:changeStart="val=> fetchParam.createTime = val"
                       v-on:changeEnd="val=> fetchParam.endTime = val"
                       :change="getData">
            </DateRange>
        </section>
        <el-table
                v-loading="loading"
                border
                :data="companyData"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="名称" min-width="150">
                <template slot-scope="scope">
                    <el-tag type="gray">{{companyType[scope.row.category]}}</el-tag>
                    {{scope.row.name}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="area_name"
                    label="地区"
                    width="180">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="contact"
                    label="联系人">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="mobile"
                    label="手机">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    width="170"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作"
                    width="150"
                    fixed="right"
                    align="center">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="adminPage(scope.$index, scope.row)">
                        管理员
                    </el-button>
                    <el-button type="text" size="small" @click="showFn(scope.$index, scope.row)">
                        详情
                    </el-button>
                    <el-button type="text" size="small" @click="editCompany(scope.$index, scope.row)">
                        修改
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
    import companyService from '../../services/companyService'
    import DateRange from '../component/form/DateRangePicker.vue'
    import Region from '../component/select/Region.vue'
    function clearFn() {
        return {
            typeSelect: '',
            provinceSelect: '',
            citySelect: '',
            areaSelect: '',
            name: ''
        }
    }
    export default {
        components: {
            DateRange,
            Region
        },
        data () {
            return {
                companyType: ['', '工业', '连锁', '提供商'],
                types: [ // 类型
                    {
                        name: '提供商',
                        id: 3
                    },
                    {
                        name: '连锁',
                        id: 2
                    },
                    {
                        name: '工业',
                        id: 1
                    }
                ],
                editloading: false,
                details: null,
                showDetail: false, // 显示详情弹窗
                loading: false,
                currentPage: 1,
                pageSize: 15,
                companyData: [],
                fetchParam: {
                    createTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    endTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    typeSelect: '',
                    provinceSelect: '',
                    citySelect: '',
                    areaSelect: '',
                    name: ''
                },
                total: 0
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.currentPage = 1
                this.fetchParam = clearFn()
            },
            // 修改企业信息
            editCompany (index, row) {
                this.$router.push({name: 'company-edit', params: {id: row.id}})
            },
            // 显示详情
            showFn (index, row) {
                companyService.getCompanyInfo(row.id).then((ret) => {
                    this.details = ret.data
                    this.showDetail = true
                })
            },
            adminPage (index, item) {
                this.$router.push({name: 'company-admin', params: {company_id: item.id || 1}, query: {category: item.category}})
            },
            // 添加
            add () {
                this.$router.push({name: 'company-add'})
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
                return companyService.getIndrustrySelectList({
                    page_size: this.pageSize,
                    page: this.currentPage,
                    category: this.fetchParam.typeSelect,
                    keyword: this.fetchParam.name,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    province: this.fetchParam.provinceSelect,
                    city: this.fetchParam.citySelect,
                    area: this.fetchParam.areaSelect
                }).then((ret) => {
                    this.companyData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
