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
            <el-form-item label="宣传展示">
                <el-radio v-model="fetchParam.show_type" :label="typeimg" :disabled="disable">图片</el-radio>
                <el-radio v-model="fetchParam.show_type" :label="typevideo" :disabled="disable">视频</el-radio>
                <p v-if="fetchParam.show_type==0" class="el-icon-picture col-tip"> 使用封面图片</p>
                <el-button class="col-btn-block" v-else @click="isShowVideoDialog=true" :disabled="disable">
                    <i v-if="fetchParam.show_video_name">{{ fetchParam.show_video_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
            </el-form-item>
            <el-form-item label="添加商品" prop="goods">
                <el-button size="small" @click="dialogGoods.isShow=true" :disabled="disable">选择商品</el-button>
                <template v-if="fetchParam.goods.length">
                    <el-table class="data-table" :data="fetchParam.goods" :fit="true" border show-summary style="margin-top: 5px;">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="原价" prop="price"></el-table-column>
                        <el-table-column label="优惠价" prop="favorable_price"></el-table-column>
                    </el-table>
                </template>
            </el-form-item>
            <el-form-item label="优惠活动价" prop="favorable_price">
                <el-input-number v-model.number="fetchParam.favorable_price" style="width: 300px" placeholder="请输入价格" :controls="false" :disabled="disable">
                    <template slot="append">元</template>
                </el-input-number>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input class="input-price" placeholder="排列顺序" v-model.number="fetchParam.order" type="Number" :disabled="disable"></el-input>
            </el-form-item>
            <el-form-item label="截止日期" prop="end_time">
                <el-date-picker v-model="fetchParam.end_time" type="datetime" placeholder="选择日期" 
                    format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" @change="datechange" :disabled="disable"> 
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary" :disabled="disable">保存</el-button>
            </el-form-item>
            <dialogSelectData ref="dialogSelect" v-model="dialogGoods.isShow" :getData="fetchGood" title="选择商品"
                          :selectedList="fetchParam.goods" @changeSelected="val=>fetchParam.goods=val">
                <div slot="search" class="course-search">
                    <el-input @keyup.enter.native="$refs.dialogSelect.fetchData(true)" v-model="dialogGoods.keyword"
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
    export default {
        data () {
            let checkPrice = (rule, value, callback) => {
                var re = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/
                if (!re.test(value)) {
                    return callback(new Error('大于零的最多两位小数'))
                }
                callback()
            }
            let checkHas = (rule, value, callback) => {
                if (!value.length) {
                    callback(new Error('不能是空'))
                } else {
                    callback()
                }
            }
            return {
                editor: null,
                isShowVideoDialog: false,
                typeimg: 0,
                typevideo: 1,
                dialogGoods: {
                    loading: false,
                    isShow: false,
                    keyword: void 0,
                },
                msg: '',
                fetchParam: clearFn(),
                disable: false,
                rules: {
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    cover: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    introduce: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    favorable_price: [
                        {type: 'number', validator:checkPrice, required: true, trigger: 'blur'}
                    ],
                    order: [
                        {type: 'number', required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    end_time: [
                        {message: "不能为空",required: 1},
                        {pattern: null,type: "string",message: null}
                    ],
                    goods: [
                        {required: true, validator: checkHas, trigger: 'blur'}
                    ]
                },
            }
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
                    this.fetchParam.favorable_price = parseFloat(ret.favorable_price)
                    this.editor && this.editor.parseFloat(ret.introduce)
                    this.$refs.cont.innerHTML = ret.introduce
                })
            } else {
                this.disable = false
            }
            xmview.setContentLoading(false)
        },
        methods: {
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
                    let compare = timeUtils.compareDate(date, new Date())
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
                        xmview.showTip('error', ret.message)
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
