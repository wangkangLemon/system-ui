<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #yshi-coupon-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }
        .top-btn2 {
            @extend %right-top-btnContainer;
            right: 130px;
        }

        .block {
            float: right;
            margin-top: 15px;
            margin-bottom: 15px;
        }
    }
</style>

<template>
    <main id="yshi-coupon-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>优惠券名称</i>
                <el-input
                    v-model="fetchParam.name"
                    suffix-icon="el-icon-search"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <el-button class="top-btn" icon="plus" type='primary' @click="$router.push({name: 'yshi-coupon-add'})">创建优惠券</el-button>
            <el-button class="top-btn2" type='default' @click="publish">发放优惠券</el-button>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="优惠券名称" 
                    prop="name" 
                    min-width="170">
                </el-table-column>
                <el-table-column 
                    label="金额(元)" 
                    prop="money" 
                    width="100">
                </el-table-column>
                <el-table-column 
                    label="使用门槛(元)" 
                    prop="threshold" 
                    width="120">
                </el-table-column>
                <el-table-column 
                    label="使用时间" 
                    width="200">
                    <span slot-scope="scope">{{scope.row.start_date || "-"}} - {{scope.row.end_date || "-"}}</span>
                </el-table-column>
                <el-table-column 
                    label="指定商品数" 
                    prop="goods_count" 
                    width="120">
                    <el-button slot-scope="{row}" type='text' @click="showGoods(row)" :disabled="row.goods_count === 0">{{row.goods_count}}</el-button>
                </el-table-column>
                <el-table-column 
                    label="领取次数" 
                    prop="get_count" 
                    width="100">
                    <el-button slot-scope="{row}" type='text' @click="showUser(row, 2)" :disabled="row.get_count === 0">{{row.get_count}}</el-button>
                </el-table-column>
                <el-table-column 
                    label="发放次数" 
                    prop="put_count" 
                    width="100">
                    <el-button slot-scope="{row}" type='text' @click="showUser(row, 1)" :disabled="row.put_count === 0">{{row.put_count}}</el-button>
                </el-table-column>
                <el-table-column 
                    label="创建时间" 
                    prop="created_at" 
                    width="170">
                </el-table-column>
                <el-table-column 
                    label="操作" 
                    prop="operate" 
                    width="180" 
                    fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="$router.push({ name: 'yshi-coupon-view', query: { coupon_id: scope.row.id } })">
                            查看
                        </el-button>
                        <el-button type="text" size="small" @click="offAndOnline(scope.row)">
                            {{scope.row.status === 1 ? '下线' : '上线'}}
                        </el-button>
                        <el-button type="text" size="small" @click="del(scope.row)" :disabled="scope.row.status === 1">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination 
                class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination>
        </section>
        
        <!-- 发放优惠券 -->
        <PublishCouponDialog 
            v-if="publishCoupon.showDialog"
            :visible.sync="publishCoupon.showDialog"
            @confirm="fetchData">
        </PublishCouponDialog>
        <!-- 商品数 -->
        <el-dialog 
            v-if="goodsModel.showDialog"
            title="指定商品数"
            :visible.sync="goodsModel.showDialog">
            <GoodsList :data="goodsModel.data"></GoodsList>
        </el-dialog>
        <!-- 领取次数 -->
        <!-- 发放次数 -->
        <el-dialog 
            v-if="userModel.showDialog"
            :title="userModel.label + '次数'"
            :visible.sync="userModel.showDialog">
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="userModel.data" :fit="true" border>
                <el-table-column 
                    label="用户名" 
                    prop="user_name" 
                    min-width="90">
                </el-table-column>
                <el-table-column 
                    label="手机号" 
                    prop="user_mobile" 
                    width="150">
                </el-table-column>
                <el-table-column 
                    :label="userModel.label + '时间'"
                    prop="created_at" 
                    width="200">
                </el-table-column>
                <el-table-column 
                    label="使用情况"
                    prop="status" 
                    width="100">
                    <span slot-scope="{ row }">{{row.status === 2 ? '已使用' : '未使用'}}</span>
                </el-table-column>
            </el-table>
            <el-pagination 
                class="block"
                @size-change="val=> {userModel.fetchParam.page_size=val; getUserData()}"
                @current-change="val=> {userModel.fetchParam.page=val; getUserData()}"
                :current-page="userModel.fetchParam.page"
                :page-size="userModel.fetchParam.page_size"
                :page-sizes="[10, 15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="userModel.total">
            </el-pagination>
        </el-dialog>
    </main>
</template>

<script>
    import couponService from 'services/yshi/couponService'
    import PublishCouponDialog from '../component/PublishCouponDialog.vue'
    import GoodsList from '../component/GoodsList.vue'

    export default {
        components: {
            PublishCouponDialog,
            GoodsList
        },
        props: {},
        activated () {},
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        mounted () {},
        computed: {},
        watch: {},
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    name: '',
                    page: 1,
                    page_size: 15,
                },
                publishCoupon: {
                    showDialog: false,
                    // confirmFn: ''
                },
                goodsModel: {
                    showDialog: false,
                    data: []
                },
                userModel: {
                    showDialog: false,
                    label: '',
                    total: '',
                    data: [],
                    fetchParam: {
                        coupon_id: '',
                        type: '',
                        page: 1,
                        page_size: 10
                    }
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return couponService.search(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            },
            offAndOnline (row) {
                this.$confirm(`确定${row.status === 1 ? '下线' : '上线'}优惠券【${row.name}】吗`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let coupon_id = row.id
                    let status = row.status === 1 ? 2 : 1
                    couponService.offAndOnline({ coupon_id, status }).then(ret => {
                        this.fetchData()
                    })
                })
            },
            del (row) {
                this.$confirm(`确定删除优惠券【${row.name}】吗`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let coupon_id = row.id
                    couponService.delete({ coupon_id }).then(ret => {
                        this.fetchData()
                    })
                })
            },
            publish () {
                this.publishCoupon.showDialog = true
            },
            showGoods (row) {
                couponService.viewGoods({ coupon_id: row.id }).then(ret => {
                    this.goodsModel.showDialog = true
                    this.goodsModel.data = ret.list
                })
            },
            showUser (row, type) {
                this.userModel.label = type === 1 ? '发放' : '领取'
                this.userModel.fetchParam.type = type
                this.userModel.fetchParam.coupon_id = row.id
                this.userModel.fetchParam.page = 1
                this.userModel.fetchParam.page_size = 10
                this.getUserData().then(() => {
                    this.userModel.showDialog = true
                })
            },
            getUserData () {
                return couponService.viewUser(this.userModel.fetchParam).then(ret => {
                    this.userModel.data = ret.list
                    this.userModel.total = ret.total
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>

