<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #course-learnmap-container {
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
    <main id="course-learnmap-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>模版名称</i>
                <el-input
                    v-model="fetchParam.title"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>状态</i>
                <el-select v-model="fetchParam.status" filterable clearable placeholder="请选择" @change="fetchData">
                    <el-option label="上线" :value="1"></el-option>
                    <el-option label="下线" :value="2"></el-option>
                </el-select>
            </section>
            <section>
                <DateRange 
                    title="创建时间" 
                    :start="fetchParam.create_start_time" 
                    :end="fetchParam.create_end_time"
                    v-on:changeStart="val=>{fetchParam.create_start_time=val}"
                    v-on:changeEnd="val=>{fetchParam.create_end_time=val}"
                    :change="fetchData">
                </DateRange>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-plus" 
                type='primary' 
                @click="$router.push({name: 'course-learnmap-add'})">
                创建模版
            </el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="模版名称" 
                    prop="title" 
                    min-width="170">
                </el-table-column>
                <el-table-column 
                    label="阶段数" 
                    prop="total_phase" 
                    width="80">
                </el-table-column>
                <el-table-column 
                    label="必修数量" 
                    prop="compulsory_object_number" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="选修数量" 
                    prop="elective_object_number" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="是否付费" 
                    prop="is_free" 
                    width="100">
                    <span slot-scope="{row}">{{row.is_free ? '否' : '是'}}</span>
                </el-table-column>
                <el-table-column 
                    label="状态" 
                    prop="status" 
                    width="80">
                    <template slot-scope="{row}">
                        <el-tag v-if="row.status === 0" type="success">上线</el-tag>
                        <el-tag v-else type="info">下线</el-tag>
                    </template>
                </el-table-column>
                <el-table-column 
                    label="创建人" 
                    prop="creator_name" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="创建时间" 
                    prop="create_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="最近修改时间" 
                    prop="update_time" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="180" 
                    fixed="right">
                    <template slot-scope="{row}">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="$router.push({name: 'course-learnmap-view', query: { id: row.id, view: 1 }})">
                            查看
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            :disabled="row.status === 0"
                            @click="$router.push({name: 'course-learnmap-edit', query: { id: row.id }})">
                            编辑
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="disableMap(row)">
                            {{row.status === 0 ? '下线' : '上线'}}
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            :disabled="row.status === 0"
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
    import DateRange from 'components/form/DateRangePicker.vue'
    import mapService from 'services/course/mapService.js'

    export default {
        components: {
            DateRange,
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
                    status: '',
                    create_start_time: '',
                    create_end_time: '',
                    type: 'learning_map',  // learning_map/teaching
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                this.fetchParam.type = 'learning_map'
                return mapService.searchMap(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            disableMap (row) {
                let statusTip = row.status === 1 ? '上线' : '下线'  
                let disabled = row.status === 1 ? 0 : 1
                this.$confirm(`是否${statusTip}【${row.title}】`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    mapService.disableMap({ id: row.id, disabled }).then(() => {
                        this.fetchData()
                    })
                })
            },
            del (row) {
                this.$confirm(`是否删除【${row.title}】`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    mapService.deleteMap(row.id).then(() => {
                        this.fetchData()
                    })
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
