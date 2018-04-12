<!--商品列表-->
<style lang='scss' rel='stylesheet/scss'>
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";

#newcourse-course-public-container {
    @extend %content-container;

    .manage-container {
        .el-dropdown {
            margin-right: 10px;
        }
        @extend %right-top-btnContainer;
        >* {
            color: #fff;
            border-radius: 5px;
        } // 添加课程
        .add {
            background: rgb(0, 204, 255);
        } 
    }

    .search {
        @extend %top-search-container;
    } // 底部的管理按钮
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
    <main id="newcourse-course-public-container">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'yshi-goods-add'})" v-operation="auth.com_course_create"><i>添加商品</i>
            </el-button>
        </section>

        <main class="search">
            <section>
                <i>名称</i>
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </section>
            <DateRange title="创建时间" :start="fetchParam.start_time" :end="fetchParam.end_time" @changeStart="val=> {fetchParam.start_time=val}" @changeEnd="val=> {fetchParam.end_time=val}" :change="fetchData">
            </DateRange>

        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true"  border>
            <el-table-column align="center" min-width="300" prop="name" label="名称">
            </el-table-column>
            <el-table-column align="center" min-width="100" prop="object_count" label="素材数">
            </el-table-column>
            <el-table-column align="center" width="130" prop="price" label="原价">
            </el-table-column>
            <el-table-column align="center" width="130" prop="favorable_price" label="优惠价">
            </el-table-column>
            <el-table-column align="center" width="190" prop="create_time" label="创建时间">
            </el-table-column>
            <el-table-column align="center" width="200" label="操作">
                <template slot-scope="scope">
                    <el-button @click="preview(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                    <el-button 
                        @click="$router.push({name: 'yshi-goods-edit', params: {good_id: scope.row.id}})" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.status == 0 || creatorDisabled(scope.row.creator_id)">
                        编辑
                    </el-button>
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.status == 0 || creatorDisabled(scope.row.creator_id)">
                        删除
                    </el-button>
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
            :total="total"></el-pagination>

    </main>
</template>

<script>
import goodsService from 'services/yshi/goodsService'
import DateRange from 'components/form/DateRangePicker.vue'
import * as _ from 'utils/common'
function getFetchParam () {
    return {
        name: void '',
        start_time: '',
        end_time: '',
        page: 1,
        page_size: 15
    }
}
export default {
    data () {
        return {
            data: [], // 表格数据
            total: 0,
            dialogVisible: false,
            fetchParam: getFetchParam(),
            dialogTree: {
                isShow: false,
                selectedId: void 0,
            }
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        handleType (type) {
            if (type === 'course') this.$router.push({name: 'course-manage-addCourse'})
            else this.$router.push({name: 'newcourse-course-add'})
        },
        initFetchParam () {
            this.fetchParam = getFetchParam()
        },
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
            let fetchParam = _.clone(this.fetchParam)
            fetchParam.status = (!fetchParam.status && fetchParam.status !== 0) ? -1 : fetchParam.status
            return goodsService.searchGoods(fetchParam).then((ret) => {
                this.data = ret.data
                this.total = ret.total
                this.loadingData = false
                xmview.setContentLoading(false)
            })
        },
        // 单条删除
        del (index, row) {
            xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                goodsService.delete(row.id).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                })
            })
        },
    },
    components: { DateRange }
}
</script>
