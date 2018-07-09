<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #objectcount-table-container {
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
    <main id="objectcount-table-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="名称" 
                    prop="name" 
                    min-width="140">
                </el-table-column>
                <el-table-column 
                    label="类型" 
                    prop="type" 
                    width="170">
                    <span slot-scope="{row}">{{row.type | type}}</span>
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
    import goodsService from 'services/yshi/goodsService'

    export default {
        components: {},
        props: {
            id: [String,Number]
        },
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
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return goodsService.searchObjectCount(this.id).then(ret => {
                    this.data = ret.list || []
                    this.total = ret.total
                    this.loading = false
                })
            }
        },
        filters: {
            type (val) {
                let map = {
                    1: '内训课程',
                    2: '试卷',
                    3: '练习',
                    4: '公开课程',
                    5: '带教'
                }
                return map[val]
            }
        },
        directives: {},
    }
</script>
