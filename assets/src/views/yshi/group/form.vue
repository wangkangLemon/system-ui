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
                <UploadFile v-else :on-success="filesHandleChange" btnTitle='选择文件'></UploadFile>
            </el-form-item>
            <el-form-item label="组合介绍" prop="content">
                <el-input :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" type="textarea" v-model="form.content">
                </el-input>
            </el-form-item>
            <el-form-item label="添加商品" prop="goods">
                <el-button size="small">选择素材</el-button>
            </el-form-item>
            <el-form-item label="设置组合售卖优惠">
            </el-form-item>
            <el-form-item>
                <el-button @click="submit('ruleForm')" type="primary">保存</el-button>
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    function clearFn () {
        return {
            id: '',
            name: '',
            image: '',
            type: '0', // 0 图片 1视频
            content: ''
        }
    }
    export default {
        data () {
            return {
                push_type_list: [],
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
        },
        components: {
            ImagEcropperInput,
            UploadFile
        }
    }
</script>
