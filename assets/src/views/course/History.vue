<!--考试记录-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";
    @import "../../utils/mixins/common";

    #course-history-container {
        @extend %content-container;

        // 导出按钮
        .export {
            position: absolute;
            right: 0;
            top: -50px;

            i {
                display: inline-block;
                vertical-align: middle;
            }
        }

        .note {
            margin-bottom: 10px;
            color: #F7BA2A;
        }
        .search {
            @extend %top-search-container
        }

        .pagin {
            float: right;
            margin-top: 15px;
        }
    }
</style>

<template>
    <article id="course-history-container">
        <el-button type="warning" class="export" @click="exportData"><i class="iconfont icon-iconfontexcel" :disabled="exporting"></i>
            <i>导出</i></el-button>

        <div class="note">说明：企业选项为内训与工业课程的考试情况</div>
        <article class="search">
            <section>
                <i>企业</i>
                <CompanySelect v-model="fetchParam.enterprise_id" :change="fetchData">
                </CompanySelect>
            </section>
            <section>
                <i>课程</i>
                <CourseSelect :change="fetchData" @change="val => fetchParam.course_id=val"
                              v-model="fetchParam.course_id"></CourseSelect>
            </section>
            <section>
                <i>连锁</i>
                <CompanySelect v-model="fetchParam.company_id" :change="fetchData">
                </CompanySelect>
            </section>
            <section>
                <i>门店</i>
                <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
            </section>
            <section>
                <i>账号</i>
                <el-input placeholder="邮箱或手机号" @keyup.enter.native="fetchData" v-model="fetchParam.account"></el-input>
            </section>
            <section>
                <i>成绩</i>
                <el-select v-model="fetchParam.grade" placeholder="未选择"
                           @change="fetchData" :clearable="true">
                    <el-option label="满分" value="1"></el-option>
                    <el-option label="及格" value="2"></el-option>
                    <el-option label="不及格" value="3"></el-option>
                </el-select>
            </section>

            <DateRange title="考试时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       @changeStart="val=> fetchParam.time_start=val "
                       @changeEnd="val=> fetchParam.time_end=val" :change="fetchData">
            </DateRange>

            <section>
                <i>姓名</i>
                <el-input v-model="fetchParam.user_name" @keyup.enter.native="fetchData"></el-input>
            </section>

            <section>
                <i>课程类型</i>
                <!--public表示公开课，private为内训，industry为工业课程-->
                <el-select v-model="fetchParam.course_type" placeholder="未选择"
                           @change="fetchData" :clearable="true">
                    <el-option label="公开课" value="public"></el-option>
                    <el-option label="内训课" value="private"></el-option>
                    <el-option label="工业课程" value="industry"></el-option>
                </el-select>
            </section>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    min-width="300"
                    label="课程">
                <template scope="scope">
                    <el-tag type="success" v-if="scope.row.enterprise_id == 1">公开</el-tag>
                    <el-tag type="primary" v-else-if="scope.row.enterprise_id == scope.row.store_id">内训</el-tag>
                    <el-tag type="warning" v-else>工业</el-tag>
                    <i>{{scope.row.course_name}}</i>
                </template>
            </el-table-column>
            <el-table-column
                    prop="store_name"
                    label="连锁" min-width="180">
            </el-table-column>
            <el-table-column
                    prop="dep_name"
                    width="330"
                    label="门店">
            </el-table-column>
            <el-table-column
                    prop="user_name"
                    label="店员" width="150">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="score"
                    label="分数">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="成绩">
                <template scope="scope">
                    <el-tag v-if="scope.row.grade == 1" type="success">满分</el-tag>
                    <el-tag v-else-if="scope.row.grade == 2" type="primary">及格</el-tag>
                    <el-tag v-else type="danger">不及格</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time_name"
                    label="考试时间">
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>
    </article>
</template>

<script>
    import testingService from '../../services/testingService'
    import CourseSelect from '../component/select/Course.vue'
    import DateRange from '../component/form/DateRangePicker.vue'
    import CompanySelect from '../component/select/IndustryCompany.vue'
    import DepSelect from '../component/select/Department.vue'

    export default{
        data () {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                fetchParam: {
                    page: void 0,
                    page_size: 15,
                    enterprise_id: void 0,
                    course_id: void 0,
                    company_id: void 0, // 连锁
                    department_id: void 0,
                    account: void 0,
                    time_start: void 0,
                    time_end: void 0,
                    grade: void 0, // 不赋值则为未选择，1位满分，2为及格，3为不及格
                    user_name: void 0, // 用户昵称
                    course_type: void 0, // 课程类型  public表示公开课，private为内训，industry为工业课程
                },
                exporting: false
            }
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleCurrentChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            fetchData () {
                this.loadingData = true
                return testingService.getHistory(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            exportData () {
                this.exporting = true
                testingService.exportTestingHistoryAsync().then(() => {
                    xmview.showTip('success', '任务创建成功! 请到数据分析中查看')
                }, () => {
                }).then(() => {
                    this.exporting = false
                })
//                testingService.exportTesting({
//                    course_id: this.fetchParam.course_id,
//                    company_id: this.fetchParam.company_id,
//                    department_id: this.fetchParam.department_id,
//                    account: this.fetchParam.account,
//                    time_start: this.fetchParam.time_start,
//                    time_end: this.fetchParam.time_end,
//                    grade: this.fetchParam.grade
//                })
            }
        },
        components: {CourseSelect, DateRange, CompanySelect, DepSelect}
    }
</script>
