<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/showDetail";
    .company-audit-show {
        padding: 20px;
        background: #fff;
        .live {
            display:flex;
            .title {
                font-size:14px;
                color:#333;
                flex:0 0 100px;
                text-align:right;
                line-height: 40px;
            }
            .src {
                 flex: 1;
                 margin: 0 10px;
                 p {
                    font-size:12px;
                    margin-top:5px;
                    color: #666;
                 }

            }
            .btn {
                flex: 0 0 140px;
                p {
                    font-size:12px;
                    margin-top:5px;
                    color: #666;
                    margin-left:5px;
                }
            }
        }
        .play{
            margin-top: 20px;
        }
        .video {
            margin: 0 20px;
            p {
                line-height: 40px;
                font-size:14px;
                color:#c00;
                &.tip {
                    font-size:12px;
                    color:#686868;
                }
            }
            span.caozuo {
                cursor: pointer;
            }
            .refresh {
                color: #1d90e6;
                margin-left: 5px;
            }
        }
        
    }
</style>
<template>
    <article class="company-audit-show">
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="直播" name="live" :disabled="liveInfo.live_status === liveStatus.taped">
            <!-- <el-tab-pane label="直播" name="live"> -->
                <section class="live">
                    <div class="title">
                        <p>推流地址:</p>
                    </div>
                    <div class="src">
                        <el-input placeholder="请输入直播地址后按回车键播放。" 
                            v-model="liveInfo.live_url" 
                            @keyup.native.enter="keyupEnter">
                        </el-input>
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain @click="live"
                            :icon="islive?'el-icon-circle-close':'el-icon-caret-right'">
                            {{islive?'结束直播':'开始直播'}}
                        </el-button>
                        <p v-if="showTime">{{liveTime}}</p>
                    </div>
                </section>
                <div id="J_prismPlayers" class="prism-player play"></div>
            </el-tab-pane>
            <el-tab-pane label="录播" name="video">
                <section class="video">
                    <p>绑定录播文件，不可再次开启直播，只可修改录播文件</p>
                    <el-button @click="fileClick">
                        <i class="el-icon-upload"></i> 
                        <i> 选择视频</i>
                    </el-button>
                    <p class="tip">选择上传视频文件</p>
                    <input style="display: none" type="file" 
                        ref="file" multiple="multiple" 
                        @change="fileChange($event)" accept="">
                    <el-progress v-if="uploading" :percentage="progress" :status="progress>= 100 ? 'success' : ''"></el-progress>
                     <el-table
                        :data="tableData"
                        border
                        style="width: 750px;margin-top:20px;">
                        <el-table-column
                          prop="name"
                          label="已绑定文件"
                          width="400">
                        </el-table-column>
                        <el-table-column prop="status" label="状态" width="200">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status == videoStatus.turnok" type="success">转码成功</el-tag>
                                <el-tag v-if="scope.row.status == videoStatus.turning" type="info">转码中</el-tag>
                                <el-tag v-if="scope.row.status == videoStatus.turnerr" type="danger">转码失败</el-tag>
                                <span @click="videoRefresh(scope.$index, scope.row)" 
                                    class="el-icon-refresh caozuo refresh">刷新
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column align="left" label="操作" fixed="right">
                            <template slot-scope="scope">
                                <span @click="preview(scope.$index, scope.row)" v-if="scope.row.status == videoStatus.turnok"
                                    class="el-icon-caret-right caozuo" style="margin-right:10px;">播放
                                </span>
                                <span @click="del(scope.row)" 
                                    class="el-icon-close caozuo">删除
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </section>
            </el-tab-pane>
        </el-tabs>
        <VideoPreviewOnly :url="videoInfo.video_url" ref="VideoPreviewOnly"></VideoPreviewOnly>
    </article>
</template>
<script>
    import screenImg from 'components/dialog/FullScreenImg.vue'
    import VideoPreviewOnly from 'components/dialog/VideoPreviewOnly.vue'
    import companyService from 'services/companyService'
    import liveService from 'services/yshi/liveService'
    import * as timeUtils from 'utils/timeUtils'
    import * as globalConfig from 'utils/globalConfig'
    import OssSdk from '@/vendor/ossSdk'
    import courseService from '../../../services/courseService'

    let ossSdk = new OssSdk()
    var video, liveInterval
    export default {
        components: {
            screenImg,
            VideoPreviewOnly
        },
        data () {
            return {
                activeTab: 'live',
                islive: false,
                liveTime: '00时00分00秒',
                showTime: true,
                tableData: [],
                live_id: void 0,
                liveStatus: globalConfig.liveStatus,
                videoStatus: globalConfig.videoStatus,
                liveInfo: {},
                videoInfo: {},
                tapedVideo:{},
                uploading: false,
                uploadingP: 0,
                isplay: false,
                progress: 0
            }
        },
        computed: {
            
        },
        watch: {
            // isplay(val) {
            //     if(!val) {
            //         liveService.closeLive({live_id:this.live_id}).then( () => {
            //             clearInterval(liveInterval)
            //             this.islive = false
            //         })
            //     }
            // }
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
            if(this.$route.params.live_id){
                this.live_id = this.$route.params.live_id
                this.fetchData()
            }
        },
        mounted(){
            
        },
        destroyed() {
            this.liveInfo.live_url = ""
            clearInterval(liveInterval)
        },
        methods: {
            fetchData(){
                liveService.getLiveVideoInfo({live_id:this.live_id}).then((ret) => {
                    if(ret) {
                        this.liveInfo.live_status = ret.live_status
                        if(ret.live_status !== this.liveStatus.taped) {
                            if(ret.live_url) {
                                this.liveInfo.live_url = ret.live_url
                            }
                            this.liveInfo.live_duration = ret.live_duration
                            this.liveTime = timeUtils.timeFormat(ret.live_duration)
                        }
                        if(ret.live_status === this.liveStatus.unlive){ //未直播
                            this.islive = false
                        }else if(ret.live_status === this.liveStatus.living){ //直播中
                            this.islive = true
                            this.startInterval(this.liveInfo.live_duration)
                        }else if(ret.live_status === this.liveStatus.lived) { //已直播
                            this.islive = false
                            this.showTime = false
                        }else if(ret.live_status === this.liveStatus.taped) { //已录播
                            this.activeTab = 'video'
                            if(ret.video_id != 0) {
                                if(ret.video_status === this.videoStatus.turnok) {
                                    this.videoInfo.video_url = ret.video_url
                                }
                                this.tableData = [{
                                    name: ret.video_name,
                                    status: ret.video_status,
                                    id: ret.video_id
                                }]
                            }
                        }
                    }
                    this.initPlayer()
                    xmview.setContentLoading(false)
                }).then(() => {
                    
                })
                
            },
            initPlayer () {
                if (!window.prismplayer || !this.liveInfo.live_url) return
                /* eslint-disable no-new,new-cap */
                this.$nextTick(() => {
                    new window.prismplayer({
                        id: 'J_prismPlayers', // 容器id
                        source: this.liveInfo.live_url, // 视频地址
                        autoplay: true,    // 自动播放：否
                        width: '100%',       // 播放器宽度
                        height: '500px'      // 播放器高度
                    })
                })
            },
            // 播放输入框的视频
            keyupEnter() {
                this.initPlayer()
            },
            // 直播
            live() {
                if(this.islive) {
                    liveService.closeLive({live_id:this.live_id}).then( () => {
                        clearInterval(liveInterval)
                        this.showTime = false
                        this.islive = !this.islive
                    })
                }else {
                    // if( this.liveInfo.live_url && this.isplay) {
                        // if(this.liveInfo.live_status === this.liveStatus.lived){
                        //     xmview.showTip('warning', '直播已结束不能重复直播。')
                        //     return
                        // }
                        liveService.openLive({live_id:this.live_id,live_url: this.liveInfo.live_url}).then( ()=> {
                            this.showTime = true
                            let dur = 0
                            this.startInterval(dur)
                            this.islive = !this.islive
                        })
                    // }else {
                    //     xmview.showTip('warning', '当前视频不属于播放状态，不可进行直播。')
                        
                    // }
                }
                
            },
            startInterval(dur) {
                liveInterval = setInterval( ()=> {
                    dur = dur + 1
                    this.liveTime = timeUtils.timeFormat(dur)
                },1000)
            },

            // 录播相关
            fileClick() {
                this.$refs.file.click()
            },
            fileChange (e) {
                this.uploading = true
                let dom = e.target
                let file = dom.files[0]
                this.tapedVideo = {
                    name: file.name,
                    tags: [],
                    file: file
                }
                this.uploadVideo()
            },
            uploadVideo () {
                let item = this.tapedVideo
                let _this = this
                courseService.getOssToken().then((ret) => {
                    ossSdk = new OssSdk(ret, fn => {
                        courseService.getOssToken().then(ret => {
                            fn(ret)
                        })
                    })
                    // 开始上传
                    // 格式化名称
                    var now = new Date()
                    var name = [
                        'videoLive', this.live_id,
                        now.getFullYear(), now.getMonth() + 1, now.getDate(),
                        [now.getHours(), now.getMinutes(), now.getSeconds(), (Math.random() + 1).toString(36).substring(7)].join('')
                    ].join('/')
                    // 上传
                    ossSdk.uploadFile(name, item.file,function (progress) {
                        console.log(progress)
                        _this.progress = progress
                    }, ret => {
                        // 创建视频
                        liveService.addVideo({
                            name: item.name,
                            tags: item.tags.join(','),
                            source_type: 'aliyun',
                            source_url: ret.res.requestUrls[0].split('?')[0]
                        }).then((id) => {
                            this.tableData = [{
                                name: item.name,
                                status: 1,
                                id: id
                            }]
                            setTimeout(() => {
                                this.uploading = false
                            },500)
                            liveService.bindVideo({live_id: this.live_id,video_id: id})
                        })
                    }, err => {
                        xmview.showTip('error', '上传出现错误' + JSON.stringify(err))
                    })
                }).catch(err => {
                    console.log(err)
                })
            },
            videoRefresh(index, row) {
                liveService.videoRefresh({video_id:row.id}).then(ret => {
                    this.tableData[0].status = ret
                    if(ret === this.videoStatus.turnok) {
                        this.fetchData()
                    }
                })
            },
             // 预览视频
            preview (index, row) {
                // 拿到播放地址
                this.$refs.VideoPreviewOnly.show(this.tableData[0].name)
            },
            // 删除视频
            del(row) {
                xmview.showDialog(`你将要删除视频 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                    liveService.bindVideo({live_id: this.live_id,video_id: 0}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.tableData = []
                    })
                })
            },
            
        }
    }
</script>
