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
        <el-form label-width="80px">
            <el-form-item label="所属栏目">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="课程名称">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="课程封面图">
                <el-input></el-input>
            </el-form-item>
        </el-form>
    </article>
</template>

<script>
    export default{
        data () {
            return {}
        },
        activated () {
            console.info('activated')
            xmview.setContentLoading(false)
        },
        methods: {},
        components: {}
    }
</script>
