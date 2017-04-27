<!--课程分析-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";

    #course-analysis-container {

        .yestoday-container {
            height: 134px;
            margin-bottom: 5px;
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
    <article id="course-analysis-container">
        <el-card v-if="false" class="yestoday-container">
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
        <el-button class="export" @click="exportClick"><i class="iconfont icon-iconfontexcel"></i> <i>导出</i></el-button>

        <article class="table-container">
            <article class="search">
                <section v-if="type == 0">
                    <i>课程类型</i>
                    <el-select :clearable="true" v-model="fetchParam.type" placeholder="请选择" @change="fetchData">
                        <el-option label="公开课" value="public"></el-option>
                        <el-option label="私有课" value="private"></el-option>
                        <el-option label="工业课" value="industry"></el-option>
                    </el-select>
                </section>
                <section v-if="type == 0">
                    <i>课程</i>
                    <CourseSelect @change="val=>{ fetchParam.course_id = val;fetchData() }"></CourseSelect>
                </section>

                <section v-if="type == 1">
                    <i>连锁部门</i>
                    <StoreSelect :type="2" @change="val=>{ fetchParam.store_id=val; fetchData() }"></StoreSelect>
                </section>

                <section v-if="type == 2">
                    <i>门店名称</i>
                    <DepSelect @change="val=>{ fetchParam.department_id=val; fetchData() }"></DepSelect>
                </section>
            </article>

            <el-table class="data-table" v-loading="loadingData"
                      :data="tableData"
                      :fit="true"
                      border>
                <el-table-column v-if="type == 0" label="课程名称">
                    <template scope="scope">
                        <el-button type="text"
                                   @click="$router.push({name:'course-analysis', query:{ type:1,course_id: scope.row.course_id }})">
                            <el-tag type="success" v-if="scope.row.course_type === 'public'">公开课</el-tag>
                            <el-tag type="primary" v-else-if="scope.row.course_type === 'industry'">工业课</el-tag>
                            <el-tag type="warning" v-else>私有课</el-tag>
                            <i> {{scope.row.name}}</i>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column v-if="type == 1 || type == 2" :label="type == 1 ? '连锁名称' : '门店名称'">
                    <template scope="scope">
                        <el-button type="text"
                                   @click="$router.push({name:'course-analysis',
                                   query:{ type:type+1,course_id: scope.row.course_id, store_id:scope.row.company_id, department_id:scope.row.department_id }})">
                            <i> {{scope.row.name}}</i>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="店员姓名" v-if="type == 3"></el-table-column>

                <el-table-column prop="study_user_count" label="学习人数" v-if="type != 3" width="100"></el-table-column>
                <el-table-column v-if="type == 1 || type == 2" prop="unstudy_user_count" width="120" label="未学习人数">
                </el-table-column>
                <el-table-column prop="testing_count" label="考试人数" v-if="type != 3" width="100"></el-table-column>
                <el-table-column prop="passed" label="及格人数" v-if="type != 3" width="100"></el-table-column>
                <el-table-column v-if="type != 3" label="及格率" width="100">
                    <template scope="scope">
                        <i>{{scope.row.passed_rate ? scope.row.passed_rate : 0}}%</i>
                    </template>
                </el-table-column>
                <el-table-column v-if="type == 0" label="操作" width="100">
                    <template scope="scope">
                        <el-button type="text" size="small"
                                   @click="$router.push({name:'course-manage-course-answer-analysis', params:{id:scope.row.course_id}})">
                            <i>答案分析</i>
                        </el-button>
                    </template>
                </el-table-column>

                <el-table-column v-if="type == 3" prop="job" label="职务"></el-table-column>
                <el-table-column v-if="type == 3" prop="department_name" label="门店名称"></el-table-column>
                <el-table-column v-if="type == 3" label="学习进度">
                    <template scope="scope">
                        <i>{{scope.row.complete_rate}} %</i>
                    </template>
                </el-table-column>
                <el-table-column v-if="type == 3" prop="testing" label="考试次数"></el-table-column>
                <el-table-column v-if="type == 3" prop="grade_name" label="最高成绩"></el-table-column>
                <el-table-column v-if="type == 3" prop="score_max" label="最高分数"></el-table-column>
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
    import testingService from '../../services/testingService'
    import courseService from '../../services/courseService'
    import CourseSelect from '../component/select/Course.vue'
    import DepSelect from '../component/select/Department.vue'
    import StoreSelect from '../component/select/IndustryCompany.vue'

    export default{
        data () {
            return {
                analysis: {},
                total: 0,
                loadingData: false,
                tableData: [],
                type: 0,
                pageType: 0, // 0-课程分析 1-连锁学习情况 2-门店学习情况  3-店员学习情况
                fetchParam: {
                    date: 'yesterday',
                    page: 1,
                    page_size: 15,
                    type: void 0,
                    course_id: void 0,
                    department_id: void 0,
                    store_id: void 0
                }
            }
        },
        watch: {
            '$route' () {
                if (this.$route.name !== 'course-analysis') return
                this.type = parseInt(this.$route.query.type) || 0
                this.fetchParam.course_id = this.$route.query.course_id
                this.fetchParam.department_id = this.$route.query.department_id
                this.fetchParam.store_id = this.$route.query.store_id
                this.fetchParam.page = 1
                this.fetchData()

                // 设置返回按钮
                xmview.setContentBack(this.type > 0)
            }
        },
        activated () {
            testingService.getAmount().then((ret) => {
                this.analysis = ret
            })

            this.type = parseInt(this.$route.query.type) || 0
            this.fetchParam.course_id = this.$route.query.course_id
            this.fetchParam.department_id = this.$route.query.department_id
            this.fetchParam.store_id = this.$route.query.store_id
            // 页面加载一次
            this.fetchData()

            xmview.setContentBack(this.type > 0)
        },
        methods: {
            fetchData () {
                this.loadingData = true
                let p
                if (this.type == 0) p = courseService.getAnalysis(this.fetchParam)
                else if (this.type == 1) p = courseService.getStoreLearn(this.fetchParam)
                else if (this.type == 2) p = courseService.getDepLearn(this.fetchParam)
                else p = courseService.getUserLearn(this.fetchParam)

                p.then((ret) => {
                    this.total = ret.total
                    this.tableData = ret.data
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })

                return p
            },
            // 导出点击
            exportClick () {
                if (this.type == 0) courseService.exportAnalysis(this.fetchParam)
                else if (this.type == 1) courseService.exportStoreLearn(this.fetchParam)
                else if (this.type == 2) courseService.exportDepLearn(this.fetchParam)
                else courseService.exportUserLearn(this.fetchParam)
            }
        },
        components: {CourseSelect, DepSelect, StoreSelect}
    }

</script>
