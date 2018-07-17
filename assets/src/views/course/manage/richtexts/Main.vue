<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #course-manage-richtexts-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }
</style>

<template>
    <main id="course-manage-richtexts-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>标题</i>
                <el-input
                    v-model="fetchParam.title"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>状态</i>
                <el-select 
                    v-model="fetchParam.status" 
                    filterable 
                    clearable 
                    placeholder="请选择" 
                    @change="fetchData">
                    <el-option label="草稿" :value="20"></el-option>
                    <el-option label="已发布" :value="21"></el-option>
                </el-select>
            </section>
            <section>
                <DateRange 
                    title="创建时间" 
                    :start="fetchParam.start_date" 
                    :end="fetchParam.end_date"
                    v-on:changeStart="val=>{fetchParam.start_date=val}"
                    v-on:changeEnd="val=>{fetchParam.end_date=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-plus" 
                type='primary' 
                @click="$router.push({name: 'course-manage-richtexts-add'})">
                新增
            </el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
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
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="165" 
                    fixed="right">
                    <template slot-scope="{row}">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="$router.push({name: 'course-manage-richtexts-view', query: {id: row.id}})">
                            查看
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="$router.push({name: 'course-manage-richtexts-edit', query: {id: row.id}})">
                            修改
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="del(row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination>
        </section>
    </main>
</template>

<script>
    import richtextService from 'services/course/richtextService'
    import DateRange from 'components/form/DateRangePicker.vue'

    export default {
        components: {
            DateRange
        },
        props: {},
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        created () {
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    title: '',
                    start_date: '',
                    end_date: '',
                    status: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return richtextService.search(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            del (row) {
                // 你将要删除图文标题图文标题 操作不可恢复确认吗?
                // 已有课程【XXXXXX】关联了该图文，请先删除关联课程
                this.$confirm(`你将要删除【${row.title}】,操作不可恢复确认吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    richtextService.del(row.id).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.fetchData()
                    })
                })
            }
        },
        filters: {
            status (val) {
                let map = {
                    20: '草稿',
                    21: '已发布'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
