<template>
    <div id="app" v-loading.fullscreen.lock="fullscreenLoading">
        <transition name="fade">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    import 'element-ui/lib/theme-default/index.css'
    export default {
        data () {
            return {
                fullscreenLoading: false
            }
        },
        created () {
            xmview.setLoading = this.setLoading.bind(this)
            xmview.showTip = this.showTip.bind(this)
            xmview.closeTip = this.closeTip.bind(this)
        },
        methods: {
            setLoading (isloading) {
                this.fullscreenLoading = isloading
            },
            showTip (type, title = '提示', msg) {
                this.$notify({
                    type,
                    title: title,
                    message: msg
                })
            },
            closeTip () {
                this.$notify.close()
            }
        }
    }
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
