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
        .col-tip-small{
            color: rgb(175, 145, 158);
            font-size: 12px;
            margin-left: 5px;
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
            <!-- <el-form-item label="所属栏目" prop="classify">
                <CourseCategorySelect type="newcourse" :autoClear="true" :showNotCat="false" v-model="form.classify"></CourseCategorySelect>
            </el-form-item> -->
            <el-form-item label="活动名称" prop="name">
                <el-input placeholder="请输入内容" v-model="form.name">
                </el-input>
            </el-form-item>
            <el-form-item label="封面图片" prop="image">
                <img :src="form.image | fillImgPath" alt="" class="img" v-if="form.image" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="弹框图片" prop="image">
                <img :src="form.image | fillImgPath" alt="" class="img" v-if="form.image" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="优惠介绍" prop="content">
                <el-input :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" type="textarea" v-model="form.content">
                </el-input>
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
            <el-form-item label="添加商品" prop="fodder">
                <el-button size="small">选择商品</el-button>
            </el-form-item>
            <el-form-item label="优惠活动价" prop="price">
                <el-input placeholder="请输入价格" v-model="form.sell_price">
                </el-input>
            </el-form-item>
            <el-form-item label="截止日期">
                <DateRange :start="form.time_start"
                    v-on:changeStart="val=> from.time_start=val "
                    :change="fetchData">
                </DateRange>
            </el-form-item>
            <el-form-item label="启用推荐">
                <el-switch
                    v-model="form.tjian">
                </el-switch>
                <i class="col-tip-small" v-if="form.tjian"> 启动推荐后,会关闭其他限时活动的推荐</i>
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
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import DateRange from 'components/form/DatePicker.vue'
    function clearFn () {
        return {
            id: '',
            classify: 1,
            name: '',
            image: '',
            type: '0', // 0 图片 1视频
            content: '',
            price: '',
            sell_price: '',
            time_start: '',
            tjian: false
        }
    }
    export default {
        data () {
            return {
                isShowVideoDialog: false,
                lesson: {type: Object, required: true},
                push_type_list: [],
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
            DialogVideo,
            DateRange
        }
    }
</script>
