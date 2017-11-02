<template>
    <el-dialog id="view" title="导入试题" :visible.sync="isOpen">
    </el-dialog>
</template>
<script>
    export default {
        props: {
            confirmFn: Function
        },
        data() {
            return {
                isOpen: false
            }
        },
        methods: {
            open() {
                this.isOpen = true
            },
            close() {
                this.isOpen = false
            }
        }
    }
</script>
