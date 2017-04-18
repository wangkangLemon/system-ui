<!--上传文件-->
<!--使用形如-->
<!--<UploadFile :defaultFile="file" url='asdjadasd' :on-success="handleChange" btnTitle='点击上传'></UploadFile>-->
<template>
    <el-upload ref="upload"
               :before-upload="beforeUpload"
               :headers="headers"
               :action="url"
               :file-list="fileList"
               :on-success="handleUploadMedia" :multiple="false">
        <el-button size="small" :disabled="disabled" type="primary"><i><i class="el-icon-upload el-icon--left"></i></i>{{btnTitle}}
        </el-button>
    </el-upload>
</template>

<script>
    import authUtils from '../../../utils/authUtils'
    export default {
        props: {
            beforeUpload: Function,
            url: {
                type: String, // 上传的url
                default: 'https://jsonplaceholder.typicode.com/posts/'
            },
            defaultFile: String,
            onSuccess: Function,
            disabled: {
                type: Boolean,
                default: false
            },
            btnTitle: { // 按钮的title
                type: String,
                default: '点击上传'
            }
        },
        data () {
            return {
                headers: {},
                fileList: this.defaultFile ? [{name: this.defaultFile}] : []
            }
        },
        created () {
            this.headers = {
                'Authorization': 'Bearer ' + authUtils.getAuthToken(),
                'TwoStep': `Bearer ` + authUtils.getTwiceToken() // 二次验证的token
            }
        },
        activated () {
            this.headers = {
                'Authorization': 'Bearer ' + authUtils.getAuthToken(),
                'TwoStep': `Bearer ` + authUtils.getTwiceToken() // 二次验证的token
            }
        },
        methods: {
            handleUploadMedia (response, file) {
                this.onSuccess && this.onSuccess(response)
                this.fileList = [{name: file.name}]
            }
        },
        components: {}
    }
</script>
