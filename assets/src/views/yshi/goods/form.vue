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
        .input-price {
            display: inline-block;
            width: 120px !important;
        }
        .el-dialog--small{
            width: 80%;
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
        <el-form :model="fetchParam" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="商品名称" prop="name">
                <el-input placeholder="请输入内容" v-model="fetchParam.name">
                </el-input>
            </el-form-item>
            <el-form-item label="商品封面" prop="image">
                <img :src="fetchParam.cover | fillImgPath" alt="" class="img" v-if="fetchParam.cover" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="宣传展示" prop="img_video">
                <el-radio v-model="fetchParam.show_type" :label="typeimg">图片</el-radio>
                <el-radio v-model="fetchParam.show_type" :label="typevideo">视频</el-radio>
                <p v-if="fetchParam.show_type==0" class="el-icon-picture col-tip"> 使用封面图片</p>
                <el-button class="col-btn-block" v-else @click="isShowVideoDialog=true">
                    <i v-if="fetchParam.show_video_name">{{ fetchParam.show_video_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
            </el-form-item>
            <el-form-item label="商品介绍" prop="content">
                <vue-editor v-model="fetchParam.introduce" @ready="ueReady"></vue-editor>
            </el-form-item>
            <el-form-item label="添加素材" prop="fodder">
                <el-button size="small" @click="addRequiredTask(1)">选择素材</el-button>
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
                <template>
                    <el-input class="input-price" placeholder="请输入价格" v-model="fetchParam.price" type="Number"></el-input><i> 元</i>
                    <i style="margin-left:10px;">优惠价格</i>
                    <el-input class="input-price" placeholder="请输入价格" v-model="fetchParam.favorable_price" type="Number"></el-input><i> 元</i>
                </template>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary">保存</el-button>
            </el-form-item>
            <DialogVideo :onSelect="handleVideoSelected" v-model="isShowVideoDialog"></DialogVideo>
            <Task
                ref="requiredTaskRef"
                :visible.sync="showRequiredTaskDialog"
                :selected="requiredTaskSelected"
                :initTabs="transferLeft['requiredTaskSelected']"
                :taskType="taskType"
                @submit="getTaskData">
            </Task>
        </el-form>
    </article>
</template>
<script>
    import VueEditor from 'components/form/UEditor.vue'
    import CourseCategorySelect from 'components/select/CourseCategory.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import goodsService from 'services/yshi/goodsService'
    import Task from '@/views/yshi/component/dialog/task/Main.vue'
    function clearFn () {
        return {
            id: '',
            name: '',
            cover: '',
            show_type: 0, // 0 图片 1视频
            show_picture: '',
            show_video_id: 0,
            show_video_name: '',
            introduce: '',
            price: '',
            favorable_price: '',
            object: [], // object_type = 0 课程 1试卷 object_id = num
        }
    }
    export default {
        data () {
            return {
                editor: null,
                typeimg: 0,
                typevideo: 1,
                isShowVideoDialog: false,
                taskType: void 0,
                showRequiredTaskDialog: false,
                requiredTaskSelected: [],
                transferLeft: '',
                selectFodder: [],
                fetchParam: clearFn(),
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
                    fodder: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    price: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                },
            }
        },
        created () {
            if (this.$route.params.good_id != undefined) {
                goodsService.getGoodInfo({
                    id: this.$route.params.good_id
                }).then((ret) => {
                    console.log(ret)
                    this.fetchParam = ret
                    this.editor && this.editor.setContent(ret.data.introduce)
                })
            }
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
                this.fetchParam.show_video_name = row.name
                this.fetchParam.show_video_id = row.id
            },
            ueReady (ue) {
                this.editor = ue
            },
            addRequiredTask (type) {
                this.showRequiredTaskDialog = true
                this.taskType = type
            },
            getTaskData() {
            },
            submit () {
                // this.$refs['ruleForm'].validate((valid) => {
                //     if (!valid) return
                //     if (!this.editor.getContentTxt()) {
                //         xmview.showTip('error', '请填写正文内容')
                //         return
                //     }
                // })
                this.fetchParam.introduce = this.editor.getContent()
                let req = goodsService.createGood
                let msg = '添加成功'
                if (this.fetchParam.id) {
                    req = goodsService.updateGood
                    msg = '修改成功'
                }
                req(this.fetchParam).then((ret) => {
                    xmview.showTip('success', msg)
                    this.fetchParam = []
                    this.$router.push({name: 'goods'})
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
        },
        components: {
            ImagEcropperInput,
            CourseCategorySelect,
            UploadFile,
            DialogVideo,
            VueEditor,
            Task
        }
    }
</script>
