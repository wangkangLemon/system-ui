<template>
    <div id="app" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="拼命加载中">
        <transition name="fade">
            <router-view></router-view>
        </transition>

        <el-dialog :title="dialog.title" v-model="dialog.isShow" size="tiny">
            <span v-html="dialog.content"></span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="dialog.isShow = false">取 消</el-button>
            <el-button type="primary" @click="dialog.confirmFn">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import store from './store/index'
    export default {
        data () {
            return {
                dialog: {
                    isShow: false,
                    content: '',
                    confirmFn: {},
                    title: '提示'
                },
                fullscreenLoading: false,
            }
        },
        created () {
            xmview.setLoading = this.setLoading.bind(this)
            xmview.showTip = this.showTip.bind(this)
            xmview.showDialog = this.showDialog.bind(this)
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
            },
            // 显示dialog
            showDialog (content, confirmFn, title = '操作提示', isShow = true) {
                this.dialog.isShow = isShow
                this.dialog.title = title
                this.dialog.content = content
                this.dialog.confirmFn = () => {
                    this.dialog.isShow = false
                    confirmFn && confirmFn()
                }
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
