<style lang='scss' scoped rel='stylesheet/scss'></style>

<template>
    <article>
        <input type="text" :value="currVal">

    </article>
</template>

<script>
    export default{
        props: ['value', 'subChangelist', 'keyup.enter', 'keyup.enter.native'],
        data () {
            return {
                currVal: this.value
            }
        },
        created () {
            console.info(this.keyup, this.keyup.enter, this.keyup.enter.native)
        },
        methods: {
            showVal () {
                console.info(this.currVal)
            }
        },
        components: {}
    }
</script>
