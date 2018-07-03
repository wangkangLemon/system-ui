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
                        <el-input placeholder="请输入内容" v-model="videosrc" @keyup.native.enter="keyupEnter"></el-input>
                        <!-- <p>视频流获取正常，可正常推流</p> -->
                    </div>
                    <div class="btn">
                        <el-button plain @click="test"
                            :icon="istest?'el-icon-circle-close':'el-icon-caret-right'">
                            {{istest?'结束测试':'开始测试'}}
                        </el-button>
                        <p>00时00分00秒{{sect}}</p>
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain @click="live"
                            :icon="islive?'el-icon-circle-close':'el-icon-caret-right'">
                            {{islive?'结束直播':'开始直播'}}
                        </el-button>
                        <p>00时00分00秒</p>
                    </div>
                </section>
                <div class="play">
                    <video :src="src" ref="video"></video>
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
                        <div slot="tip" class="el-upload__tip">请注意您只能上传.mp4 .flv .mov格式的视频文件</div>
                    </el-upload>
                     <el-table
                        :data="tableData"
                        border
                        style="width: 500px;margin-top:20px;">
                        <el-table-column
                          prop="name"
                          label="已绑定文件"
                          width="400">
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
    import signingService from 'services/system/signingService'
    var video
    export default {
        components: {
            screenImg
        },
        data () {
            return {
                activeTab: 'live',
                videosrc: '',
                src: 'http://www.w3school.com.cn/i/movie.mp4',
                istest: false,
                islive: false,
                hourt: "00",
                mint: '00',
                sect: '00',
                tableData: [],
                fileList: []
            }
        },
        watch: {
           

        },
        created () {
            if(this.$route.params.id){
                this.signingId = this.$route.params.id
                signingService.getSigningInfo(this.signingId).then((ret) => {
                    
                }).then(() => {
                    xmview.setContentLoading(false)
                })
            }
            xmview.setContentLoading(false)
        },
        mounted(){
            this.fetchData()
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
                video = this.$refs.video
                video.addEventListener("ended",() => {
                    this.istest = false
                    this.islive = false
                })
            },
            keyupEnter() {
                alert(this.videosrc)
            },
            test() {
                if(this.islive) this.islive = false
                this.istest = !this.istest
                if(this.istest) {
                    video.currentTime = 0
                    video.play()
                }else {
                    video.pause()
                }
                video.addEventListener("timeupdate",() => {
                    // let second = 0
                    // let min = 0
                    // let hour = 0
                    // if(parseInt(video.currentTime)/60 > 1){
                    //     let min = parseInt(video.currentTime)/60
                    //     if(min / 60 > 1){
                    //     }
                    // }
                    this.sect = parseInt(video.currentTime)
                })
            },
            live() {
                if(this.istest) this.istest = false
                this.islive = !this.islive
                if(this.islive) {
                    video.currentTime = 0
                    video.play()
                }else {
                    video.pause()
                }
            }
            
           
        }
    }
</script>
