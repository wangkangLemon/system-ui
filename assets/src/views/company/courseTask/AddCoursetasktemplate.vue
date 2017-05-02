<!--添加任务模板-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";

    #company-coursetask-addcoursetamplte {
        @extend %content-container;

        .course-search {
            margin-bottom: 12px;
            .el-input {
                width: 150px;
                ::-webkit-input-placeholder {
                    font-size: 13px
                }
            }
        }
    }
</style>

<template>
    <article id="company-coursetask-addcoursetamplte">
        <el-form :model="form" :rules="rules" label-position="right" ref="form" label-width="120px" style="width: 60%">
            <el-form-item prop="category" label="分类">
                <CourseTaskTemplateCategorySelect :placeholder="form.currCategoryName"
                                                  v-model="form.category"></CourseTaskTemplateCategorySelect>
            </el-form-item>
            <el-form-item prop="title" label="标题">
                <el-input v-model="form.title" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item prop="description" label="描述">
                <el-input v-model="form.description" auto-complete="off" :rows="6" type="textarea"></el-input>
            </el-form-item>
            <el-form-item prop="imgUrl" label="封面">
                <div class="img-wrap" v-if="form.image">
                    <img :src="form.image | fillImgPath" alt=""/>
                </div>
                <ImagEcropperInput :isRound="false" :aspectRatio="2.15" :confirmFn="cropperFn"
                                   class="upload-btn"></ImagEcropperInput>
            </el-form-item>
            <el-form-item prop="course" label="选择课程">
                <el-tag style="margin-right: 3px"
                        v-for="(c,index) in form.courses" :key="index"
                        :closable="true"
                        @close="form.courses.splice(index,1)"
                        type="success">
                    {{c.name}}
                <!--c-->
                </el-tag>

                <el-button type="primary" @click="dialogCourse.isShow=true" size="small">添加课程</el-button>
            </el-form-item>
            <el-form-item prop="sort" label="排序">
                <el-input-number v-model="form.sort" auto-complete="off"></el-input-number>
            </el-form-item>
            <el-form-item prop="sort">
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button type="warning">存草稿</el-button>
            </el-form-item>
        </el-form>

        <dialogSelectData ref="dialogSelect" v-model="dialogCourse.isShow" :getData="fetchCourse" title="选择课程"
                          :selectedList="form.courses" @changeSelected="val=>form.courses=val">
            <div slot="search" class="course-search">
                <el-input @keyup.enter.native="$refs.dialogSelect.fetchData(true)" v-model="dialogCourse.keyword"
                          icon="search"
                          placeholder="请输入关键字搜索"></el-input>
            </div>
        </dialogSelectData>
    </article>
</template>

<script>
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    import CourseTaskTemplateCategorySelect from '../../component/select/CourseTaskTemplateCategory.vue'
    import companyService from '../../../services/companyService'
    import courseService from '../../../services/courseService'
    import dialogSelectData from '../../component/dialog/SelectData4table.vue'

    export default{
        name: 'coursetask-template-add',
        data () {
            return {
                form: {                // 表单属性值
                    id: void 0,
                    title: void 0,          // 标题
                    category: void 0,       // 分类
                    image: void 0,        // 图片地址
                    description: void 0,  // 简介
                    sort: void 0,         // 排序
                    course_id: void 0,     // 课程
                    status: void 0,       // 状态
                    currCategoryName: '', // 名字
                    courses: [],
                    coursesIds: void 0
                },
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    category: {type: 'number', required: true, message: '请选择栏目', trigger: 'change'}
                },
                dialogCourse: {
                    loading: false,
                    isShow: false,
                    keyword: void 0,
                },
            }
        },
        created () {
            xmview.setContentLoading(false)
            if (this.$route.params.item) {
                this.form = this.$route.params.item
                xmview.setContentTile('编辑课程任务模板-企业')
            }
        },
        methods: {
            cropperFn(data) {
                companyService.CourseTaskTemplateUploadUrl({
                    avatar: data,
                    alias: Date.now() + '.jpg'
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.form.image = ret.data.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            fetchCourse (params) {
                return courseService.getPublicCourselist(Object.assign({}, this.dialogCourse, params))
            },
            submit() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    // 处理课程id
                    this.form.coursesIds = []
                    this.form.courses.forEach((c) => {
                        this.form.coursesIds.push(c.id)
                    })
                    this.form.coursesIds = this.form.coursesIds.join(',')

                    let reqFn = companyService.addCourseTaskTemplate
                    if (this.form.id) {
                        reqFn = companyService.updateCourseTaskTemplate
                    }
                    reqFn(this.form).then((ret) => {
                        xmview.showTip('success', '保存成功')
                        this.$router.back()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            }
        },
        components: {ImagEcropperInput, CourseTaskTemplateCategorySelect, dialogSelectData}
    }
</script>
