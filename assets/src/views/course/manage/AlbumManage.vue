<!--专辑管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";

    #course-manage--albummanage {
        @extend %content-container;
        .manage-container {
            @extend %right-top-btnContainer;
        }
    }
</style>

<template>
    <article id="course-manage--albummanage">
        <section class="manage-container">
            <el-button type="primary" icon="plus">
                <i>新建专辑</i>
            </el-button>
        </section>

        <article class="search">
            <section>
                <i>专辑名称</i>
                <vInput :enter="fetchData" v-model="fetchParam.keyword"></vInput>
            </section>

            <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       @changeStart="val=> fetchParam.time_start=val "
                       @changeEnd="val=> fetchParam.time_end=val" :change="fetchData">
            </DateRange>
        </article>

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
    import DateRange from '../../component/form/DateRangePicker.vue'
    import vInput from '../../component/form/Input.vue'
    export default{
        data () {
            return {
                data: [],
                fetchParam: {
                    page: 1,
                    page_size: 15,
                    keyword: void 0,
                    time_start: void 0,
                    time_end: void 0
                }
            }
        },
        watch: {
            'fetchParam.page_size'() {

            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            fetchData () {
                courseService.getAlbumList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                })
            }
        },
        components: {vInput, DateRange}
    }
</script>
