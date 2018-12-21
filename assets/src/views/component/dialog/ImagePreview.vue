<!-- 图片预览 -->
<!-- 使用姿势 -->
<!-- <ImagePreview v-model="isShow" :url="imgage"></ImagePreview> -->
<template>
    <el-dialog :title="title" :visible.sync="isShow" width="30%">
        <img width="100%" :src="imgURL" alt="">
    </el-dialog>
</template>

<script>
import { fillImgPath } from '../../../utils/filterUtils'
export default {
    props: ['value', 'url'],
    data() {
        return {
            title: '图片预览',
            isShow: this.value || false,
            imgURL: fillImgPath(this.url),
        }
    },
    watch: {
        value(val) {
            this.isShow = val
        },
        isShow(val) {
            this.$emit('input', val)
        },
        url(val) {
            this.imgURL = fillImgPath(val)
        }
    }
}
</script>
