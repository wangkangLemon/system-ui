<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #live-content-add {
        @extend %content-container;
    .form {
        width: 80%;
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
        .input-price {
            display: inline-block;
            width: 120px !important;
        }
        .o-error {
            color:red;
            font-size:10px;
            line-height:10px;
            height:10px;
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
    <article id="live-content-add">
        <el-form :model="fetchParam" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="课程名称" prop="name">
                <el-input placeholder="请输入内容" v-model="fetchParam.name" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="课程封面" prop="cover">
                <img :src="fetchParam.cover | fillImgPath" alt="" class="img" v-if="fetchParam.cover" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false" v-if="!disable"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="主讲人" prop="teacher_name">
                <el-input placeholder="请输入内容" v-model="fetchParam.teacher_name" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="主讲人头像" prop="teacher_image">
                <img :src="fetchParam.teacher_image | fillImgPath" alt="" class="img" v-if="fetchParam.teacher_image" style="margin-bottom: 10px; width:100px;height:100px;" />
                <ImagEcropperInput :confirmFn="cropperFn2" :aspectRatio="1/1" :isRound="false" v-if="!disable"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="主讲人简介" prop="teacher_description">
                <el-input placeholder="请输入内容" v-model="fetchParam.teacher_description" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="课程介绍" prop="description">
                <vue-editor v-model="fetchParam.description" @ready="ueReady" v-if="!disable"></vue-editor>
                <div v-if="disable" ref="cont">{{fetchParam.description}}</div>
            </el-form-item>
            <el-form-item label="直播时间" prop="start_time">
                <el-date-picker v-model="fetchParam.start_time" type="datetime" placeholder="选择日期" :picker-options="pickerOptions"
                    format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="datechange" :disabled="disable"> 
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary" v-if="!disable">保存</el-button>
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import VueEditor from 'components/form/UEditor.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import liveService from 'services/yshi/liveService'
    import formCheck from 'utils/formCheckUtils'
    import * as timeUtils from 'utils/timeUtils'
    function clearFn () {
        return {
            id: void 0,
            name: void '',
            cover: void '',
            teacher_image: void '',
            teacher_name: void '',
            teacher_description: void '',
            description: void '',
            start_time: ''
        }
    }
    export default {
        data () {
            return {
                editor: null,
                fetchParam: clearFn(),
                disable: false,
                pickerOptions: {
                    // disabledDate(time) {
                    //     return !_this.fetchParam.end_time ? null
                    //         : (time.getTime() <= new Date().getTime() && timeUtils.compareDate(time, new Date()) !== 0)
                    // }
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() && timeUtils.compareDate(time, new Date()) !== 0
                    }
                },
                rules: {
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    cover: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    teacher_name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    description: [
                        {required: true, message: '必须填写'}
                    ],
                    start_time: [
                        {required: true, message: '必须填写'}
                    ]
                }
            }
        },
        created() {
            if (this.$route.params.live_id != undefined) {
                if (this.$route.name === 'yshi-live-preview'){
                    this.disable = true
                } else {
                    this.disable = false
                }
                liveService.getLiveInfo({
                    id: this.$route.params.live_id
                }).then((ret) => {
                    console.log(ret)
                    this.fetchParam = ret
                    this.$nextTick(() => {
                        this.initTable()
                    })
                    this.editor && this.editor.setContent(ret.introduce)
                    this.$refs.cont.innerHTML = ret.introduce
                })
            } else {
                this.disable = false
            }
            xmview.setContentLoading(false)
        },
        watch: {
        },
        methods: {
            cropperFn (data, ext) {
                liveService.getUploadUrl({
                    image: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.fetchParam.cover = ret.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            cropperFn2 (data, ext) {
                liveService.getUploadUrl({
                    image: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.fetchParam.teacher_image = ret.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
            ueReady (ue) {
                this.editor = ue
            },
            datechange(val) {
                this.fetchParam.time = val
            },
            submit () {
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) return
                    if (!this.editor.getContentTxt()) {
                        xmview.showTip('error', '请填写正文内容')
                        return
                    }
                    this.fetchParam.description = this.editor.getContent()
                    // 去除favorable空值
                    let req = liveService.createLive
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = liveService.updateLive
                        msg = '修改成功'
                    }
                    req(this.fetchParam).then((ret) => {
                        xmview.showTip('success', msg)
                        this.fetchParam = clearFn()
                        this.$router.push({name: 'yshi-live'})
                    }).catch((ret) => {
                        if (ret.data.data === 'exist'){
                            this.orderErr = true
                        } else {
                            xmview.showTip('error', ret.message)
                        }
                    })
                })
                
            }
        },
        components: {
            ImagEcropperInput,
            UploadFile,
            DialogVideo,
            VueEditor
        }
    }
</script>
