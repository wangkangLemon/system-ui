<!--视频选取弹出框-->
<style rel="stylesheet/scss" lang="scss">
@import "~utils/mixins/common";
@import "~utils/mixins/mixins";
@import "~utils/mixins/topSearch";

#course-manage-component--dialogvideo {
    @extend %content-container;
    .search {
        @extend %top-search-container;
    }
}
</style>
<template>
    <el-dialog 
        title="选取图文" 
        :visible.sync="isShowDialog"
        append-to-body>
<!--         <span slot="title">
            <span class="el-dialog__title">选取文档</span>  
            <span style="color:#FF4949">只能选取审核通过的文档</span>
        </span> -->
        <article id="course-manage-component--dialogvideo">
            <article class="search">
                <section>
                    <i>名称</i>
                    <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
                </section>
            </article>

            <el-table class="data-table" v-loading="loadingData" :data="data" :fit="true" border>
                <el-table-column 
                    label="标题" 
                    prop="" 
                    min-width="140">
                    <el-button 
                        slot-scope="{row}"
                        type="text" 
                        size="small" 
                        @click="$router.push({name: 'course-manage-richtexts-view', query: {id: row.id}})">
                        {{row.title}}
                    </el-button>
                </el-table-column>
                <el-table-column 
                    label="状态" 
                    prop="status" 
                    width="80">
                    <span slot-scope="{row}">{{row.status | status}}</span>
                </el-table-column>
                <el-table-column 
                    label="创建时间" 
                    prop="created_at"
                    width="170">
                </el-table-column>
                <el-table-column fixed="right" width="70" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="selectItem(scope.$index, scope.row)" type="text" size="small">选取</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination 
                class="pagin" 
                @size-change="sizeChange" 
                @current-change="pageChange" 
                :current-page="fetchParam.page" 
                :page-size="fetchParam.page_size" 
                :page-sizes="[15, 30, 60, 100]" 
                layout="sizes,total, prev, pager, next" 
                :total="total">
            </el-pagination>

        </article>
    </el-dialog>
</template>

<script>
import courseService from 'services/course/richtextService'

export default {
    props: {
        onSelect: Function,
        value: Boolean,     // 是否显示dialog
        fileType: String,
    },
    data() {
        return {
            isShowDialog: this.value,
            data: [],
            loadingData: false,
            total: 0,
            fetchParam: {
                status: '',
                title: '',
                start_date: '',
                end_date: '',
                page: 1,
                page_size: 15,
            }
        }
    },
    watch: {
        'value'(val) {
            this.setShowDialog(val)
        },
        'fetchParam.page'() {
            this.fetchData()
        },
        'fetchParam.page_size'() {
            this.fetchData()
        },
        'isShowDialog'(val) {
            this.$emit('input', val)
            this.setShowDialog(val)
            if (val === true) {
                this.fetchData()
            }
        }
    },
    methods: {
        fetchData() {
            this.loadingData = true
            return courseService.search(this.fetchParam).then((ret) => {
                this.data = ret.list || []
                this.total = ret.total
                this.loadingData = false
            })
        },
        selectItem(index, row) {
            this.setShowDialog(false)
            row.file_name = row.title
            this.onSelect(row)
        },
        setShowDialog(val) {
            this.isShowDialog = val
        },
        sizeChange(val) {
            this.fetchParam.page_size = val
        },
        pageChange(val) {
            this.fetchParam.page = val
        },
        refreshFetchParam () {
            this.fetchParam.keyword = ''
            this.fetchParam.page = 1
        }
    },
    components: {},
    filters: {
        status (val) {
            let map = {
                20: '草稿',
                21: '已发布'
            }
            return map[val]
        }
    },
}
</script>
