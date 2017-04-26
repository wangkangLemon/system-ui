<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";

    #feedback-add {
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
    <article id="feedback-index">
        <div class="manage-container">
        返回列表
        </div>

        <el-input
  type="textarea"
  autosize
  placeholder="请输入内容"
  v-model="textarea2">
</el-input>
<div style="margin: 20px 0;"></div>
<el-input
  type="textarea"
  :autosize="{ minRows: 2, maxRows: 4}"
  placeholder="请输入内容"
  v-model="textarea3">
</el-input>

    </article>
</template>

<script>
    export default {
        data() {
            return {
                textarea2: '',
                textarea3: ''
            }
        },
        created() {
            xmview.setContentLoading(false)
        }
    }
</script>
