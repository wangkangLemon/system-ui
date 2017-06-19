<!--课程分析-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #analysis-company-stat {

        .yestoday-container {
            height: 134px;
            margin-bottom: 5px;
            i {

            }
        }

        .export {
            float: right;
            margin-top: 7px;
        }

        .el-tabs {
            display: inline-block;
        }

        .table-container {
            @extend %content-container;

            .search {
                @extend %top-search-container;
            }
        }
    }
</style>

<template>
    <article id="analysis-company-stat">
        <el-tabs v-model="fetchParam.date" @tab-click="fetchData">
            <el-tab-pane label="昨日" name="yesterday"></el-tab-pane>
            <el-tab-pane label="上周" name="prevweek"></el-tab-pane>
            <el-tab-pane label="上月" name="prevmonth"></el-tab-pane>
            <el-tab-pane label="全部" name="all"></el-tab-pane>
        </el-tabs>
        <el-button type="warning" class="export" @click="exportClick"><i class="iconfont icon-iconfontexcel"></i>
            <i>导出</i></el-button>

        <article class="table-container">
            <article class="search">
            </article>

            <el-table class="data-table" v-loading="loadingData"
                      :data="tableData"
                      :fit="true"
                      border>
                <el-table-column v-if=" type == 0" label="企业名称" min-width="200">
                    <template scope="scope">
                        <el-button type="text"
                                   @click="$router.push({name:'analysis-company-stat-view', query:{ type:1,course_id: scope.row.id }})">
                            <i> {{scope.row.company_name}}</i>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="active_user"
                        min-width="100"
                        label="活跃店员数量">
                </el-table-column>
                <el-table-column
                        prop="course_user"
                        min-width="100"
                        label="学习人数">
                </el-table-column>
                <el-table-column
                        prop="testing_user"
                        min-width="100"
                        label="考试人数">
                </el-table-column>
                <el-table-column
                        prop="testing_number"
                        min-width="100"
                        label="考试次数">
                </el-table-column>
                <el-table-column
                        prop="private_number"
                        min-width="100"
                        label="私有课数量">
                </el-table-column>
                <el-table-column
                        prop="private_testing"
                        min-width="100"
                        label="私有课考试次数">
                </el-table-column>
                <el-table-column
                        prop="private_testing_user"
                        min-width="100"
                        label="私有课考试人数">
                </el-table-column>
            </el-table>

            <el-pagination class="pagin"
                           @size-change="val => {fetchParam.page_size = val; fetchData() }"
                           @current-change="val => {fetchParam.page = val; fetchData() }"
                           :current-page="fetchParam.page"
                           :page-size="fetchParam.page_size"
                           :page-sizes="[15, 30, 60, 100]"
                           layout="sizes,total, prev, pager, next"
                           :total="total">
            </el-pagination>
        </article>
    </article>
</template>

<script>
    import companyService from '../../../services/companyService'
    import CourseSelect from '../../component/select/Course.vue'
    import DepSelect from '../../component/select/Department.vue'
    import StoreSelect from '../../component/select/IndustryCompany.vue'

    export default{
        filters: {
            passedPercent (val) {
                if (val) return parseInt(val * 100) + '%'
                else return '-'
            }
        },
        data () {
            return {
                analysis: {},
                total: 0,
                loadingData: false,
                tableData: [],
                type: 0,
                fetchParam: getFetchParam()
            }
        },
        activated () {
            this.type = parseInt(this.$route.query.type) || 0
            this.fetchParam.course_id = this.$route.query.course_id
            this.fetchParam.department_id = this.$route.query.department_id
            this.fetchParam.store_id = this.$route.query.store_id
            // 页面加载一次
            this.fetchData()

            xmview.setContentBack(this.type > 0)
        },
        methods: {
            initFetchParam () {
                this.fetchParam = getFetchParam()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchParam.getData()
            },
            handleCurrentChange (val) {
                this.page = val
                this.getData()
            },
            fetchData () {
                this.loadingData = true
                return companyService.getCompanyStat({
                    page: this.fetchParam.page,
                    page_size: this.fetchParam.page_size,
                    stat_date: this.fetchParam.date,
                }).then((ret) => {
                    console.log(ret)
                    this.total = ret.total
                    this.tableData = ret.data
                    this.loadingData = false
                })
            },
            // 导出点击
            exportClick () {
//                if (this.type == 0) courseService.exportAnalysis(this.fetchParam)
//                else if (this.type == 1) courseService.exportStoreLearn(this.fetchParam)
//                else if (this.type == 2) courseService.exportDepLearn(this.fetchParam)
//                else courseService.exportUserLearn(this.fetchParam)
            }
        },
        components: {CourseSelect, DepSelect, StoreSelect}
    }

    function getFetchParam () {
        return {
            date: 'yesterday',
            page: 1,
            page_size: 15,
            type: void 0,
            course_id: void 0,
            department_id: void 0,
            store_id: void 0
        }
    }
</script>
