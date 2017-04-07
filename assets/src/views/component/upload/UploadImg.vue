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
    <div class="component-upload-uploadimg">
        <div v-show="isShowDefault && defaultImg" class="defaultImg">
            <img :src="host + this.defaultImg">
            <span>
                <i class="el-icon-delete2" @click="deleteDefault"></i>
            </span>
        </div>
        <el-upload ref="container" v-show="!(isShowDefault && defaultImg)"
                   :headers="headers"
                   :action="url"
                   list-type="picture-card"
                   :multiple="false"
                   :before-upload="beforeUpload"
                   :on-success="handleSuccess"
                   :on-error="handleRemove"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="currImg" alt="">
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
            defaultImg: String
        },
        data () {
            return {
                uploadBtn: null, // 上传按钮
                currImg: void 0,
                dialogVisible: false,
                headers: void 0,
                isShowDefault: true, // 是否显示默认图片
                forceShowUpload: false, // 强行显示上传图片
                host: config.apiHost
            }
        },
        created () {
            this.headers = {
                'Authorization': 'Bearer ' + authUtils.getAuthToken()
            }
        },
        mounted () {
            this.uploadBtn = document.querySelector('.el-upload--picture-card')
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
                this.setImgUrl(file.url)
            },
            setImgUrl (val) {
                this.currImg = val
            },
            handleSuccess (response, file, fileList) {
                if (response.code == 0)
                    this.onSuccess && this.onSuccess(response)
                else {
                    xmview.showTip('error', response.message)
                    this.handleRemove()
                }
            },
            deleteDefault () {
                this.isShowDefault = false
            },
            clearFiles() {
                this.uploadBtn.style.display = 'block'
                this.isShowDefault = true
                this.$refs.container.clearFiles()
            }
        },
    }
</script>
