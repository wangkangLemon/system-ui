<!--课程分析-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";

    #course-analysis-container {

        .yestoday-container {
            i {

            }
            .yestoday-container-item {
                display: inline-block;
                font-size: 13px;
                > * {
                    display: block;
                }
                h5 {
                    color: #666;
                }

                em {
                    font-size: 22px;
                    color: #333;
                }

                i {
                    color: #bbb;
                    font-size: 12px;

                    span {
                        // 增加
                        &.el-icon-caret-top {
                            color: #13ce66;
                        }
                        // 减少
                        &.el-icon-caret-bottom {
                            color: #fa8072;
                        }
                    }
                }
            }
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
    <article id="course-analysis-container">
        <el-card class="yestoday-container" v-if="false">
            <i>今日数据</i>
            <section class="yestoday-container-item">
                <h5>考试次数</h5>
                <em>{{analysis.total}}</em>
                <i>
                    <span class="el-icon-caret-top">{{analysis.percent}}</span>
                    同比上周
                </i>
            </section>

            <section class="yestoday-container-item">
                <h5>考试人数</h5>
                <em>{{analysis.totalUnique}}</em>
                <i>
                    <span class="el-icon-caret-bottom">{{analysis.percentUnique}}</span>
                    同比上周
                </i>
            </section>
            <section class="yestoday-container-item">
                <h5>及格人数</h5>
                <em>{{analysis.passed}}</em>
                <i>
                    <span class="el-icon-caret-top">10%</span>
                    同比上周
                </i>
            </section>
            <section class="yestoday-container-item">
                <h5>公开课考试次数</h5>
                <em>123456</em>
                <i>
                    <span class="el-icon-caret-top">10%</span>
                    同比上周
                </i>
            </section>
            <section class="yestoday-container-item">
                <h5>私有课考试次数</h5>
                <em>123456</em>
                <i>
                    <span class="el-icon-caret-top">10%</span>
                    同比上周
                </i>
            </section>
            <section class="yestoday-container-item">
                <h5>工业课考试次数</h5>
                <em>123456</em>
                <i>
                    <span class="el-icon-caret-top">10%</span>
                    同比上周
                </i>
            </section>
        </el-card>

        <el-tabs v-model="fetchParam.date" @tab-click="fetchData">
            <el-tab-pane label="昨日" name="yesterday"></el-tab-pane>
            <el-tab-pane label="本周" name="week"></el-tab-pane>
            <el-tab-pane label="上周" name="prevweek"></el-tab-pane>
            <el-tab-pane label="本月" name="month"></el-tab-pane>
            <el-tab-pane label="上月" name="prevmonth"></el-tab-pane>
        </el-tabs>

        <article class="table-container">
            <article class="search">
                <section>
                    <i>课程类型</i>
                    <el-select :clearable="true" v-model="fetchParam.type" placeholder="请选择" @change="fetchData">
                        <el-option label="公开课" value="public"></el-option>
                        <el-option label="私有课" value="private"></el-option>
                        <el-option label="工业课" value="industry"></el-option>
                    </el-select>
                </section>

                <section>
                    <i>课程</i>
                    <CourseSelect v-model="fetchParam.course_id" @change="fetchData"></CourseSelect>
                </section>
            </article>

            <el-table class="data-table" v-loading="loadingData"
                      :data="tableData"
                      :fit="true"
                      border>
                <el-table-column
                        label="课程名称">
                    <template scope="scope">
                        <i>{{scope.row.name}}</i>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="study_user_count"
                        label="学习人数">
                </el-table-column>
                <el-table-column
                        prop="testing_count"
                        label="考试人数">
                </el-table-column>
                <el-table-column
                        label="及格率">
                    <template scope="scope">
                        <i>{{scope.row.passed_rate ? scope.row.passed_rate : 0}}%</i>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small">答案分析</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination class="pagin"
                           @size-change="val => fetchParam.page_size = val "
                           @current-change="val => fetchParam.page = val"
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
    import testingService from '../../services/testingService'
    import courseService from '../../services/courseService'
    import CourseSelect from '../component/select/Course.vue'

    export default{
        data () {
            return {
                analysis: {},
                total: 0,
                loadingData: false,
                tableData: [],
                fetchParam: {
                    date: 'yesterday',
                    page: 1,
                    page_size: 15,
                    type: void 0,
                    course_id: void 0,
                }
            }
        },
        watch: {
            'fetchParam.page_size'() {
                this.fetchData()
            },
            'fetchParam.page'() {
                this.fetchData()
            }
        },
        activated () {
            testingService.getAmount().then((ret) => {
                this.analysis = ret
            })

            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            testenter () {
                console.info(111)
            },
            fetchData () {
                this.loadingData = true
                return courseService.getAnalysis(this.fetchParam).then((ret) => {
                    this.total = ret.total
                    this.tableData = ret.data
                    this.loadingData = false
                })
            }
        },
        components: {CourseSelect}
    }

</script>
