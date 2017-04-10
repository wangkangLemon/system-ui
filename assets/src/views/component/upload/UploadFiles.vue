<!--上传文件-->
<!--使用形如-->
<!--<UploadFile :defaultFile="file" url='asdjadasd' :on-success="handleChange"></UploadFile>-->
<template>
    <el-upload ref="upload"
               :headers="headers"
               :action="url"
               :file-list="fileList"
               :on-success="handleUploadMedia" :multiple="false">
        <el-button size="small" :disabled="disabled" type="primary">点击上传</el-button>
    </el-upload>
</template>

<script>
    import authUtils from '../../../utils/authUtils'
    export default {
        props: {
            url: {
                type: String, // 上传的url
                default: 'https://jsonplaceholder.typicode.com/posts/'
            },
            defaultFile: String,
            onSuccess: Function,
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data () {
            return {
                headers: {},
                fileList: this.defaultFile ? [{name: this.defaultFile}] : []
            }
        },
        activated () {
            this.headers = {
                'Authorization': 'Bearer ' + authUtils.getAuthToken()
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
