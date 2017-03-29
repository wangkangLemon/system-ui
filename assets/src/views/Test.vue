<style lang='scss' scoped rel='stylesheet/scss'>
    .div {
        color: red;
    }
</style>

<template>
    <div>
        <Menutree :data="tree"></Menutree>
    </div>
</template>

<script lang='babel'>
    import Menutree from './component/tree/MenuTree.vue'
    export default{
        data() {
            return {
                tree: {
                    id: 1,
                    child: {
                        id: 2,
                        child: {
                            id: 3,
                            child: {
                                id: 4
                            }
                        }
                    }
                }
            }
        },
        created () {
        },
        methods: {
            getData (data) {
                console.info('test.vue 获取裁切内容' + data)
            }
        },
        components: {
            Menutree
        }
    }
</script>
