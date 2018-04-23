<!-- 
    课程transfer
 -->
<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #learning-map-course-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <main id="learning-map-course-container">
        <section class="search">
<!--             <section>
                <i>课程类型</i>
                <el-select 
                    v-model="fetchParam.type" 
                    filterable 
                    clearable 
                    placeholder="请选择课程类型"
                    @change="fetchData">
                    <el-option label="公开课" value="public"></el-option>
                    <el-option label="内训课" value="private"></el-option>
                </el-select>
            </section> -->
            <section>
                <i>练习名称</i>
                <el-input
                    v-model="fetchParam.keyword"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
        </section>
        <Transfer 
            ref="transfer"
            placeholder="搜索"
            :loading="loading"
            :showHeader="true"
            :isSearch="false"
            :type="type"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :total="total"
            :data="data"
            v-model="selected"
            :showSelectedData="false"
            @curRow="getCurRow"
            @select-all="getSelectAll"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
            @searchFn="handleTransferSearch">
<!--             <template slot="source-column" slot-scope="scope">
                <el-tag></el-tag>
            </template> -->
        </Transfer>
    </main>
</template>

<script>
    import practiceService from 'services/exam/practiceService'
    import Transfer from '@/views/yshi/component/dialog/Transfer2.vue'

    export default {
        components: {
            Transfer
        },
        props: {
            taskType: Number,
            childType: Array,
            type: {
                type: [Number, String],
                required: false,
            },
            value: {
                type: Array,
                default: () => {
                    return []
                }
            },
            showSelectedData: {
                type: Boolean,
                default: false
            }
        },
        activated () {},
        created () {
            this.fetchParam = this.initFetchParam()
            this.fetchData()
        },
        mounted () {},
        computed: {},
        watch: {
            value (val) {
                this.selected = val
            }
        },
        data () {
            return {
                loading: false,
                // TYPE: TYPE,
                selected: this.value,
                fetchParam: this.initFetchParam(),
                data: [],
                total: 0,
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return practiceService.search(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            handlePageChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleTransferSearch (val) {
                this.fetchParam.page = 1
                this.data = []
                this.fetchParam.keyword = val
                this.fetchData()
            },
            getCurRow (row, all) {
                if (this.type) {
                    row.type = this.type
                    row.taskType = this.taskType
                    this.$emit('curRow', row, all)
                }
            },
            getSelectAll (selection) {
                selection.forEach(sel => {
                    this.getCurRow(sel, true)
                })
            },
            initFetchParam () {
                return {
                    keyword: '',
                    status: 0,
                    time_start: '',
                    time_end: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        filters: {},
        directives: {},
    }
</script>
