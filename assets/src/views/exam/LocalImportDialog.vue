<style lang='scss' rel='stylesheet/scss'>
    #dialog-local-import {
        .upload-file {
            margin: 0 auto;
            width: 360px;
            text-align: center;
        }
        hr {
            margin: 15px 0;
        }
    }
</style>
<template>
    <el-dialog id="dialog-local-import" title="导入试题" :visible.sync="isOpen">
        <el-upload
                class="upload-file"
                drag
                :action="uploadUrl"
                :multiple="false"
                :headers="headers">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="upload-file"><el-button type="text">下载参考模板</el-button></div>
        <hr>
        <article>
            <h3>注意事项：</h3>
            <p>1.模板中字段轻对照填写，不能为空</p>
            <p>2.如果有某些内容为空，导入时将跳过</p>
        </article>
    </el-dialog>
</template>
<script>
    import config from '../../utils/config'
    import authUtils from '../../utils/authUtils'

    export default {
        props: {
            confirmFn: Function
        },
        data() {
            return {
                isOpen: false,
                uploadUrl: `${config.apiHost}/testbank/group/subject/excel`,
                headers: {
                    'Authorization': 'Bearer ' + authUtils.getAuthToken(),
                    'TwoStep': `Bearer ` + authUtils.getTwiceToken() // 二次验证的token
                }
            }
        },
        methods: {
            open() {
                this.isOpen = true
            },
            close() {
                this.isOpen = false
            }
        }
    }
</script>
