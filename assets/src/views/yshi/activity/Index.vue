<!--活动列表-->
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
    .i-url{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 20px;
        width: 150px;
        float: left;
        margin-right: 10px;
    }
}
</style>

<template>
    <main id="newcourse-course-public-container">
        <section class="manage-container">
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'yshi-activity-add'})"><i>创建打包售卖</i>
            </el-button>
        </section>

        <main class="search">
            <section>
                <i>活动名称</i>
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>状态</i>
                <el-select v-model="fetchParam.status" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="上线" value="2"></el-option>
                    <el-option label="下线" value="1"></el-option>
                </el-select>
            </section>
            <DateRange title="创建时间" :start="fetchParam.start_time" :end="fetchParam.end_time" @changeStart="val=> {fetchParam.start_time=val}" @changeEnd="val=> {fetchParam.end_time=val}" :change="fetchData">
            </DateRange>

        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true"  border>
            <el-table-column align="left" min-width="200" prop="name" label="活动名称">
            </el-table-column>
            <el-table-column align="left" min-width="80" prop="goods_count" label="商品数">
            </el-table-column>
            <el-table-column align="left" width="130" prop="price" label="原价">
            </el-table-column>
            <el-table-column align="left" width="130" prop="favorable_price" label="优惠价">
            </el-table-column>
            <el-table-column align="left" width="80" prop="order" label="排序">
            </el-table-column>
            <el-table-column align="left" width="250" prop="url" label="链接">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" :content="scope.row.url" placement="top">
                        <p class="i-url">{{scope.row.url}}</p>
                    </el-tooltip>
                    <el-button type="text" size="small" v-clipboard="copy(scope.row)" @success="handleSuccess" @error="handleError" >
                        点击复制
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column align="left" width="190" prop="end_time" label="截止时间">
                <template slot-scope="scope">
                    <p v-if="scope.row.end_time">{{scope.row.end_time}}</p>
                    <p v-else>--</p>
                </template>
            </el-table-column>
            <el-table-column align="left" width="190" prop="create_time" label="创建时间">
            </el-table-column>
            <el-table-column align="left" width="180" label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="$router.push({name: 'yshi-activity-preview', params: {activity_id: scope.row.id}})" type="text" size="small">查看</el-button>
                    <el-button 
                        @click="$router.push({name: 'yshi-activity-edit', params: {activity_id: scope.row.id}})" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.status == 2">
                        编辑
                    </el-button>
                    <el-button 
                        @click="offline(scope.$index, scope.row)" 
                        type="text" 
                        size="small">
                        <i>{{ scope.row.status == 1 ? '上线' : '下线' }}</i>
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
        <ErrorDialog :error="error"></ErrorDialog>
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
import activityService from 'services/yshi/activityService'
import DateRange from 'components/form/DateRangePicker.vue'
import * as _ from 'utils/common'
import * as timeUtils from 'utils/timeUtils'
import ErrorDialog from 'components/dialog/ErrorDialog.vue'
function getFetchParam () {
    return {
        name: void '',
        status: void 0, // 1 下线，0 正常
        start_time: void 0,
        end_time: void 0,
        page: 1,
        page_size: 15,
    }
}
export default {
    data () {
        return {
            data: [], // 表格数据
            total: 0,
            copyData: '',
            xxx: 'sdf',
            dialogVisible: false,
            fetchParam: getFetchParam(),
            error: {
                showDialog: false,
                message: '',
                data: []
            }
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
        copy (row) {
            return row.url
        },
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
            fetchParam.status = (!fetchParam.status && fetchParam.status !== 1) ? 0 : fetchParam.status
            return activityService.searchActivity(fetchParam).then((ret) => {
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
            let txt = row.status == 2 ? '下线' : '上线'
            let finalStatus = row.status == 1 ? 2 : 1
            xmview.showDialog(`你将要${txt}课程 <span style="color:red">${row.name}</span> 确认吗?`, () => {
                activityService.statusline(row.id, finalStatus).then((ret) => {
                    row.status = finalStatus
                })
            })
        },
        // 单条删除
        del (index, row) {
            xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                activityService.delete(row.id).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                }).catch(ret => {
                    console.log(ret)
                    this.error.message = ret.data.message
                    this.error.data = ret.data.list
                    this.error.showDialog = true
                })
            })
        },
        handleSuccess(e) {
            console.log(e)
            xmview.showTip('success', '复制成功')
        },
        handleError (e) {
            xmview.showTip('error', '复制失败')
        }
        
    },
    components: { DateRange, ErrorDialog }
}
</script>
