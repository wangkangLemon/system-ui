<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";
    .delete-dialog {
        text-align: center;
        i {
            &:before {
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
        <el-dialog v-model="isShow" class="delete-dialog" size="tiny">
            <i class="iconfont icon-warn"></i>
            <h1>操作提示</h1>
            <p>你将要删除<span>{{text}}</span>操作不可恢复确认吗？</p>
            <el-button @click="callback(0)">取 消</el-button>
            <el-button type="primary" @click="callback(1)">确认删除</el-button>
        </el-dialog>
    </article>
</template>
<script lang="babel">
    export default {
        props: ['callback', 'isShow', 'text']
    }
</script>
