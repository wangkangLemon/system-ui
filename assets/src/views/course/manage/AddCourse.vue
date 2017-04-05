<!--添加课程-->
<!--公开课管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";

    #course-manage-addcourse-container {
        @extend %content-container;
    }
</style>

<template>
    <article id="course-manage-addcourse-container">
        <el-form label-width="120px">
            <el-form-item label="所属栏目">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="课程名称">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="课程封面图">
                <UploadImg></UploadImg>
            </el-form-item>
        </el-form>
    </article>
</template>

<script>
    import UploadImg from '../../component/upload/UploadImg.vue'
    export default{
        data () {
            return {}
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {},
        components: {UploadImg}
    }
</script>
