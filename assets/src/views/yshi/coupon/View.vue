<style lang="scss">
    @import "~utils/mixins/common";
    #yshi-coupon-view-container {
       @extend %content-container;
        .form {
            width: 50%;
        }
    }
</style>

<template>
    <main id="yshi-coupon-view-container">
        <el-form :model="ruleForm" ref="ruleForm"  class="form" label-width="180px">
            <el-form-item label="优惠券名称">
                <span>{{ruleForm.name}}</span>
            </el-form-item>
            <el-form-item label="优惠金额">
                <span>{{ruleForm.money}}元</span>
            </el-form-item>
            <el-form-item label="使用门槛">
                <span>{{ruleForm.threshold}}元</span>
            </el-form-item>
            <el-form-item label="使用时间">
                <span>{{ruleForm.start_date || '-'}} - {{ruleForm.end_date || '-'}}</span>
            </el-form-item>
            <el-form-item label="指定商品">
                <template v-if="transferRight.length">
                    <GoodsList :data="transferRight"></GoodsList>
                </template>
                <template v-else>所有商品</template>
            </el-form-item>
        </el-form>
    </main>
</template>

<script>
    import couponService from 'services/yshi/couponService'
    import GoodsList from '../component/GoodsList.vue'

    export default {
        components: {
            GoodsList
        },
        props: {},
        activated () {},
        created () {
            this.fetchData(this.$route.query.coupon_id).then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                ruleForm: {
                    name: '',
                    money: '',
                    threshold: '',
                    start_date: '',
                    end_date: '',
                    goods_list: [],
                },
                transferRight: [],  // 从组件功能上命名，即transfer右边选中的数据
            }
        },
        methods: {
            fetchData (coupon_id) {
                return couponService.view({ coupon_id }).then(ret => {
                    this.transferRight = ret.data.goods_list
                    for (let i in ret.data) {
                        if (i in this.ruleForm) {
                            this.ruleForm[i] = ret.data[i]
                        }
                    }
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
