<!--文章内容管理-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";

    .article-content-container {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .main-container {
            padding: 20px;
            background: #fff;
            .search {
                @extend %top-search-container;
            }
            .block {
                text-align: right;
                margin-top: 10px;
            }
        }
    }
</style>
<template>
    <article class="article-content-container">
        <section class="add">
            <el-button type="primary" icon="plus" @click="addArticle">添加</el-button>
        </section>
        <div class="main-container">
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input @change="getData" class="name" v-model="search.title"/>
                </section>
                <section>
                    <i>类别</i>
                    <ArticleCategorySelect :onchange="getData" v-model="search.category_id"></ArticleCategorySelect>
                </section>
                <DateRange title="时间" :start="search.createTime" :end="search.endTime"
                           v-on:changeStart="val=> search.createTime=val"
                           v-on:changeEnd="val=> search.endTime=val"
                           :change="getData">
                </DateRange>
            </section>
            <el-table border :data="articleData" v-loading="loading">
                <el-table-column
                        prop="title"
                        label="标题">
                </el-table-column>
                <el-table-column
                        prop="category_name"
                        label="类别"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="status_name"
                        label="状态"
                        width="200">
                    <template scope="scope">
                        <el-tag type="gray" v-if="scope.row.status">{{scope.row.status_name}}</el-tag>
                        <el-tag type="success" v-if="!scope.row.status">{{scope.row.status_name}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="创建时间"
                        width="200">
                </el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showFn(scope.row)">
                            查看
                        </el-button>
                        <el-button type="text" size="small" @click="editArticle(scope.row)">
                            修改
                        </el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <section class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, ->, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </section>
        </div>
    </article>
</template>
<script>
    import DateRange from '../component/form/DateRangePicker.vue'
    import ArticleService from '../../services/articleService'
    import ArticleCategorySelect from '../component/select/ArticleCategory.vue'
    export default {
        components: {
            DateRange,
            ArticleCategorySelect
        },
        data () {
            return {
                loading: false,
                search: {
                    title: '',
                    category_id: '',
                    createTime: '',
                    endTime: '',
                },
                name: '', // 搜索的姓名
                articleData: [],
                total: 0,
                currentPage: 1, // 分页当前显示的页数
                pageSize: 15
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            showFn (row) {
                this.$router.push({name: 'article-content-show', params: {id: row.id}})
            },
            addArticle () {
                this.$router.push({name: 'article-content-operate'})
            },
            editArticle (row) {
                this.$router.push({name: 'article-content-operate', params: {id: row.id}})
            },
            handleDelete (index, row) {
                xmview.showDialog(`你将要删除文章【<i style="color:red">${row.title || ''}</i>】操作不可恢复确认吗？`, this.deleteItem(row.id))
            },
            deleteItem (id) {
                // 以下执行接口删除动作
                return () => {
                    ArticleService.deleteArticle(id).then((ret) => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                this.loading = true
                return ArticleService.getArticleList({
                    category_id: this.search.category_id,
                    title: this.search.title,
                    start_time: this.search.createTime,
                    end_time: this.search.endTime,
                    page: this.currentPage,
                    page_size: this.pageSize
                }).then((ret) => {
                    this.articleData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
