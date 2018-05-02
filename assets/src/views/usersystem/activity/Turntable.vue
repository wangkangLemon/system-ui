<!--转盘设置-->
<style lang="scss" rel="stylesheet/scss">
    .activity-turntable-container {
        .el-select {
            width: 30% !important;
        }
        .el-card {
            .el-form-item {
                .tip {
                    > i {
                        color: #ff4949;
                        margin-right: 10px;
                    }
                    font-size: 12px;
                    color: #999;
                }
            }
            .el-card__header {
                padding: 15px;
                background: #f0f3f5;
            }
            .el-button {
                display: block;
                margin: 0 auto;
            }
            .el-table_1_column_2 {
                text-align: center;
            }
            .img-list {
                vertical-align: middle;
                height: 30px;
            }
        }
        /*上传图片部分*/
        @at-root {
            .uploadimg {
                > div {
                    display: inline-block;
                }

                .img-container {
                    width: 200px;
                    height: 264px;
                    border: solid 1px #ccd0d4;
                    background: #f8f8f8;

                    &:before {
                        content: "图片";
                        font-size: 14px;
                        height: 264px;
                        line-height: 264px;
                        display: block;
                        text-align: center;
                        color: #999;
                    }

                    img {
                        height: 100%;
                        z-index: 9;
                        position: absolute;
                        width: 198px;
                        top: 0;
                        left: 1px;
                    }
                }

                .img-desc {
                    vertical-align: middle;
                    color: #bbb;
                    margin-left: 12px;
                    > span {
                        font-size: 13px;
                        line-height: 1.4em;
                        display: block;
                        margin-top: 10px;
                    }

                    a {
                        font-size: 13px;
                        color: #337ab7;
                        text-decoration: none;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }
</style>
<template>
    <article class="activity-turntable-container">
        <el-card class="box-card">
            <div class="clearfix" slot="header">活动规则</div>
            <el-form :model="activity" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="活动标题" prop="title">
                    <el-input v-model="activity.title" placeholder="活动标题"></el-input>
                </el-form-item>
                <el-form-item label="限制次数" prop="limit">
                    <el-input type="number" placeholder="用户每天最多可参与的次数" v-model.number="activity.limit">
                        <template slot="append">次/每天</template>
                    </el-input>
                </el-form-item>
                <!--<el-form-item label="上传图片" prop="url">-->
                <!--<section class="uploadimg">-->
                <!--<div class="img-container">-->
                <!--<img :src="form.url | fillImgPath" v-show="form.url">-->
                <!--</div>-->
                <!--<div class="img-desc">-->
                <!--<ImagEcropperInput :aspectRatio="1280/1706" :confirmFn="cropperFn"></ImagEcropperInput>-->
                <!--<span>图片用于手机客户端转盘页面的背景图更换</span>-->
                <!--</div>-->
                <!--</section>-->
                <!--</el-form-item>-->
                <el-form-item label="奖项配置">
                    <p class="tip"><i>*</i>此活动必须配置8个奖品，其中至少有一个谢谢参与</p>
                    <el-table
                            border
                            :data="awardlist">
                        <el-table-column
                                width="100"
                                prop="sort"
                                label="排序">
                        </el-table-column>
                        <el-table-column
                                prop="product_image"
                                label="图片"
                                width="200">
                            <template slot-scope="scope">
                                <img v-if="scope.row.type == 'product'" class="img-list" :src="scope.row.product_image" alt="">
                                <img v-if="scope.row.type == 'credit'" class="img-list" src="../images/credit.png" alt="">
                                <img v-if="scope.row.type == 'thanks'" class="img-list" src="../images/thanks.png" alt="">
                            </template>
                        </el-table-column>
                        <el-table-column
                                min-width="180"
                                prop="product_name"
                                label="奖品">
                        </el-table-column>
                        <el-table-column
                                width="100"
                                prop="weight"
                                label="中奖概率">
                            <template slot-scope="scope">{{scope.row.weight}}%</template>
                        </el-table-column>
                        <el-table-column
                                prop="limit"
                                width="100"
                                label="发放量">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type == 'thanks'">无限</span>
                                <span v-if="scope.row.type == 'product'">{{scope.row.limit}}</span>
                                <span v-if="scope.row.type == 'credit' && scope.row.limit == 0">无限</span>
                                <span v-if="scope.row.type == 'credit' && scope.row.limit > 0">{{scope.row.limit}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                min-width="100"
                                prop="left"
                                label="已发放">
                        <template slot-scope="scope">
                            <el-button type="text" @click="$router.push({name:'activity-prize', query:{play_type:'wheel',id:scope.row.id,product_name:scope.row.product_name} })">{{scope.row.left}}</el-button>
                        </template>
                        </el-table-column>
                        <el-table-column
                                width="80"
                                prop="operate"
                                label="操作"
                                fixed="right"
                                align="center">
                            <template slot-scope="scope">
                                <el-button size="small" type="text" @click="editFn(scope.row)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="抽奖规则" prop="description">
                    <p class="tip">转盘页面底部的抽奖说明</p>
                    <el-input
                            type="textarea"
                            :rows="5"
                            v-model="activity.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit('form')">保存生效</el-button>
        </el-card>
        <!--奖品设置-->
        <el-dialog v-model="addForm" title="奖品设置" size="small">
            <el-form :model="form1" :rules="rules1" ref="form1" label-width="100px">
                <el-form-item label="奖品类型" prop="type">
                    <el-select @change="changeProduct" v-model="form1.type">
                        <el-option label="商品" value="product"></el-option>
                        <el-option label="谢谢参与" value="thanks"></el-option>
                        <el-option label="积分" value="credit"></el-option>
                    </el-select>
                    <el-select @change="getSelectPorduct" v-model="form1.category" v-if="form1.type == 'product'">
                        <el-option label="补签卡" value="sign_card"></el-option>
                        <el-option label="转盘卡" value="wheel_card"></el-option>
                        <el-option label="红包加成卡" value="price_plus_card"></el-option>
                        <el-option label="成长值充值卡" value="growth_charge_card"></el-option>
                        <el-option label="成长值加倍卡" value="growth_plus_card"></el-option>
                        <el-option label="实物" value="entity"></el-option>
                        <el-option label="外部虚拟卡券" value="coupon"></el-option>
                        <el-option label="优惠券" value="discount_coupon"></el-option>
                    </el-select>
                    <el-select @change="getStockCount" v-if="form1.category && form1.category != 'discount_coupon'"
                               v-model="form1.product_id">
                        <el-option :label="item.name" :value="item.id" v-for="(item,index) in products"
                                   :key="index"></el-option>
                    </el-select>
                    <CouponSelect v-model="form1.product_id" v-if="form1.category && form1.category == 'discount_coupon'"></CouponSelect>
                </el-form-item>
                <el-form-item label="库存量" v-if="!isNaN(form1.product_id) && form1.product_id > 0">
                    {{stockCount}}
                </el-form-item>
                <el-form-item label="积分面值" prop="quota" v-if="form1.type == 'credit'">
                    <el-input v-model.number="form1.quota"></el-input>
                </el-form-item>
                <el-form-item label="发放量" prop="limit">
                    <el-input type="number" v-model.number="form1.limit"
                              :placeholder="form1.type == 'credit' ? '请填写发放量，不填默认为无限' : ''"
                              v-if="form1.type == 'product' || form1.type == 'credit'"></el-input>
                    <span v-if="form1.type == 'thanks'">无限</span>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="form1.sort"></el-input>
                </el-form-item>
                <el-form-item label="中奖概率" prop="weight">
                    <el-input type="number" :min="0" :max="100" v-model.number="form1.weight">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm=false">取消</el-button>
                <el-button type="primary" @click="awardSet('form1')">保存</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import clone from 'clone'
    import ActivityService from '../../../services/usersystem/activityService'
    import ParkService from '../../../services/usersystem/parkService'
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    import CouponSelect from 'components/select/Coupon.vue'
    export default {
        components: {
            ImagEcropperInput,
            CouponSelect
        },
        data () {
            return {
                preLimit: 0,
                stockCount: 0, // 库存量
                addForm: false,
                awardlist: [],
                products: [], // 产品列表
                activity: {
                    title: '',
                    limit: '',
//                    url: '',
                    description: ''
                },
                form1: {},
                cloneForm1: {},
                rules: {
                    title: {required: true, message: '必填项', trigger: 'blur'},
                    limit: {type: 'number', required: true, message: '必填项', trigger: 'blur'},
                    description: {required: true, message: '必填项', trigger: 'blur'},
                },
                rules1: {
                    type: {required: true, message: '必填项'}, // 类型
                    category: {required: true, message: '必填项'}, // 分类
                    product_id: {required: true, message: '必填项'}, // 产品
                    weight: {type: 'number', required: true, message: '必填项'},
                    quota: {type: 'number', required: true, message: '必填项'},
                },
            }
        },
        activated () {
            // 获取活动详情和奖品配置
            Promise.all([this.getData(), this.rewardSearch()]).then((ret) => {
                this.activity = ret[0].play
                this.awardlist = ret[1].rewards
            }).then(() => {
                xmview.setContentLoading(false)
            })
            this.getSelectPorduct()
        },
        watch: {
            'form1.limit' (val) {
                delete this.rules1['limit']
                if (this.form1.type == 'product') {
                    this.getStockCount().then(() => {
                        if (this.form1.limit > this.stockCount) {
                            this.rules1['limit'] = {
                                max: this.stockCount,
                                required: true,
                                type: 'number',
                                message: '发放量不得大于库存量',
                                trigger: 'blur'
                            }
                        }
                    })
                }
            }
        },
        methods: {
            // 获取库存
            getStockCount () {
                if (this.form1.type == 'product' && this.form1.product_id) {
                    // 获取库存量
                    return ParkService.prodDetail({id: this.form1.product_id}).then((ret) => {
                        this.stockCount = ret.stock_count
                    })
                }
            },
            getData () {
                return ActivityService.getActivity({play_id: 1})
            },
            rewardSearch () {
                return ActivityService.rewardSearch({play_type: 'wheel'})
            },
            editFn (row) {
                this.addForm = true
                this.$nextTick(() => {
                    this.$refs.form1.resetFields()
                    this.form1 = clone(row)
                    this.cloneForm1 = clone(row)
                    this.preLimit = row.limit
                    this.getStockCount()
                })
            },
            awardSet (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        // 判断库存
                        if (this.form1.type == 'product' && this.stockCount < this.form1.limit) {
                            xmview.showTip('error', '库存不足')
                            return
                        }
                        // 判断概率
                        let sumWeight = 0
                        this.awardlist.forEach((item) => {
                            if (item.id != this.form1.id) {
                                sumWeight += item.weight
                            }
                        })
                        if (this.form1.weight + sumWeight > 100) {
                            xmview.showTip('error', '总概率不得超过100%')
                            return
                        }
                        // 发放量不得减少
                        // if (this.form1.type == 'product' && this.form1.limit < this.preLimit) {
                        //     xmview.showTip('error', '商品发放量不得减小')
                        //     return
                        // }
                        ActivityService.updateReward(this.form1).then((ret) => {
                            xmview.showTip('success', '修改成功')
                            this.addForm = false
                            this.rewardSearch().then((ret) => {
                                this.awardlist = ret.rewards
                            })
                        })
                    } else {
                        return false
                    }
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        ActivityService.updateActivity({
                            play_id: 1,
                            title: this.activity.title,
                            limit: this.activity.limit,
                            description: this.activity.description,
                        }).then((ret) => {
                            xmview.showTip('success', '修改成功')
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            getSelectPorduct () {
                if (this.form1.category != this.cloneForm1.category) this.form1.product_id = ''
                // 获取选中产品列表 products
                ActivityService.productSearch({category: this.form1.category}).then((ret) => {
                    this.products = ret.data
                })
            },
            changeProduct () {
                if (this.form1.type == 'credit' || this.form1.type == 'thanks') {
                    delete this.rules1['limit']
                    this.form1.category = ''
                    this.form1.product_id = ''
                }
            },
            cropperFn(data) {
                console.log(data)
//                this.form.url = data
//                this.uploadingImg = true
//                // 上传图片
//                mobileService.uploadboot({company_id: this.user.company_id, image: data}).then(ret => {
//                    this.form.url = ret.data.url
//                }).then(() => {
//                    xmview.showTip('success', '上传成功')
//                    this.uploadingImg = false
//                }).catch((ret) => {
//                    xmview.showTip('error', ret.message)
//                    this.uploadingImg = false
//                })
            },
        }
    }
</script>
