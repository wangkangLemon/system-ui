<style lang="scss" rel="stylesheet/scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #favorable-content-add {
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
        .course-search {
            @extend %top-search-container;
        }
    }
</style>
<template>
    <article id="favorable-content-add">
        <el-form 
            :model="fetchParam" 
            :rules="rules" 
            class="form" 
            label-width="180px" 
            ref="ruleForm">
            <el-form-item label="优惠名称" prop="name">
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
                    v-else 
                    class="col-btn-block" 
                    @click="isShowVideoDialog=true" 
                    :disabled="disable">
                    <i v-if="fetchParam.show_video_name">{{ fetchParam.show_video_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
            </el-form-item>
            <el-form-item label="优惠介绍" prop="introduce">
                <vue-editor 
                    v-model="fetchParam.introduce" 
                    @ready="ueReady" 
                    v-if="!disable">
                </vue-editor>
                <div v-if="disable" ref="cont">{{fetchParam.introduce}}</div>
            </el-form-item>
            <el-form-item label="序号" prop="sort">
                <el-input-number 
                    :disabled="disable"
                    v-model.number="fetchParam.sort"
                    v-pnumberOnly
                    :min="0"
                    :controls="false">
                </el-input-number>
            </el-form-item>
            <el-form-item label="优惠展示属性" required>
                <el-radio-group v-model="fetchParam.show_in" @change="changeShowIn">
                    <el-radio :label="1" :disabled="disable">前端展示</el-radio>
                    <el-radio :label="2" :disabled="disable">后端展示</el-radio>
                </el-radio-group>
<!--                 <el-checkbox 
                    v-model="fetchParam.show_in_app"
                    :true-label="1"
                    :false-label="0"
                    :disabled="disable">
                    前端展示
                </el-checkbox>
                <el-checkbox 
                    v-model="fetchParam.show_in_com"
                    :true-label="1"
                    :false-label="0"
                    :disabled="disable">
                    后端展示
                </el-checkbox> -->
            </el-form-item>
            <el-form-item label="添加单品" prop="goods">
                <el-button 
                    size="small" 
                    @click="chooseGoods" 
                    :disabled="disable">
                    选择商品
                </el-button>
                <template v-if="fetchParam.goods.length">
                    <el-table 
                        class="data-table" 
                        :data="fetchParam.goods" 
                        border 
                        show-summary 
                        :summary-method="getSummaries"
                        style="width:100%;" ref="table">
                        <el-table-column 
                            label="单品名称" 
                            prop="name">
                        </el-table-column>
                        <el-table-column 
                            label="所属类型" 
                            prop="category">
                        </el-table-column>
                        <template v-if="fetchParam.show_in === 2">
                            <el-table-column 
                                label="连锁定价">
                                <span slot-scope="{row}">{{row.price_com}}</span>
                            </el-table-column>
                            <el-table-column 
                                label="连锁实价">
                                <span slot-scope="{row}">{{row.favorable_price_com}}</span>
                            </el-table-column>
                        </template>
                        <template v-else>
                            <el-table-column 
                                label="app定价">
                                <span slot-scope="{row}">{{row.price}}</span>
                            </el-table-column>
                            <el-table-column 
                                label="app实价">
                                <span slot-scope="{row}">{{row.favorable_price}}</span>
                            </el-table-column>
                        </template>
                    </el-table>
                </template>
            </el-form-item>
            <el-form-item label="优惠类型" prop="favorable_type">
                <el-select 
                    v-model="fetchParam.favorable_type" 
                    filterable 
                    clearable 
                    :disabled="disable"
                    placeholder="请选择"
                    @change="changFavorableType">
                    <el-option label="满折优惠" :value="2"></el-option>
                    <el-option label="打包优惠" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设置满折优惠" prop="favorable" v-if="fetchParam.favorable_type===2">
<!--                 <PlusOrRemove 
                    ref="favorablePlus"
                    @res="groupDiscounts" 
                    :money="moneyarr" 
                    :discount="discountarr" 
                    :favorable="fetchParam.favorable" 
                    :disable="disable">
                </PlusOrRemove> -->
                <PlusOrRemove 
                    ref="favorablePlus"
                    @res="groupDiscounts" 
                    :select="fetchParam.favorable" 
                    :disable="disable">
                </PlusOrRemove>
            </el-form-item>
            <el-form-item label="打包优惠价" prop="favorable_price" v-if="fetchParam.favorable_type===1">
                <el-input 
                    v-numberOnly 
                    v-model.number="fetchParam.favorable_price" 
                    style="width: 300px" 
                    placeholder="请输入价格" 
                    type="tel" 
                    :disabled="disable">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="截止日期" prop="end_time">
                <el-date-picker
                    :disabled="disable"
                    v-model="fetchParam.end_time"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                    type="datetime">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="团购优惠">
                <el-checkbox v-model="isGroupBuying" :disabled="disable">设置团购优惠</el-checkbox>
                <div v-show="isGroupBuying">
<!--                     <PlusOrRemove 
                        @res="groupDiscounts2" 
                        textRight="人"
                        :money="moneyarr2" 
                        :discount="discountarr2" 
                        :favorable="fetchParam.group_buying" 
                        :disable="disable">
                    </PlusOrRemove> -->
                    <PlusOrRemove 
                        textRight="人"
                        :select="group_buying" 
                        @res="val => fetchParam.group_buying = val"
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
            <!-- show_in改变，dialogSelectData里面选中的数据清空，并重新请求 -->
            <dialogSelectData 
                ref="dialogSelect" 
                v-model="dialogGoods.isShow" 
                :getData="fetchGood" 
                title="选择商品"
                :selectedList="fetchParam.goods" 
                @changeSelected="val=>fetchParam.goods=val">
                <div slot="search" class="course-search">
                    <section>
                        <i>关键字</i>
                        <el-input 
                            @keyup.enter.native="$refs.dialogSelect.fetchData(true)" 
                            v-model="dialogGoods.name"
                            icon="search"
                            placeholder="请输入关键字搜索">
                        </el-input>
                    </section>
                    <section>
                        <i>分类</i>
                        <GoodsCategorySelect
                            v-model="dialogGoods.category_id"
                            :clearable="true"
                            :show-in="fetchParam.show_in"
                            @change="$refs.dialogSelect.fetchData(true)">
                        </GoodsCategorySelect>
                    </section>
                </div>
            </dialogSelectData>
            <!-- <Task
                ref="material"
                :visible.sync="dialogGoods.isShow"
                :selected="fetchParam.transferRight"
                :keys="['goods', ]"
                :initTabs="transferLeft"
                @submit="getTaskData">
            </Task> -->
            <DialogVideo 
                :onSelect="handleVideoSelected" 
                v-model="isShowVideoDialog">
            </DialogVideo>
        </el-form>
    </article>
</template>
<script>
    import VueEditor from 'components/form/UEditor.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import dialogSelectData from 'components/dialog/SelectData5table.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import Task from 'components/dialog/task/Main.vue'
    import PlusOrRemove from '../component/PlusOrRemove.vue'
    import GoodsCategorySelect from 'components/select/GoodsCategory.vue'
    import goodsService from 'services/yshi/goodsService'
    import favorableService from 'services/yshi/favorableService'
    import formCheck from 'utils/formCheckUtils'
    function clearFn () {
        return {
            id: void 0,
            status: void 0,
            name: void '',
            cover: void '',
            favorable_price: void 0,
            show_type: 1, // 0 图片 1视频
            show_video_name: void '',
            show_video_id: void 0,
            introduce: void '',
            favorable: [{}],
            group_buying: [],
            sort: void 0,
            goods: [],
            goods_ids: [],
            show_in: void 0,
        }
    }
    export default {
        components: {
            ImagEcropperInput,
            UploadFile,
            dialogSelectData,
            DialogVideo,
            VueEditor,
            PlusOrRemove,
            Task,
            GoodsCategorySelect
        },
        data () {
            return {
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
                    }
                },
                isGroupBuying: false,
                typeimg: 1,
                typevideo: 2,
                editor: null,
                isShowVideoDialog: false,
                fetchParam: clearFn(),
                group_buying: [],
                dialogGoods: {
                    loading: false,
                    isShow: false,
                    name: void 0,
                    category_id: void 0,
                },
                disable: false,
                moneyarr: [],
                discountarr: [],
                moneyarr2: [],
                discountarr2: [],
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
                    sort: [
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
                    if (this.$route.name === 'yshi-favorable-preview'){
                        this.disable = true
                    } else {
                        this.disable = false
                    }
                    favorableService.getGoodGroupInfo({
                        id: this.$route.params.group_id
                    }).then((ret) => {
                        console.log(ret)
                        this.fetchParam = ret
                        this.$nextTick(() => {
                            this.initTable()
                        })
                        if (this.fetchParam.group_buying && this.fetchParam.group_buying.length) {
                            this.isGroupBuying = true
                            // ret.group_buying.forEach(item => {
                            //     this.moneyarr2.push(item.reach)
                            //     this.discountarr2.push(item.discount)
                            // })
                            this.group_buying = ret.group_buying
                        } else {
                            this.fetchParam.group_buying = []
                            this.group_buying = []
                        }
                        ret.favorable.forEach(item => {
                            this.moneyarr.push(item.reach)
                            this.discountarr.push(item.discount)
                        })
                        this.editor && this.editor.setContent(ret.introduce)
                        this.$refs.cont.innerHTML = ret.introduce
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
                this.dialogGoods.show_in = this.fetchParam.show_in
                return goodsService.searchGoods(Object.assign({}, this.dialogGoods, params))
            },
            chooseGoods () {
                if (!this.fetchParam.show_in) {
                    return xmview.showTip('warning', '请选择优惠属性')
                }
                this.dialogGoods.isShow=true
            },
            changeShowIn () {
                // debugger
                this.fetchParam.goods = []
                this.$refs.dialogSelect.fetchData(true)
            },
            getSummaries (param) {
                const { columns, data } = param
                const sums = []
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计'
                        return
                    }
                    if (index === 1) {
                        return
                    }
                    if (index === 2) {
                        let left = data.reduce((prev, curr) => {
                            return parseFloat((prev + parseFloat(curr.price_com)).toFixed(2))
                        }, 0)
                        let right = data.reduce((prev, curr) => {
                            return parseFloat((prev + parseFloat(curr.price)).toFixed(2))
                        }, 0)
                        sums[index] = this.fetchParam.show_in === 2 ? left : right
                    }
                    if (index === 3) {
                        let left = data.reduce((prev, curr) => {
                            return parseFloat((prev + parseFloat(curr.favorable_price_com)).toFixed(2))
                        }, 0)
                        let right = data.reduce((prev, curr) => {
                            return parseFloat((prev + parseFloat(curr.favorable_price)).toFixed(2))
                        }, 0)
                        sums[index] = this.fetchParam.show_in === 2 ? left : right
                    }
                })
                return sums
            },
            // 处理视频选取
            handleVideoSelected(row) {
                this.fetchParam.show_video_name = row.name
                this.fetchParam.show_video_id = row.id
            },
            changFavorableType (val) {
                if (val === 1) {
                    // this.fetchParam.favorable.forEach(item => {
                    //     item.discount && (item.discount = '')
                    //     item.reach && (item.reach = '')
                    // })
                    this.fetchParam.favorable = [{}]
                    this.discountarr.length = 0
                    this.moneyarr.length = 0
                }
                this.fetchParam.favorable_price = void 0
            },
            // 满折优惠
            groupDiscounts(val) {
                console.log('满折优惠', val)
                this.fetchParam.favorable = val
            },
            // 团购优惠
            groupDiscounts2(val) {
                console.log(val)
                this.fetchParam.group_buying = val
            },
            ueReady (ue) {
                this.editor = ue
            },
            submit () {
                let pass = true
                let error = false
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) {
                        pass = false
                        return
                    }
                    // if (this.isGroupBuying || this.fetchParam.favorable_type === 2) {
                    //     if ( !this.$store.state.component.yshiGroupSussess) return
                    // }
                    if (!this.editor.getContentTxt()) {
                        xmview.showTip('error', '请填写正文内容')
                        return
                    }
                    this.fetchParam.introduce = this.editor.getContent()
                    this.fetchParam.goods_ids = this.fetchParam.goods.map(item => {
                        return item.id
                    })
                    // 截止日期
                    if (this.fetchParam.end_time && new Date(this.fetchParam.end_time).getTime() < Date.now()) {
                        return xmview.showTip('warning', '截止日期要大于当前日期')
                    }
                    // 去除favorable空值
                    // if (this.fetchParam.favorable_type === 2) {
                    //     this.fetchParam.favorable.forEach((item) => {
                    //         for (let [key, value] of Object.entries(item)) {
                    //             if (!('reach' in item && 'discount' in item)) {
                    //                 xmview.showTip('error', '请检查优惠阶级')
                    //                 pass = false
                    //                 return
                    //             }
                    //             if(value === 0 || value === true) {
                    //                 pass = false
                    //                 xmview.showTip('error', '请检查优惠阶级')
                    //                 return
                    //             }
                    //         }
                    //         delete item.error
                    //     })
                    //     for (let i = this.fetchParam.favorable.length-1; i>=0 ; i--){
                    //         if (!this.fetchParam.favorable[i].reach || !this.fetchParam.favorable[i].discount){
                    //             this.fetchParam.favorable.splice(i,1)
                    //         }
                    //     }
                    // } else {
                    //     this.fetchParam.favorable = [{}]
                    // }
                    // 团购优惠
                    // if (!this.isGroupBuying) {
                    //     this.fetchParam.group_buying = [{}]
                    // } else {
                    //     this.fetchParam.group_buying.forEach((item) => {
                    //         if (!('reach' in item && 'discount' in item)) {
                    //             xmview.showTip('error', '请检查优惠阶级')
                    //             pass = false
                    //             return
                    //         }
                    //         for (let [key, value] of Object.entries(item)) {
                    //             if(value === 0|| value === true) {
                    //                 pass = false
                    //                 xmview.showTip('error', '请检查优惠阶级')
                    //                 return
                    //             }
                    //         }
                    //         delete item.error
                    //     })
                    // }

                    if(this.isGroupBuying) {
                        let buyarr = []
                        this.fetchParam.group_buying.forEach((item) => {
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
                        this.fetchParam.group_buying = buyarr
                    }

                    let req = favorableService.createGoodGroup
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = favorableService.updateGoodGroup
                        msg = '修改成功'
                    }
                    if (pass) {
                        req(this.fetchParam).then((ret) => {
                            xmview.showTip('success', msg)
                            this.fetchParam = clearFn()
                            this.$router.push({name: 'yshi-favorable'})
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
        }
    }
</script>
