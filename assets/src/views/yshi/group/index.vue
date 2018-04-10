<!--课程列表-->
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
        } 
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
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'yshi-group-add'})" v-operation="auth.com_course_create"><i>创建组合售卖</i>
            </el-button>
        </section>

        <main class="search">
            <section>
                <i>名称</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>状态</i>
                <el-select v-model="fetchParam.status" placeholder="未选择" @change="fetchData" :clearable="true">
                    <el-option label="正常" value="0"></el-option>
                    <el-option label="下线" value="1"></el-option>
                </el-select>
            </section>
            <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end" @changeStart="val=> {fetchParam.time_start=val}" @changeEnd="val=> {fetchParam.time_end=val}" :change="fetchData">
            </DateRange>

        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true"  border>
            <el-table-column align="center" min-width="300" prop="name" label="组合名称">
            </el-table-column>
            <el-table-column align="center" min-width="100" prop="creator_id" label="商品数">
            </el-table-column>
            <el-table-column align="center" min-width="100" prop="creator_id" label="优惠阶梯数">
            </el-table-column>
            <el-table-column align="center" width="130" prop="award_price_float" label="满">
            </el-table-column>
            <el-table-column align="center" width="130" prop="price" label="打折">
            </el-table-column>
            <el-table-column align="center" width="100" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">已上线</el-tag>
                    <el-tag v-else type="info">已下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" width="190" prop="create_time_name" label="创建时间">
            </el-table-column>
            <el-table-column align="center" width="180" label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="preview(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                    <el-button 
                        @click="$router.push({name: 'yshi-group-edit', params: {course_id: scope.row.id}})" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.status == 0 || creatorDisabled(scope.row.creator_id)">
                        编辑
                    </el-button>
                    <el-button 
                        @click="offline(scope.$index, scope.row)" 
                        type="text" 
                        size="small"
                        :disabled="creatorDisabled(scope.row.creator_id)">
                        <i>{{ scope.row.status == 1 ? '上线' : '下线' }}</i>
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
import courseService from 'services/newcourse/courseService'
import DateRange from 'components/form/DateRangePicker.vue'
import * as _ from 'utils/common'
function getFetchParam () {
    return {
        keyword: void '',
        status: void 0, // 1 下线，0 正常
        category_id: void 0, // 栏目id
        time_start: void 0,
        time_end: void 0,
        page: 1,
        page_size: 15,
        course_type: 'private',
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
            return courseService.search(fetchParam).then((ret) => {
                this.data = ret.data
                this.total = ret.total
                this.loadingData = false
                this.selectedIds = []
                xmview.setContentLoading(false)
            })
        },
        // 下线 或者上线课程 0为下线，1为上线
        offline (index, row) {
            let txt = row.status == 0 ? '下线' : '上线'
            let finalStatus = row.status == 0 ? 1 : 0
            let reqFn = row.status == 0 ? courseService.offline : courseService.online
            xmview.showDialog(`你将要${txt}课程 <span style="color:red">${row.name}</span> 确认吗?`, () => {
                reqFn(row.id).then((ret) => {
                    row.status = finalStatus
                })
            })
        },
        // 单条删除
        del (index, row) {
            xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                courseService.delete(row.id).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                })
            })
        },
    },
    components: { DateRange }
}
</script>
