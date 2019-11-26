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
                <CourseTaskTemplateCategorySelect :placeholder="form.category_name"
                                                  v-model="form.category_id"></CourseTaskTemplateCategorySelect>
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
                        v-for="(c,index) in form.course" :key="index"
                        :closable="true"
                        @close="form.course.splice(index,1)"
                        type="success">
                    {{c.name}}
                <!--c-->
                </el-tag>

                <el-button type="primary" @click="addCourse" size="small">添加课程</el-button>
            </el-form-item>
            <el-form-item prop="sort" label="排序">
                <el-input-number v-model="form.sort" auto-complete="off"></el-input-number>
            </el-form-item>
            <el-form-item prop="sort">
                <el-button type="primary" @click="submit(0)">提交</el-button>
                <el-button type="warning" @click="submit(1)">存草稿</el-button>
            </el-form-item>
        </el-form>

        <dialogSelectData ref="dialogSelect" v-model="dialogCourse.isShow" :getData="fetchCourse" title="选择课程"
                          :selectedList="form.course" @changeSelected="val=>form.course=val">
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
    import courseService from '../../../services/newcourse/courseService'
    import dialogSelectData from '../../component/dialog/SelectData4table.vue'

    export default{
        name: 'coursetask-template-add',
        data () {
            return {
                form: {                // 表单属性值
                    id: void 0,
                    title: void 0,          // 标题
                    category_id: void 0,       // 分类
                    image: void 0,        // 图片地址
                    description: void 0,  // 简介
                    sort: void 0,         // 排序
                    course_id: void 0,     // 课程
                    status: void 0,       // 状态
                    category_name: '', // 名字
                    course: [],
                },
                rules: {
                    title: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    category_id: {type: 'number', required: true, message: '请选择栏目', trigger: 'change'}
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
            cropperFn(data, ext) {
                companyService.CourseTaskTemplateUploadUrl({
                    avatar: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.form.image = ret.data.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            addCourse(){
                this.dialogCourse.isShow = true;
                this.dialogCourse.keyword = "";
                this.$refs.dialogSelect.fetchData(true);
            },
            fetchCourse (params) {
                params.course_type = 'public'
                params.status = 0
                return courseService.search(Object.assign({}, this.dialogCourse, params))
            },
            submit(s) {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return false
                    }
                    // 处理课程id
                    this.form.course_id = []
                    this.form.course.forEach((c) => {
                        this.form.course_id.push(c.id)
                    })
                    console.log(this.form.course_id)
                    // let  courseArr=[]
                    // console.log("aaaa")
                    // console.log(this.form.course_id)
                    // for(let i=0; i<this.form.course_id.length; i++){
                    //     if(courseArr.indexOf(this.form.course_id[i])==-1){
                    //         courseArr.push(this.form.course_id[i])
                    //     }
                    // }
                    // if(courseArr.length == this.form.course_id.length){
                    //     console.log(courseArr+"1111")
                    // }else{
                    //         alert("有重复数据");
                    //         return;
                    //     }
                    this.form.course_id = this.form.course_id.join(',')
                    if (s > 0) {
                        this.form.status = s
                    }
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
