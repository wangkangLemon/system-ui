<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <article>
        <input type="text" @change="changeVal" v-model="currVal">

    </article>
</template>

<script>
    export default{
        props: ['value'],
        data () {
            return {
                currVal: this.value
            }
        },
        created () {
        },
        methods: {
            changeVal () {
                this.$emit('input', this.currVal)
            }
        },
        components: {}
    }
</script>
