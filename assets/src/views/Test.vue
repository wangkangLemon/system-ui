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
        <VueEditor @ready="ueReady"></VueEditor>
    </div>
</template>

<script>
    import VueEditor from './component/form/UEditor.vue'

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
                ue.setContent('html')
                console.log(ue.getContent())
                console.log(ue.getContentTxt())
            }
        },
        components: {
            VueEditor
        }
    }
</script>
