<!--启动图-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/topSearch";
    .analysis-company-startimg {
        .search {
            @extend %top-search-container;
        }
        .box-card {
            margin-top: 20px;
            .clearfix {
                font-size: 16px;
                font-weight: bold;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
            }
            .block {
                text-align: right;
                margin-top: 15px;
            }
            i.el-icon-picture {
                position: relative;
                .img-wrap {
                    display: none;
                    padding: 5px;
                    background: #fff;
                    width: 213px;
                    height: 123px;
                    position: absolute;
                    bottom: -123px;
                    right: -213px;
                    z-index: 999 !important;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }
    }
</style>
<template>
    <article class="analysis-company-startimg">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>截止到{{date}}日，共{{total}}家连锁设置过客户端启动图</span>
            </div>
            <section class="search">
                <section>
                    <i>企业</i>
                    <CompanySelect  :change="getData" v-model="search.company_id"
                                    v-on:change="val=>search.company_id=val">
                    </CompanySelect>
                </section>
                <DateRange title="创建时间" :start="search.createTime" :end="search.endTime"
                           v-on:changeStart="val=> search.createTime=val"
                           v-on:changeEnd="val=> search.endTime=val"
                           :change="getData">
                </DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="startImgData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        min-width="300"
                        label="图片">
                    <template slot-scope="scope">
                        {{scope.row.logo_app_boot}}
                        <i class="el-icon-picture" v-if="scope.row.logo_app_boot" @mouseover="showImg" @mouseout="hideImg">
                            <div class="img-wrap">
                                <img :src="scope.row.logo_app_boot | fillImgPath"/>
                            </div>
                        </i>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="name"
                        min-width="180"
                        label="企业">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        width="170"
                        label="创建时间">
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
<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import CompanySelect from '../../component/select/IndustryCompany.vue'
    import companyService from '../../../services/companyService'
    function clearFn () {
        return {
            company_id: '',
            createTime: '',
            endTime: '',
        }
    }
    export default {
        components: {
            CompanySelect,
            DateRange
        },
        data () {
            return {
                loading: false,
                startImgData: [],
                currentPage: 1,
                pageSize: 15,
                total: 0,
                date: '',
                search: clearFn()
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            showImg (e) {
                e.target.firstChild.style.display = 'block'
            },
            hideImg (e) {
                e.target.firstChild.style.display = 'none'
            },
            initFetchParam() {
                this.currentPage = 1
                this.search = clearFn()
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                this.loading = true
                return companyService.getCompanyStartLogo({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    company_id: this.search.company_id,
                    time_start: this.search.createTime,
                    time_end: this.search.endTime,
                }).then((ret) => {
                    this.total = ret.total
                    this.startImgData = ret.data
                    this.date = ret.date
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
