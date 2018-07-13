<!--组合商品列表-->
<style lang='scss' rel='stylesheet/scss'>
@import "~utils/mixins/common";
@import "~utils/mixins/topSearch";

#favorable-index-container {
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
    <main id="favorable-index-container">
        <section class="manage-container">
            <el-button 
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push({name: 'yshi-favorable-add'})">
                <i>创建优惠</i>
            </el-button>
        </section>

        <main class="search">
            <section>
                <i>名称</i>
                <el-input 
                    v-model="fetchParam.name" 
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>优惠类型</i>
                <el-select 
                    v-model="fetchParam.favorable_type" 
                    filterable 
                    clearable 
                    placeholder="请选择" 
                    @change="fetchData">
                    <el-option label="打包优惠" :value="1"></el-option>
                    <el-option label="满折优惠" :value="2"></el-option>
                </el-select>
            </section>
            <DateRange 
                title="创建时间" 
                :start="fetchParam.start_time" 
                :end="fetchParam.end_time" 
                @changeStart="val=> {fetchParam.start_time=val}" 
                @changeEnd="val=> {fetchParam.end_time=val}" 
                :change="fetchData">
            </DateRange>
        </main>
        <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true"  border>
            <el-table-column 
                min-width="200" 
                prop="name" 
                label="优惠名称">
            </el-table-column>
            <el-table-column 
                width="80" 
                label="优惠类型">
                <template slot-scope="scope">
                    <p v-if="scope.row.favorable.length">{{ scope.row.favorable[0].discount }}</p>
                </template>
                <span slot-scope="{row}">{{(row.favorable_type === 1 ? '打包' : '满折') + '优惠'}}</span>
            </el-table-column>
            <el-table-column 
                min-width="80" 
                prop="goods_count" 
                label="单品数">
            </el-table-column>
            <el-table-column 
                width="150" 
                label="连锁/app实价">
                <span slot-scope="{row}">{{row.favorable_price_com}}/{{row.favorable_price}}</span>
            </el-table-column>
            <el-table-column 
                min-width="130" 
                prop="favorable_max" 
                label="最高优惠">
            </el-table-column>
            <el-table-column 
                width="110" 
                prop="is_group_buying" 
                label="是否支持团购">
                <span slot-scope="{row}">{{row.is_group_buying === 0 ? '否' : '是'}}</span>
            </el-table-column>
            <el-table-column 
                width="100" 
                prop="order" 
                label="序号">
            </el-table-column>
            <el-table-column 
                width="170" 
                prop="end_time" 
                label="截止日期">
                <span 
                    slot-scope="{row}" 
                    :style="{ color: new Date(row.end_time).getTime() < Date.now() ? 'red' : '' }">
                    {{row.end_time}}
                </span>
            </el-table-column>
            <el-table-column 
                width="170" 
                prop="create_time" 
                label="创建时间">
            </el-table-column>
            <el-table-column 
                width="170" 
                prop="update_time" 
                label="最近修改时间">
            </el-table-column>
            <el-table-column 
                width="180" 
                label="操作" 
                fixed="right">
                <template slot-scope="scope">
                    <el-button 
                        @click="$router.push({name: 'yshi-favorable-preview', params: {group_id: scope.row.id}})" 
                        type="text" 
                        size="small">
                        查看
                    </el-button>
                    <el-button 
                        @click="$router.push({name: 'yshi-favorable-edit', params: {group_id: scope.row.id}})" 
                        type="text" 
                        size="small" 
                        :disabled="scope.row.status == 2">
                        编辑
                    </el-button>
                    <el-button 
                        @click="offline(scope.$index, scope.row)" 
                        type="text" 
                        size="small">
                        <i>{{ scope.row.status == 1 ? '上架' : '下架' }}</i>
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
        <el-pagination 
            class="pagin"
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
    import favorableService from 'services/yshi/favorableService'
    import DateRange from 'components/form/DateRangePicker.vue'
    import * as _ from 'utils/common'
    function getFetchParam () {
        return {
            name: void '',
            status: void 0, // 1 下线，2 上线
            favorable_type: void 0,
            start_time: void 0,
            end_time: void 0,
            page: 1,
            page_size: 15,
        }
    }
    export default {
        components: { 
            DateRange,
        },
        data () {
            return {
                data: [], // 表格数据
                total: 0,
                fetchParam: getFetchParam(),
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
                fetchParam.status = (!fetchParam.status && fetchParam.status !== 1) ? 0 : fetchParam.status
                return favorableService.searchGoodsGroup(fetchParam).then((ret) => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            },
            // 下线  0为下线，1为上线
            offline (index, row) {
                let txt = row.status == 2 ? '下线' : '上线'
                let finalStatus = row.status == 1 ? 2 : 1
                xmview.showDialog(`你将要${txt}课程 <span style="color:red">${row.name}</span> 确认吗?`, () => {
                    favorableService.statusline(row.id, finalStatus).then((ret) => {
                        row.status = finalStatus
                    })
                })
            },
            // 单条删除
            del (index, row) {
                xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                    favorableService.delete(row.id).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                    })
                })
            },
        },
    }
</script>
