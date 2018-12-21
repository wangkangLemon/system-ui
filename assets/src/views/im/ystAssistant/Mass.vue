<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #im-ystassistant-mass {
        //        @extend %content-container;
        .search {
            @extend %top-search-container
        }

        // 新建消息
        .create-msg {
            .el-tabs {
                margin-bottom: 15px;
            }
            // 图文消息
            .news-msg {
                > section {
                    text-align: center;
                    border: 1px solid #ededed;
                    color: #666;
                    width: 40%;
                    height: 300px;
                    font-size: 22px;
                    display: inline-block;
                    cursor: pointer;
                    margin-left: 6%;
                    padding-top: 40px;

                    &:hover {
                        color: #333;
                        border-color: #ddd;
                    }
                    div {
                        line-height: 100px;
                        font-size: 100px;
                        display: block;
                    }
                    h5 {
                        line-height: 22px;
                    }
                }
            }
        }
    }
</style>

<template>
    <article id="im-ystassistant-mass">
        <el-tabs type="border-card" v-model="activedTab" @tab-click="handleClick">
            <el-tab-pane label="新建消息" name="new" class="create-msg">
                <!-- <article class="search">
                    <section><i>发送对象</i>
                        <el-select v-model="fetchParamSend.receiver">
                            <el-option value="" label="全部"></el-option>
                            <el-option value="manager" label="店长"></el-option>
                            <el-option value="employee" label="店员"></el-option>
                            <el-option value="free" label="自定义"></el-option>
                        </el-select>
                    </section>

                </article> -->
                <el-form :model="fetchParamSend" ref="fetchParamSend" :rules="rules" label-width="100px">
                    <el-form-item label="发送对象" prop="receiver">
                        <el-select v-model="fetchParamSend.receiver">
                            <el-option value="" label="全部"></el-option>
                            <el-option value="manager" label="店长"></el-option>
                            <el-option value="employee" label="店员"></el-option>
                            <el-option value="custom" label="自定义"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="指定人员" prop="receiver_mobile" v-if="fetchParamSend.receiver === 'custom'">
                        <el-input
                            type="textarea"
                            :rows="8"
                            placeholder="输入手机号，多个手机号逗号分开"
                            v-model="fetchParamSend.receiver_mobile">
                        </el-input>
                    </el-form-item>
                    <!-- <el-form-item label="异常手机号" class="is-error" v-if="fetchParamSend.mobileFailure">
                        <el-input
                            type="textarea"
                            :rows="2"
                            readonly
                            v-model="fetchParamSend.mobileFailure">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="成功手机号" v-if="fetchParamSend.mobileSuccess">
                        <el-input
                            type="textarea"
                            :rows="2"
                            readonly
                            v-model="fetchParamSend.mobileSuccess">
                        </el-input>
                    </el-form-item> -->
                </el-form>

                <!--// 图片消息-->
                <!--<el-tabs v-model="fetchParamSend.type" type="border-card">-->
                <el-tabs v-model="fetchParamSend.type">
                    <el-tab-pane name="news">
                        <span slot="label"><i class="el-icon-menu"></i> 图文消息</span>

                        <article class="news-msg" v-if="!currNewsInfo">
                            <section @click="showDialogMaterial">
                                <div>+</div>
                                <br>
                                <h5>从素材库中选择</h5>
                            </section>
                            <router-link :to="{name:'im-ystAssistant-material'}" tag="section">
                                <div>+</div>
                                <br>
                                <h5>新建图文消息</h5>
                            </router-link>
                        </article>
                        <NewsInfo v-else v-model="currNewsInfo.articles" :type="1"></NewsInfo>
                    </el-tab-pane>
                    <el-tab-pane name="text">
                        <span slot="label"><i class="el-icon-document"></i> 文本消息</span>
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 12, maxRows: 15}"
                                placeholder="请输入内容"
                                v-model="fetchParamSend.text">
                        </el-input>
                    </el-tab-pane>
                    <el-tab-pane label="图片消息" name="image">
                        <article class="news-msg" v-if="!currImg">
                            <section @click="showDialogImg">
                                <div>+</div>
                                <br>
                                <h5>从图片库中选择</h5>
                            </section>
                            <section @click="$refs.uploadImg.choose()" v-loading="loadingUploadimg">
                                <div>+</div>
                                <br>
                                <h5>上传图片</h5>

                                <UploadFile accept="image/*" ref="uploadImg" v-show="false" :url='uploadImgUrl'
                                            :onProgress="()=>loadingUploadimg=true"
                                            :on-success="uploadImgSucc"></UploadFile>
                            </section>
                        </article>
                        <img :src="currImg.thumb_url" title="加载失败" v-else>
                    </el-tab-pane>
                </el-tabs>

                <el-button type="primary" @click="send(0)" :disabled="isSending">
                    <i v-if="!isSending">群发</i>
                    <i v-else>发送中</i>
                </el-button>
                <el-button type="warning" @click="dialogPewviewMsg.isShow = true">
                    <i>预览</i>
                </el-button>
                <el-button type="danger" @click="currNewsInfo = currImg = void 0" v-show="currNewsInfo || currImg">
                    <i>删除</i>
                </el-button>
            </el-tab-pane>
            <!--=============================华丽的分隔符===========================-->
            <el-tab-pane label="已发送" name="sended">
                <SendedList ref="sendedlist"></SendedList>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="选择图文消息" :visible.sync="dialogMaterial.isShow">
            <MaterialList ref="materiallist" :type="1" :onSelected="selectedMaterial"></MaterialList>
        </el-dialog>

        <el-dialog title="选择图片" :visible.sync="dialogImg.isShow">
            <ImgList ref="imglist" :type="1" :onSelected="selectedImg"></ImgList>
        </el-dialog>

        <el-dialog title="输入预览人手机号" :visible.sync="dialogPewviewMsg.isShow" width="30%">
            <el-input v-model="dialogPewviewMsg.mobile" placeholder="预览人手机号"></el-input>
            <div slot="footer">
                <el-button @click="dialogPewviewMsg.isShow = false">取 消</el-button>
                <el-button type="primary" @click="send(1)" :disabled="isSending">
                    <i v-show="!isSending">确 定</i>
                    <i v-show="isSending">发送中...</i>
                </el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import imService from '../../../services/imService'
    import MaterialList from './components/MaterialList.vue'
    import ImgList from './components/ImgList.vue'
    import NewsInfo from './components/NewsInfo.vue' // 图文消息的展示
    import SendedList from './components/SendedList.vue'
    import UploadFile from '../../component/upload/UploadFiles.vue'

    export default{
        data () {
            const validatePass = (rule, value, callback) => {
                if (/^(1[345789]\d{9}(,|，)?)+$/.test(value)) {
                    callback()
                } else {
                    callback(new Error('请输入正确的手机号并且用逗号分隔'))
                }
            }
            return {
                activedTab: 'new',
                fetchParamSend: getOrignFetchParamSend(),
                dialogMaterial: {
                    isShow: false,
                },
                dialogImg: {
                    isShow: false
                },
                // 预览消息
                dialogPewviewMsg: {
                    isShow: false,
                    mobile: ''
                },
                currNewsInfo: void 0,
                currImg: void 0,
                isSending: false, // 是否正在群发中
                uploadImgUrl: void 0, // 图片上传的url
                loadingUploadimg: false, // 上传图片中,
                rules: {
                    receiver_mobile: [
                        // {required: true, message: '', trigger: 'blur'},
                        { required: true, validator: validatePass, trigger: 'change' }
                    ],
                }
            }
        },
        created () {
            xmview.setContentLoading(false)
            this.uploadImgUrl = imService.getNewsUploadImgUrl()
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            handleClick (tab) {
                if (tab.name == 'sended') {
                    this.$nextTick(() => {
                        this.$refs.sendedlist.fetchData()
                    })
                }
            },
            // 选中图文消息
            selectedMaterial(data) {
                this.dialogMaterial.isShow = false
                this.currNewsInfo = data
            },
            showDialogMaterial() {
                this.dialogMaterial.isShow = true
                this.$nextTick(() => {
                    this.$refs.materiallist.fetchData()
                })
            },
            // 选中图片
            selectedImg(data) {
                this.dialogImg.isShow = false
                this.currImg = data
            },
            showDialogImg () {
                this.dialogImg.isShow = true
                this.$nextTick(() => {
                    this.$refs.imglist.fetchData()
                })
            },
            // 0- 群发 1 - 预览
            send (type = 0) {
                // 群发图文
                if (this.fetchParamSend.type === 'text') {
                    if (!this.fetchParamSend.text) {
                        xmview.showTip('warning', '请填写内容后发送')
                        return
                    }
                } else {
                    if ((this.fetchParamSend.type === 'news' && !this.currNewsInfo) || (this.fetchParamSend.type === 'image' && !this.currImg)) {
                        xmview.showTip('warning', '请选取素材后发送')
                        return
                    }
                    // 加上素材的id
                    this.fetchParamSend.media_id = this.fetchParamSend.type === 'news' ? this.currNewsInfo.id : this.currImg.id
                }

                this.isSending = true
                if (type === 0) {
                    imService.mass(this.fetchParamSend).then(() => {
                        // if (ret.failure > 0) {
                        //     this.ruleForm.mobileFailure = ret.mobileFailure
                        //     this.ruleForm.mobileSuccess = ret.mobileSuccess
                        //     this.ruleForm.receiver_mobile = ''
                        //     xmview.showTip('warning', ret.message || '部分手机号不存在')
                        // } else {
                        //     this.fetchParamSend = getOrignFetchParamSend()
                        //     this.isSending = false
                        //     xmview.showTip('success', '发送成功!')
                        // }
                        this.fetchParamSend = getOrignFetchParamSend()
                        this.isSending = false
                        xmview.showTip('success', '发送成功!')
                    }, () => {
                    }).then(() => {
                        this.isSending = false
                    })
                } else if (type === 1) {
                    imService.sendPreview(Object.assign({}, this.fetchParamSend, {mobile: this.dialogPewviewMsg.mobile})).then((ret) => {
                        this.dialogPewviewMsg.isShow = false
                        xmview.showTip('success', '发送成功, 请注意查收')
                    }, () => {
                    }).then(() => {
                        this.isSending = false
                    })
                }
            },
            // 图片上传完毕回调
            uploadImgSucc (ret) {
                this.fetchParamSend.type = 'image'
                this.currImg = this.currImg || {}
                this.currImg.thumb_url = ret.data.thumb
                this.currImg.id = ret.data.id
                this.loadingUploadimg = false
            }
        },
        components: {MaterialList, ImgList, NewsInfo, SendedList, UploadFile}
    }

    function getOrignFetchParamSend () {
        return {
            type: 'news',
            receiver: '',
            media_id: void 0,
            text: '',
            receiver_mobile: '',
            // mobileFailure: '',
            // mobileSuccess: '',
        }
    }
</script>
