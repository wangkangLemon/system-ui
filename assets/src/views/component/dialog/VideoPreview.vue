<!--预览视频-->
<style lang='scss' rel='stylesheet/scss'>
    .comp-dialog-videopreview {

    }

    .form {
        margin-top: 20px;
    }

</style>

<template>
    <el-dialog :title="title || '视频预览'" :visible.sync="isShow">
        <div id="J_prismPlayer" class="prism-player"></div>

        <el-form label-width="100px" :model="form" class="form" ref="form" v-if="!type">
            <el-form-item label="审核结果" prop='flag'>
                <el-select v-model="form.status" :disabled="disabled">
                    <el-option label="审核成功" value="3"></el-option>
                    <el-option label="审核失败" value="4"></el-option>
                    <el-option label="待审核" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label='备注说明' prop="remark">
                <el-input
                        :disabled="disabled"
                        type="textarea"
                        v-model="form.remark"
                        :autosize="{ minRows: 4, maxRows: 6}"
                        placeholder="请输入内容">
                </el-input>
            </el-form-item>
            <el-button v-if="!disabled" type='primary' class="bottom-btn" @click="submit()">确定</el-button>
            <el-button v-else type='primary' class="bottom-btn" @click="isShow=false">取消</el-button>
        </el-form>

    </el-dialog>
</template>

<script>
    import courseService from '../../../services/courseService'
    import clone from 'clone'

    export default {
        props: {
            onchange: Function,
            url: String,
            row: {},
            type: ''
        },
        data() {
            return {
                disabled: false,
                isShow: false,
                title: '',
                form: {
                    id: '',
                    status: '',
                    remark: '' //  注释
                }
            }
        },
        beforeCreate () {
            if (window.prismplayer) return

            let loadCount = 0
            let script = document.createElement('script')
            script.src = '//g.alicdn.com/de/prismplayer/1.5.7/prism-flash-min.js'
            script.onload = () => {
                loadCount++
                loadCount >= 2 && this.initPlayer()
            }

            let link = document.createElement('link')
            link.href = '//g.alicdn.com/de/prismplayer/1.5.7/skins/default/index.css'
            link.rel = 'stylesheet'
            link.onload = () => {
                loadCount++
                loadCount >= 2 && this.initPlayer()
            }
            document.head.appendChild(script)
            document.head.appendChild(link)
        },
        created () {
            this.initPlayer()
        },
        watch: {
            'isShow'(val) {
                if (val) {
                    this.initPlayer()
                    console.log(this.row)
                    this.initform()
                }
            }
        },
        methods: {
            // 审核提交
            submit () {
                if (!this.row) return
                if (this.form.status === '待审核') {
                    this.form.status = 0
                } else if (this.form.status === '审核成功') {
                    this.form.status = 3
                } else if (this.form.status === '审核失败') {
                    this.form.status = 4
                }
                courseService.auditVideo(this.form).then(() => {
                    xmview.showTip('success', '保存成功')
                    this.isShow = false
                    this.onchange()
                })
            },
            show (title) {
                this.title = title
                this.isShow = true
            },
            initPlayer () {
                if (!window.prismplayer || !this.url) return
                /* eslint-disable no-new,new-cap */
                this.$nextTick(() => {
                    new window.prismplayer({
                        id: 'J_prismPlayer', // 容器id
                        source: this.url, // 视频地址
                        autoplay: true,    // 自动播放：否
                        width: '100%',       // 播放器宽度
                        height: '360px'      // 播放器高度
                    })
                })
            },
            initform () {
                if (!this.row) return
                this.form = clone(this.row)
                this.disabled = this.row.status !== 0
                if (this.form.status === 0) {
                    this.form.status = '待审核'
                } else if (this.form.status === 3) {
                    this.form.status = '审核成功'
                } else if (this.form.status === 4) {
                    this.form.status = '审核失败'
                }
            }
        },
        components: {}
    }
</script>
