<!--弹框设置-->
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
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'yshi-dialog-add'})"><i>创建弹框</i>
            </el-button>
        </section>
        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true"  border>
            <el-table-column align="left" min-width="200" prop="name" label="推广名称">
            </el-table-column>
            <el-table-column align="left" min-width="250" prop="url" label="跳转链接">
            </el-table-column>
            <el-table-column align="left" width="190" prop="create_time" label="创建时间">
            </el-table-column>
            <el-table-column align="left" width="190" prop="end_time" label="截止时间">
                <template slot-scope="scope">
                    <p v-if="scope.row.end_time">{{scope.row.end_time}}</p>
                    <p v-else>--</p>
                </template>
            </el-table-column>
            <el-table-column align="left" width="180" label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="$router.push({name: 'yshi-dialog-preview', params: {dialog_id: scope.row.id}})" type="text" size="small">查看</el-button>
                    <el-button 
                        @click="$router.push({name: 'yshi-dialog-edit', params: {dialog_id: scope.row.id}})" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.status == 2">
                        编辑
                    </el-button>
                    <el-button 
                        @click="offline(scope.$index, scope.row)" 
                        type="text" 
                        size="small">
                        <i>{{ scope.row.status == 1 ? '启动' : '撤销' }}</i>
                    </el-button>
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.status == 2">
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
import toastService from 'services/yshi/toastService'
import DateRange from 'components/form/DateRangePicker.vue'
import * as _ from 'utils/common'
import * as timeUtils from 'utils/timeUtils'
function getFetchParam () {
    return {
        page: 1,
        page_size: 15,
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
            return toastService.searchToast(fetchParam).then((ret) => {
                this.data = ret.list
                this.total = ret.total
                this.loadingData = false
                xmview.setContentLoading(false)
            })
        },
        // 下线 或者上线课程 1为下线，2为上线
        offline (index, row) {
            if(row.status == 1) {
                let date = new Date(row.end_time)
                let compare = timeUtils.compareDateTime(date, new Date())
                if (compare !== 1){
                    xmview.showTip('error', '截止时间已到期，请先修改。')
                    return
                }
            }
            let txt = row.status == 2 ? '撤销' : '启动'
            let finalStatus = row.status == 1 ? 2 : 1
            xmview.showDialog(`你将要${txt}课程 <span style="color:red">${row.name}</span> 确认吗?`, () => {
                toastService.statusline(row.id, finalStatus).then((ret) => {
                    row.status = finalStatus
                    this.fetchData()
                })
            })
        },
        // 单条删除
        del (index, row) {
            xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                toastService.delete(row.id).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                })
            })
        },
    },
    components: { DateRange }
}
</script>
