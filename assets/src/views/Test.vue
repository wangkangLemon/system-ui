<style lang='scss' rel='stylesheet/scss'>
    #testview-container {

    }

</style>

<template>
    <div id="testview-container">
        <vTest v-model="inoutVal" ref="text" :subChangelist="changeList"></vTest>
        <vTest :value="inoutVal" @input="val=>inoutVal = val "></vTest>
        <vTest value="true"></vTest>
        <vTest :value="123"></vTest>

        <input type="file" ref="file">
    </div>
</template>

<script>
    import VideoPreview from './component/dialog/VideoPreview.vue'
    import vTest from './component/Test.vue'
    export default {
        data() {
            return {
                inoutVal: 11,
                isShow: false,
                list: [{name: '11', age: 18}, {name: '12', age: 18}]
            }
        },
        created () {
//            xmview.showDialog('<span style="color: red">shit</span>')
            console.info(this.$refs.file, 'created')
            console.info(this.$refs.text, 'created')
        },
        mounted () {
            console.info(this.$refs.file)
            console.info(this.$refs.text)
        },
        methods: {
            changeList () {
                console.info(this.$refs.file)
                this.$refs.text.showVal()
            }
        },
        components: {VideoPreview, vTest}
    }
</script>
