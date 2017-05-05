<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
    </div>
</template>

<script>
    import CourseSelect from './component/select/Course.vue'
    import UploadImg from './component/upload/UploadImg.vue'
    export default {
        data() {
            return {
                courseList: [],
                selected: void 0
            }
        },
        created () {
        },
        mounted () {
        },

        methods: {},
        components: {CourseSelect, UploadImg}
    }
</script>
