<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #activity-content-add {
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
        .col-tip-small{
            color: rgb(175, 145, 158);
            font-size: 12px;
            margin-left: 5px;
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
    <article id="activity-content-add">
        <el-form :model="fetchParam" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="活动名称" prop="name">
                <el-input placeholder="请输入内容" v-model="fetchParam.name" :disabled="disable">
                </el-input>
            </el-form-item>
            <el-form-item label="封面图片" prop="cover">
                <img :src="fetchParam.cover | fillImgPath" alt="" class="img" v-if="fetchParam.cover" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false" v-if="!disable"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="优惠介绍" prop="introduce">
               <vue-editor v-model="fetchParam.introduce" @ready="ueReady" v-if="!disable"></vue-editor>
               <div v-if="disable" ref="cont">{{fetchParam.introduce}}</div>
            </el-form-item>
            <el-form-item label="宣传展示" prop="show_type">
                <el-radio-group v-model="fetchParam.show_type">
                    <el-radio :label="typeimg" :disabled="disable">图片</el-radio>
                    <el-radio :label="typevideo" :disabled="disable">视频</el-radio>
                </el-radio-group>
                <p v-if="fetchParam.show_type==0" class="el-icon-picture col-tip"> 使用封面图片</p>
                <el-button class="col-btn-block" v-else @click="isShowVideoDialog=true" :disabled="disable">
                    <i v-if="fetchParam.show_video_name">{{ fetchParam.show_video_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
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
            <el-form-item label="优惠活动价" prop="favorable_price">
                <el-input v-numberOnly v-model.number="fetchParam.favorable_price" style="width: 300px" placeholder="请输入价格" type="tel" :disabled="disable">
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number placeholder="排列顺序" style="width: 300px" v-model.number="fetchParam.order" :min="1" :controls="false" :disabled="disable">
                </el-input-number>
                <p v-if="orderErr" class="o-error">此序号已经存在</p>
            </el-form-item>
            <el-form-item label="截止日期" prop="end_time">
                <el-date-picker v-model="fetchParam.end_time" type="datetime" placeholder="选择日期" :picker-options="pickerOptions"
                    format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="datechange" :disabled="disable"> 
                </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="截止日期2" prop="end_time">
                <el-date-picker
                    v-model="fetchParam.end_time"
                    type="datetime"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item> -->
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
    import CourseCategorySelect from 'components/select/CourseCategory.vue'
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import dialogSelectData from 'components/dialog/SelectData5table.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import DateRange from 'components/form/DatePicker.vue'
    import goodsService from 'services/yshi/goodsService'
    import activityService from 'services/yshi/activityService'
    import * as timeUtils from 'utils/timeUtils'
    import formCheck from 'utils/formCheckUtils'
    function clearFn () {
        return {
            id: void 0,
            name: void '',
            cover: void '',
            show_type: 0, // 0 图片 1视频
            show_video_id: void 0,
            show_video_name: void '',
            introduce: void '',
            favorable_price: void 0,
            end_time: void '',
            order: void 0,
            goods: [],
            goods_ids: []
        }
    }
    let _this
    export default {
        data () {
            return {
                editor: null,
                isShowVideoDialog: false,
                typeimg: 0,
                typevideo: 1,
                dialogGoods: {
                    loading: false,
                    isShow: false,
                    name: void 0,
                },
                msg: '',
                fetchParam: clearFn(),
                disable: false,
                orderErr : false,
                pickerOptions: {
                    // disabledDate(time) {
                    //     return !_this.fetchParam.end_time ? null
                    //         : (time.getTime() <= new Date().getTime() && timeUtils.compareDate(time, new Date()) !== 0)
                    // }
                    disabledDate(time) {
                        return time.getTime() <= new Date().getTime() && timeUtils.compareDate(time, new Date()) !== 0
                    }
                },
                rules: {
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    cover: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    show_type: [
                        {   required: true, trigger: 'change', validator: (rule, value, callback) => {
                            formCheck.checkHasShow(rule, value, callback, this.fetchParam.show_video_name, () => {
                                this.fetchParam.show_video_id = 0
                                this.fetchParam.show_video_name = ''
                            })
                        }}
                    ],
                    introduce: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    favorable_price: [
                        {type: 'number', message: '必须填写', required: true, trigger: 'blur'},
                        {validator: (rule, value, callback) => {
                            let pricez = 0
                            this.fetchParam.goods.forEach( item => {
                                pricez = pricez + parseFloat(item.favorable_price)
                            })
                            formCheck.checkMoney(rule, value, pricez, callback)
                        }}
                    ],
                    order: [
                        {type: 'number', required: true, message: '必须填写', trigger: 'blur'},
                        { type: 'number', min: 1, message: '请输入正整数', trigger: 'blur' },
                    ],
                    // end_time: [
                    //     {message: "不能为空",required: 1},
                    //     {pattern: null,type: "string",message: null}
                    // ],
                    goods: [
                        {required: true, message: '必须填写'}
                    ]
                },
            }
        },
        beforeCreate () {
            _this = this
        },
        created() {
            if (this.$route.params.activity_id != undefined) {
                if (this.$route.name === 'yshi-activity-preview'){
                    this.disable = true
                } else {
                    this.disable = false
                }
                activityService.getActivityInfo({
                    id: this.$route.params.activity_id
                }).then((ret) => {
                    console.log(ret)
                    this.fetchParam = ret
                    this.$nextTick(() => {
                        this.initTable()
                    })
                    this.fetchParam.favorable_price = parseFloat(ret.favorable_price)
                    this.editor && this.editor.setContent(ret.introduce)
                    this.$refs.cont.innerHTML = ret.introduce
                })
            } else {
                this.disable = false
            }
            xmview.setContentLoading(false)
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
            // 处理windows下 表格合计出多的gutter
            initTable () {
                this.$refs.table.layout.gutterWidth = 0
            },
            cropperFn (data, ext) {
                activityService.getUploadUrl({
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
            datechange(val) {
                this.fetchParam.end_time = val
            },
            // 处理视频选取
            handleVideoSelected(row) {
                this.fetchParam.show_video_name = row.name
                this.fetchParam.show_video_id = row.id
            },
            ueReady (ue) {
                this.editor = ue
            },
            fetchGood (params) {
                return goodsService.searchGoods(Object.assign({}, this.dialogGoods, params))
            },
            submit() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) return
                    if (!this.editor.getContentTxt()) {
                        xmview.showTip('error', '请填写正文内容')
                        return
                    }
                    if (this.fetchParam.end_time === ''){
                        xmview.showTip('error', '请选择时间')
                        return
                    }
                    let date = new Date(this.fetchParam.end_time)
                    let compare = timeUtils.compareDateTime(date, new Date())
                    if (compare !== 1){
                        xmview.showTip('error', '截止日期不能小于当前日期')
                        return
                    }
                    this.fetchParam.introduce = this.editor.getContent()
                    this.fetchParam.goods_ids = this.fetchParam.goods.map(item => {
                        return item.id
                    })
                    let req = activityService.createActivity
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = activityService.updateActivity
                        msg = '修改成功'
                    }
                    req(this.fetchParam).then((ret) => {
                        xmview.showTip('success', msg)
                        this.fetchParam = clearFn()
                        this.$router.push({name: 'yshi-activity'})
                    }).catch((ret) => {
                        if (ret.message === 'exist'){
                            this.orderErr = true
                        } else {
                            xmview.showTip('error', ret.message)
                        }
                    })
                })
                
            }
        },
        components: {
            ImagEcropperInput,
            CourseCategorySelect,
            UploadFile,
            DialogVideo,
            VueEditor,
            DateRange,
            dialogSelectData
        }
    }
</script>
