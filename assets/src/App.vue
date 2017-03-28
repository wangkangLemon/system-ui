<template>
    <div id="app" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import store from './store/index'
    export default {
        data () {
            return {
                fullscreenLoading: false,
            }
        },
        created () {
            xmview.setLoading = this.setLoading.bind(this)
            xmview.showTip = this.showTip.bind(this)
        },
        methods: {
            // 全屏的loading
            setLoading (isloading) {
                this.fullscreenLoading = isloading
            },
            // success/warning/info/error
            showTip (type, msg, msgDuring = 2000) {
                return this.$message({
                    type,
                    message: msg,
                    duration: msgDuring
                })
            }
        },
        store
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    @import "./utils/mixins/common";
    @import "./utils/mixins/mixins";

    .fade-enter-active, .fade-leave-active {
        transition: opacity .2s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }

    body {
        font-size: 14px;
        color: #333;
        line-height: 1.4;
    }

    * {
        box-sizing: border-box;
    }
</style>
