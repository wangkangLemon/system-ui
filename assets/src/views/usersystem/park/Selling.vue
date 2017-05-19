<!--出售中-->
<!--公开课管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #usersys-integral-saling {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            margin-top: 15px;
        }

        .el-dialog__wrapper {
            padding-top: 15px;
            background: rgba(0, 0, 0, .5);
            z-index: 1000;
        }
    }
</style>

<template>
    <main id="usersys-integral-saling">
        <article class="manage-container">
            <el-button type="success">发布商品</el-button>
        </article>
    </main>
</template>

<script>
    export default{}
</script>
