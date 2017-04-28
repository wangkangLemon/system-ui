<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";

    #feedback-index {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            margin-top: 15px;
        }

        .el-dialog__wrapper {
            padding-top: 15px;
            background: rgba(0, 0, 0, .5);
            z-index: 1000;
        }
    }
</style>

<template>
    <main id="feedback-index">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="$router.push({name:'feedback-add'})"><i>提交工单</i></el-button>
        </section>

        <main class="search">
            <section>
                <i>工单状态</i>
                <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="未分配" value="0"></el-option>
                    <el-option label="处理中" value="1"></el-option>
                    <el-option label="待补充" value="2"></el-option>
                    <el-option label="已补充待处理" value="3"></el-option>
                    <el-option label="已处理待确认" value="4"></el-option>
                    <el-option label="已关闭" value="9"></el-option>
                </el-select>
            </section>

            <DateRange title="提交时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       v-on:changeStart="val=> fetchParam.time_start=val"
                       v-on:changeEnd="val=> fetchParam.time_end=val"
                       :change="fetchData">
            </DateRange>
        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" border>
            <el-table-column width="100" prop="id" label="工单编号"></el-table-column>
            <el-table-column width="120" prop="category_name" label="问题分类"></el-table-column>
            <el-table-column prop="content" label="问题描述"></el-table-column>
            <el-table-column width="180" prop="create_time_name" label="提交时间"></el-table-column>
            <el-table-column width="100" prop="status_name" label="状态"></el-table-column>
            <el-table-column width="100" prop="operate" label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" @click="showFn(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="deleteFn(scope.row)">删除</el-button>
                </template>
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

    </main>
</template>

<script>
    import feedbackService from '../../services/feedback/user'
    import vInput from '../component/form/Input.vue'
    import DateRange from '../component/form/DateRangePicker.vue'
    export default {
        components: {
            vInput,
            DateRange
        },
        data() {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                dialogVisible: false,
                fetchParam: {
                    status: -1,
                    category_id: void 0,
                    page: 1,
                    page_size: 15,
                    time_start: void '',
                    time_end: void ''
                }
            }
        },
        watch: {
            'fetchParam.status': function (newVal) {
                if (newVal == '') {
                    this.fetchParam.status = -1
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
            fetchData (val) {
                this.loadingData = true
                return feedbackService.search(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            }
        }
    }
</script>
