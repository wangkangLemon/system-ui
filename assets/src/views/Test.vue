<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <CourseSelect v-model='selected' :list="courseList" @changeList="val=> courseList=val"></CourseSelect>
        <CourseSelect v-model='selected' :list="courseList" @changeList="val=> courseList=val"></CourseSelect>
    </div>
</template>

<script>
    import CourseSelect from './component/select/Course.vue'
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
        components: {CourseSelect}
    }
</script>
