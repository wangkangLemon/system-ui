<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #dialog-content-add {
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
    <article id="dialog-content-add">
        <el-form :model="fetchParam" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="活动名称" prop="name">
                <el-input placeholder="请输入内容" v-model="fetchParam.name" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="弹出图片" prop="image">
                <img :src="fetchParam.image | fillImgPath" alt="" class="img" v-if="fetchParam.image" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false" :aspectRatio="aspectRatio" v-if="!disable"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="跳转链接" prop="url">
                <el-input placeholder="请输入内容" v-model="fetchParam.url" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="截止日期" prop="end_time">
                <el-date-picker v-model="fetchParam.end_time" type="datetime" placeholder="选择日期" :picker-options="pickerOptions"
                    format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="datechange" :disabled="disable"> 
                </el-date-picker>
            </el-form-item>
            <el-form-item label="启用推荐">
                <el-switch
                    v-model="fetchParam.status" :on-value="2" :off-value="1" on-color="#13ce66" :disabled="disable">
                </el-switch>
                <i class="col-tip-small" v-if="fetchParam.status == 2"> 启动推荐后,会关闭其他限时活动的推荐</i>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary" v-if="!disable">保存</el-button>
            </el-form-item>
        </el-form>
    </article>
</template>
<script>
    import CourseCategorySelect from 'components/select/CourseCategory.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import toastService from 'services/yshi/toastService'
    import * as timeUtils from 'utils/timeUtils'
    function clearFn () {
        return {
            id: void 0,
            name: void '',
            image: void '',
            url: void '',
            end_time: void '',
            status: void 0,
        }
    }
    let _this
    export default {
        data () {
            return {
                fetchParam: clearFn(),
                disable: false,
                aspectRatio: 521 / 527,
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
                    image: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    // end_time: [
                    //     {message: "不能为空",required: 1},
                    //     {pattern: null,type: "string",message: null}
                    // ]
                },
            }
        },
        beforeCreate () {
            _this = this
        },
        created() {
            if (this.$route.params.dialog_id != undefined) {
                if (this.$route.name === 'yshi-dialog-preview'){
                    this.disable = true
                } else {
                    this.disable = false
                }
                toastService.getToastInfo({
                    id: this.$route.params.dialog_id
                }).then((ret) => {
                    console.log(ret)
                    this.fetchParam = ret
                })
            } else {
                this.disable = false
            }
            xmview.setContentLoading(false)
        },
        methods: {
            cropperFn (data, ext) {
                toastService.getUploadUrl({
                    image: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.fetchParam.image = ret.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
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
            datechange(val) {
                this.fetchParam.end_time = val
            },
            changes() {
                console.log(this.fetchParam.status)
            },
            submit () {
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) return
                    let date = new Date(this.fetchParam.end_time)
                    let compare = timeUtils.compareDateTime(date, new Date())
                    if (compare !== 1){
                        xmview.showTip('error', '截止日期不能小于当前日期')
                        return
                    }
                    let req = toastService.createToast
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = toastService.updateToast
                        msg = '修改成功'
                    }
                    req(this.fetchParam).then((ret) => {
                        xmview.showTip('success', msg)
                        this.fetchParam = clearFn()
                        this.$router.push({name: 'yshi-dialog'})
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
                
            }
        },
        components: {
            ImagEcropperInput,
            CourseCategorySelect,
            UploadFile,
        }
    }
</script>
