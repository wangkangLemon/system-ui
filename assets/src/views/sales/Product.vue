<!--药品列表-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";

    #sales-procuct-container {
        padding: 15px;
        background: #fff;
        border-radius: 6px;
        overflow: hidden;

        .data-table {
            margin-top: 15px;
        }

        .pagin {
            float: right;
            margin-top: 10px;
        }

        .search {
            @extend %top-search-container
        }
    }
</style>

<template>
    <article id="sales-procuct-container">
        <article class="search">
            <section>
                <i>工业</i>
                <IndustryCompanySelect type="1" v-model="fetchParam.enterprise_id"
                                       :change="fetchData">
                </IndustryCompanySelect>
            </section>
            <section>
                <i>名称</i>
                <el-input @change="fetchData" v-model="fetchParam.keyword" placeholder="药品名称"></el-input>
            </section>
            <section>
                <i>状态</i>
                <el-select @change="fetchData"
                           v-model="fetchParam.deleted"
                           placeholder="未选择">
                    <el-option label="全部" :value="undefined"></el-option>
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="已删除" value="1"></el-option>
                </el-select>
            </section>

            <DateRange title="晒单时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       v-on:changeStart="val=> fetchParam.time_start=val "
                       v-on:changeEnd="val=> fetchParam.time_end=val "
                       :change="fetchData">
            </DateRange>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    width="180"
                    prop="name"
                    label="名称">
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="ent_name"
                    label="工业">
            </el-table-column>
            <el-table-column
                    prop="description"
                    label="描述">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="deleted"
                    label="状态">
                <template scope="scope">
                    <el-tag v-if="scope.row.deleted">已删除</el-tag>
                    <el-tag v-else type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @current-change="handleCurrentChange"
                       :current-page="start"
                       :page-size="pagesize"
                       layout="total, prev, pager, next"
                       :total="total">
        </el-pagination>
    </article>
</template>

<script>
    import salesService from '../../services/salesService'
    import IndustryCompanySelect from '../component/select/IndustryCompany.vue'
    import DateRange from '../component/form/DateRangePicker.vue'
    import * as filters from '../../filters/timeFilter'

    export default{
        filters,
        data () {
            return {
                loadingData: false,
                loadingSelectIndustry: false, // 工业下拉列表loading
                data: [],
                total: 0,
                pagesize: 15,
                start: 1, // 当前第几页
                fetchParam: {
                    time_start: void 0, // 时间范围
                    time_end: void 0, // 药品名称
                    enterprise_id: void 0, // 工业ID
                    deleted: void 0, // 删除状态
                },
            }
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            }, () => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loadingData = true
                let fetchParam = Object.assign({}, this.fetchParam, {
                    start: this.start,
                    length: this.pagesize
                })

                return salesService.getProductList(fetchParam)
                    .then(ret => {
                        this.data = ret.data
                        this.total = ret.total

                        setTimeout(() => {
                            this.loadingData = false
                        }, 200)
                    })
            },
            // 处理页码变化
            handleCurrentChange (val) {
                this.start = val
                this.fetchData()
            },
        },
        components: {IndustryCompanySelect, DateRange}
    }
</script>
