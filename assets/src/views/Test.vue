<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <UploadImg :defaultImg="defaultImg"></UploadImg>
        <Tags v-model="tags"></Tags>
    </div>
</template>

<script>
    import UploadImg from './component/upload/UploadImg.vue'
    import Tags from './component/form/Tags.vue'

    export default {
        data() {
            return {
                isShow: true,
                defaultImg: 'http://images2015.cnblogs.com/news/24442/201703/24442-20170323175419330-619990066.jpg',
                tags: []
            }
        },
        mounted () {
        },
        methods: {
            handleChange (val) {
                console.info(val)
            }
        },
        components: {UploadImg, Tags}
    }
</script>
