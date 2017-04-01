<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";

    #course-history-container {
        padding: 15px;
        position: relative;
        border: 1px solid #ededed;
        border-radius: 5px;
        background: #fff;
        overflow: hidden;

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
        <el-button class="export"><i class="iconfont icon-iconfontexcel"></i> <i>导出</i></el-button>

        <article class="search">
            <h1 style="color:red">还有部分查询未完成 等待接口</h1>
            <CourseSelect :change="fetchData" @change="val => fetchParam.course_id=val"
                          v-model="fetchParam.course_id"></CourseSelect>

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
                <i>账号</i>
                <v-input @changeVal="val=>fetchParam.account=val" :enter="fetchData" v-model="fetchParam.account"
                placeholder="账号"></v-input>
            </section>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    width="300"
                    prop="course_name"
                    label="课程">
            </el-table-column>
            <el-table-column
                    prop="ent_name"
                    label="连锁">
            </el-table-column>
            <el-table-column
                    prop="dep_name"
                    label="门店">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="user_name"
                    label="店员">
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
    import vInput from '../component/form/Input.vue'
    export default{
        data () {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                fetchParam: {
                    page: void 0,
                    page_size: 15,
                    course_id: void 0,
                    company_id: void 0, // 连锁
                    department_id: void 0,
                    account: void 0,
                    time_start: void 0,
                    time_end: void 0,
                    grade: void 0, // 不赋值则为未选择，1位满分，2为及格，3为不及格
                }
            }
        },
        created () {
            this.fetchData()
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
                testingService.getHistory(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            }
        },
        components: {CourseSelect, DateRange, vInput}
    }
</script>
