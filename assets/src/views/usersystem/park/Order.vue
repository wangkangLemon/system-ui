<!--库存管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #usersys-integral-stock {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }

        .data-table {
            .el-button {
                margin-left: 2px;
            }
        }

        .el-dialog {
            // top: 15px !important;
        }
    }
</style>

<template>
    <main id="usersys-integral-stock">
        <article class="search">
            <section>
                <i>订单号</i>
                <el-input v-model="fetchParam.product_order_no" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>商品名</i>
                <el-input v-model="fetchParam.product_name" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>联系方式</i>
                <el-input v-model="fetchParam.mobile" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>销售渠道</i>
                <el-select v-model="fetchParam.channel" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="积分乐园兑换" value="exchange"></el-option>
                    <el-option label="月末签到奖励" value="sign_month"></el-option>
                    <el-option label="连续7天签到" value="sign_weekly"></el-option>
                    <el-option label="转盘抽奖" value="wheel"></el-option>
                </el-select>
            </section>
            <section>
                <i>商品类型</i>
                <el-select v-model="fetchParam.product_category" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="补签卡" value="sign_card"></el-option>
                    <el-option label="转盘卡" value="wheel_card"></el-option>
                    <el-option label="红包加成卡" value="price_plus_card"></el-option>
                    <el-option label="成长值充值卡" value="growth_charge_card"></el-option>
                    <el-option label="成长值加倍卡" value="growth_plus_card"></el-option>
                    <el-option label="外部虚拟卡券" value="coupon"></el-option>
                    <el-option label="实物" value="entity"></el-option>
                    <el-option label="优惠券" value="discount_coupon"></el-option>
                </el-select>
            </section>
            <section>
                <i>物流状态</i>
                <el-select v-model="fetchParam.status" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="已领取" :value="1"></el-option>
                    <el-option label="未领取" :value="0"></el-option>
                </el-select>
            </section>
            <DateRange title="有效日期" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       v-on:changeStart="val=> fetchParam.time_start=val"
                       v-on:changeEnd="val=> fetchParam.time_end=val"
                       :change="fetchData">
            </DateRange>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    min-width="220"
                    prop="order_no"
                    label="订单号">
            </el-table-column>
            <el-table-column
                    min-width="150"
                    prop="product_no"
                    label="商品编号">
            </el-table-column>
            <el-table-column
                    min-width="250"
                    label="商品名">
                    <template slot-scope="scope">
                        <img :src="scope.row.image | fillImgPath" height="30" style="vertical-align: middle">
                        <i>{{scope.row.product_name}}</i>
                    </template>
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="channel"
                    label="销售渠道">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="user_name"
                    label="领取人">
            </el-table-column>
            <el-table-column
                    width="130"
                    prop="mobile"
                    label="联系方式">
            </el-table-column>
            <el-table-column
                    width="170"
                    prop="create_time_name"
                    label="领取时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="操作"
                    fixed="right"
                    align="center">
                <template slot-scope="scope">
                    <div class="tab-oepratebtns">
                        <el-button type="text" size="small" @click="edit(scope.row)">完善订单</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="val => fetchParam.page_size = val "
                       @current-change="val => fetchParam.page = val"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>

        <!--商品详情的弹出框-->
        <el-dialog
                title="商品设置"
                :visible.sync="dialogDetail.isShow"
                size="small">
            <el-form :model="dialogDetail.model" :rules="rules" ref="form" label-position="right" label-width="80px">
                <el-form-item label="商品名称">
                    <i>{{ dialogDetail.model.product_name }}</i>
                </el-form-item>
                <el-form-item label="商品编号">
                    <i>{{ dialogDetail.model.product_no }}</i>
                </el-form-item>
                <el-form-item label="商品封面">
                    <img :src="dialogDetail.model.image" style="width: 120px"/>
                </el-form-item>
                <el-form-item label="商品详情">
                    <pre style="white-space: pre-line;">{{ dialogDetail.model.description }}</pre>
                </el-form-item>
                <template v-if="dialogDetail.model.category == 'entity'">
                    <el-form-item label="收货人" prop='receiver'>
                        <el-input v-model="dialogDetail.model.receiver" placeholder="请输入收货人"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" prop='phone'>
                        <el-input v-model="dialogDetail.model.phone" placeholder="请输入手机号"></el-input>
                    </el-form-item>
                    <el-form-item label="收货地址" prop='address'>
                        <el-input v-model="dialogDetail.model.address" type="textarea" placeholder="请输入收货地址"></el-input>
                    </el-form-item>
                    <el-form-item label="邮政编码" prop='postcode'>
                        <el-input v-model="dialogDetail.model.postcode" placeholder="请输入邮政编码（选填）"></el-input>
                    </el-form-item>
                    <el-form-item label="物流公司">
                        <el-input v-model="dialogDetail.model.shipper" placeholder="请输入物流公司"></el-input>
                    </el-form-item>
                    <el-form-item label="快递单号">
                        <el-input v-model="dialogDetail.model.shipper_no" placeholder="请输入快递单号"></el-input>
                    </el-form-item>
                </template>
                
            </el-form>

            <span v-if="dialogDetail.model.category == 'entity'" slot="footer">
                <el-button @click="dialogDetail.isShow = false">取消</el-button>
                <el-button type="primary" @click="submit('form')">确定</el-button>
            </span>
        </el-dialog>
    </main>
</template>

<script>
    import orderService from '../../../services/usersystem/orderService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            DateRange
        },
        data () {
            return {
                selectedIds: [],
                loadingData: false,
                data: [{}], // 表格数据
                total: 0,
                fetchParam: clearFetchParam(),
                dialogDetail: { // 完善订单弹框
                    isShow: false,
                    model: {
                        product_name: void '',
                        description: void '',
                        image: void '',
                        product_no: void '',
                        receiver: void '',
                        phone: void '',
                        address: void '',
                        postcode: void '',
                        shipper: void '',
                        shipper_no: void '',
                        category: void '',
                        product_order_id: void 0,
                    }
                },
                rules: {
                    receiver: [
                        {required: true, message: '必填项', trigger: 'change'}
                    ],
                    phone: [
                        {required: true, message: '必填项', trigger: 'change'}
                    ],
                    address: [
                        {required: true, message: '必填项', trigger: 'change'}
                    ],
                    postcode: [
                        {required: true, message: '必填项', trigger: 'change'}
                    ],
                },
            }
        },
        watch: {
            'fetchParam.page_size'(val) {
                this.fetchData()
            },
            'fetchParam.page'(val) {
                this.fetchData()
            },
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {

            initFetchParam () {
                this.fetchParam = clearFetchParam()
            },
            fetchData() {
                this.loadingData = true
                return orderService.search(this.fetchParam).then((ret) => {
                    this.data = ret.orders
                    this.total = ret.total
                    this.loadingData = false
                }).catch((ret) => {
                    this.xmviex.showTip('error', ret.message)
                })
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            edit (row) {
                this.dialogDetail.model.product_name = row.product_name
                this.dialogDetail.model.product_no = row.product_no
                this.dialogDetail.model.image = row.image
                this.dialogDetail.model.description = row.description
                this.dialogDetail.model.category = row.category
                this.dialogDetail.model.product_order_id = row.id
                if (row.category === 'entity') {
                    orderService.view(this.dialogDetail.model.product_order_id).then((ret) => {
                        this.dialogDetail.model.receiver = ret.express.receiver
                        this.dialogDetail.model.phone = ret.express.phone
                        this.dialogDetail.model.address = ret.express.address
                        this.dialogDetail.model.postcode = ret.express.postcode
                        this.dialogDetail.model.shipper = ret.express.shipper
                        this.dialogDetail.model.shipper_no = ret.express.shipper_no
                        this.dialogDetail.isShow = true
                    }).catch((ret) => {
                        if (ret.message === 'record not found') {
                            ret.tipCom.close()
                            this.dialogDetail.model.receiver = ''
                            this.dialogDetail.model.phone = ''
                            this.dialogDetail.model.address = ''
                            this.dialogDetail.model.postcode = ''
                            this.dialogDetail.model.shipper = ''
                            this.dialogDetail.model.shipper_no = ''
                            this.dialogDetail.isShow = true
                        }
                    })
                } else {
                    this.dialogDetail.isShow = true
                }
            },
            submit (form) {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        orderService.complete(this.dialogDetail.model.product_order_id, this.dialogDetail.model).then((ret) => {
                            this.dialogDetail.isShow = false
                            xmview.showTip('success', '保存成功')
                            this.fetchData()
                        })
                    } else {
                        return false
                    }
                })
            },
        },
    }
    function clearFetchParam() {
        return {
            mobile: void '', // 领取人联系方式
            channel: void '', // 销售渠道
            product_name: void '', // 商品名
            product_category: void '', // 商品类型
            product_order_no: void '', // 订单号
            status: void -1, // 物流状态
            page: 1,
            page_size: 15,
            time_start: void '',
            time_end: void '',
        }
    }
</script>
