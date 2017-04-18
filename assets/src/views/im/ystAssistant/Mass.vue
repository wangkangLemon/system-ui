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
                <article class="search">
                    <section><i>发送对象</i>
                        <el-select v-model="fetchParamSend.receiver">
                            <el-option value="" label="全部"></el-option>
                            <el-option value="manager" label="店长"></el-option>
                            <el-option value="employee" label="店员"></el-option>
                        </el-select>
                    </section>
                </article>

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
                            <router-link :to="{name:'im-ystAssistant-materialmanage'}" tag="section">
                                <div>+</div>
                                <br>
                                <h5>上传图片</h5>
                            </router-link>
                        </article>
                        <img :src="currImg.thumb_url | fillImgPath" title="加载失败" v-else>
                    </el-tab-pane>
                </el-tabs>

                <el-button type="primary" @click="send" :disabled="isSending">
                    <i v-if="!isSending">群发</i>
                    <i v-else>发送中</i>
                </el-button>
                <el-button type="danger" @click="currNewsInfo = currImg = void 0" v-show="currNewsInfo || currImg">
                    <i>删除</i>
                </el-button>
            </el-tab-pane>
            <el-tab-pane label="已发送" name="sended">配置管理</el-tab-pane>
        </el-tabs>

        <el-dialog title="选择图文消息" v-model="dialogMaterial.isShow">
            <MaterialList ref="materiallist" :type="1" :onSelected="selectedMaterial"></MaterialList>
        </el-dialog>

        <el-dialog title="选择图片" v-model="dialogImg.isShow">
            <ImgList ref="imglist" :type="1" :onSelected="selectedImg"></ImgList>
        </el-dialog>
    </article>
</template>

<script>
    import imService from '../../../services/imService'
    import MaterialList from './components/MaterialList.vue'
    import ImgList from './components/ImgList.vue'
    import NewsInfo from './components/NewsInfo.vue' // 图文消息的展示

    export default{
        data () {
            return {
                activedTab: 'new',
                fetchParamSend: getOrignFetchParamSend(),
                dialogMaterial: {
                    isShow: false,
                },
                dialogImg: {
                    isShow: false
                },
                currNewsInfo: void 0,
                currImg: void 0,
                isSending: false, // 是否正在群发中
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            handleClick (tab) {
                console.info('选中tab', tab, this.activedTab)
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
            send () {
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
                imService.mass(this.fetchParamSend).then(() => {
                    this.fetchParamSend = getOrignFetchParamSend()
                    this.isSending = false
                }).catch(() => {
                    this.isSending = false
                })
            }
        },
        components: {MaterialList, ImgList, NewsInfo}
    }

    function getOrignFetchParamSend () {
        return {
            type: 'news',
            receiver: '',
            media_id: void 0,
            text: ''
        }
    }
</script>
