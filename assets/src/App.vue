<template>
    <div id="app">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import 'element-ui/lib/theme-default/index.css'
    export default {}
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "./utils/mixins/common";
    @import "./utils/mixins/mixins";

    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }

    body {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
    }

</style>
