<!--首页导航-->
<style lang='scss' rel='stylesheet/scss'>
    .index-nav-container {
        background: #fff;
        border: 1px solid #ededed;
        .form {
            z-index: 99999999999999999999 !important;
            .img-wrap {
                border:1px solid #ededed;
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
            padding: 20px 10px;
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
                    width: 12.5%;
                    display: inline-block;
                    vertical-align: top;
                    text-align: center;
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
                }
            }
            .nav-operate {
                letter-spacing: 0;
                font-size: 14px;
                width: 13%;
                text-align: center;
                margin-top: 20px;
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
        <el-dialog class="form" title="修改图标" v-model="changeIcon" size="tiny">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="name" label="导航图标" label-width="120px">
                    <div class="img-wrap">
                        <img :src="form.url | fillImgPath" alt="" />
                    </div>
                    <p class="tip">建议上传图片尺寸为 140*140</p>
                    <ImagEcropperInput :isShowBtn="true" ref="imgcropper" :confirmFn="cropperFn" :aspectRatio="1"
                    :isRound="true"></ImagEcropperInput>
                </el-form-item>
                <el-form-item prop="name" label="导航名称" label-width="120px">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="changeIcon = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <article class="nav-list" v-for="list in resultData">
            <section class="nav-imgs">
                <div class="nav-item" v-for="(item,index) in list.info" :class="{'active': !list.active}">
                    <div v-if="!list.active" @click="changeFn(list.info, index, list.id)">
                        <img :src="item.icon | fillImgPath" alt=""/>
                        <p>{{item.name}}</p>
                    </div>
                    <div v-else>
                        <img :src="item.icon | fillImgPath" alt=""/>
                        <p>{{item.name}}</p>
                    </div>
                </div>
            </section>
            <section class="nav-operate">
                <span v-if="list.active">使用中</span>
                <el-button type="text" v-if="!list.active" @click="navStart(list.id)">启用</el-button>
                <el-button type="text" @click="navClone(list.id)">克隆</el-button>
                <el-button type="text" @click="navDelete(list.id)" v-if="!list.active">删除</el-button>
            </section>
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
    </article>
</template>
<script>
    import ImagEcropperInput from '../component/upload/ImagEcropperInput.vue'
    import mobileService from '../../services/mobileService'
    import formUtils from '../../utils/formUtils'
    import clone from 'clone'
    import {fillImgPath} from '../../utils/filterUtils'
    export default{
        filters: {
            fillImgPath
        },
        data () {
            return {
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
                form: {
                    url: '',
                    name: ''
                },
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
            cropperFn (data) {
                // 执行上传
                mobileService.uploadNavIcon({
                    image: data,
                    alias: Date.now() + '.jpg'
                }).then((ret) => {
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
            }
        },
        components: {ImagEcropperInput}
    }
</script>
