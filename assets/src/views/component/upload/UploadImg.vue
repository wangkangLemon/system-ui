<template>
    <div>
        <el-upload ref="container"
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
    export default{
        props: {
            // 要上传的url地址
            url: {
                type: String,
                default: 'https://jsonplaceholder.typicode.com/posts/'
            },
            // 上传成功后的回调
            onSuccess: Function
        },
        data () {
            return {
                uploadBtn: null, // 上传按钮
                currImg: void 0,
                dialogVisible: false,
                headers: void 0
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
                    this.uploadBtn.style.display = 'block'
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
                this.onSuccess && this.onSuccess(response)
            }
        },
    }
</script>
