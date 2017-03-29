<!--企业LOGO页面-->
<style lang='scss' scoped rel='stylesheet/scss'>
    .container {
        background: #fff;
        padding: 15px;

        .img-container {
            vertical-align: middle;
            border-radius: 50%;
            width: 100px;
            height: 100px;
            display: inline-block;
            position: relative;
            border: 1px solid #ededed;
            overflow: hidden;
            margin: 0 13px;

            &:before {
                content: "100 x 100";
                background: #f8f8f8;
                display: block;
                position: absolute;
                width: 100%;
                height: 100%;
                line-height: 100px;
                text-align: center;
                color: #777;
            }

            img {
                border-radius: 50%;
                border: none;
                width: 100%;
                height: 100%;
                z-index: 2;
                position: absolute;
            }
        }

        .img-tip {
            vertical-align: middle;
            display: inline-block;
            font-size: 13px;
            line-height: 1.4em;
            color: #bbb;
        }

        .upload-btn {
            margin-top: 9px;
        }

        .submit{
            margin-top: 15px;
            margin-left: 13px;
        }
    }
</style>

<template>
    <article class="container">
        <table>
            <tr>
                <td>企业LOGO</td>
                <td>
                    <div class="img-container">
                        <img :src="imgData" v-show="imgData">
                    </div>
                    <span class="img-tip">
                        建议上传图片尺寸为 100x100 <br>
                        该 Logo 用于联系人我的企业前面的图标显示
                        <br>

                        <ImagEcropperInput :isRound="1" :aspectRatio="1" :confirmFn="cropperFn"
                                           class="upload-btn"></ImagEcropperInput>
                    </span>
                </td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <el-button class="submit" type="info" @click="submit">提交</el-button>
                </td>
            </tr>
        </table>
    </article>
</template>

<script lang='babel'>
    import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
    export default{
        data () {
            return {
                imgData: ''
            }
        },
        methods: {
            // 裁切后的回调
            cropperFn(data) {
                this.imgData = data
            },
            submit() {
            }
        },
        components: {ImagEcropperInput}
    }
</script>
