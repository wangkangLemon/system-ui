<style lang="scss">
    .phase-operation {
        cursor: pointer;
        position: fixed;
        top: 260px;
        right: 26%;
        i {
            color: orange;
            font-size: 70px;
        }
    }
</style>
<template>
    <div class="phase-operation">
        <i 
            class="el-icon-circle-plus"
            @click="addPhase"
            title="添加阶段">
        </i>
        <p>总阶段数:{{ total }}</p>
    </div>
</template>

<script>
    export default {
        props: {
            total: Number
        },
        watch: {
            total (val) {
                this.total = val
            }
        },
        methods: {
            addPhase () {
                this.$emit('addPhase')
            }
        }
    }
</script>
