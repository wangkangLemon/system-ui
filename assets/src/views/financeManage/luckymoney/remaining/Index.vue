<style lang="scss">
    @import "~utils/mixins/common";
    @import "~utils/mixins/topSearch";
    #remaining-record-container {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .top-btn {
            @extend %right-top-btnContainer;
        }

        .block {
            float: right;
            margin-top: 15px;
        }
    }

    .u-loadmore {
        color: #63bdea;
        margin-left: 10px;
        padding-top: 4px;
        display: block;
        cursor: pointer;
    }
</style>

<template>
    <main id="remaining-record-container">
        <section class="search">
            <!-- 搜索条件 -->
            <section>
                <i>用户账号</i>
                <el-input
                    v-model="fetchParam.mobile"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
            <section>
                <i>真实姓名</i>
                <el-input
                    v-model="fetchParam.user_name"
                    @keyup.enter.native="fetchData">
                </el-input>
            </section>
        </section>
        <section>
            <!-- 内容主体 -->
            <!-- 自适应width：字段长度不固定的设置min-width,字段长度固定的设置width -->
            <!-- 格式化字段通过:formatter或者通过slot-scope在插值中使用过滤器，推荐用后者 -->
            <!-- 固定列通过配置fixed="right || left"-->
            <el-table class="data-table" v-loading="loading" :data="data" :fit="true" border>
                <el-table-column 
                    label="用户账号" 
                    prop="mobile" 
                    width="130">
                </el-table-column>
                <el-table-column 
                    label="当前余额" 
                    prop="lucky_money" 
                    width="150">
                </el-table-column>
                <el-table-column 
                    label="真实姓名" 
                    prop="user_name" 
                    width="150">
                </el-table-column>
                <el-table-column 
                    label="身份证号码" 
                    prop="identity_card_no" 
                    width="200">
                </el-table-column>
                <el-table-column 
                    label="所属银行" 
                    prop="bank_name" 
                    width="150">
                </el-table-column>
                <el-table-column 
                    label="银联卡账户" 
                    prop="bank_card_no" 
                    width="200">
                </el-table-column>
                <el-table-column 
                    label="微信OPEN ID" 
                    prop="wechat_openid" 
                    min-width="150">
                </el-table-column>
            </el-table>
            <el-pagination class="block"
                @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                @current-change="val=> {fetchParam.page=val; fetchData()}"
                :current-page="fetchParam.page"
                :page-size="fetchParam.page_size"
                :page-sizes="[15, 30, 60, 100]"
                layout="sizes, total, prev, pager, next" 
                :total="total">
            </el-pagination>
        </section>
    </main>
</template>

<script>
    import luckymoney from 'services/luckymoney'

    export default {
        components: {},
        props: {},
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        created () {
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
                    user_name: '',
                    mobile: '',
                    page: 1,
                    page_size: 15,
                }
            }
        },
        methods: {
            fetchData () {
                this.loading = true
                return luckymoney.searchRemainingMoney(this.fetchParam).then(ret => {
                    this.data = ret.list
                    this.total = ret.total
                    this.loading = false
                })
            }
        },
        filters: {},
        directives: {},
    }
</script>
