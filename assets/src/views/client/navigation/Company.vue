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
        .block {
            text-align: right;
            padding: 10px 0;
        }
    }
</style>
<template>
    <article class="index-nav-container">
        <el-dialog class="form" :title="dialogTitle" v-model="changeIcon">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item prop="category" label="推荐类别">
                    <el-select v-model="form.category">
                        <el-option label="功能推荐" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="version" label="功能支持版本">
                    <el-select v-model="form.version">
                        <el-option label="功能推荐" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="version" label="选择功能">
                    <el-select v-model="form.action">
                        <el-option label="功能推荐" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" v-loading="loading" label="导航图标">
                    <div class="img-wrap">
                        <img :src="form.url" alt="" />
                    </div>
                    <p class="tip">建议上传图片尺寸为 140*140</p>
                    <el-button type="primary" @click="() => {$refs.imgcropper.chooseImg()}">上传</el-button>
                </el-form-item>
                <el-form-item prop="name" label="导航名称">
                    <el-input v-model="form.name" placeholder="控制在4个字以内，展示效果最佳"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeIcon = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <div class="add">
            <el-button type="primary" icon="plus" class="recharge" @click="navClone(0)">新建方案</el-button>
        </div>
        <section class="search">
            <section>
                <i>平台</i>
                <el-select clearable v-model="fetchParam.plat" @change="getData">
                    <el-option label="Android" :value="1"></el-option>
                    <el-option label="iOS" :value="2"></el-option>
                </el-select>
            </section>
            <section>
                <i>版本</i>
                <el-select clearable v-model="fetchParam.version" @change="getData">
                    <el-option label="Android" :value="1"></el-option>
                    <el-option label="iOS" :value="2"></el-option>
                </el-select>
            </section>
        </section>
        <article class="nav-list" v-for="(list,pindex) in resultData" :key="list.id">
            <section class="nav-imgs">
                <section class="dragWrap" v-if="!list.active">
                    <div class="nav-item active"
                         v-for="(item,index) in list.info"
                         v-dragging="{item: item, list: list.info, group: 'item' + list.id}"
                         :key="item.name">
                        <div class="parent" @mouseover="showLayer" @mouseout="hideLayer">
                            <img :src="item.icon | fillImgPath" alt=""/>
                            <p>{{item.name}}</p>
                            <div class="operate-layer" @click="changeFn(list.info, index, list.id)">
                                <i class="iconfont icon-edit"></i>
                                <i class="el-icon-circle-cross"></i>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="dragWrap" v-if="list.active">
                    <div class="nav-item"
                         v-for="(item,index) in list.info"
                         :key="item.name">
                        <div>
                            <img :src="item.icon | fillImgPath" alt=""/>
                            <p>{{item.name}}</p>
                        </div>
                    </div>
                </section>
                <div @click="addNav(list.id)" class="nav-item additem" v-if="!list.active">
                    <div>
                        <img src="../images/add.png" alt="">
                    </div>
                </div>
            </section>
            <section class="nav-operate">
                <span v-if="list.active">使用中</span>
                <el-button type="text" v-if="!list.active" @click="navStart(list.id)">启用</el-button>
                <el-button type="text" @click="navClone(list.id)">克隆</el-button>
                <el-button type="text" @click="navDelete(list.id)" v-if="!list.active">删除</el-button>
            </section>
            <div class="platform">
                <i>使用平台和版本:</i>
                <div>
                    <em>Android 2.0</em>
                    <em>Android 2.0</em>
                    <em>Android 2.0</em>
                    <em>Android 2.0</em>
                    <em>Android 2.0</em>
                    <em>Android 2.0</em>
                    <em>Android 2.0</em>
                    <em>Android 2.0</em>
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
    import formUtils from '../../../utils/formUtils'
    import clone from 'clone'
    export default{
        data () {
            return {
                dialogTitle: '',
                fetchParam: {
                    plat: '',
                    version: ''
                },
                loading: false,
                currentData: {
                    id: '',
                    list: [],
                    index: '',
                    url: ''
                },
                changeIcon: false,
                total: 0,
                currentPage: 1,
                page_size: 10,
                resultData: [],
                form: clearFn(),
                rules: {
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            addNav (listID) {
                this.form = clearFn()
                this.changeIcon = true
                this.$nextTick(() => {
                    this.$refs.form.resetFields()
                })
            },
            showLayer (e) {
                if (e.target.parentNode.className == 'parent') {
                    if (e.target.parentNode.querySelector('.operate-layer') != null) {
                        e.target.parentNode.querySelector('.operate-layer').style.visibility = 'visible'
                    }
                }
            },
            hideLayer (e) {
                if (e.target.parentNode.className == 'parent') {
                    if (e.target.parentNode.querySelector('.operate-layer') != null) {
                        e.target.parentNode.querySelector('.operate-layer').style.visibility = 'hidden'
                    }
                }
            },
            cropperFn (data) {
                this.loading = true
                // 执行上传
                mobileService.uploadNavIcon({
                    image: data,
                    alias: Date.now() + '.jpg'
                }).then((ret) => {
                    this.loading = false
                    this.form.url = data
                    this.currentData.url = ret.url
                })
            },
            changeFn (list, index, id) {
                this.form = {
                    url: list[index].icon,
                    name: list[index].name
                }
                this.currentData = {list, index, id}
                this.dialogTitle = list[index].name
                this.changeIcon = true
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                return mobileService.menuSearch({page: this.currentPage, page_size: this.page_size}).then((ret) => {
                    this.resultData = ret.data
                    this.total = ret.total
                })
            },
            startCropper() {
                ImagEcropperInput.chooseImg()
            },
            navStart (navID) {
                mobileService.applyMenu(navID).then(() => {
                    xmview.showTip('success', '启用成功')
                    this.getData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            navClone (navID) {
                mobileService.menuClone(navID).then(() => {
                    xmview.showTip('success', '克隆成功')
                    this.getData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            navDelete (navID) {
                mobileService.menuDelete(navID).then(() => {
                    xmview.showTip('success', '删除成功')
                    this.getData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let originData = clone(this.currentData)
                        this.currentData.list[this.currentData.index]['name'] = this.form.name
                        if (this.currentData.url) {
                            this.currentData.list[this.currentData.index]['icon'] = this.currentData.url
                        }
                        let info = formUtils.serializeArray(this.currentData.list, 'info')
                        mobileService.updateMenu({
                            info: info,
                            scheme_id: this.currentData.id
                        }).then((ret) => {
                            this.changeIcon = false
                            xmview.showTip('success', '更换成功')
                        }).catch((ret) => {
                            this.currentData.list[this.currentData.index]['name'] = originData.list[this.currentData.index]['name']
                            this.currentData.list[this.currentData.index]['icon'] = originData.list[this.currentData.index]['icon']
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            // 拖拽完成之后
            dragFn () {
                /*
                 draged 拖拽对象
                 to 目标对象
                 value.list 存储拖拽之后的数组
                 */
                this.$dragging.$on('dragged', (value) => {
                    // 拖拽成功之后运行
                    // 将value.draged.id 和 value.to.id 作为参数传递给接口
                })
            }
        },
        components: {ImagEcropperInput}
    }
    function clearFn() {
        return {
            category: '', // 类别
            version: '', // 版本
            action: '', // 功能
            url: '',
            name: ''
        }
    }
</script>
