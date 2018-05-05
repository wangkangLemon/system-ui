<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #good-content-add {
        @extend %content-container;
    .form {
        width: 80%;
        .btn {
            float: right;
        }
        .img {
            display: block;
            width: 250px;
            height: 160px;
        }
        .collection {
            align-items: center;
            min-height: 36px;
            border-radius: 4px;
            padding: 3px 10px;
            border: 1px solid #bfcbd9;
            .tag {
               margin-right: 10px;
            }
        }
        .col-tip{
            color: #666;
            display: block;
            line-height: 36px;
        }
        .col-btn-block{
            display: block;
            margin-top: 10px;
        }
        .input-price {
            display: inline-block;
            width: 120px !important;
        }
        .el-input-number{
            .el-input__inner{
                float: left;
                width: 260px;
            }
            .el-input-group__append{
                width: 40px;
                height: 36px;
            }
        }
        
    }
    .dialog {
            section {
                margin-bottom: 10px;
                i {
                    margin-right: 10px;
                }
            }
        }
     }
</style>
<template>
    <article id="good-content-add">
        <el-form :model="fetchParam" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="商品名称" prop="name">
                <el-input placeholder="请输入内容" v-model="fetchParam.name" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="商品封面" prop="cover">
                <img :src="fetchParam.cover | fillImgPath" alt="" class="img" v-if="fetchParam.cover" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false" v-if="!disable"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="宣传展示" prop="show_type">
                <el-radio-group v-model="fetchParam.show_type">
                    <el-radio :label="typeimg" :disabled="disable">图片</el-radio>
                    <el-radio :label="typevideo" :disabled="disable">视频</el-radio>
                </el-radio-group>
                <p v-if="fetchParam.show_type==1" class="el-icon-picture col-tip"> 使用封面图片</p>
                <el-button class="col-btn-block" v-else @click="isShowVideoDialog=true" :disabled="disable">
                    <i v-if="fetchParam.show_video_name">{{ fetchParam.show_video_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
            </el-form-item>
            <el-form-item label="商品介绍" prop="introduce">
                <vue-editor v-model="fetchParam.introduce" @ready="ueReady" v-if="!disable"></vue-editor>
                <div v-if="disable" ref="cont">{{fetchParam.introduce}}</div>
            </el-form-item>
            <el-form-item label="添加素材" prop="transferRight">
                <el-button size="small" @click="chooseMaterial" :disabled="disable">选择素材</el-button>
                <template v-if="fetchParam.transferRight.length">
                    <el-table class="data-table" :data="fetchParam.transferRight" :fit="true" border style="margin-top: 5px;">
                        <el-table-column 
                            label="类型" 
                            prop="type"
                            width="100">
                            <el-tag slot-scope="scope" :type="scope.row.type | taskType('tag')">
                                {{scope.row.type | taskType('label')}}
                            </el-tag>
                        </el-table-column>
                        <el-table-column 
                            label="名称" 
                            prop="name">
                        </el-table-column>
                    </el-table>
                    <el-tag>总计：{{fetchParam.transferRight.length}}个素材</el-tag>
                </template>
            </el-form-item>
            <el-form-item label="商品定价" prop="price">
                <el-input type="tel" v-numberOnly v-model.number="fetchParam.price" style="width: 300px" placeholder="请输入价格" :disabled="disable">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
             <el-form-item label="优惠价格" prop="favorable_price">
                <el-input type="tel" v-numberOnly v-model.number="fetchParam.favorable_price" style="width:300px;" placeholder="请输入价格" :disabled="disable">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary" v-if="!disable">保存</el-button>
            </el-form-item>
            <DialogVideo :onSelect="handleVideoSelected" v-model="isShowVideoDialog"></DialogVideo>
            <Task
                ref="material"
                :visible.sync="showMaterialDialog"
                :selected="fetchParam.transferRight"
                :initTabs="transferLeft"
                @submit="getTaskData">
            </Task>
        </el-form>
    </article>
</template>
<script>
    import VueEditor from 'components/form/UEditor.vue'
    import CourseCategorySelect from 'components/select/CourseCategory.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import goodsService from 'services/yshi/goodsService'
    import Task from 'components/dialog/task/Main.vue'
    import TaskModel from 'components/dialog/task/model'
    import formCheck from 'utils/formCheckUtils'

    function clearFn () {
        return {
            id: void 0,
            name: void '',
            cover: void '',
            show_type: 1, // 0 图片 1视频
            show_picture: void '',
            show_video_id: void 0,
            show_video_name: void '',
            introduce: void '',
            price: void 0,
            favorable_price: void 0,
            objects: [], // type = 0 公开课程 1内训课 2试卷 3练习 id = num
            transferRight: []
        }
    }
    export default {
        data () {
            let checkHasShow = (rule, value, callback) => {
                formCheck.checkHasShow(rule, value, callback, this.fetchParam.show_video_name, () => {
                    this.fetchParam.show_video_id = 0
                    this.fetchParam.show_video_name = ''
                })
            }
            let checkPrice = (rule, value, callback) => {
                formCheck.checkPrice(rule, value, callback)
            }
            let checkMoney = (rule, value, callback) => {
                formCheck.checkMoney(rule, value, this.fetchParam.price, callback)
            }
            return {
                editor: null,
                typeimg: 1,
                typevideo: 2,
                isShowVideoDialog: false,
                taskType: void 0,
                showMaterialDialog: false,
                transferLeft: [],
                fetchParam: clearFn(),
                disable: false,
                rules: {
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    cover: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    show_type: [
                        {required: true, trigger: 'change', validator: checkHasShow},
                    ],
                    introduce: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    price: [
                        {type: 'number', required: true, trigger: 'blur', message: '请输入商品定价'},
                        {validator: checkPrice}
                    ],
                    transferRight: [
                        {required: true, message: '请选择至少一个素材'}
                    ],
                    favorable_price: [
                        {type: 'number', required: true,trigger: 'blur', message: '请输入优惠价格'},
                        {validator: checkMoney}
                    ]
                },
            }
        },
        created () {
            console.log(this.$route.name)
            if (this.$route.name === 'yshi-goods-preview' && this.$route.params.good_id != undefined) {
                goodsService.getGoodInfo({
                    id: this.$route.params.good_id
                }).then((ret) => {
                    console.log(ret)
                    this.fetchParam = ret
                    this.fetchParam.price = parseFloat(ret.price)
                    this.fetchParam.favorable_price = parseFloat(ret.favorable_price)
                    let obj = this.getTaskSelected(ret.objects)
                    this.fetchParam.transferRight = obj.resRight
                    if (this.fetchParam.transferRight.length > 0) {
                        this.transferLeft = obj.resLeft
                    } else {
                        this.transferLeft = new TaskModel().initTabs()
                    }
                    this.editor && this.editor.setContent(ret.introduce)
                    this.$refs.cont.innerHTML = ret.introduce
                })
                this.disable = true
            } else {
                this.disable = false
                if (this.$route.params.good_id != undefined) {
                    goodsService.getGoodInfo({
                        id: this.$route.params.good_id
                    }).then((ret) => {
                        console.log(ret)
                        this.fetchParam = ret
                        this.fetchParam.price = parseFloat(ret.price)
                        this.fetchParam.favorable_price = parseFloat(ret.favorable_price)
                        let obj = this.getTaskSelected(ret.objects)
                        this.fetchParam.transferRight = obj.resRight
                        if (this.fetchParam.transferRight.length > 0) {
                            this.transferLeft = obj.resLeft
                        } else {
                            this.transferLeft = new TaskModel().initTabs()
                        }
                        this.editor && this.editor.setContent(ret.introduce)
                    })
                } else {
                    this.transferLeft = new TaskModel().initTabs()
                }
            }
            xmview.setContentLoading(false)
        },
        methods: {
            getTaskSelected (list) {
                let resLeft = new TaskModel().getTabs()
                let resRight = []
                console.log(list)
                list.forEach(item => {
                    // 适配器，适配task组件中的数据
                    let type = item.type === 4 ? 'public' : item.type === 1 ? 'private' : item.type === 2 ? 'exam' : 'practice'
                    item.type = type
                    resRight.push(item)
                    resLeft.forEach(tab => {
                        if (tab.childType && tab.childType.includes(item.type)) {
                            tab.selected.push(item)
                        } else if (tab.type === item.type) {
                            tab.selected.push(item)
                        }
                        // if (tab.type === item.type) {
                        //     tab.selected.push(item)
                        // }
                    })
                })
                return {
                    resLeft,
                    resRight
                }
            },
            cropperFn (data, ext) {
                goodsService.getUploadUrl({
                    image: data,
                    alias: `${Date.now()}${ext}`
                }).then((ret) => {
                    xmview.showTip('success', '上传成功')
                    this.fetchParam.cover = ret.url // 显示图片
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            filesHandleChange (res) {
                console.log(res)
            },
            validate (formName) {
                let pass = true
                this.$refs[formName].validate(valid => {
                    if (!valid) pass = false
                })
                return pass
            },
            // 处理视频选取
            handleVideoSelected(row) {
                this.fetchParam.show_video_name = row.name
                this.fetchParam.show_video_id = row.id
            },
            ueReady (ue) {
                this.editor = ue
            },
            chooseMaterial () {
                this.showMaterialDialog = true
            },
            handleChangeinp(value) {
                // this.fetchParam.price = 222
                // console.log(value);
            },
            getTaskData() {
                this.showMaterialDialog = false
            },
            submit () {
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) return
                    if (!this.editor.getContentTxt()) {
                        xmview.showTip('error', '请填写正文内容')
                        return
                    }
                    this.fetchParam.objects = this.fetchParam.transferRight.map(item => {
                        return {
                            type: item.type === 'public' ? 4 : item.type === 'private' ? 1 : item.type === 'exam' ? 2 : 3,
                            id: item.id,
                            name: item.name
                        }
                    })
                    this.fetchParam.introduce = this.editor.getContent()
                    let req = goodsService.createGood
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = goodsService.updateGood
                        msg = '修改成功'
                    }
                    req(this.fetchParam).then((ret) => {
                        xmview.showTip('success', msg)
                        this.fetchParam = clearFn()
                        this.$router.push({name: 'yshi-goods'})
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
        },
        components: {
            ImagEcropperInput,
            CourseCategorySelect,
            UploadFile,
            DialogVideo,
            VueEditor,
            Task
        },
    }
</script>
