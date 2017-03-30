<!--药品列表-->
<style lang='scss' scoped rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";

    #sales-procuct-container {
        padding: 15px;
        background: #fff;
        border-radius: 6px;
        overflow: hidden;
    }

    .data-table {
        margin-top: 15px;
    }

    .pagin {
        float: right;
        margin-top: 15px;
    }

    .search {
        @extend %top-search-container
    }
</style>

<template>
    <article id="sales-procuct-container">
        <article class="search">
            <section>
                <i>工业</i>
                <el-select v-loading="loadingSelectIndustry"
                           @visible-change="handleIndustrySelChange"
                           @change="fetchData"
                           v-model="fetchParam.enterprise_id"
                           placeholder="请选择">
                    <el-option
                            v-for="item in industry"
                            :label="item.name"
                            :value="item.id" :key="item.id">
                    </el-option>
                </el-select>
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

<script lang='babel'>
    import salesService from '../../services/salesService'

    export default{
        data () {
            return {
                loadingData: false,
                loadingSelectIndustry: false, // 工业下拉列表loading
                data: [],
                total: 0,
                pagesize: 15,
                start: 1, // 当前第几页
                industry: [{name: '全部'}], // 工业下拉数据
                fetchParam: {
                    keyword: void 0, // 药品名称
                    enterprise_id: void 0, // 工业ID
                    time_start: void 0, // 开始时间
                    time_end: void 0, // 结束时间
                    deleted: void 0, // 删除状态
                },
            }
        },
        created () {
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
            // 处理工业下拉框点击
            handleIndustrySelChange () {
                if (this.industry.length > 1)
                    return

                this.loadingSelectIndustry = true
                salesService.getIndrustrySelectList().then(ret => {
                    this.industry.push(...ret.data)
                    this.loadingSelectIndustry = false
                }).catch(() => {
                    this.loadingSelectIndustry = false
                })
            }
        }
    }
</script>
