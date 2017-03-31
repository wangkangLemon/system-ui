<!--图片裁切上传-->
<style lang='scss' scoped rel='stylesheet/scss'>
    .croppercontainer {
        img {
            max-width: 100%; /* This rule is very important, please do not ignore this! */
        }
    }
</style>

<template>
    <article ref="container">
        <el-button type="primary" @click="chooseImg">上传<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-dialog :close-on-click-modal="false" title="裁切图片" v-model="showCropper" size="large" top="15px">
            <div class="croppercontainer">
                <img @load="startCropper()" class="image-preview" alt="Picture"
                     :src="imgData">
            </div>
            <span slot="footer">
                <el-button @click="showCropper = false">取 消</el-button>
                <el-button type="primary" @click="confirmCropper()">确 定</el-button>
            </span>
        </el-dialog>

        <input type="file" style="display: none" @change="fileChange($event)" ref="file">
    </article>
</template>

<script lang='babel'>
    import Cropper from 'cropperjs'
    import '../../../../node_modules/cropperjs/dist/cropper.min.css'

    let _this
    export default{
        //    点击确认后的回调  长宽比例 16/9  是否圆形裁切
        props: ['confirmFn', 'aspectRatio', 'isRound'],
        data () {
            return {
                showCropper: false,
                imgData: '',
                finalRatio: null,
                cropper: null
            }
        },
        // 提供给外部调用
        chooseImg () {
            _this.chooseImg()
        },
        created () {
            _this = this
            this.finalRatio = this.aspectRatio || 16 / 9
        },
        methods: {
            // 选择图片
            chooseImg () {
                this.$refs.file.click()
            },
            // 文件切换选中
            fileChange (e) {
                let file = e.target.files[0]
                if (!file)
                    return

                let _this = this
                let reader = new window.FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    _this.showCropper = true
                    _this.$nextTick(() => {
                        _this.imgData = this.result
                        _this.$refs.file.value = null
                    })
                }
            },
            // 确定裁剪尺寸
            confirmCropper () {
                this.showCropper = false
                this.confirmFn && this.confirmFn(this.cropper.getCroppedCanvas().toDataURL())
            },
            startCropper () {
                let image = this.$refs.container.querySelector('.image-preview')
                let _this = this
                this.cropper = new Cropper(image, {
                    aspectRatio: this.finalRatio,
                    scalable: false,
                    zoomable: false,
                    viewMode: 1,
                    ready() {
                        // 是否需要原型裁切
                        if (_this.isRound) {
                            [..._this.$refs.container.querySelectorAll('.cropper-view-box,.cropper-face')].map(item => {
                                item.style['border-radius'] = '50%'
                            })
                        }
                    }
                })
            }
        },
        components: {}
    }
</script>
