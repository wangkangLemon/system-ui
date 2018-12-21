<!--<VueAmrPlayer url="model.url"></VueAmrPlayer>-->
<template>
    <el-button type="text"  @click="play"><i class="iconfont icon-luyin"></i></el-button>
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
        }
    },
    created() {
        // 如果全局对象不存在，说明编辑器代码还没有加载完成，需要加载编辑器代码
        this.insertScriptTag()
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
        },
        play() {
            window.playAmr(this.url)
        },
    }
}
</script>
