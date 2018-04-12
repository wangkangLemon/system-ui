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
            line-height: 36px;
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
            <el-form-item label="商品名称" prop="name">
                <el-input placeholder="请输入内容" v-model="form.name">
                </el-input>
            </el-form-item>
            <el-form-item label="商品封面" prop="image">
                <img :src="form.cover | fillImgPath" alt="" class="img" v-if="form.cover" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="宣传展示" prop="img_video">
                <el-radio v-model="form.show_type" label="0">图片</el-radio>
                <el-radio v-model="form.show_type" label="1">视频</el-radio>
                <p v-if="form.type==0" class="el-icon-picture col-tip"> 使用封面图片</p>
                <el-button class="col-btn-block" v-else @click="isShowVideoDialog=true">
                    <i v-if="lesson.material_name">{{ lesson.material_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
                <!-- <UploadFile v-else :on-success="filesHandleChange" btnTitle='选择文件'></UploadFile> -->
            </el-form-item>
            <el-form-item label="商品介绍" prop="content">
                <el-input :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" type="textarea" v-model="form.introduce">
                </el-input>
            </el-form-item>
            <el-form-item label="添加素材" prop="fodder">
                <el-button size="small">选择素材</el-button>
                <template v-if="selectFodder.length">
                    <el-table class="data-table" :data="selectFodder" :fit="true" border style="margin-top: 5px;">
                        <el-table-column 
                            label="类型" 
                            prop="type"
                            width="100">
                            <el-tag slot-scope="scope" :type="scope.row.type === 'course' ? 'success' : 'warning'">
                                {{scope.row.type | type}}
                            </el-tag>
                        </el-table-column>
                        <el-table-column 
                            label="名称" 
                            prop="name">
                        </el-table-column>
                    </el-table>
                    <el-tag>总计：{{selectFodder.length}}个素材</el-tag>
                </template>
            </el-form-item>
            <el-form-item label="商品定价" prop="price">
                <el-input placeholder="请输入价格" v-model="form.price" type="Number"></el-input>
            </el-form-item>
            <el-form-item label="优惠价格" prop="price">
                <el-input placeholder="请输入价格" v-model="form.favorable_price" type="Number"></el-input><span class="label">元</span>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit('ruleForm')" type="primary">保存</el-button>
            </el-form-item>
            <DialogVideo :onSelect="handleVideoSelected" v-model="isShowVideoDialog"></DialogVideo>
        </el-form>
    </article>
</template>
<script>
    import CourseCategorySelect from 'components/select/CourseCategory.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    function clearFn () {
        return {
            id: '',
            name: '',
            cover: '',
            show_type: 0, // 0 图片 1视频
            show_picture: '',
            show_video: 0,
            introduce: '',
            price: '',
            favorable_price: '',
            object: [], // object_type = 0 课程 1试卷 object_id = num
        }
    }
    export default {
        data () {
            return {
                isShowVideoDialog: false,
                lesson: {type: Object, required: true},
                push_type_list: [],
                selectFodder: [],
                form: clearFn(),
                rules: {
                    classify: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
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
                    fodder: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                },
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
            // 处理视频选取
            handleVideoSelected(row) {
                this.lesson.material_name = row.name
                this.lesson.material_id = row.id
            },
        },
        components: {
            ImagEcropperInput,
            CourseCategorySelect,
            UploadFile,
            DialogVideo
        }
    }
</script>
