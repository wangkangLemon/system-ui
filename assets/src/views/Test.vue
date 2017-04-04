<style lang='scss' scoped rel='stylesheet/scss'>
    .div {
        color: red;
    }

    .container {
        padding: 20px;
    }
</style>

<template>
    <div class="container">
        <SelectScroll></SelectScroll>
        <Test v-model="testVal"></Test>
    </div>
</template>

<script>
    import SelectScroll from './component/form/SelectScroll.vue'
    import Test from './component/Test.vue'

    export default{
        data() {
            return {
                testVal: 1
            }
        },
        created () {
        },
        watch: {
            'testVal'(newVal) {
                console.info('值改变!', newVal)
            }
        },
        methods: {},
        components: {
            SelectScroll,
            Test
        }
    }
</script>
