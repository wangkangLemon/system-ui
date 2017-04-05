<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <CourseCategory :onchange="handleChange"></CourseCategory>
    </div>
</template>

<script>
    import CourseCategory from './component/select/CourseCategory.vue'
    export default {
        data() {
            return {}
        },
        methods: {
            handleChange (val) {
                console.info(val)
            }
        },
        components: {CourseCategory}
    }
</script>
