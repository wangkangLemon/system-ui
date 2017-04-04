<!--公开课管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #course-manage-public-container {
        @extend %content-container;

        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <article id="course-manage-public-container">
        <article class="search">
            <h1>部分查询选项接口未完成</h1>

            <section>
                <i>课程名称</i>
                <vInput :enter="fetchData"></vInput>
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
    import courseService from '../../../services/courseService'
    import vInput from '../../component/form/Input.vue'

    export default{
        data () {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                fetchParam: {
                    date: void 0, // yesterday 为昨日，week为本周，prevweek 为上周，month为本月，prevmonth 为上月
                    store_id: void 0,
                    type: void 0, // public 为公开课，private 为私有课，industry为工业课，不赋值则表示全部
                    course_id: void 0,
                    page: 1,
                    page_size: 15
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
                return courseService.getCourseList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            }
        },
        components: {vInput}
    }
</script>
