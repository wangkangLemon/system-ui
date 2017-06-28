<!--<VueAmrPlayer url="model.url"></VueAmrPlayer>-->
<template>
    <el-button type="text" :loading="downLoading" icon="edit" @click="play"></el-button>
</template>

<script>
export default {
    name: 'VueAmrPlayer',
    props: {
        amrPath: {
            // amrPlayer 代码的路径
            type: String,
            default: '/vendor/amr/'
        },
        url: {
            // amr http地址
            type: String,
            default: function () {
                return {}
            }
        },
    },
    data() {
        return {
            instance: null,
            // scriptTagStatus -> 0:代码未加载，1:两个代码依赖加载了一个，2:两个代码依赖都已经加载完成
            scriptTagStatus: 0,
            currVal: '',
            downFlag: 0,
            downLoading: false,
        }
    },
    created() {
        this.currVal = this.url
        if (window.AmrPlayer !== undefined) {
            // 如果全局对象存在，说明编辑器代码已经初始化完成，直接加载编辑器
            this.scriptTagStatus = 2
            this.initPlayer()
        } else {
            // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
            this.insertScriptTag()
        }
    },
    beforeDestroy() {
        // 组件销毁的时候，要销毁 Player 实例
        if (this.instance !== null && this.instance.destroy) {
            this.instance.destroy()
        }
    },
    methods: {
        insertScriptTag() {
            let armScriptTag = document.getElementById('armScriptTag')
            let playerScriptTag = document.getElementById('playerScriptTag')
            // 如果这个tag不存在，则生成相关代码tag以加载代码
            if (armScriptTag === null) {
                armScriptTag = document.createElement('script')
                armScriptTag.type = 'text/javascript'
                armScriptTag.src = this.amrPath + 'amrnb.js'
                armScriptTag.id = 'armScriptTag'
                playerScriptTag = document.createElement('script')
                playerScriptTag.type = 'text/javascript'
                playerScriptTag.src = this.amrPath + 'amrplayer.js'
                playerScriptTag.id = 'playerScriptTag'
                let s = document.getElementsByTagName('head')[0]
                s.appendChild(armScriptTag)
                s.appendChild(playerScriptTag)
            }
            // 等待代码加载完成后初始化编辑器
            if (playerScriptTag.loaded) {
                this.scriptTagStatus++
            } else {
                playerScriptTag.addEventListener('load', () => {
                    this.scriptTagStatus++
                    playerScriptTag.loaded = true
                    this.initPlayer()
                })
                playerScriptTag.onerror = () => {
                    xmview.showTip('error', '加载AMR播放器失败, 请刷新重试!')
                }
            }
            if (armScriptTag.loaded) {
                this.scriptTagStatus++
            } else {
                armScriptTag.addEventListener('load', () => {
                    this.scriptTagStatus++
                    armScriptTag.loaded = true
                    this.initPlayer()
                })
                armScriptTag.onerror = () => {
                    xmview.showTip('error', '加载AMR播放器失败, 请刷新重试!')
                }
            }
            this.initPlayer()
        },
        initPlayer() {
            // scriptTagStatus 为 2 的时候，说明两个必需引入的 js 文件都已经被引入，且加载完成
            if (this.scriptTagStatus === 2 && this.instance === null) {
                // Vue 异步执行 DOM 更新，这样一来代码执行到这里的时候可能 template 里面的 script 标签还没真正创建
                // 所以，我们只能在 nextTick 里面初始化 ArmPlayer
                this.$nextTick(() => {
                    this.instance = new window.AmrPlayer()
                })
            }
        },
        play() {
            if (this.instance !== null) {
                if (this.downFlag === 0) {
                    this.instance.playAmr(this.currVal)
                    this.downFlag++
                } else {
                    this.instance.toggle()
                }
            } else {
                xmview.showTip('error', '加载AMR播放器失败, 请刷新重试!')
            }
        },
    }
}
</script>
