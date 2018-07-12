<!--组合商品列表-->
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
            <el-button type="primary" icon="el-icon-plus" @click="$router.push({name: 'yshi-live-add'})"><i>新建课程</i>
            </el-button>
        </section>

        <main class="search">
            <section>
                <i>课程名称</i>
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>课程状态</i>
                <el-select v-model="fetchParam.status" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="未直播" :value="liveStatus.unlive"></el-option>
                    <el-option label="直播中" :value="liveStatus.living"></el-option>
                    <el-option label="已直播" :value="liveStatus.lived"></el-option>
                    <el-option label="已录播" :value="liveStatus.taped"></el-option>
                </el-select>
            </section>
            <DateRange title="创建时间" :start="fetchParam.start_date" :end="fetchParam.end_date" @changeStart="val=> {fetchParam.start_date=val}" @changeEnd="val=> {fetchParam.end_date=val}" :change="fetchData">
            </DateRange>

        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true"  border>
            <el-table-column align="left" min-width="200" prop="name" label="课程名称">
            </el-table-column>
            <el-table-column align="left" width="100" label="课程状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == liveStatus.unlive" type="info">未直播</el-tag>
                    <el-tag v-if="scope.row.status == liveStatus.living" type="danger">直播中</el-tag>
                    <el-tag v-if="scope.row.status == liveStatus.lived" type="success">已直播</el-tag>
                    <el-tag v-if="scope.row.status == liveStatus.taped" type="warning">已录播</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="left" width="190" prop="start_time" label="预设直播时间">
            </el-table-column>
            <el-table-column align="left" width="190" prop="created_at" label="创建时间">
            </el-table-column>
            <el-table-column align="left" width="180" label="操作" fixed="right">
                <template slot-scope="scope">
                    <el-button @click="$router.push({name: 'yshi-live-preview', params: {live_id: scope.row.id}})" type="text" size="small">查看</el-button>
                    <el-button 
                        @click="$router.push({name: 'yshi-live-edit', params: {live_id: scope.row.id}})" 
                        type="text" 
                        size="small">
                        编辑
                    </el-button>
                    <el-button 
                        @click="$router.push({name: 'yshi-live-video', params: {live_id: scope.row.id}})" 
                        type="text" 
                        size="small" >
                        直播
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
import liveService from 'services/yshi/liveService'
import DateRange from 'components/form/DateRangePicker.vue'
import * as _ from 'utils/common'
import * as globalConfig from 'utils/globalConfig'
function getFetchParam () {
    return {
        name: void '',
        status: void 0,
        start_date: void 0,
        end_date: void 0,
        page: 1,
        page_size: 15,
    }
}
export default {
    data () {
        return {
            data: [], // 表格数据
            total: 0,
            fetchParam: getFetchParam(),
            liveStatus: globalConfig.liveStatus
        }
    },
    created () {
        this.fetchData()
    },
    methods: {
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
            return liveService.searchLive(fetchParam).then((ret) => {
                this.data = ret.list
                this.total = ret.total
                this.loadingData = false
                xmview.setContentLoading(false)
            })
        },
        // // 检查直播按钮是否可以点击
        // checkStatus(row) {
        //     let is = false
        //     this.data.forEach(item => {
        //         if(item.status === this.liveStatus.living){
        //             if(row.id == item.id) {
        //                 is = false
        //             }else {
        //                 is = true
        //             }
        //         }
        //     })
        //     return is
        // },
        // 单条删除
        del (index, row) {
            xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                liveService.delete(row.id).then(() => {
                    xmview.showTip('success', '操作成功')
                    this.fetchData()
                })
            })
        },
    },
    components: { DateRange }
}
</script>
