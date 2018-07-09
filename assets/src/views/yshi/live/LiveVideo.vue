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
                        <el-input placeholder="http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8" 
                            v-model="liveInfo.live_url" 
                            @keyup.native.enter="keyupEnter">
                        </el-input>
                        <!-- <p>{{liveInfo.live_url}}</p> -->
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain @click="live"
                            :icon="islive?'el-icon-circle-close':'el-icon-caret-right'">
                            {{islive?'结束直播':'开始直播'}}
                        </el-button>
                        <p v-if="showTime">{{liveTime}}</p>
                    </div>
                </section>
                <div class="play">
                    <video-player  class="video-player vjs-custom-skin"
                        ref="videoPlayer"
                        :playsinline="true"
                        :options="playerOptions"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)">
                    </video-player>
                </div>
            </el-tab-pane>
            <el-tab-pane label="录播" name="video">
                <section class="video">
                    <p>绑定录播文件，不可再次开启直播，只可修改录播文件</p>
                    <el-button @click="fileClick">
                        <i class="el-icon-upload"></i> 
                        <i> 选择视频</i>
                    </el-button>
                    <p class="tip">只能上传.mp4 .flv .mov格式的视频文件</p>
                    <input style="display: none" type="file" 
                        ref="file" multiple="multiple" 
                        @change="fileChange($event)" accept=".mp4,.flv,.mov">
                    <el-progress v-if="uploading" :percentage="tapedVideo.progress" :status="tapedVideo.progress>= 100 ? 'success' : ''"></el-progress>
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
    import 'video.js/dist/video-js.css'
    import { videoPlayer } from 'vue-video-player'

    let ossSdk = new OssSdk()
    var video, liveInterval
    export default {
        components: {
            screenImg,
            VideoPreviewOnly,
            videoPlayer
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
                playerOptions: {
            //        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                    autoplay: false, //如果true,浏览器准备好时开始回放。
                    muted: false, // 默认情况下将会消除任何音频。
                    loop: false, // 导致视频一结束就重新开始。
                    preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                    language: 'zh-CN',
                    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                    sources: [{
                      type: "application/x-mpegURL",
                      src: "" //你的m3u8地址（必填）
                    }],
                    // poster: "poster.jpg", //你的封面地址
                    width: document.documentElement.clientWidth,
                    notSupportedMessage: '此视频暂无法播放，请输入有效地址。', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
            //        controlBar: {
            //          timeDivider: true,
            //          durationDisplay: true,
            //          remainingTimeDisplay: false,
            //          fullscreenToggle: true  //全屏按钮
            //        }
                  }
            }
        },
        computed: {
            player() {
                return this.$refs.videoPlayer.player
            }
        },
        watch: {
            isplay(val) {
                if(!val) {
                    liveService.closeLive({live_id:this.live_id}).then( () => {
                        clearInterval(liveInterval)
                        this.islive = false
                    })
                }
            }
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
                            this.playerOptions.sources[0].src = this.liveInfo.live_url
                            this.playerOptions.autoplay = true
                            this.startInterval(this.liveInfo.live_duration)
                        }else if(ret.live_status === this.liveStatus.lived) { //已直播
                            this.islive = false
                            this.showTime = false
                            this.playerOptions.sources[0].src = this.liveInfo.live_url
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
                    xmview.setContentLoading(false)
                }).then(() => {
                    
                })
                
            },
            // 播放输入框的视频
            keyupEnter() {
                // alert(this.liveInfo.live_url)
                this.playerOptions.sources[0].src = this.liveInfo.live_url
                this.playerOptions.autoplay = true
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
                    if( this.liveInfo.live_url && this.isplay) {
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
                    }else {
                        xmview.showTip('warning', '当前视频不属于播放状态，不可进行直播。')
                        
                    }
                }
                
            },
            startInterval(dur) {
                liveInterval = setInterval( ()=> {
                    dur = dur + 1
                    this.liveTime = timeUtils.timeFormat(dur)
                },1000)
            },
            onPlayerPlay(player) {
                this.isplay = true
            },
            onPlayerPause(player){
                this.isplay = false
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
                    file: file,
                    process: 0
                }
                this.uploadVideo()
            },
            uploadVideo () {
                let item = this.tapedVideo
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
                        item.process = progress
                    }, ret => {
                        // 创建视频
                        liveService.addVideo({
                            name: item.name,
                            tags: item.tags.join(','),
                            source_type: 'aliyun',
                            source_url: ret.res.requestUrls[0].split('?')[0]
                        }).then((id) => {
                            this.tapedVideo.progress = 100
                            this.tableData = [{
                                name: item.name,
                                status: 1,
                                id: id
                            }]
                            this.uploading = false
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
