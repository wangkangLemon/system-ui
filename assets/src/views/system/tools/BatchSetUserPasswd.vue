<!--系统-工具-批量设置用户密码-->
<style lang='scss' rel="stylesheet/scss">
@import "../../../utils/mixins/common";
@import "../../../utils/mixins/showDetail";
#system-tools-batchsetuserpasswd-container {
    @extend %content-container;
    .header-button {
        @extend %right-top-btnContainer;
    }
    .block {
        text-align: right;
        margin-top: 10px;
    }
}
</style>
<template>
    <main id="system-tools-batchsetuserpasswd-container">
        <div>system tools batch set user passwd</div>
    </main>
</template>

<script>
export default{
    name: "",
    data() {
        return {}
    },
    activated() {
        this.getData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {}

}
</script>