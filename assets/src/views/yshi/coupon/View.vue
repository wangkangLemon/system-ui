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
                <span>{{ruleForm.start_time}} - {{ruleForm.end_time}}</span>
            </el-form-item>
            <el-form-item label="指定商品">
                <template v-if="transferRight.length">
                    <el-table class="data-table" :data="transferRight" :fit="true" border style="margin-top: 5px;">
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
                    <el-tag>总计：{{transferRight.length}}个商品</el-tag>
                </template>
            </el-form-item>
        </el-form>
    </main>
</template>

<script>
    import couponService from 'services/yshi/couponService'

    export default {
        components: {},
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
                    start_time: '',
                    end_time: '',
                    goods_list: [],
                },
                transferRight: [],  // 从组件功能上命名，即transfer右边选中的数据
            }
        },
        methods: {
            fetchData (coupon_id) {
                return couponService.view({ coupon_id }).then(ret => {
                    this.transferRight = ret.goods_list
                    for (let i in ret) {
                        if (i in this.ruleForm) {
                            this.ruleForm[i] = ret[i]
                        }
                    }
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
