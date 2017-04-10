<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <UploadImg :defaultImg="defaultImg"></UploadImg>
     </div>
</template>

<script>
    import UploadImg from './component/upload/UploadImg.vue'

    export default {
        data() {
            return {
                isShow: true,
                defaultImg: 'http://images2015.cnblogs.com/news/24442/201703/24442-20170323175419330-619990066.jpg'
            }
        },
        mounted () {
        },
        methods: {
            handleChange (val) {
                console.info(val)
            }
        },
        components: {UploadImg}
    }
</script>
