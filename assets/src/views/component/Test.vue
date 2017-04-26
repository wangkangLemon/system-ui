<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <article>
        <input type="text" :value="currVal">

    </article>
</template>

<script>
    export default{
        props: ['value', 'subChangelist'],
        data () {
            return {
                currVal: this.value
            }
        },
        created () {
            this.currVal = 123456
            this.$emit('input', 123456)

            this.showVal()
        },
        methods: {
            showVal () {
                console.info(this.currVal)
            }
        },
        components: {}
    }
</script>
