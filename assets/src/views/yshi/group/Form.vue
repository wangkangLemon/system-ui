<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #group-content-add {
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
            line-height: 30px;
        }
        .col-btn-block{
            display: block;
            margin-top: 10px;
        }
        .input-price {
            display: inline-block;
            width: 120px !important;
        }
        .o-error {
            color:red;
            font-size:10px;
            line-height:10px;
            height:10px;
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
    <article id="group-content-add">
        <el-form :model="fetchParam" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="组合名称" prop="name">
                <el-input placeholder="请输入内容" v-model="fetchParam.name" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="组合图片" prop="cover">
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
            <el-form-item label="组合介绍" prop="introduce">
                <vue-editor v-model="fetchParam.introduce" @ready="ueReady" v-if="!disable"></vue-editor>
                <div v-if="disable" ref="cont">{{fetchParam.introduce}}</div>
            </el-form-item>
            <el-form-item label="添加商品" prop="goods">
                <el-button size="small" @click="dialogGoods.isShow=true" :disabled="disable">选择商品</el-button>
                <template v-if="fetchParam.goods.length">
                    <el-table class="data-table" :data="fetchParam.goods" border show-summary style="width:100%;" ref="table">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="原价" prop="price"></el-table-column>
                        <el-table-column label="优惠价" prop="favorable_price"></el-table-column>
                    </el-table>
                </template>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number placeholder="排列顺序" style="width: 300px" v-model.number="fetchParam.order" :min="1" :controls="false" :disabled="disable">
                </el-input-number>
                <p v-if="orderErr" class="o-error">此序号已经存在</p>
            </el-form-item>
            <el-form-item label="设置组合售卖优惠" prop="favorable">
                <PlusOrRemove 
                    @res="val => fetchParam.favorable = val" 
                    :select="favorable" 
                    :disable="disable"></PlusOrRemove>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary" v-if="!disable">保存</el-button>
            </el-form-item>
            <dialogSelectData ref="dialogSelect" v-model="dialogGoods.isShow" :getData="fetchGood" title="选择商品"
                          :selectedList="fetchParam.goods" @changeSelected="val=>fetchParam.goods=val">
                <div slot="search" class="course-search">
                    <el-input @keyup.enter.native="$refs.dialogSelect.fetchData(true)" v-model="dialogGoods.name"
                            icon="search"
                            placeholder="请输入关键字搜索"></el-input>
                </div>
            </dialogSelectData>
            <DialogVideo :onSelect="handleVideoSelected" v-model="isShowVideoDialog"></DialogVideo>
        </el-form>
    </article>
</template>
<script>
    import VueEditor from 'components/form/UEditor.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import dialogSelectData from 'components/dialog/SelectData5table.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import goodsService from 'services/yshi/goodsService'
    import goodsGroupService from 'services/yshi/goodsGroupService'
    import PlusOrRemove from '../component/PlusOrRemove.vue'
    import formCheck from 'utils/formCheckUtils'
    function clearFn () {
        return {
            id: void 0,
            status: void 0,
            name: void '',
            cover: void '',
            show_type: 1, // 0 图片 1视频
            show_video_name: void '',
            show_video_id: void 0,
            introduce: void '',
            favorable: [],
            order: void 0,
            goods: [],
            goods_ids: []
        }
    }
    export default {
        data () {
            return {
                typeimg: 1,
                typevideo: 2,
                editor: null,
                isShowVideoDialog: false,
                dialogGoods: {
                    loading: false,
                    isShow: false,
                    name: void 0,
                },
                fetchParam: clearFn(),
                favorable: [],
                disable: false,
                moneyarr: [],
                discountarr: [],
                orderErr : false,
                rules: {
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    cover: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    show_type: [
                        {required: true, trigger: 'change', validator: (rule, value, callback) => {
                            formCheck.checkHasShow(rule, value, callback, this.fetchParam.show_video_name, () => {
                                this.fetchParam.show_video_id = 0
                                this.fetchParam.show_video_name = ''
                            })
                        }}
                    ],
                    introduce: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    order: [
                        {type: 'number', required: true, message: '必须填写', trigger: 'blur'},
                        { type: 'number', min: 1, message: '请输入正整数', trigger: 'blur' },
                    ],
                    goods: [
                        {required: true, message: '必须填写'}
                    ],
                    favorable: [
                        {required: true, trigger: 'blur', validator: (rule, value, callback) => {
                            value.forEach((item) => {
                                if (item.reach && item.discount) {
                                    callback()
                                } else {
                                    callback(new Error('不能是空'))
                                }
                            })
                        }}
                    ]
                }
            }
        },
        created() {
            this.fetchData()
        },
        watch: {
            'fetchParam.goods'(val) {
                console.log(val.length)
                if(val.length >= 1){
                    this.$nextTick(() => {
                        this.initTable()
                    })
                }
            }
        },
        methods: {
            fetchData() {
                if (this.$route.params.group_id != undefined) {
                    if (this.$route.name === 'yshi-group-preview'){
                        this.disable = true
                    } else {
                        this.disable = false
                    }
                    goodsGroupService.getGoodGroupInfo({
                        id: this.$route.params.group_id
                    }).then((ret) => {
                        console.log(ret)
                        this.fetchParam = ret
                        this.$nextTick(() => {
                            this.initTable()
                        })
                        this.favorable = ret.favorable
                        // ret.favorable.forEach(item => {
                        //     this.moneyarr.push(item.reach)
                        //     this.discountarr.push(item.discount)
                        // })
                        this.editor && this.editor.setContent(ret.introduce)
                        if (this.$route.name === 'yshi-googroupds-preview') {
                            this.$refs.cont.innerHTML = ret.introduce
                        }
                    })
                } else {
                    this.disable = false
                }
                xmview.setContentLoading(false)
            },
            initTable () {
                this.$refs.table.layout.gutterWidth = 0
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
            fetchGood (params) {
                return goodsService.searchGoods(Object.assign({}, this.dialogGoods, params))
            },
            // 处理视频选取
            handleVideoSelected(row) {
                this.fetchParam.show_video_name = row.name
                this.fetchParam.show_video_id = row.id
            },
            // 组合优惠
            groupDiscounts(val) {
                console.log(val)
                this.fetchParam.favorable = val
            },
            ueReady (ue) {
                this.editor = ue
            },
            submit () {
                let pass = true
                let error = false
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) pass = false
                    if (!this.editor.getContentTxt()) {
                        xmview.showTip('error', '请填写正文内容')
                        pass = false
                    }
                    this.fetchParam.introduce = this.editor.getContent()
                    this.fetchParam.goods_ids = this.fetchParam.goods.map(item => {
                        return item.id
                    })
                    let buyarr = []
                    this.fetchParam.favorable.forEach((item) => {
                        let buy = {}
                        if(!(item.reach.value && item.discount.value)) {
                            xmview.showTip('error', '请检查优惠阶级')
                            pass = false
                            return
                        }
                        for (let [key, value] of Object.entries(item)) {
                            for (let [key, value2] of Object.entries(value)) {
                                if(value2 === 0 || value2 === true) {
                                    pass = false
                                    error = true
                                    xmview.showTip('error', '请检查优惠阶级')
                                    // 使用break提交失败一次item.error就被删掉了，而return没有被真正删掉
                                    // 循环中的return并不能将函数直接返回，和break是一样的
                                    return
                                }
                            }
                        }
                        if(error) {
                            return
                        }else {
                            buy.reach = item.reach.value
                            buy.discount = item.discount.value
                            buyarr.push(buy)
                        }
                    })
                    if(!buyarr.length){
                        return
                    }
                    this.fetchParam.favorable = buyarr
                    // 去除favorable空值
                    for (let i = this.fetchParam.favorable.length-1; i>=0 ; i--){
                        if (!this.fetchParam.favorable[i].reach || !this.fetchParam.favorable[i].discount){
                            this.fetchParam.favorable.splice(i,1)
                        }
                    }
                    let req = goodsGroupService.createGoodGroup
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = goodsGroupService.updateGoodGroup
                        msg = '修改成功'
                    }
                    if(pass) {
                        req(this.fetchParam).then((ret) => {
                            xmview.showTip('success', msg)
                            this.fetchParam = clearFn()
                            this.$router.push({name: 'yshi-group'})
                        }).catch((ret) => {
                            if (ret.data.data === 'exist'){
                                this.orderErr = true
                                // this.fetchData()
                            } else {
                                xmview.showTip('error', ret.message)
                            }
                        })
                    }
                })
                
            }
        },
        components: {
            ImagEcropperInput,
            UploadFile,
            dialogSelectData,
            DialogVideo,
            VueEditor,
            PlusOrRemove
        }
    }
</script>
