<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #speaking-content-add {
        @extend %content-container;
    .form {
        width: 50%;
        .btn {
            float: right;
        }
        .img {
            display: block;
            width: 250px;
            height: 160px;
        }
        .collection {
            align-items: center;
            min-height: 36px;
            border-radius: 4px;
            padding: 3px 10px;
            border: 1px solid #bfcbd9;
            .tag {
               margin-right: 10px;
            }
        }
        .col-tip{
            color: #666;
            display: block;
            line-height: 30px;
        }
        .col-btn-block{
            display: block;
            margin-top: 10px;
        }
    }
    .dialog {
            section {
                margin-bottom: 10px;
                i {
                    margin-right: 10px;
                }
            }
        }
     }
</style>
<template>
    <article id="speaking-content-add">
        <el-form :model="form" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="组合名称" prop="name">
                <el-input placeholder="请输入内容" v-model="form.name">
                </el-input>
            </el-form-item>
            <el-form-item label="组合图片" prop="image">
                <img :src="form.image | fillImgPath" alt="" class="img" v-if="form.image" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="宣传展示" prop="img_video">
                <el-radio v-model="form.type" label="0">图片</el-radio>
                <el-radio v-model="form.type" label="1">视频</el-radio>
                <p v-if="form.type==0" class="el-icon-picture col-tip"> 使用封面图片</p>
                <el-button class="col-btn-block" v-else @click="isShowVideoDialog=true">
                    <i v-if="lesson.material_name">{{ lesson.material_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
            </el-form-item>
            <el-form-item label="组合介绍" prop="content">
                <el-input :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" type="textarea" v-model="form.content">
                </el-input>
            </el-form-item>
            <el-form-item label="添加商品" prop="goods">
                <el-button size="small" @click="dialogCourse.isShow=true">选择商品</el-button>
                <template v-if="form.course.length">
                    <el-table class="data-table" :data="form.course" :fit="true" border show-summary style="margin-top: 5px;">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="原价" prop="name"></el-table-column>
                        <el-table-column label="优惠价" prop="name"></el-table-column>
                    </el-table>
                </template>
            </el-form-item>
            <el-form-item label="设置组合售卖优惠">
                <PlusOrRemove @res="groupDiscounts"></PlusOrRemove>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit('ruleForm')" type="primary">保存</el-button>
            </el-form-item>
            <dialogSelectData ref="dialogSelect" v-model="dialogCourse.isShow" :getData="fetchCourse" title="选择商品"
                          :selectedList="form.course" @changeSelected="val=>form.course=val">
                <div slot="search" class="course-search">
                    <el-input @keyup.enter.native="$refs.dialogSelect.fetchData(true)" v-model="dialogCourse.keyword"
                            icon="search"
                            placeholder="请输入关键字搜索"></el-input>
                </div>
            </dialogSelectData>
            <DialogVideo :onSelect="handleVideoSelected" v-model="isShowVideoDialog"></DialogVideo>
        </el-form>
    </article>
</template>
<script>
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import dialogSelectData from 'components/dialog/SelectData4table.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import courseService from 'services/newcourse/courseService'
    import PlusOrRemove from '../component/PlusOrRemove.vue'
    function clearFn () {
        return {
            id: '',
            name: '',
            image: '',
            type: '0', // 0 图片 1视频
            content: '',
            course: []
        }
    }
    export default {
        data () {
            return {
                isShowVideoDialog: false,
                push_type_list: [],
                lesson: {type: Object, required: true},
                dialogCourse: {
                    loading: false,
                    isShow: false,
                    keyword: void 0,
                },
                form: clearFn(),
                rules: {
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    image: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    img_video: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    goods: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ]
                },
                groupDiscount: []
            }
        },
        mounted() {
            xmview.setContentLoading(false)
        },
        methods: {
            cropperFn (data, ext) {
            },
            filesHandleChange (res) {
                console.log(res)
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
            fetchCourse (params) {
                params.course_type = 'public'
                params.status = 0
                return courseService.search(Object.assign({}, this.dialogCourse, params))
            },
            // 处理视频选取
            handleVideoSelected(row) {
                this.lesson.material_name = row.name
                this.lesson.material_id = row.id
            },
            // 组合优惠
            groupDiscounts(val) {
                console.log(val)
                this.groupDiscount = val
            }
        },
        components: {
            ImagEcropperInput,
            UploadFile,
            dialogSelectData,
            DialogVideo,
            PlusOrRemove
        }
    }
</script>
