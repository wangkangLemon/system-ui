<style lang="scss">
    @import "../../../utils/mixins/topSearch";
    .search {
        @extend %top-search-container;
    }
    .choose-course {
        .block {
            text-align: center !important;
            width: 50%;
            margin: 0 auto;
            margin-top: 10px;
        }
    }
</style>
<template>
    <article>
        <el-dialog class="choose-course main-container" keyword="选取内容" :visible.sync="curValue">
            <section class="search">
                <section>
                    <i>名称</i>
                    <el-input @keyup.enter.native="changeList" v-model="search.keyword"></el-input>
                </section>
                <section>
                    <i>状态</i>
                    <el-select clearable v-model="search.status" @change="changeList">
                        <el-option label="上线" :value="0"></el-option>
                        <el-option label="下线" :value="1"></el-option>
                    </el-select>
                </section>
            </section>
            <el-table v-loading="loading" border :data="data" :highlight-current-row="true">
                <el-table-column
                        :prop="category == 'article' || category == 'share_article' || category == 'speaking_pass' ? 'title' : 'name'"
                        label="名称" min-width="200"></el-table-column>
                <el-table-column prop="status" label="状态" width="100">
                    <template scope="scope">
                        <el-tag type="success" v-if="!scope.row.status">上线</el-tag>
                        <el-tag type="gray" v-if="scope.row.status">下线</el-tag>
                    </template>
                </el-table-column>
                <el-table-column :prop="category=='speaking_pass' ? 'create_time' : 'create_time_name'" label="创建时间" width="180"></el-table-column>
                <el-table-column label="操作" width="180">
                    <template scope="scope">
                        <el-button type="text" @click="confirm(scope.row)">选取</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="courseSizeChange"
                        @current-change="coursePageChange"
                        :total="total"
                        :current-page="page"
                        :page-size="page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next">
                </el-pagination>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import courseService from '../../../services/newcourse/courseService'
    import speakingService from '../../../services/speaking/contentService'
    import ArticleService from '../../../services/articleService'
    export default {
        props: {
            value: Boolean,
            category: {
                default: '',
                type: String
            }
        },
        data () {
            return {
                curValue: this.value,
                loading: false,
                search: {
                    keyword: '',
                    status: ''
//                    category_id: ''
                },
                data: [],
                page: 1,
                page_size: 10,
                total: 0,
            }
        },
        watch: {
            category (val) {
                if (!val || this.value != 'play') return
                this.page = 1
                this.search = {
                    keyword: '',
                    status: ''
                }
                this.changeList()
            },
            value (val) {
                this.curValue = val
                if (val) this.changeList()
            },
            curValue (val) {
                this.curValue = val
                this.$emit('input', val)
            }
        },
        methods: {
            // 课程当前页
            coursePageChange (val) {
                this.page = val
                this.changeList()
            },
            // 课程分页
            courseSizeChange (val) {
                this.page_size = val
                this.changeList()
            },
            confirm (data) {
                this.$emit('result', data)
            },
            getCourse () {
                this.loading = true
                // 获取课程数据
                return courseService.search({
                    keyword: this.search.keyword,
                    status: this.search.status,
                    page: this.page,
                    page_size: this.page_size,
                    course_type: 'public'
                }).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            getArticle () {
                this.loading = true
                return ArticleService.getArticleList({
                    title: this.search.keyword,
                    page: this.page,
                    page_size: this.page_size
                }).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            getSpeaking () {
                this.loading = true
                // 获取药我说数据
                return speakingService.search({
                    sender_type: 'system',
                    keyword: this.search.keyword,
                    status: this.search.status,
                    page: this.page,
                    page_size: this.page_size
                }).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loading = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            changeList () {
                let typeArr = {
                    course_finished: 'getCourse',
                    // testing: 'getCourse',
                    // testing_pass: 'getCourse',
                    share_testing: 'getCourse',
                    article: 'getArticle',
                    share_article: 'getArticle',
                    speaking_pass: 'getSpeaking'
                }
                this[typeArr[this.category]]()
            }
        }
    }
</script>
