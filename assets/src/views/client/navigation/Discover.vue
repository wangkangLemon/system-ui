<!--企业导航-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";
    %navItem {
        margin-top: 10px;
        width: 116px;
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
    }
    .index-discover-container {
        @extend %content-container;
        background: #fff;
        border: 1px solid #ededed;
        .group-list-container {
            .tip {
                margin-bottom: 10px;
            }
            .group-list {
                .group-item {
                    @extend %navItem;
                    .el-input {
                        margin: auto;
                        width: 50%;
                        margin-top: 5px;
                    }
                }
            }
        }
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
                width: 80px;
                height: 80px;
                > img {
                    border-radius: 50%;
                    width: 100%;
                    height: 100%;
                }
                &:last-of-type {
                    border-radius: 0;
                    margin-bottom: 10px;
                }
            }
            .split-line {
                margin-bottom: 10px;
                width: 100%;
                border-bottom: 1px solid #ddd;
                height: 1px;
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
                .dragWrap {
                    display: inline-block;
                    width: auto;
                    vertical-align: top;
                    margin-right: 10px;
                    margin-top: 10px;
                    padding-bottom: 5px;
                    &.is-border {
                        border: 1px dotted red;
                    }
                }
                .nav-item {
                    @extend %navItem;
                    &.active {
                        &:hover {
                            cursor: pointer;
                        }
                    }
                    &.additem {
                        cursor: pointer;
                        margin-top: 27px;
                    }
                }
            }
            .nav-operate {
                letter-spacing: 0;
                font-size: 14px;
                width: 155px;
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
    <article class="index-discover-container" v-loading="containerLoading">
        <!--添加编辑/弹窗-->
        <el-dialog class="form" :title="dialogTitle" v-model="changeIcon">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="推荐类别">
                    <el-select clearable v-model="form.category">
                        <el-option label="功能推荐" :value="1"></el-option>
                        <el-option label="添加链接" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="version" label="功能支持版本" v-if="form.category == 1">
                    <el-select v-model="form.version">
                        <el-option label="功能支持版本" :value="1"></el-option>
                        <el-option label="功能支持版本1" :value="2"></el-option>
                        <el-option label="功能支持版本2" :value="3"></el-option>
                        <el-option label="功能支持版本3" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="version" label="选择功能" v-if="form.category == 1">
                    <el-select v-model="form.action">
                        <el-option label="选择功能" :value="1"></el-option>
                        <el-option label="选择功能1" :value="2"></el-option>
                        <el-option label="选择功能2" :value="3"></el-option>
                        <el-option label="选择功能3" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" v-loading="loading" label="应用logo">
                    <div class="img-wrap">
                        <img :src="form.url" alt="" />
                    </div>
                    <p class="tip">建议上传图片尺寸为 140*140</p>
                    <el-button type="primary" @click="() => {$refs.imgcropper.chooseImg()}">上传</el-button>
                </el-form-item>
                <el-form-item prop="name" label="应用名称">
                    <el-input v-model="form.name" placeholder="控制在4个字以内，展示效果最佳"></el-input>
                </el-form-item>
                <el-form-item prop="link" label="应用链接" v-if="form.category == 2">
                    <el-input v-model="form.link" placeholder="请以http://或者https://开头"></el-input>
                </el-form-item>
                <div class="split-line"></div>
                <el-form-item label="是否需要推荐">
                    <el-radio-group @change="changeRecommend" v-model="form.isRecommend">
                        <el-radio class="radio" :label="0">否</el-radio>
                        <el-radio class="radio" :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-if="form.isRecommend">
                    <el-form-item label="推荐标签">
                        <el-checkbox v-model="form.isDot">红点</el-checkbox>
                    </el-form-item>
                    <el-form-item prop="recommend" label="">
                        <el-checkbox v-model="form.isRecommendText">推荐语</el-checkbox>
                        <div class="subshow" v-if="form.isRecommendText">
                            <i>文案</i>
                            <el-input v-model="form.recommendText"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="">
                        <el-checkbox v-model="form.isPicture">展示图片</el-checkbox>
                        <div class="subshow" v-if="form.isPicture">
                            <div class="img-wrap">
                                <img :src="form.showPic" alt="" />
                            </div>
                            <el-button @click="()=>{$refs.recommendPic.chooseImg()}">上传</el-button>
                        </div>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeIcon = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <!--分组弹窗-->
        <el-dialog class="group-list-container" title="分组" v-model="groupDialog">
            <div class="tip">同一组应用请用相同数字标识，分组的排序按照数字从小到大排列</div>
            <article class="group-list">
                <section class="group-item" v-for="(item,index) in groupList">
                    <img :src="item.icon | fillImgPath" alt=""/>
                    <p>{{item.name}}</p>
                    <el-input placeholder="0" v-model="item.group"/>
                </section>
            </article>
            <div slot="footer" class="dialog-footer">
                <el-button @click="groupDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitGroup">确 定</el-button>
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
                <section class="dragWrap"
                         :class="{'is-border':list.modules.length > 1}"
                         v-if="!list.active"
                         v-for="(mitem,mindex) in list.modules">
                    <div class="nav-item active"
                         v-for="(item,index) in mitem.data"
                         v-dragging="{item: item, list: mitem.data, group: 'item' + list.id + item.group}"
                         :key="item.name">
                        <!--key 必须是字符串-->
                        <div class="parent" @mouseenter="showLayer" @mouseleave="hideLayer">
                            <img :src="item.icon | fillImgPath" alt=""/>
                            <p>{{item.name}}</p>
                            <div class="operate-layer">
                                <i class="iconfont icon-edit" @click="changeFn(item, index, list.id)"></i>
                                <i class="el-icon-circle-cross"></i>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="dragWrap" :class="{'is-border':list.modules.length > 1}" v-if="list.active" v-for="(mitem,mindex) in list.modules">
                    <div class="nav-item"
                         v-for="(item,index) in mitem.data"
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
                <el-button type="text" @click="grouping(list)" v-if="!list.active">分组</el-button>
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
        <ImagEcropperInput :compress="1" :isShowBtn="false" ref="recommendPic" :confirmFn="recommendPic" :aspectRatio="1"
                           :isRound="false"></ImagEcropperInput>
    </article>
</template>
<script>
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    import mobileService from '../../../services/mobileService'
    //    import formUtils from '../../../utils/formUtils'
    //    import clone from 'clone'
    export default{
        name: 'navigatioin-discover',
        data () {
            return {
                containerLoading: false,
                groupDialog: false, // 是否显示分组弹窗
                dialogTitle: '',
                fetchParam: {
                    plat: '',
                    version: ''
                },
                loading: false,
                changeIcon: false,
                total: 0,
                currentPage: 1,
                page_size: 10,
                resultData: [],
                groupList: [],
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
            // 分组
            grouping (list) {
                this.groupDialog = true
                this.groupList = list.grouplist
                console.log(list)
            },
            // 确认分组
            submitGroup () {
                console.log(this.groupList)
                console.log('确认分组')
            },
            addNav (listID) {
                this.form = clearFn()
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
            cropperFn (data) {
                this.loading = true
                // 执行上传
                mobileService.uploadNavIcon({
                    image: data,
                    alias: Date.now() + '.jpg'
                }).then((ret) => {
                    this.loading = false
                    this.form.url = data
                })
            },
            // 推荐图片上传
            recommendPic (data) {
                this.form.showPic = data
                // 执行上传
            },
            changeFn (list, index, id) {
//                this.form = {
//                    url: list[index].icon,
//                    name: list[index].name
//                }
                console.log(list)
                this.form.url = list.icon
                this.form.name = list.name
                this.dialogTitle = list.name
                this.changeIcon = true
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
//                this.resultData = [
//                    {
//                        'id': 1,
//                        'name': '默认',
//                        'readonly': 1,
//                        'active': 0,
//                        'create_admin_id': 1,
//                        'update_admin_id': 1,
//                        'info': [
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/public.png',
//                                'name': '药店培训',
//                                'sort': 1,
//                                'group': 3
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/history.png',
//                                'name': '学习进度',
//                                'sort': 2,
//                                'group': 1
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/task.png',
//                                'name': '任务中心',
//                                'sort': 6,
//                                'group': 2
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/speakingsys.png',
//                                'name': '药我说',
//                                'sort': 4,
//                                'group': 2
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/uniondrug.png',
//                                'name': '联合用药',
//                                'sort': 5,
//                                'group': 2
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/mixtaboo.png',
//                                'name': '搭配禁忌',
//                                'sort': 6,
//                                'group': 3
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/disease.png',
//                                'name': '疾病大全',
//                                'sort': 7,
//                                'group': 4
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/symptom.png',
//                                'name': '症状大全',
//                                'sort': 8,
//                                'group': 4
//                            }
//                        ],
//                        'create_time_name': '2017-01-07 18:00:04',
//                        'create_time_unix': 1483783204,
//                        'update_time_name': '2017-06-21 08:32:31',
//                        'update_time_unix': 1498005151
//                    },
//                    {
//                        'id': 2,
//                        'name': '默认',
//                        'readonly': 1,
//                        'active': 0,
//                        'create_admin_id': 1,
//                        'update_admin_id': 1,
//                        'info': [
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/public.png',
//                                'name': '药店培训',
//                                'sort': 1,
//                                'group': 3
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/history.png',
//                                'name': '学习进度',
//                                'sort': 2,
//                                'group': 1
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/task.png',
//                                'name': '任务中心',
//                                'sort': 6,
//                                'group': 2
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/speakingsys.png',
//                                'name': '药我说',
//                                'sort': 4,
//                                'group': 2
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/uniondrug.png',
//                                'name': '联合用药',
//                                'sort': 5,
//                                'group': 2
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/mixtaboo.png',
//                                'name': '搭配禁忌',
//                                'sort': 6,
//                                'group': 3
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/disease.png',
//                                'name': '疾病大全',
//                                'sort': 7,
//                                'group': 4
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/symptom.png',
//                                'name': '症状大全',
//                                'sort': 8,
//                                'group': 4
//                            }
//                        ],
//                        'create_time_name': '2017-01-07 18:00:04',
//                        'create_time_unix': 1483783204,
//                        'update_time_name': '2017-06-21 08:32:31',
//                        'update_time_unix': 1498005151
//                    },
//                    {
//                        'id': 16,
//                        'name': '默认',
//                        'readonly': 0,
//                        'active': 1,
//                        'create_admin_id': 1,
//                        'update_admin_id': 162,
//                        'info': [
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/public.png',
//                                'name': '公开课',
//                                'sort': 4,
//                                'group': 1
//                            },
//                            {
//                                'icon': '/upload/course/image/1493971044276339.jpg',
//                                'name': '学习进度',
//                                'sort': 2,
//                                'group': 1
//                            },
//                            {
//                                'icon': '/upload/course/image/1493108743727142.jpg',
//                                'name': '课程收藏',
//                                'sort': 3,
//                                'group': 1
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/gsp.png',
//                                'name': 'GSP工具',
//                                'sort': 4,
//                                'group': 1
//                            },
//                            {
//                                'icon': '/upload/course/image/1493006194233884.jpg',
//                                'name': '联合用药',
//                                'sort': 5,
//                                'group': 1
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/mixtaboo.png',
//                                'name': '搭配禁忌',
//                                'sort': 6,
//                                'group': 1
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/disease.png',
//                                'name': '疾病',
//                                'sort': 7,
//                                'group': 1
//                            },
//                            {
//                                'icon': 'http://api.yst.vodjk.dev/assets/app/images/menu/symptom.png',
//                                'name': '症状大全',
//                                'sort': 8,
//                                'group': 1
//                            }
//                        ],
//                        'create_time_name': '2017-04-20 17:43:24',
//                        'create_time_unix': 1492681404,
//                        'update_time_name': '2017-06-22 03:48:30',
//                        'update_time_unix': 1498074510
//                    },
//                ]
                this.containerLoading = true
                return mobileService.searchScheme(
                    {
                        type: 'discover',
                        platform: this.fetchParam.plat,
                        app_version: this.fetchParam.version,
                        page: this.currentPage,
                        page_size: this.page_size
                    }
                ).then((ret) => {
                    console.log(ret)
                    this.resultData = ret.data
                    this.total = ret.total
                    // 按照group重新组合数组
                    this.resultData.forEach((list) => {
                        let newArr = []
                        let newObj = {group: '', data: []}
                        // 按group排序
                        list.modules = list.modules.sort((x, y) => {
                            return x.group - y.group
                        })
                        list.grouplist = list.modules
                        // 按排序分组
                        list.modules.forEach((item, i) => {
                            if (item.group != newObj.group) {
                                newObj = {group: '', data: []}
                                newObj.group = item.group
                                newArr.push(newObj)
                            }
                            newObj.data.push(item)
                        })
                        list.modules = newArr
                    })
                    // 重组数据后，按组内sort排序
                    this.resultData.forEach((pitem) => {
                        pitem.modules.forEach((mitem) => {
                            mitem.data = mitem.data.sort((x, y) => {
                                return x.sort - y.sort
                            })
                        })
                    })
                }).then(() => {
                    this.containerLoading = false
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
                        console.log(1)
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
            },
            changeRecommend () {
                this.form.isDot = 0
                this.form.isRecommendText = 0
                this.form.isPicture = 0
            }
        },
        components: {ImagEcropperInput}
    }
    function clearFn() {
        return {
            category: 1, // 类别
            version: '', // 版本
            action: '', // 功能
            link: '', // 链接
            url: '',
            name: '',
            isDot: 0, // 是否显示红点
            isPicture: 0, // 是否显示图片
            isRecommendText: 0, // 是否显示推荐语
            recommendText: '', // 推荐语
            isRecommend: 0, // 是否需要推荐
            showPic: '' // 展示图地址
        }
    }
</script>
