<!--发布 添加 产品-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #usersys-integral-publishprod {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <article id="usersys-integral-publishprod">
        <el-form ref="form" label-position="right" label-width="120px" :rules="rules" :model="fetchParam"
                 style="max-width: 800px">
            <el-form-item label="商品类型" prop="category">
                <ProdCategorySelect :disabled="fetchParam.id != null" ref="prodCategory"
                                    v-model="fetchParam.category"></ProdCategorySelect>
            </el-form-item>
            <el-form-item label="面值" v-if="isShowMianzhi" prop="quota">
                <el-input v-model.number="fetchParam.quota" placeholder="设置卡券的面值"></el-input>
            </el-form-item>
            <el-form-item label="天数" v-if="isShowDay" prop="day">
                <el-input v-model.number="fetchParam.day" placeholder="设置卡券的面值"></el-input>
            </el-form-item>
            <el-form-item label="倍数" v-if="isShowTimes" prop="quota">
                <el-input v-model.number="fetchParam.quota" placeholder="设置卡券的面值"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input :disabled="fetchParam.id != null" v-model="fetchParam.name"
                          placeholder="积分乐园的商品名称,建议8个字以内"></el-input>
            </el-form-item>
            <el-form-item label="商品内容" prop="description">
                <el-input v-model="fetchParam.description" :autosize="{ minRows: 4, maxRows: 4}" type="textarea"
                          placeholder="此商品的介绍文案"></el-input>
            </el-form-item>
            <el-form-item label="商品封面图" prop="image">
                <img :src="fetchParam.image | fillImgPath" style="max-width: 300px" v-show="fetchParam.image">
                <ImgCropper :compress="1" imgType="png" :isShowBtn="true" ref="imgcropper" :confirmFn="cropperImgSucc"
                            :aspectRatio="16/9"></ImgCropper>
                <i style="color: #999; font-size: 13px">*图片用于手机客户端查看积分乐园商品列表的图片及详情顶部的图片</i>
            </el-form-item>
            <el-form-item label="排序">
                <el-input size="small" placeholder="输入数字设置该商品在积分乐园的顺序，默认为0，会展示在积分乐园最下方"
                          v-model="fetchParam.sort"></el-input>
            </el-form-item>
            <el-form-item label="兑换积分" prop="price">
                <el-input size="small" placeholder="设置兑换单个商品所需要的积分" v-model.number="fetchParam.price"></el-input>
            </el-form-item>
            <el-form-item label="商品有效期(天)" prop="expire">
                <el-input v-model.number="fetchParam.expire"></el-input>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary" @click="publish(0)">发布并上架</el-button>
                <el-button @click="publish(1)">发布不上架</el-button>
            </el-form-item>
        </el-form>
    </article>
</template>

<script>
    import ImgCropper from '../../component/upload/ImagEcropperInput.vue'
    import parkService from '../../../services/usersystem/parkService'
    import ProdCategorySelect from '../../component/select/ProdCategory.vue'
    export default{
        name: 'usersystem-park-publishprod',
        data () {
            return {
                fetchParam: initParam(),
                rules: {
                    category: {required: true, message: '请选择商品类型', trigger: 'change'},
                    name: {required: true, message: '请填写商品名称', trigger: 'blur'},
                    description: {required: true, message: '请填写商品的介绍内容', trigger: 'blur'},
                    image: {required: true, message: '请上传封面图片', trigger: 'change'},
                    price: {required: true, type: 'number', message: '请输入兑换积分', trigger: 'blur'},
                    expire: {required: true, type: 'number', message: '请设置该商品兑换所需积分', trigger: 'blur'},
                },
                isShowMianzhi: false, // 是否显示面值
                isShowDay: false, // 是否显示 天数
                isShowTimes: false, // 是否显示 倍数
            }
        },
        watch: {
            'fetchParam.category' (val) {
                this.isShowMianzhi = false
                this.isShowDay = false
                this.isShowTimes = false

                delete this.rules.quota
                delete this.rules.day

                // 显示面值
                if (val === 'growth_charge_card') {
                    this.isShowMianzhi = true
                    this.rules['quota'] = {required: true, type: 'number', message: '请输入面值', trigger: 'blur'}
                }
                // 显示倍数
                if (val === 'price_plus_card' || val === 'growth_plus_card') {
                    this.isShowTimes = true
                    this.rules['quota'] = {required: true, type: 'number', message: '请输入面值', trigger: 'blur'}
                }
                // 显示天数
                if (val === 'growth_plus_card') {
                    this.isShowDay = true
                    this.rules['day'] = {required: true, type: 'number', message: '请输入天数', trigger: 'blur'}
                }
            }
        },
        mounted () {
            this.fetchParam = this.$route.params.prod || initParam()
//            this.fetchParam.id = this.$route.query.id
            console.info(this.fetchParam)
            if (this.fetchParam.id) xmview.setContentTile('编辑商品-用户体系管理')
            this.$refs.prodCategory.fetchData().then(() => {
                console.info(111)
                xmview.setContentLoading(false)
            })
        },
        methods: {
            // 裁切完毕后的回调
            cropperImgSucc(data) {
                parkService.prodUploadImg({image: data}).then((ret) => {
                    console.info(ret)
                    this.fetchParam.image = ret
                })
            },
            publish (status) {
                this.$refs.form.validate((valid) => {
                    if (!valid) return
                    xmview.setContentLoading(true)
                    this.fetchParam.status = status
                    let p
                    if (this.fetchParam.id)
                        p = parkService.prodUpdate(this.fetchParam)
                    else
                        p = parkService.prodPublish(this.fetchParam)

                    p.then(() => {
                        this.$router.back()
                    }, () => {
                        xmview.setContentLoading(false)
                    })
                })
            }
        },
        components: {ImgCropper, ProdCategorySelect}
    }

    function initParam () {
        return {
            name: void 0,
            category: void 0,
            description: void 0,
            image: void 0,
            price: void 0,
            expire: void 0,
            sort: void 0,
            status: void 0,
            quota: void 0,
            day: void 0,
            id: void 0,
        }
    }
</script>
