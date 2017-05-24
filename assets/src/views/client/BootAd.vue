<!--启动广告-->
<style lang='scss' rel='stylesheet/scss'>
    #client-bootad-contaienr {
        background: #fff;
        padding: 15px;
        border-radius: 5px;

        /*上传图片部分*/
        @at-root {
            .uploadimg {
                > div {
                    display: inline-block;
                }

                .img-container {
                    width: 200px;
                    height: 264px;
                    border: solid 1px #ccd0d4;
                    background: #f8f8f8;

                    &:before {
                        content: "1280 x 1706";
                        font-size: 20px;
                        height: 264px;
                        line-height: 264px;
                        display: block;
                        text-align: center;
                        color: #666;
                    }

                    img {
                        height: 100%;
                        z-index: 9;
                        position: absolute;
                        width: 198px;
                        top: 0;
                        left: 1px;
                    }
                }

                .img-desc {
                    vertical-align: middle;
                    color: #bbb;
                    margin-left: 12px;
                    span {
                        font-size: 13px;
                        line-height: 1.4em;
                        display: block;
                    }

                    a {
                        font-size: 13px;
                        color: #337ab7;
                        text-decoration: none;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <article id="client-bootad-contaienr">
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px">
            <el-form-item label="广告图片" v-loading="uploadingImg"
                          element-loading-text="图片上传中">
                <section class="uploadimg">
                    <div class="img-container">
                        <img :src="imgData | fillImgPath" v-show="imgData">
                    </div>
                    <div class="img-desc">
                        <span>
                            建议上传图片尺寸为 1280x1706；<br>下次开启药视通手机客户端时，启动页就会显示该启动图
                        </span>
                        <a href="javascript:;" @click="isShowImgSample = true">查看示例</a>
                        <ImagEcropperInput :aspectRatio="1280/1706" :confirmFn="cropperFn"></ImagEcropperInput>
                    </div>
                </section>
            </el-form-item>
            <el-form-item label="跳转链接" prop="logo_app_boot">
                <el-input v-model="form.logo_app_boot" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="展示方式" prop="logo_app_priority">
                <el-radio-group v-model="form.logo_app_priority">
                    <el-radio v-model="form.logo_app_priority" :label="0">优先展示企业启动图</el-radio>
                    <el-radio v-model="form.logo_app_priority" :label="1">优先展示广告</el-radio>
                    <el-radio v-model="form.logo_app_priority" :label="2">关闭广告</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </el-form-item>
        </el-form>

        <!--查看示例的弹出框-->
        <el-dialog title="查看示例" v-model="isShowImgSample" size="small" top="15px">
            <img src="./images/mobile-boot-sample.png" style="width: 100%">
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="isShowImgSample = false">确 定</el-button>
            </span>
        </el-dialog>
    </article>
</template>

<script>
    import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
    import mobileService from '../../services/mobileService'
    import authUtls from '../../utils/authUtils'
    export default{
        data() {
            return {
                imgData: '',
                uploadingImg: false,
                isShowImgSample: false, // 是否显示图片示例
                form: {
                    logo_app_boot: '', // 跳转链接
                    logo_app_priority: 1, // 展示方式优先级
                },
                rules: {
                    logo_app_boot: [
                        {required: true, message: '请输入跳转链接', trigger: 'blur'}
                    ],
                    logo_app_priority: [
                        {type: 'number', required: true, message: '请选择展示方式', trigger: 'blur'}
                    ],
                }
            }
        },
        activated () {
            this.user = authUtls.getUserInfo()
            mobileService.getBoot({company_id: this.user.company_id}).then((ret) => {
                this.imgData = ret.data.image
                this.form = {
                    logo_app_boot: ret.data.url,
                    logo_app_priority: ret.data.status
                }
            }).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            cropperFn(data) {
                this.uploadingImg = true
                // 上传图片
                mobileService.uploadboot({company_id: this.user.company_id, image: data}).then(ret => {
                    this.imgData = ret.data.url
                }).then(() => {
                    xmview.showTip('success', '上传成功')
                    this.uploadingImg = false
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                    this.uploadingImg = false
                })
            },
            submitForm() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        mobileService.updateBoot({
                            company_id: this.user.company_id,
                            image: this.imgData,
                            url: this.form.logo_app_boot,
                            status: this.form.logo_app_priority
                        }).then((ret) => {
                            xmview.showTip('success', '提交成功')
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            }
        },
        components: {
            ImagEcropperInput
        }
    }
</script>
