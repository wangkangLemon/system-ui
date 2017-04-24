<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";
    .delete-dialog {
        text-align: center;
        text-align-last: center;
        i {
            &:before {
                margin-top: 20px;
                display: block;
                font-size: px2rem(60);
                color: #f8bb86;
                padding-bottom: px2rem(40);
            }
        }
        h1 {
            font-size: px2rem(20);
        }
        p {
            margin: px2rem(10);
            span {
                color: red;
            }
        }
    }
</style>
<template>
    <article>
        <el-dialog v-model="value" :show-close="false" class="delete-dialog" size="tiny">
            <i class="iconfont icon-warn"></i>
            <h1>操作提示</h1>
            <p>{{text}}</p>
            <el-button @click="operate(0)">取 消</el-button>
            <el-button @click="operate(1)" type="primary">确认删除</el-button>
        </el-dialog>
    </article>
</template>
<script lang="babel">
    export default {
        props: ['value', 'text'],
        methods: {
            operate (val) {
                this.$emit('callback', val)
            }
        }
    }
</script>
