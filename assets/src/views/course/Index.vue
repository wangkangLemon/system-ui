<template>
    <keep-alive exclude="course-manage-addcourse,course-manage-videoadd,learnmap-create,teachingmap-create">
        <router-view></router-view>
    </keep-alive>
</template>

<script>
    export default{
        data () {
            return {}
        },
        created () {
        },
        methods: {},
        components: {}
    }
</script>
