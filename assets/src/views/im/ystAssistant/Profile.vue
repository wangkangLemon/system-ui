<!--资料设置-->
<style lang='scss' rel='stylesheet/scss'>
    #im-ystasstant-profile {
        width: 100%;
        padding: 10px;
        .left-container, .right-container {
            display: inline-block;
            vertical-align: top;
        }
        .left-container {
            width: 171px;
            img {
                width: 171px;
                height: 171px;
                border-radius: 50%;
            }
            > div {
                text-align: center;
            }
        }

        .right-container {
            margin-left: 15px;
            width: 500px;
        }
    }
</style>

<template>
    <el-card id="im-ystasstant-profile" v-loading="loading">
        <article class="left-container">
            <!--<img src="http://upload.vodjk.com/2017/0418/1492481646151.jpg" title="头像加载失败">-->
            <img :src="data.avatar | fillImgPath" title="头像加载失败">
            <div>
                <el-button @click="$refs.imgcropper.chooseImg()">修改头像</el-button>
            </div>
            <ImgCropper :isShowBtn="false" ref="imgcropper" :confirmFn="cropperImgSucc" :aspectRatio="1"
                        :isRound="true"></ImgCropper>
        </article>

        <article class="right-container">
            <el-form label-position="right" label-width="100px">
                <el-form-item label="服务号名称">
                    <el-input v-model="data.name" placeholder="名称"></el-input>
                </el-form-item>
                <el-form-item label="联系人电话">
                    <el-input v-model="data.mobile" placeholder="电话"></el-input>
                </el-form-item>
                <el-form-item label="联系人邮箱">
                    <el-input v-model="data.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="data.address" placeholder="地址"></el-input>
                </el-form-item>
                <el-form-item label="简介">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 12, maxRows: 15}"
                            placeholder="请输入内容"
                            v-model="data.intro">
                    </el-input>
                </el-form-item>
                <el-form-item label="">
                    <el-button @click="save" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </article>
    </el-card>
</template>

<script>
    import imService from '../../../services/imService'
    import ImgCropper from '../../component/upload/ImagEcropperInput.vue'
    export default{
        data () {
            return {
                loading: false,
                data: {}
            }
        },
        activated () {
            imService.getProfileInfo().then((ret) => {
                this.data = ret
                xmview.setContentLoading(false)
            })
        },
        methods: {
            // 图片裁切完成回调
            cropperImgSucc (avatar) {
                // 上传头像
                imService.changeProfileAvatar({avatar}).then((ret) => {
                    this.data.avatar = ret
                })
            },
            save () {
                this.loading = true
                imService.editProfile(this.data).then(() => {
                    xmview.showTip('success', '保存成功!')
                    this.loading = false
                }).catch(() => {
                    this.loading = false
                })
            }
        },
        components: {ImgCropper}
    }
</script>
