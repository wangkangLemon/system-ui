<style lang='scss' rel='stylesheet/scss'></style>

<template>
    <Test @keyup.enter.native="shit"></Test>
</template>

<script>
    import Test from './component/Test.vue'
    export default{
        data () {
            return {}
        },
        created () {
        },
        activated () {
        },
        methods: {
            shit (val) {
                console.info(val, 'shit123')
            }
        },
        components: {Test}
    }
</script>
