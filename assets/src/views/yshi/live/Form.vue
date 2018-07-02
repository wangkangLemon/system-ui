<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #group-content-add {
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
    <article id="group-content-add">
        <el-form :model="fetchParam" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="课程名称" prop="name">
                <el-input placeholder="请输入内容" v-model="fetchParam.name" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="课程封面" prop="cover">
                <img :src="fetchParam.cover | fillImgPath" alt="" class="img" v-if="fetchParam.cover" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false" v-if="!disable"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="主讲人" prop="user">
                <el-input placeholder="请输入内容" v-model="fetchParam.user" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="主讲人头像" prop="headimg">
                <img :src="fetchParam.cover | fillImgPath" alt="" class="img" v-if="fetchParam.headimg" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false" v-if="!disable"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="主讲人简介" prop="userinfo">
                <el-input placeholder="请输入内容" v-model="fetchParam.userinfo" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="课程介绍" prop="classinfo">
                <vue-editor v-model="fetchParam.classinfo" @ready="ueReady" v-if="!disable"></vue-editor>
                <div v-if="disable" ref="cont">{{fetchParam.classinfo}}</div>
            </el-form-item>
            <el-form-item label="直播时间" prop="time">
                <el-date-picker v-model="fetchParam.time" type="datetime" placeholder="选择日期" :picker-options="pickerOptions"
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
    import dialogSelectData from 'components/dialog/SelectData5table.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import goodsService from 'services/yshi/goodsService'
    import goodsGroupService from 'services/yshi/goodsGroupService'
    import PlusOrRemove from '../component/PlusOrRemove.vue'
    import formCheck from 'utils/formCheckUtils'
    import * as timeUtils from 'utils/timeUtils'
    function clearFn () {
        return {
            id: void 0,
            name: void '',
            cover: void '',
            user: void '',
            headimg: void '',
            userinfo: void '',
            classinfo: void '',
            time: ''
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
                    user: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    classinfo: [
                        {required: true, message: '必须填写'}
                    ],
                    time: [
                        {required: true, message: '必须填写'}
                    ]
                }
            }
        },
        created() {
            if (this.$route.params.group_id != undefined) {
                if (this.$route.name === 'yshi-group-preview'){
                    this.disable = true
                } else {
                    this.disable = false
                }
                goodsGroupService.getGoodGroupInfo({
                    id: this.$route.params.group_id
                }).then((ret) => {
                    console.log(ret)
                    this.fetchParam = ret
                    this.$nextTick(() => {
                        this.initTable()
                    })
                    ret.favorable.forEach(item => {
                        this.moneyarr.push(item.reach)
                        this.discountarr.push(item.discount)
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
                goodsService.getUploadUrl({
                    image: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.fetchParam.cover = ret.url // 显示图片
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
            fetchGood (params) {
                return goodsService.searchGoods(Object.assign({}, this.dialogGoods, params))
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
                    this.fetchParam.introduce = this.editor.getContent()
                    this.fetchParam.goods_ids = this.fetchParam.goods.map(item => {
                        return item.id
                    })
                    if ( !this.$store.state.component.yshiGroupSussess) return
                    // 去除favorable空值
                    for (let i = this.fetchParam.favorable.length-1; i>=0 ; i--){
                        if (!this.fetchParam.favorable[i].reach || !this.fetchParam.favorable[i].discount){
                            this.fetchParam.favorable.splice(i,1)
                        }
                    }
                    let req = goodsGroupService.createGoodGroup
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = goodsGroupService.updateGoodGroup
                        msg = '修改成功'
                    }
                    req(this.fetchParam).then((ret) => {
                        xmview.showTip('success', msg)
                        this.fetchParam = clearFn()
                        this.$router.push({name: 'yshi-group'})
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
            dialogSelectData,
            DialogVideo,
            VueEditor,
            PlusOrRemove
        }
    }
</script>
