<!--首页导航-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";

    .index-nav-container {
        @extend %content-container;
        background: #fff;
        border: 1px solid #ededed;
        .search {
            padding-top: 20px;
            padding-bottom: 6px;
            padding-left: 15px;
            @extend %top-search-container;
            border-bottom: 1px solid #ddd;
        }
        .add {
            @extend %right-top-btnContainer;
        }
        .form {
            .img-wrap {
                width: 140px;
                height: 140px;
                > img {
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .nav-list {
            padding: 10px;
            border-bottom: 1px solid #ededed;
            letter-spacing: -3px;
            font-size: 0;
            &:hover {
                background: #ededed;
            }
            > section {
                display: inline-block;
                vertical-align: top;
            }
            .nav-imgs {
                width: 86%;
                letter-spacing: -3px;
                font-size: 0;
                .nav-item {
                    margin-top: 10px;
                    width: 12.5%;
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
                    position: relative;
                    .operate-layer {
                        visibility: hidden;
                        font-size: 18px;
                        position: absolute;
                        top: 0;
                        @extend %horizontalCenter;
                        display: inline-block;
                        vertical-align: top;
                        width: 80px;
                        height: 80px;
                        background: rgba(0, 0, 0, 0.3);
                        border-radius: 50%;
                        text-align: left;
                        i {
                            margin-top: 10px;
                        }
                        .el-icon-circle-cross {
                            float: right;
                        }
                    }
                    img {
                        border-radius: 50%;
                        width: 80px;
                        height: 80px;
                    }
                    p {
                        letter-spacing: 0;
                        margin-top: 5px;
                        font-size: 14px;
                    }
                    &.active {
                        &:hover {
                            cursor: pointer;
                        }
                    }
                    &.additem {
                        cursor: pointer;
                    }
                }
            }
            .nav-operate {
                letter-spacing: 0;
                font-size: 14px;
                width: 13%;
                text-align: center;
                margin-top: 20px;
            }
            .platform {
                font-size: 14px;
                letter-spacing: 0;
                margin-top: 10px;
                * {
                    display: inline-block;
                    vertical-align: top;
                }
                > i {
                    width: 105px;
                    margin-top: 5px;
                }
                > div {
                    width: 80%;
                    > em {
                        margin: 5px;
                        padding: 2px 5px;
                        background: rgba(0, 0, 0, 0.1);
                    }
                }
            }
        }
        .apply-version {
            .el-dialog__body {
                /*padding: 0;*/
            }
            p {
                padding-bottom: 10px;
            }
            section {
                display: flex;
                margin-bottom: 10px;
                > i {
                    display: block;
                    width: 100px;
                    text-align: right;
                }
                .el-checkbox-group {
                    width: 80%;
                    .el-checkbox {
                        margin-left: 15px;
                        margin-bottom: 10px;
                    }
                }
            }
        }
        .block {
            text-align: right;
            padding: 10px 0;
        }
    }
</style>
<template>
    <article class="index-nav-container" v-loading="containerLoading">
        <!--添加编辑/弹窗-->
        <el-dialog class="form" :title="dialogTitle" v-model="changeIcon" @open="dialogOpen">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="推荐类别">
                    <el-select clearable v-model="form.type" @change="typeChange">
                        <el-option label="功能推荐" value="app_module"></el-option>
                        <el-option label="添加链接" value="link"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能支持版本" v-if="form.type == 'app_module'">
                    <el-select clearable placeholder="全部" v-model="form.app_version" @change="versionChange">
                        <el-option v-for="(item,index) in modulesVersions" :label="item" :value="item"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="type_id" label="选择功能" v-if="form.type == 'app_module'">
                    <el-select v-model="form.type_id" @change="getDefaultLogo">
                        <el-option v-for="(item,index) in modules" :label="item.name" :value="item.id"
                                   :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="icon" v-loading="loading" label="应用logo">
                    <div class="img-wrap" v-if="form.icon">
                        <img :src="form.icon | fillImgPath" alt=""/>
                    </div>
                    <p class="tip">建议上传图片尺寸为 140*140</p>
                    <el-button type="primary" @click="() => {$refs.imgcropper.chooseImg()}">上传</el-button>
                </el-form-item>
                <el-form-item prop="name" label="应用名称">
                    <el-input v-model="form.name" placeholder="控制在4个字以内，展示效果最佳"></el-input>
                </el-form-item>
                <el-form-item prop="url" label="应用链接" v-if="form.type == 'link'">
                    <el-input v-model="form.url" placeholder="请以http://或者https://开头"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeIcon = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <!--启用弹窗-->
        <el-dialog class="apply-version" title="选择方案应用平台和版本" :visible.sync="versionDialog">
            <article v-loading="versionLoading">
                <p>此方案可应用到以下平台版本：</p>
                <section>
                    <i>Android：</i>
                    <el-checkbox-group v-model="checkedAndroids" @change="(value)=>{checkedAndroids=[...value]}">
                        <el-checkbox v-for="(item,index) in platForm.android" :label="item" :key="index">{{item}}
                        </el-checkbox>
                    </el-checkbox-group>
                </section>
                <section>
                    <i>iOS：</i>
                    <el-checkbox-group v-model="checkedIos" @change="(value)=>{checkedIos=[...value]}">
                        <el-checkbox v-for="(item,index) in platForm.ios" :label="item" :key="index">{{item}}
                        </el-checkbox>
                    </el-checkbox-group>
                </section>
            </article>
            <div slot="footer" class="dialog-footer">
                <el-button @click="versionDialog = false">取 消</el-button>
                <el-button type="primary" @click="activeScheme">启 用</el-button>
            </div>
        </el-dialog>
        <div class="add">
            <el-button type="primary" icon="plus" class="recharge" @click="createScheme">新建方案</el-button>
        </div>
        <section class="search">
            <section>
                <i>平台</i>
                <el-select clearable v-model="fetchParam.plat" @change="()=>{searchVersions();getData()}">
                    <el-option label="Android" value="android"></el-option>
                    <el-option label="iOS" value="ios"></el-option>
                </el-select>
            </section>
            <section>
                <i>版本</i>
                <el-select clearable v-model="fetchParam.version" @change="getData">
                    <el-option v-for="(item,index) in versions" :label="item" :value="item" :key="index"></el-option>
                </el-select>
            </section>
        </section>
        <article class="nav-list" v-for="(list,pindex) in resultData" :key="list.id">
            <section class="nav-imgs">
                <section class="dragWrap" v-if="!list.active">
                    <div class="nav-item active"
                         v-for="(item,index) in list.modules"
                         :key="list.id + index">
                        <div class="parent" @mouseenter="showLayer" @mouseleave="hideLayer">
                            <img :src="item.icon | fillImgPath" alt=""/>
                            <p>{{item.name}}</p>
                            <div class="operate-layer">
                                <i class="iconfont icon-edit" @click="editModule(item, list.id, pindex, index)"></i>
                                <i class="el-icon-circle-cross" @click="delModule(list.id, item.id, pindex, index)"></i>
                            </div>
                        </div>
                    </div>
                    <div @click="addModule(list.id, pindex)" class="nav-item additem" v-if="!list.active">
                        <div>
                            <img src="../images/add.png" alt="">
                        </div>
                    </div>
                </section>
                <section class="dragWrap" v-if="list.active">
                    <div class="nav-item"
                         v-for="(item,index) in list.modules"
                         :key="list.id + index">
                        <div>
                            <img :src="item.icon | fillImgPath" alt=""/>
                            <p>{{item.name}}</p>
                        </div>
                    </div>
                    <div @click="addModule(list.id, pindex)" class="nav-item additem" v-if="!list.active">
                        <div>
                            <img src="../images/add.png" alt="">
                        </div>
                    </div>
                </section>
            </section>
            <section class="nav-operate">
                <span v-if="list.active">使用中</span>
                <el-button type="text" v-if="!list.active" @click="getPlatVersions(list.id)">启用</el-button>
                <el-button type="text" @click="cloneScheme(list.id)">克隆</el-button>
                <el-button type="text" @click="deleteScheme(list.id)" v-if="!list.active && !list.readonly">删除</el-button>
            </section>
            <div class="platform" v-if="list.active">
                <i>使用平台和版本:</i>
                <div>
                    <em v-for="(version,index) in list.platform_tag" :key="index">{{version}}</em>
                </div>
            </div>
        </article>
        <div class="block">
            <el-pagination
                    :page-size="page_size"
                    :current-page="currentPage"
                    @current-change="handleCurrentChange"
                    layout="total, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
        <ImagEcropperInput :compress="1" :isShowBtn="false" ref="imgcropper" :confirmFn="cropperFn" :aspectRatio="1"
                           :isRound="true"></ImagEcropperInput>
    </article>
</template>
<script>
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    import mobileService from '../../../services/mobileService'
    import {getArrayIdIndex} from '../../../utils/common'
    import clone from 'clone'
    export default{
        data () {
            return {
                containerLoading: false,
                dialogTitle: '', // 编辑功能标题
                versions: [], // 搜索版本列表
                fetchParam: { // 搜索条件
                    plat: '',
                    version: ''
                },
                versionDialog: false, // 是否显示启用版本的dialog
                versionLoading: false, // 显示版本弹窗loading
                platForm: [], // 启动时获取的平台列表
                checkedAndroids: [], // 已选的Android列表
                checkedIos: [], // 已选的ios列表
                loading: false,
                currentData: {
                    scheme_id: '', // 方案ID
                    pindex: '', // 父层索引
                    index: '' // 子层索引
                },
                changeIcon: false,
                modulesVersions: [], // 获取所有功能的版本
                modules: [], // 获取功能列表
                total: 0,
                currentPage: 1,
                page_size: 10,
                resultData: [],
                form: clearFn(),
                rules: {
                    name: {required: true, message: '必须填写', trigger: 'blur'},
                    icon: {required: true, message: '必须上传', trigger: 'change'},
                    url: {required: true, message: '必须填写', trigger: 'blur'},
                    type_id: {required: true, type: 'number', message: '必须填写', trigger: 'blur'}
                }
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            getDefaultLogo () {
                // 根据功能获取到默认logo
                let curModule = getArrayIdIndex(this.modules, this.form.type_id)
                if (curModule > -1) this.form.icon = this.modules[curModule]['icon']
            },
            dialogOpen () {
                // 当编辑弹窗显示的时候过去所有的功能版本
                return mobileService.getModuleVersions().then((ret) => {
                    this.modulesVersions = ret.data
                })
            },
            // 表单版本发生变化的时候获取功能列表
            versionChange () {
//                this.form.type_id = ''
                return mobileService.getModules({version: this.form.app_version}).then((ret) => {
                    this.modules = ret.data
                    return ret.data
                })
            },
            typeChange () {
                if (this.form.type == 'link') {
                    this.form.url = '' // 链接地址
                    this.form.name = '' // 功能名称
                    this.form.icon = '' // 功能图标
                } else {
                    this.form.type_id = '' // 功能id
                    this.form.app_version = '' // 版本
                    this.form.name = '' // 功能名称
                    this.form.icon = '' // 功能图标
                }
            },
            addModule (scheme_id, pindex) {
                this.form = clearFn()
                this.form.scheme_id = scheme_id
                delete this.form.module_id
                this.currentData = {
                    pindex,
                    scheme_id
                }
                this.changeIcon = true
                this.$nextTick(() => {
                    this.$refs.form.resetFields()
                })
            },
            showLayer (e) {
                e.target.querySelector('.operate-layer').style.visibility = 'visible'
            },
            hideLayer (e) {
                e.target.querySelector('.operate-layer').style.visibility = 'hidden'
            },
            cropperFn (data, ext) {
                this.loading = true
                // 执行上传
                mobileService.uploadModuleScheme({
                    image: data,
                    alias: Date.now() + ext,
                    scheme_id: this.currentData.scheme_id
                }).then((ret) => {
                    this.loading = false
                    this.form.icon = ret.url
                })
            },
            editModule (item, scheme_id, pindex, index) {
                this.currentData = {
                    pindex,
                    index,
                    scheme_id
                }
                this.changeIcon = true
                this.form.type = item.type
                this.dialogTitle = item.name
                item.app_version = ''
                this.$nextTick(() => {
                    this.form = clone(item)
                    this.versionChange().then(() => {
                        if (this.form.type == 'link') {
                            this.form.scheme_id = scheme_id
                            this.form.module_id = item.id
                        } else {
                            this.getActiveVersion(item.type_id).then((ret) => {
                                this.form.app_version = ret[0].app_version
                                this.form.scheme_id = scheme_id
                                this.form.module_id = item.id
                            })
                        }
                    })
                })
            },
            delModule (scheme_id, module_id, pindex, index) {
                mobileService.deleteModule({scheme_id, module_id}).then(() => {
                    xmview.showTip('success', '删除成功')
                    this.resultData[pindex].modules.splice(index, 1)
                })
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                this.containerLoading = true
                return mobileService.searchScheme(
                    {
                        type: 'company',
                        platform: this.fetchParam.plat,
                        app_version: this.fetchParam.version,
                        page: this.currentPage,
                        page_size: this.page_size
                    }
                ).then((ret) => {
                    this.resultData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.containerLoading = false
                })
            },
            searchVersions () {
                mobileService.searchVersions(
                    {
                        type: 'company',
                        platform: this.fetchParam.plat
                    }).then((ret) => {
                        this.versions = ret.data
                    })
            },
            // 获取启用的版本
            getPlatVersions (scheme_id) {
                this.checkedIos = []
                this.checkedAndroids = []
                this.versionDialog = true
                this.versionLoading = true
                mobileService.getPlatVersions({scheme_id}).then((ret) => {
                    this.platForm = ret.data
                    this.platForm.scheme_id = scheme_id
                    this.versionLoading = false
                })
            },
            cloneScheme (scheme_id) {
                mobileService.cloneScheme({scheme_id}).then(() => {
                    xmview.showTip('success', '克隆成功')
                    this.getData()
                })
            },
            deleteScheme (scheme_id) {
                mobileService.deleteScheme({scheme_id}).then(() => {
                    xmview.showTip('success', '删除成功')
                    this.getData()
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let msg = ''
                        let req = ''
                        if (this.form.module_id) {
                            msg = '修改成功'
                            req = mobileService.updateModule
                            delete this.form.sort
                        } else {
                            this.form.sort = this.resultData[this.currentData.pindex]['modules'].length + 1
                            msg = '添加成功'
                            req = mobileService.addModule
                        }
                        req(this.form).then((ret) => {
                            // 添加
                            if (!this.form.module_id) {
                                this.form.module_id = ret.id
                                // 追加一项
                                this.resultData[this.currentData.pindex]['modules'].push(this.form)
                            } else {
                                // 修改当前项
                                this.resultData[this.currentData.pindex]['modules'][this.currentData.index] = this.form
                            }
                            this.changeIcon = false
                            xmview.showTip('success', msg)
                        })
                        console.log(this.form)
                    } else {
                        return false
                    }
                })
            },
            // 新建方案
            createScheme () {
                mobileService.createScheme({type: 'company'}).then((ret) => {
                    this.resultData.push(ret.data)
                })
            },
            // 启用版本号
            activeScheme () {
                mobileService.activeScheme(
                    {
                        scheme_id: this.platForm.scheme_id,
                        ios: this.checkedIos.toString(),
                        android: this.checkedAndroids.toString()
                    }
                ).then(() => {
                    xmview.showTip('success', '启用成功')
                    this.versionDialog = false
                    this.getData()
                }).catch((ret) => {
                    xmview.showTip('success', ret.message || '启用失败')
                })
            },
            getActiveVersion (type_id) {
                return this.versionChange().then((ret) => {
                    let versionArr = ret.filter((item) => {
                        if (item.id == type_id) {
                            return item
                        }
                    })
                    return versionArr
                })
            }
        },
        components: {ImagEcropperInput}
    }
    function clearFn() {
        return {
            type: '', // 功能类型
            type_id: '', // 功能id
            url: '', // 链接地址
            name: '', // 功能名称
            icon: '', // 功能图标
            app_version: '', // 版本
        }
    }
</script>
