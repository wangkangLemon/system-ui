<!--上传视频-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";

    #course-manage-video-add-container {
        @extend %content-container;
        min-height: 300px;
        position: relative;

        .first-select-btn {
            @extend %absoluteCenter;
            position: absolute;
        }

        .box-card {
            margin: 0 auto;
            width: 700px;
            margin-bottom: 15px;
            transition: all 300ms ease;
            .operate {
                text-align: right;
            }
            .clearfix {
                display: flex;
                span {
                    flex: 1;
                    height: 34px;
                    line-height: 34px;
                }

                .el-button {
                    flex: 0;
                }
            }

            .el-card__header {
                padding: 5px 10px;
                background: #f8f8f8;
            }
        }

        // 底部按钮
        .bottom-btn {
            margin: 0 auto;
            width: 700px;
        }
    }
</style>

<template>
    <article id="course-manage-video-add-container">
        <el-button @click="fileClick" class="first-select-btn" v-if="listData.length < 1" type="primary"><i
                class="el-icon-upload el-icon--right"></i> <i> 选择要上传的视频文件</i>
        </el-button>

        <el-card class="box-card" v-for="(item,index) in listData" :key="index">
            <div slot="header" class="clearfix">
                <span>{{item.name}}</span>
                <el-button type="text" icon="delete" @click="deleteVideo(index)"></el-button>
            </div>
            <el-form label-width="120px">
                <el-form-item label="视频名称">
                    <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="视频标签">
                    <vTags v-model="item.tags"></vTags>
                </el-form-item>
                <el-form-item label="">
                    <el-progress :percentage="item.process" :status="item.process>= 100 ? 'success' : ''"></el-progress>
                </el-form-item>
            </el-form>
            <div class="operate">
                <el-button type="primary" :disabled="item.process >= 100" @click="submit(item)">
                    <i v-if="item.process < 100 && item.process > 0">正在上传</i>
                    <i v-if="item.process == 0">开始上传</i>
                    <i v-if="item.process >= 100">上传完毕</i>
                </el-button>
            </div>
        </el-card>

        <div v-if="listData.length > 0" class="bottom-btn">
            <el-button v-if="complete" @click="fileClick">继续添加视频</el-button>
        </div>

        <input style="display: none" type="file" ref="file" multiple="multiple" @change="fileChange($event)" accept="">
    </article>
</template>

<script>
    import vTags from '../../component/form/Tags.vue'
    import OssSdk from '../../../vendor/ossSdk'
    import courseService from '../../../services/courseService'
    import authUtils from '../../../utils/authUtils'

    let ossSdk
    export default{
        name: 'course-manage-videoadd',
        data () {
            return {
                listData: [],
                uploading: false,
                complete: false, // 是否上传成功
            }
        },
        mounted () {
//            ossSdk = new OssSdk()
            this.user = authUtils.getUserInfo()
            xmview.setContentLoading(false)
        },
        methods: {
            fileChange (e) {
                this.complete = false
                this.uploading = false
                let dom = e.target
                let ret = []
                for (let i = 0; i < dom.files.length; i++) {
                    let file = dom.files[i]
                    if (this.checkExist(file.name)) {
                        xmview.showTip('warning', `${file.name} 已存在于列表中`)
                        this.complete = true
                    } else {
                        ret.push({
                            name: file.name,
                            tags: [],
                            file: file,
                            process: 0
                        })
                    }
                }

                this.listData.push(...ret)
                dom.value = null
            },
            deleteVideo (index) {
                this.listData.splice(index, 1)
                let completeAll = this.listData.every((item, index) => {
                    return item.process == 100
                })
                if (completeAll) this.complete = true
            },
            fileClick() {
                this.$refs.file.click()
            },
            // 开始上传
            submit (item) {
                this.complete = false
                this.uploading = true
                courseService.getOssToken().then((ret) => {
                    ossSdk = new OssSdk(ret)
                    // 格式化名称
                    var now = new Date()
                    var name = [
                        'company', this.user.company_id,
                        now.getFullYear(), now.getMonth() + 1, now.getDate(),
                        [now.getHours(), now.getMinutes(), now.getSeconds(), (Math.random() + 1).toString(36).substring(7)].join('')
                    ].join('/') + this.extname(item.file)
                    // 上传
                    ossSdk.uploadFile(name, item.file, function (progress) {
                        item.process = progress
                    }, ret => {
                        // 创建视频
                        courseService.addVideo({
                            name: item.name,
                            tags: item.tags.join(','),
                            source_type: 'aliyun',
                            source_url: ret.res.requestUrls[0].split('?')[0]
                        }).then(() => {
                            xmview.showTip('success', '操作成功!')
                            this.complete = true
                            this.uploading = false
                        })
                    }, err => {
                        this.complete = true
                        xmview.showTip('error', '上传出现错误' + JSON.stringify(err))
                    })
                })
            },
            checkExist (name) {
                for (let i = 0; i < this.listData.length; i++) {
                    if (this.listData[i].name === name) {
                        return true
                    }
                }
                return false
            },
            extname (file) {
                var name = file.name || ''
                var parts = name.split('.')
                parts.shift()
                if (parts.length) {
                    return '.' + parts.pop()
                }
                return ''
            }
        },
        components: {vTags}
    }
</script>
