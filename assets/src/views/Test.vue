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
        <VueEditor ueditorPath="/vendor/ueditor/" @ready="ueReady"></VueEditor>
    </div>
</template>

<script>
    import VueEditor from 'vue-ueditor'

    export default{
        data() {
            return {
                testVal: 1
            }
        },
        created () {
        },
        methods: {
            ueReady (ue) {
                console.info(ue)
            }
        },
        components: {
            VueEditor
        }
    }
</script>
