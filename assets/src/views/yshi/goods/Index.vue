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
            <el-button 
                type="warning" 
                @click="$router.push({name: 'yshi-goods-category'})">
                分类管理
            </el-button>
            <el-button 
                type="primary" 
                icon="el-icon-plus" 
                @click="$router.push({name: 'yshi-goods-add'})">
                创建商品
            </el-button>
        </section>

        <main class="search">
            <section>
                <i>名称</i>
                <el-input v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>分类</i>
                <GoodsCategorySelect
                    v-model="fetchParam.category_id"
                    :onchange="fetchData">
                </GoodsCategorySelect>
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
                label="单品名称">
            </el-table-column>
            <el-table-column 
                min-width="100" 
                prop="category" 
                label="所属分类">
            </el-table-column>
            <el-table-column 
                width="130" 
                prop="price" 
                label="连锁/app定价">
                <span slot-scope="{row}">{{row.price}}/{{row.price_app}}</span>
            </el-table-column>
            <el-table-column 
                width="130" 
                prop="price" 
                label="连锁/app实价">
                <span slot-scope="{row}">{{row.favorable_price}}/{{row.favorable_price_app}}</span>
            </el-table-column>
            <el-table-column 
                width="100" 
                prop="favorable_count" 
                label="参与优惠数">
                <el-button 
                    slot-scope="{row}"
                    type='text'
                    :disabled="!row.favorable_count"
                    @click="openTable(1, row.id)">
                    {{row.favorable_count}}
                </el-button>
            </el-table-column>
            <el-table-column 
                width="80" 
                prop="object_count" 
                label="素材数量">
                <el-button 
                    slot-scope="{row}"
                    type='text' 
                    :disabled="!row.object_count"
                    @click="openTable(2, row.id)">
                    {{row.object_count}}
                </el-button>
            </el-table-column>
            <el-table-column 
                width="100" 
                prop="is_group_buying" 
                label="是否有团购">
                <span slot-scope="{row}">{{row.is_group_buying === 0 ? '否' : '是'}}</span>
            </el-table-column>
            <el-table-column 
                width="60" 
                prop="order" 
                label="序号">
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
                width="200" 
                fixed="right"
                label="操作">
                <template slot-scope="scope">
                    <el-button 
                        @click="$router.push({name: 'yshi-goods-preview', params: {good_id: scope.row.id}})"
                        type="text" 
                        size="small">
                        查看
                    </el-button>
                    <el-button 
                        @click="$router.push({name: 'yshi-goods-edit', params: {good_id: scope.row.id}})" 
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
        <ErrorDialog :error="error"></ErrorDialog>
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
        <el-dialog 
            v-if="columnDetail.showDialog"
            :title="columnDetail.title" 
            :visible.sync="columnDetail.showDialog">
            <component 
                :is="columnDetail.component" 
                :id="columnDetail.id">
            </component>
        </el-dialog>
    </main>
</template>

<script>
    import goodsService from 'services/yshi/goodsService'
    import DateRange from 'components/form/DateRangePicker.vue'
    import GoodsCategorySelect from 'components/select/GoodsCategory.vue'
    import ErrorDialog from 'components/dialog/ErrorDialog.vue'
    import ObjectCountTable from './component/ObjectCountTable.vue'
    import FavorableCountTable from './component/FavorableCountTable.vue'
    import * as _ from 'utils/common'
    function getFetchParam () {
        return {
            name: void '',
            start_time: void '',
            end_time: void '',
            category_id: void '',
            page: 1,
            page_size: 15
        }
    }
    export default {
        components: { 
            DateRange, 
            ErrorDialog,
            GoodsCategorySelect,
            ObjectCountTable,
            FavorableCountTable,
        },
        data () {
            return {
                data: [], // 表格数据
                total: 0,
                dialogVisible: false,
                fetchParam: getFetchParam(),
                dialogTree: {
                    isShow: false,
                    selectedId: void 0,
                },
                error: {
                    showDialog: false,
                    message: '',
                    data: []
                },
                columnDetail: {
                    showDialog: false,
                    component: '',
                    title: '',
                    id: ''
                }
            }
        },
        created () {
            this.fetchData()
        },
        methods: {
            openTable (type, id) {
                let map = {
                    1: {
                        title: '参与优惠数详情',
                        component: FavorableCountTable
                    },
                    2: {
                        title: '素材数量详情',
                        component: ObjectCountTable
                    }
                }
                this.columnDetail.component = map[type].component
                this.columnDetail.id = id
                this.columnDetail.title = map[type].title
                this.columnDetail.showDialog = true
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
            fetchData () {
                this.loadingData = true
                let fetchParam = _.clone(this.fetchParam)
                return goodsService.searchGoods(fetchParam).then((ret) => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            },
            offline (index, row) {
                let txt = row.status == 2 ? '下线' : '上线'
                let finalStatus = row.status == 1 ? 2 : 1
                xmview.showDialog(`你将要${txt}课程 <span style="color:red">${row.name}</span> 确认吗?`, () => {
                    goodsService.statusline(row.id, finalStatus).then((ret) => {
                        row.status = finalStatus
                    })
                })
            },
            // 单条删除
            del (index, row) {
                xmview.showDialog(`你将要删除课程 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                    goodsService.delete(row.id).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                    }).catch(ret => {
                        this.error.message = ret.data.message
                        this.error.data = ret.data.list
                        this.error.showDialog = true
                    })
                })
            },
        },
    }
</script>
