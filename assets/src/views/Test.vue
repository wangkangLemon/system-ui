<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <CourseSelect v-model='selected' :list="courseList" @changeList="val=> courseList=val"></CourseSelect>
        <CourseSelect v-model='selected' :list="courseList" @changeList="val=> courseList=val"></CourseSelect>
        <router-link :to="{name:'main'}">我走</router-link>
        <a href="//52hhx.com">我走2</a>
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
            window.onbeforeunload = function () {
                return 'shit'
            }
        },
        mounted () {
        },

        methods: {},
        components: {CourseSelect}
    }
</script>
