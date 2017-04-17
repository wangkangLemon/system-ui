<!--使用ex.-->
<!--<el-form-item label="课程封面图" prop="image">-->
    <!--<UploadImg :defaultImg="fetchParam.image" :url="uploadImgUrl"-->
               <!--:on-success="res=> fetchParam.image = res.data.url"></UploadImg>-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";

    .component-upload-uploadimg {
        width: 100px;
        height: 100px;
        display: inline-block;

        %commSize {
            width: 100% !important;
            height: 100% !important;
        }

        > * {
            height: 100%;
        }

        .defaultImg {
            position: relative;
            border-radius: 5px;

            &:hover {
                span {
                    opacity: 1;
                }
            }
            img {
                width: 100%;
                height: 100%
            }

            span {
                border-radius: 5px;
                opacity: 0;
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                background: rgba(0, 0, 0, 0.4);
                text-align: center;
                transition: all 300ms ease;

                i {
                    font-size: 30px;
                    color: #fff;
                    display: block;
                    transform: translateY(-50%);
                    top: 50%;
                    position: absolute;
                    width: 100%;
                    cursor: pointer;
                }
            }
        }

        .el-upload--picture-card {
            @extend %commSize;
            position: relative;
            i {
                position: absolute;
                @extend %absoluteCenter;
            }
        }

        .el-upload-list__item-actions {
            @extend %commSize
        }

        .el-upload-list__item {
            @extend %commSize
        }

        .el-progress, .el-progress--circle {
            @extend %commSize;
            .el-progress-circle {
                @extend %commSize;
            }
            > * {
                @extend %commSize
            }
        }
    }
</style>
<template>
    <div class="component-upload-uploadimg" ref="container">
        <el-upload :headers="headers"
                   :action="url"
                   list-type="picture-card"
                   :multiple="false"
                   :before-upload="beforeUpload"
                   :on-success="handleSuccess"
                   :on-error="handleRemove"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :file-list="currImg">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="currImg.length > 0 && currImg[0].url" alt="">
        </el-dialog>
    </div>
</template>

<script>
    import authUtils from '../../../utils/authUtils'
    import config from '../../../utils/config'
    export default{
        props: {
            // 要上传的url地址
            url: {
                type: String,
                default: 'https://jsonplaceholder.typicode.com/posts/'
            },
            // 上传成功后的回调
            onSuccess: Function,
            defaultImg: String,
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                uploadBtn: null, // 上传按钮
                dialogVisible: false,
                headers: void 0,
                forceShowUpload: false, // 强行显示上传图片
                host: config.apiHost,
                currImg: [],
            }
        },
        watch: {
            'currImg' (val) {
                if (val.length > 0 && val[0].url) {
                    this.uploadBtn && (this.uploadBtn.style.display = 'none')
                } else {
                    this.uploadBtn.style.display = 'block'
                }
            },
            'defaultImg' (val) {
                this.currImg = val ? [{name: val, url: val}] : []
            },
            'disabled' (val) {
                this.isShowDelAndPreview(!val)
            }
        },
        created () {
            this.currImg = this.defaultImg ? [{name: this.defaultImg, url: this.defaultImg}] : []
            this.headers = {
                'Authorization': 'Bearer ' + authUtils.getAuthToken()
            }
        },
        activated () {
            console.info(this.disabled)
            this.uploadBtn && (this.uploadBtn = this.$refs.container.querySelector('.el-upload--picture-card'))
            this.isShowDelAndPreview(!this.disabled)
        },
        mounted () {
            this.uploadBtn = this.$refs.container.querySelector('.el-upload--picture-card')
        },
        methods: {
            beforeUpload () {
                this.uploadBtn.style.display = 'none'
            },
            handleRemove () {
                setTimeout(() => {
                    this.clearFiles()
                }, 500)
            },
            handlePictureCardPreview (file) {
                this.dialogVisible = true
            },
            handleSuccess (response, file, fileList) {
                if (response.code == 0)
                    this.onSuccess && this.onSuccess(response)
                else {
                    xmview.showTip('error', response.message)
                    this.handleRemove()
                }
            },
            clearFiles() {
                this.uploadBtn.style.display = 'block'
                this.isShowDefault = true
                this.currImg = []
            },
            isShowDelAndPreview (isShow) {
                let uploadList = this.$refs.container.querySelector('.el-upload-list__item-actions')
                if (uploadList) {
                    uploadList.style.display = isShow ? 'block' : 'none'
                }
//                this.$refs.container.querySelector('.el-upload-list__item-actions').style.display = isShow ? 'block' : 'none'
            }
        },
    }
</script>
