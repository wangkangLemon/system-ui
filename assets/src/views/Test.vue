<style lang='scss' scoped rel='stylesheet/scss'>
    .div {
        color: red;
    }
    .container{
        padding: 20px;
    }
</style>

<template>
    <div class="container">
        <SelectScroll></SelectScroll>
    </div>
</template>

<script lang='babel'>
    import SelectScroll from './component/form/SelectScroll.vue'

    export default{
        data() {
            return {
            }
        },
        created () {
        },
        methods: {
        },
        components: {
            SelectScroll
        }
    }
</script>
