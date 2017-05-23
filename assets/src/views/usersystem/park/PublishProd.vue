<!--发布产品-->
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
        <el-form label-position="right" label-width="120px" :model="fetchParam" style="max-width: 800px">
            <el-form-item label="商品类型">
                <el-select v-model="fetchParam.prodno" placeholder="全部" :clearable="true">
                    <el-option value="1" label="未选择"></el-option>
                    <el-option value="1" label="补登卡"></el-option>
                    <el-option value="1" label="转盘卡"></el-option>
                    <el-option value="1" label="红包加成卡"></el-option>
                    <el-option value="1" label="成长值充值卡"></el-option>
                    <el-option value="1" label="成长值加倍卡"></el-option>
                    <el-option value="1" label="实物"></el-option>
                    <el-option value="1" label="外部虚拟卡券"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="面值">
                <el-input v-model="fetchParam.region" placeholder="设置卡券的面值"></el-input>
            </el-form-item>
            <el-form-item label="天数">
                <el-input v-model="fetchParam.region" placeholder="设置卡券的面值"></el-input>
            </el-form-item>
            <el-form-item label="倍数">
                <el-input v-model="fetchParam.region" placeholder="设置卡券的面值"></el-input>
            </el-form-item>
            <el-form-item label="商品名称">
                <el-input v-model="fetchParam.region" placeholder="积分乐园的商品名称,建议8个字以内"></el-input>
            </el-form-item>
            <el-form-item label="商品内容">
                <el-input v-model="fetchParam.type" :autosize="{ minRows: 4, maxRows: 4}" type="textarea"
                          placeholder="此商品的介绍文案"></el-input>
            </el-form-item>
            <el-form-item label="商品封面图">
                <ImgCropper :isShowBtn="true" ref="imgcropper" :confirmFn="cropperImgSucc" :aspectRatio="1"></ImgCropper>
                <i style="color: #999; font-size: 13px">*图片用于手机客户端查看积分乐园商品列表的图片及详情顶部的图片</i>
            </el-form-item>
            <el-form-item label="排序">
                <el-input size="small" placeholder="输入数字设置该商品在积分乐园的顺序，默认为0，会展示在积分乐园最下方" v-model="fetchParam.order"></el-input>
            </el-form-item>
            <el-form-item label="兑换积分">
                <el-input size="small" placeholder="设置兑换单个商品所需要的积分" v-model="fetchParam.order"></el-input>
            </el-form-item>
            <el-form-item label="商品有效期">
                <el-date-picker
                        v-model="fetchParam.time"
                        type="datetime"
                        placeholder="请选取商品有效期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="">
                <el-button type="primary">发布并上架</el-button>
                <el-button>发布不上架</el-button>
            </el-form-item>
        </el-form>
    </article>
</template>

<script>
    import ImgCropper from '../../component/upload/ImagEcropperInput.vue'
    export default{
        data () {
            return {
                fetchParam: {},
                rules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    resource: [
                        {required: true, message: '请选择活动资源', trigger: 'change'}
                    ],
                    desc: [
                        {required: true, message: '请填写活动形式', trigger: 'blur'}
                    ]
                }
            }
        },
        created () {
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            cropperImgSucc() {}
        },
        components: {ImgCropper}
    }
</script>
