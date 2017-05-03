<!--小应用-->
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
        }
    }
</style>
<template>
    <article class="analysis-company-startimg">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>截止到2017-02-09日，共152家连锁设置小应用</span>
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
                    :data="hybridData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="title"
                        min-width="300"
                        label="应用名称">
                </el-table-column>
                <el-table-column
                        prop="company"
                        min-width="180"
                        label="链接">
                </el-table-column>
                <el-table-column
                        prop="company"
                        min-width="180"
                        label="企业">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        min-width="180"
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
    export default {
        components: {
            CompanySelect,
            DateRange
        },
        data () {
            return {
                loading: false,
                hybridData: [],
                currentPage: 1,
                pageSize: 15,
                total: 0,
                search: {
                    company_id: '',
                    createTime: '',
                    endTime: '',
                }
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            handleSizeChange (val) {
                this.pageSize = val
            },
            handleCurrentChange (val) {
                this.currentPage = val
            },
            getData () {
                console.log(1)
            }
        }
    }
</script>
