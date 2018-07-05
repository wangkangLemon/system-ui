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
            video {
                padding: 20px 240px 0 45px;
                width: 100%;
            }
        }
        .video {
            margin: 0 20px;
            p {
                line-height: 40px;
                font-size:14px;
                color:#333;
            }
        }
        
    }
</style>
<template>
    <article class="company-audit-show">
        <el-tabs v-model="activeTab" type="card">
            <el-tab-pane label="直播" name="live">
                <section class="live">
                    <div class="title">
                        <p>推流地址:</p>
                    </div>
                    <div class="src">
                        <el-input placeholder="http://" v-model="liveInfo.live_url" @keyup.native.enter="keyupEnter"></el-input>
                        <!-- <p>视频流获取正常，可正常推流</p> -->
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain @click="live"
                            :icon="islive?'el-icon-circle-close':'el-icon-caret-right'">
                            {{islive?'结束直播':'开始直播'}}
                        </el-button>
                        <p>{{liveTime}}</p>
                    </div>
                </section>
                <div class="play">
                    <video :src="src" ref="video" controls></video>
                </div>
            </el-tab-pane>
            <el-tab-pane label="录播" name="video">
                <section class="video">
                    <p>绑定录播文件，不可再次开启直播，只可修改录播文件</p>
                    <el-upload
                        class="upload-demo"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        accept=".mp4,.flv,.mov"
                        :on-change="uploadChange"
                        :before-upload="beforeUpload"
                        :file-list="fileList">
                        <el-button size="small">选择视频</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传.mp4 .flv .mov格式的视频文件</div>
                    </el-upload>
                     <el-table
                        :data="tableData"
                        border
                        style="width: 700px;margin-top:20px;">
                        <el-table-column
                          prop="name"
                          label="已绑定文件"
                          width="400">
                        </el-table-column>
                        <el-table-column
                          prop="name"
                          label="状态"
                          width="200">
                        </el-table-column>
                        <el-table-column align="left" label="操作" fixed="right">
                            <template slot-scope="scope">
                                <span @click="$router.push({name: 'yshi-live-edit', params: {live_id: scope.row.id}})" 
                                    class="el-icon-caret-right" style="margin-right:10px;">
                                </span>
                                <span @click="del(scope.$index, scope.row)" 
                                    class="el-icon-close">
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </section>
            </el-tab-pane>
        </el-tabs>
        
    </article>
</template>
<script>
    import screenImg from 'components/dialog/FullScreenImg.vue'
    import companyService from 'services/companyService'
    import liveService from 'services/yshi/liveService'
    import * as timeUtils from 'utils/timeUtils'
    import * as globalConfig from 'utils/globalConfig'
    var video, liveInterval
    export default {
        components: {
            screenImg
        },
        data () {
            return {
                activeTab: 'video',
                // src: 'http://www.w3school.com.cn/i/movie.mp4',
                src: 'http://',
                islive: false,
                liveTime: '00时00分00秒',
                tableData: [],
                fileList: [],
                live_id: void 0,
                liveStatus: globalConfig.liveStatus,
                liveInfo: {},
                videoInfo: {}
            }
        },
        watch: {
           

        },
        created () {

        },
        mounted(){
            if(this.$route.params.live_id){
                this.live_id = this.$route.params.live_id
                this.fetchData()
            }
            xmview.setContentLoading(false)
            
        },
        methods: {
            uploadChange(file, fileList) {
                console.log(file)
            },
            beforeUpload (file) {
                console.log(file)
                let fd = new FormData()
                fd.append('file', file)
                fd.append('groupId', this.groupId)
                console.log(fd)
                // newVideo(fd).then(res => {
                //     console.log(res)
                // })
                let obj = {
                    name: file.name,
                    url: ''
                }
                this.tableData.push(obj)
                return true
            },
            fetchData(){
                liveService.getLiveVideoInfo({live_id:this.live_id}).then((ret) => {
                    if(ret) {
                        if(ret.live_status === this.liveStatus.living){
                            this.islive = true
                            this.liveTime = timeUtils.timeFormat(ret.live_duration)
                        }
                        if(ret.live_url) {
                            this.src = ret.live_url
                        }else {
                            this.src = 'http://'
                        }
                    }
                }).then(() => {
                    xmview.setContentLoading(false)
                })

                video = this.$refs.video
                video.addEventListener("ended",() => {
                    this.islive = false
                })
                video.addEventListener("timeupdate",() => {
                    this.timeFormat()
                })
            },
            keyupEnter() {
                this.src = this.liveInfo.live_url
            },
            timeFormat() {
                if(this.islive) {
                    this.timel = timeUtils.timeFormat(video.currentTime)
                }
            },
            live() {
                if( !video.pause) {
                    this.islive = !this.islive
                    if(!this.islive) {
                        liveService.closeLive().then( () => {
                            clearInterval(liveInterval)
                        })
                    }else {
                        liveService.openLive({live_id:this.live_id}).then( ()=> {
                            let dur = 3598
                            liveInterval = setInterval( ()=> {
                                dur = dur + 1
                                this.liveTime = timeUtils.timeFormat(dur)
                            },1000)
                        })
                    }
                }else {
                    xmview.showTip('warning', '直播地址无效，不可播放。')
                }
            }
        }
    }
</script>
