<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
     #speaking-content-add {
        @extend %content-container;
    .form {
        width: 50%;
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
    <article id="speaking-content-add">
        <el-form :model="fetchParam" :rules="rules" class="form" label-width="180px" ref="ruleForm">
            <el-form-item label="组合名称" prop="name">
                <el-input placeholder="请输入内容" v-model="fetchParam.name">
                </el-input>
            </el-form-item>
            <el-form-item label="组合图片" prop="cover">
                <img :src="fetchParam.cover | fillImgPath" alt="" class="img" v-if="fetchParam.cover" style="margin-bottom: 10px;" />
                <ImagEcropperInput :confirmFn="cropperFn" :isRound="false"></ImagEcropperInput>
            </el-form-item>
            <el-form-item label="宣传展示">
                <el-radio v-model="fetchParam.show_type" :label="typeimg">图片</el-radio>
                <el-radio v-model="fetchParam.show_type" :label="typevideo">视频</el-radio>
                <p v-if="fetchParam.show_type==0" class="el-icon-picture col-tip"> 使用封面图片</p>
                <el-button class="col-btn-block" v-else @click="isShowVideoDialog=true">
                    <i v-if="fetchParam.show_video_name">{{ fetchParam.show_video_name }}</i>
                    <i v-else>选择视频</i>
                </el-button>
            </el-form-item>
            <el-form-item label="组合介绍" prop="introduce">
                <vue-editor v-model="fetchParam.introduce" @ready="ueReady"></vue-editor>
            </el-form-item>
            <el-form-item label="添加商品">
                <el-button size="small" @click="dialogGoods.isShow=true">选择商品</el-button>
                <template v-if="fetchParam.goods.length > 0">
                    <el-table class="data-table" :data="fetchParam.goods" :fit="true" border show-summary style="margin-top: 5px;">
                        <el-table-column label="名称" prop="name"></el-table-column>
                        <el-table-column label="原价" prop="price"></el-table-column>
                        <el-table-column label="优惠价" prop="favorable_price"></el-table-column>
                    </el-table>
                </template>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <template>
                    <el-input class="input-price" placeholder="组合顺序" v-model.number="fetchParam.order" type="Number"></el-input>
                </template>
            </el-form-item>
            <el-form-item label="设置组合售卖优惠">
                <PlusOrRemove @res="groupDiscounts" :money="moneyarr" :discount="discountarr" :favorable="favorables"></PlusOrRemove>
            </el-form-item>
            <el-form-item>
                <el-button @click="submit" type="primary">保存</el-button>
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
    import ImagEcropperInput from 'components/upload/ImagEcropperInput.vue'
    import UploadFile from 'components/upload/UploadFiles.vue'
    import dialogSelectData from 'components/dialog/SelectData5table.vue'
    import DialogVideo from '@/views/newcourse/component/DialogVideo.vue'
    import goodsService from 'services/yshi/goodsService'
    import goodsGroupService from 'services/yshi/goodsGroupService'
    import PlusOrRemove from '../component/PlusOrRemove.vue'
    function clearFn () {
        return {
            id: '',
            name: '',
            cover: '',
            show_type: 0, // 0 图片 1视频
            show_video_name: '',
            show_video_id: 0,
            introduce: '',
            favorable: [],
            order: 0,
            goods: [],
            goods_ids: []
        }
    }
    export default {
        data () {
            return {
                typeimg: 0,
                typevideo: 1,
                editor: null,
                isShowVideoDialog: false,
                favorables: [''],
                dialogGoods: {
                    loading: false,
                    isShow: false,
                    keyword: void 0,
                },
                fetchParam: clearFn(),
                moneyarr: [],
                discountarr: [],
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
                    order: [
                        {type: 'number', required: true, message: '必须填写', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            if (this.$route.params.group_id != undefined) {
                goodsGroupService.getGoodGroupInfo({
                    id: this.$route.params.group_id
                }).then((ret) => {
                    console.log(ret)
                    this.fetchParam = ret
                    this.favorables = ret.favorable
                    ret.favorable.forEach(item => {
                        this.moneyarr.push(item.reach)
                        this.discountarr.push(item.discount)
                    })
                    this.fetchParam.goods = ret.goods
                    this.editor && this.editor.setContent(ret.data.introduce)
                })
            }
            xmview.setContentLoading(false)
        },
        methods: {
            cropperFn (data, ext) {
                // ArticleService.ArticleUploadUrl({
                //     avatar: data,
                //     alias: `${Date.now()}${ext}`
                // }).then((ret) => {
                //     xmview.showTip('success', '上传成功')
                //     this.fetchParam.cover = ret.data.url // 显示图片
                // }).catch((ret) => {
                //     xmview.showTip('error', ret.message)
                // })
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
                this.favorables = val
            },
            ueReady (ue) {
                this.editor = ue
            },
            submit () {
                this.$refs['ruleForm'].validate((valid) => {
                    if (!valid) return
                    if (!this.editor.getContentTxt()) {
                        xmview.showTip('error', '请填写正文内容')
                        return
                    }
                    this.fetchParam.introduce = this.editor.getContent()
                    this.fetchParam.goods_ids = JSON.stringify(this.fetchParam.goods.map(item => {
                        return item.id
                    }))
                    this.fetchParam.favorable = JSON.stringify(this.favorables)
                    let req = goodsGroupService.createGoodGroup
                    let msg = '添加成功'
                    if (this.fetchParam.id) {
                        req = goodsGroupService.updateGoodGroup
                        msg = '修改成功'
                    }
                    req(this.fetchParam).then((ret) => {
                        xmview.showTip('success', msg)
                        this.fetchParam = clearFn()
                        this.$router.push({name: 'yshi-group'})
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
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
