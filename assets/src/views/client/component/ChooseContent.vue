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
        <el-dialog :show-close="false" class="choose-course main-container" title="选取内容" v-model="value">
            <section class="search">
                <section>
                    <i>名称</i>
                    <el-input @keyup.enter.native="changeList" v-model="search.keyword"></el-input>
                </section>
                <section>
                    <i>分类</i>
                    <el-select v-model="category" @change="changeList">
                        <el-option label="课程" value="course"></el-option>
                        <el-option label="药我说" value="speaking"></el-option>
                        <el-option label="资讯" value="article"></el-option>
                    </el-select>
                </section>
                <!--<section>-->
                    <!--<i>栏目分类</i>-->
                    <!--<CourseCategorySelect v-model="category_id" :onchange="getCourse"></CourseCategorySelect>-->
                <!--</section>-->
            </section>
            <el-table v-if="category == 'course'" v-loading="loading" @row-click="selectCurrent" border :data="data" :highlight-current-row="true">
                <el-table-column prop="name" label="课程"></el-table-column>
                <el-table-column prop="company" label="企业" width="200"></el-table-column>
                <el-table-column prop="material_type" label="类型" width="150">
                    <template scope="scope">
                        {{material_type[scope.row.material_type]}}
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="category == 'speaking'" v-loading="loading" @row-click="selectCurrent" border :data="data" :highlight-current-row="true">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="create_time" label="创建时间" width="150"></el-table-column>
            </el-table>
            <el-table  v-if="category == 'article'" border :data="data" v-loading="loading" @row-click="selectCurrent" :highlight-current-row="true">
                <el-table-column
                        prop="title"
                        label="标题"></el-table-column>
                <el-table-column
                        prop="category_name"
                        label="类别"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="创建时间"
                        width="200">
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
            <span slot="footer" class="dialog-footer">
                <el-button @click="setValue">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </article>
</template>
<script>
    import courseService from '../../../services/courseService'
    import speakingService from '../../../services/speaking/contentService'
    import ArticleService from '../../../services/articleService'
//    import CourseCategorySelect from '../../component/select/CourseCategory.vue'
    export default {
        props: ['value'],
        components: {
//            CourseCategorySelect
        },
        data () {
            return {
                currentData: null,
                loading: false,
                search: {
                    keyword: '',
//                    category_id: ''
                },
                category: 'course',
                data: [],
                page: 1,
                page_size: 10,
                total: 0,
                material_type: {
                    video: '视频',
                    doc: 'word文档',
                    ppt: '幻灯片',
                    pdf: 'PDF文件'
                }
            }
        },
        watch: {
            category () {
                this.page = 1
                this.search.keyword = ''
            },
            value (val) {
                if (val) this.currentData = null
            }
        },
        created () {
            this.getCourse()
        },
        methods: {
            setValue () {
                this.$emit('input', false)
            },
            selectCurrent (item) { // 选取 点击搜索之后的某一行存储当前选择的id 确定的时候调用
                console.log(item)
                this.currentData = item
            },
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
            confirm () {
                if (this.currentData == null) {
                    xmview.showTip('error', '请选取内容')
                    return
                }
                this.$emit('result', {data: this.currentData, category: this.category})
            },
            getCourse () {
                this.loading = true
                // 获取课程数据
                return courseService.getPublicCourselist({
                    keyword: this.search.keyword,
//                    category_id: this.category_id,
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
                // 获取课程数据
                return speakingService.search({
                    keyword: this.search.keyword,
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
                let typeArr = {course: 'getCourse', article: 'getArticle', speaking: 'getSpeaking'}
                this[typeArr[this.category]]()
            }
        }
    }
</script>
