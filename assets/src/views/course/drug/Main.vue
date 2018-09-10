<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #course-drug-main-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
    }

    .u-loadmore {
        color: #63bdea;
        margin-left: 10px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
    }
</style>

<template>
    <main id="course-drug-main-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>通用名</i>
                <el-input
                    v-model="fetchParam.keyword"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <el-button 
                class="top-btn" 
                icon="el-icon-document" 
                type='primary' 
                @click="fileExport">
                Excel导入
            </el-button>
            <el-button 
                class="top-btn" 
                icon="el-icon-plus" 
                type='primary' 
                @click="$router.push({ name: 'course-drug-add'})">
                新增药品
            </el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="通用名" 
                    prop="common_name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="商品名" 
                    prop="trade_name">
                </el-table-column>
                <el-table-column 
                    label="别名" 
                    prop="another_name">
                </el-table-column>
                <el-table-column 
                    label="系统分类" 
                    prop="category_system">
                </el-table-column>
                <el-table-column 
                    label="柜组分类" 
                    prop="category_group">
                </el-table-column>
                <el-table-column 
                    label="药品分类" 
                    prop="category_drug">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="165" 
                    fixed="right">
                    <template slot-scope="scope">
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="$router.push({ name: 'course-drug-add', query: { isView: 1, id: scope.row.id } })">
                            查看
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="$router.push({ name: 'course-drug-add', query: { isEdit: 1, id: scope.row.id } })">
                            编辑
                        </el-button>
                        <el-button 
                            type="text" 
                            size="small" 
                            @click="del(scope.row)">
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
    import drugService from 'services/course/drugService'

    export default {
        components: {},
        props: {},
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
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
                    common_name: '',
                    category_group: '',
                    category_drug: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return drugService.searchDrug(this.fetchParam).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            },
            del (row) {
                this.$confirm(`确定删除【${row.common_name}】吗`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    drugService.del(id)
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
