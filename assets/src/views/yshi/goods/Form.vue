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
        <el-form 
            :model="fetchParam" 
            :rules="rules" 
            class="form" 
            label-width="180px" 
            ref="ruleForm">
            <el-form-item label="单品名称" prop="name">
                <el-input 
                    placeholder="请输入内容" 
                    v-model="fetchParam.name" 
                    :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="封面" prop="cover">
                <img 
                    :src="fetchParam.cover | fillImgPath" 
                    alt="" 
                    class="img" 
                    v-if="fetchParam.cover" 
                    style="margin-bottom: 10px;" />
                <ImagEcropperInput 
                    :confirmFn="cropperFn" 
                    :isRound="false" 
                    v-if="!disable">
                </ImagEcropperInput>
            </el-form-item>
            <el-form-item label="宣传展示" prop="show_type">
                <el-radio-group v-model="fetchParam.show_type">
                    <el-radio :label="typeimg" :disabled="disable">图片</el-radio>
                    <el-radio :label="typevideo" :disabled="disable">视频</el-radio>
                </el-radio-group>
                <p v-if="fetchParam.show_type==1" class="el-icon-picture col-tip"> 使用封面图片</p>
                <el-button 
                    class="col-btn-block" 
                    v-else 
                    @click="isShowVideoDialog=true" 
                    :disabled="disable">
                    <i v-if="fetchParam.show_video_name">{{ fetchParam.show_video_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
            </el-form-item>
            <el-form-item label="商品介绍" prop="introduce">
                <vue-editor 
                    v-if="!disable"
                    v-model="fetchParam.introduce" 
                    @ready="ueReady">
                </vue-editor>
                <div v-if="disable" ref="cont">{{fetchParam.introduce}}</div>
            </el-form-item>
            <el-form-item label="所属分类" prop="category_id">
                <GoodsCategorySelect
                    :disabled="disable"
                    :placeholder="currCategoryName" 
                    v-model="fetchParam.category_id">
                </GoodsCategorySelect>
            </el-form-item>
            <el-form-item label="序号" prop="sort">
                <el-input-number 
                    :disabled="disable"
                    v-model.number="fetchParam.sort"
                    v-pnumberOnly
                    :controls="false">
                </el-input-number>
            </el-form-item>
            <el-form-item label="素材类型" prop="object_type">
                <el-radio-group 
                    v-model="fetchParam.object_type" 
                    :disabled="disable || disableObject" 
                    @change="typeChangHandler">
                    <el-radio label="template">模版</el-radio>
                    <el-radio label="custom">自定义</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item 
                v-if="fetchParam.object_type"
                :label="fetchParam.object_type==='custom' ? '添加素材' : '添加模版'" 
                prop="transferRight">
                <el-button 
                    size="small" 
                    type="primary"
                    @click="chooseMaterial"
                    :disabled="disable || disableObject">
                    添加
                </el-button>
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
            <el-form-item label="app定价" prop="price">
                <el-input 
                    type="tel" 
                    v-numberOnly 
                    v-model.number="fetchParam.price" 
                    style="width: 300px" 
                    placeholder="请输入价格" 
                    :disabled="disable">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="app优惠价格" prop="favorable_price">
                <el-input 
                    type="tel" 
                    v-numberOnly 
                    v-model.number="fetchParam.favorable_price" 
                    style="width:300px;" 
                    placeholder="请输入价格" 
                    :disabled="disable">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="连锁定价" prop="price_com">
                <el-input 
                    type="tel" 
                    v-numberOnly 
                    v-model.number="fetchParam.price_com" 
                    style="width: 300px" 
                    placeholder="请输入价格" 
                    :disabled="disable">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="连锁优惠价格" prop="favorable_price_com">
                <el-input 
                    type="tel" 
                    v-numberOnly 
                    v-model.number="fetchParam.favorable_price_com" 
                    style="width:300px;" 
                    placeholder="请输入价格" 
                    :disabled="disable">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="团购优惠">
                <el-checkbox v-model="isGroupBuying" :disabled="disable">设置团购优惠</el-checkbox>
                <div v-show="isGroupBuying">
                    <PlusOrRemove 
                        @res="groupDiscounts" 
                        textRight="人"
                        :select="fetchParam.group_buying" 
                        :disable="disable">
                    </PlusOrRemove>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button 
                    @click="submit" 
                    type="primary" 
                    v-if="!disable">
                    保存
                </el-button>
            </el-form-item>
            <DialogVideo 
                :onSelect="handleVideoSelected" 
                v-model="isShowVideoDialog">
            </DialogVideo>
            <Task
                ref="material"
                :visible.sync="showMaterialDialog"
                :selected="fetchParam.transferRight"
                :initTabs="transferLeft"
                @submit="getTaskData">
            </Task>
            <Teaching
                title="选取模版"
                :selected="fetchParam.transferRight"
                @pick="getTemplateData"
                :visible.sync="showTemplateDialog">
            </Teaching>
        </el-form>
    </article>
</template>
<script>
    import VueEditor from 'components/form/UEditor.vue'
    import GoodsCategorySelect from 'components/select/GoodsCategory.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import Task from 'components/dialog/task/Main.vue'
    import Teaching from '../component/Teaching.vue'
    import PlusOrRemove from '../component/PlusOrRemove.vue'
    import goodsService from 'services/yshi/goodsService'
    import TaskModel from 'components/dialog/task/model' // 不应该把这个引入在这里初始化initTabs的值
    import formCheck from 'utils/formCheckUtils'

    function clearFn () {
        return {
            id: void 0,
            name: void '',
            cover: void '',
            sort: void 0,
            show_type: 1, // 0 图片 1视频
            show_picture: void '',
            show_video_id: void 0,
            show_video_name: void '',
            introduce: void '',
            price: void 0,   // app价格
            favorable_price: void 0, // app优惠价格
            price_com: void 0,  // 连锁价格
            favorable_price_com: void 0, // 连锁优惠价格
            object_type: 'template',
            objects: [], // type = 0 公开课程 1内训课 2试卷 3练习 id = num,
            group_buying: [{}],
            transferRight: []
        }
    }
    export default {
        components: {
            ImagEcropperInput,
            GoodsCategorySelect,
            UploadFile,
            DialogVideo,
            VueEditor,
            Task,
            Teaching,
            PlusOrRemove,
        },
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
                formCheck.checkMoney(rule, value, this.fetchParam.price_com, '优惠价格不能高于商品定价', callback)
            }
            let checkMoney2 = (rule, value, callback) => {
                formCheck.checkMoney(rule, value, this.fetchParam.price, '优惠价格不能高于商品定价', callback)
            }
            return {
                currCategoryName: '',
                isGroupBuying: false,
                moneyarr: [],
                discountarr: [],
                editor: null,
                typeimg: 1,
                typevideo: 2,
                isShowVideoDialog: false,
                taskType: void 0,
                showMaterialDialog: false,
                showTemplateDialog: false,
                transferLeft: [],
                fetchParam: clearFn(),
                disable: false,
                disableObject: false,
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
                    category_id: { required: true, message: '请选择分类'},
                    sort: { required: true, message: '请输入序号', trigger: 'blur' },
                    object_type: { required: true, message: '请选择素材类型', trigger: 'blur' },
                    transferRight: [
                        {required: true, message: '请选择至少一个素材'}
                    ],
                    price: [
                        {type: 'number', required: true, trigger: 'blur', message: '请输入app定价'},
                        {validator: checkPrice}
                    ],
                    favorable_price: [
                        {type: 'number', required: true,trigger: 'blur', message: '请输入app优惠价格'},
                        {validator: checkMoney2}
                    ],
                    price_com: [
                        {type: 'number', required: true, trigger: 'blur', message: '请输入连锁定价'},
                        {validator: checkPrice}
                    ],
                    favorable_price_com: [
                        {type: 'number', required: true,trigger: 'blur', message: '请输入连锁优惠价格'},
                        {validator: checkMoney}
                    ]
                },
            }
        },
        created () {
            console.log(this.$route.name)
            if (this.$route.params.good_id != undefined) {
                goodsService.getGoodInfo({
                    id: this.$route.params.good_id
                }).then((ret) => {
                    console.log(ret)
                    this.fetchParam = ret
                    this.fetchParam.price_com = parseFloat(ret.price_com)
                    this.fetchParam.favorable_price_com = parseFloat(ret.favorable_price_com)
                    this.fetchParam.price = parseFloat(ret.price)
                    this.fetchParam.favorable_price = parseFloat(ret.favorable_price)
                    let obj = this.getTaskSelected(ret.objects)
                    this.fetchParam.transferRight = obj.resRight
                    if (this.fetchParam.transferRight.length > 0) {
                        this.transferLeft = obj.resLeft
                    } else {
                        this.transferLeft = new TaskModel().initTabs()
                    }
                    if (this.fetchParam.group_buying && this.fetchParam.group_buying.length) {
                        this.isGroupBuying = true
                        ret.group_buying.forEach(item => {
                            this.moneyarr.push(item.reach)
                            this.discountarr.push(item.discount)
                        })
                    } else {
                        this.fetchParam.group_buying = [{}]
                    }
                    this.currCategoryName = ret.category
                    this.editor && this.editor.setContent(ret.introduce)
                    if (this.$route.name === 'yshi-goods-preview') {
                        this.$refs.cont.innerHTML = ret.introduce
                    }
                    this.disableObject = !!ret.online_count
                })
                this.disable = this.$route.name === 'yshi-goods-preview' ? true : false
            } else {
                this.transferLeft = new TaskModel().initTabs()
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
                    let type = this.typeNumToStr(item.type)
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
                if (this.fetchParam.object_type === 'custom') {
                    this.showMaterialDialog = true
                } else {
                    this.showTemplateDialog = true
                }
            },
            handleChangeinp(value) {
                // this.fetchParam.price = 222
                // console.log(value);
            },
            getTaskData() {
                this.showMaterialDialog = false
            },
            getTemplateData (val) {
                this.fetchParam.transferRight = [val].map(item => {
                    return {
                        type: 'teaching',
                        name: item.title,
                        id: item.id
                    }
                })
            },
            typeChangHandler () {
                this.fetchParam.transferRight = []
            },
            groupDiscounts(val) {
                console.log(val)
                this.fetchParam.group_buying = val
            },
            submit () {
                let pass = true
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) pass = false
                    // console.log(this.$store.state.component.yshiGroupSussess)
                    console.log(this.fetchParam.group_buying)
                    if(this.isGroupBuying) {
                        this.fetchParam.group_buying.forEach((item) => {
                            if (!('reach' in item && 'discount' in item)) {
                                xmview.showTip('error', '请检查优惠阶级')
                                pass = false
                                return
                            }
                            for (let [key, value] of Object.entries(item)) {
                                if(value === 0 || value === true) {
                                    pass = false
                                    xmview.showTip('error', '请检查优惠阶级')
                                    // 使用break提交失败一次item.error就被删掉了，而return没有被真正删掉
                                    // 循环中的return并不能将函数直接返回，和break也有一些区别，注意使用
                                    return
                                }
                            }
                            delete item.error
                        })

                    }

                    if (!this.editor.getContentTxt()) {
                        xmview.showTip('error', '请填写正文内容')
                        pass = false
                    }
                    // 介绍
                    this.fetchParam.introduce = this.editor.getContent()
                    // 模版和自定义素材
                    this.fetchParam.objects = this.fetchParam.transferRight.map(item => {
                        return {
                            type: this.typeStrToNum(item.type),
                            id: item.id,
                            name: item.name
                        }
                    })
                    // 团购优惠
                    if (!this.isGroupBuying) {
                        this.fetchParam.group_buying = [{}]
                    }
                    let req = goodsService.createGood
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = goodsService.updateGood
                        msg = '修改成功'
                    }
                    if(pass) {
                        req(this.fetchParam).then((ret) => {
                            xmview.showTip('success', msg)
                            this.fetchParam = clearFn()
                            this.$router.push({name: 'yshi-goods'})
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    }
                })
            },
            typeStrToNum (val) {
                let map = {
                    'private': 1,
                    'exam': 2,
                    'practice': 3,
                    'public': 4,
                    'teaching': 5,
                    'live': 6
                }
                return map[val]
            },
            typeNumToStr (val) {
                let map = {
                    1: 'private',
                    2: 'exam',
                    3: 'practice',
                    4: 'public',
                    5: 'teaching',
                    6: 'live'
                }
                return map[val]
            }
        },
    }
</script>
