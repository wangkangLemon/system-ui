<!--流水记录-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";

    #sales-history-container {
        padding: 15px;
        background: #fff;
        border-radius: 5px;
        overflow: hidden;

        .pagin {
            float: right;
            margin-top: 15px;
        }

        .data-table {
            margin-top: 10px;
            img {
                vertical-align: middle;
                width: 70px;
                height: 50px;
                margin: 5px 0;
            }

            .btnShowDtail {

            }
        }

        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <article id="sales-history-container">
        <article class="search">
            <section>
                <i>工业</i>
                <IndustrySelect v-model="fetchParam.enterprise_id" type="1"
                                v-on:change="val=>fetchParam.enterprise_id=val"
                                :change="fetchData">
                </IndustrySelect>
            </section>
            <section>
                <span>药品</span>
                <el-select v-loading="loadingDrug"
                           @visible-change="handleDruglistchange"
                           @change="fetchData"
                           v-model="fetchParam.product_id"
                           placeholder="未选择">
                    <el-option v-for="item in drugList"
                               :label="item.name" :value="item.id" :key="item.id">
                    </el-option>
                </el-select>
            </section>

            <section>
                <i>姓名</i>
                <el-input :enter="fetchData" v-model="fetchParam.username"
                         placeholder="请输入内容"></el-input>
            </section>

            <DateRange title="晒单时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       v-on:changeStart="val=> fetchParam.time_start=val "
                       v-on:changeEnd="val=> fetchParam.time_end=val "
                       :change="fetchData">
            </DateRange>

            <section>
                <i>状态</i>
                <el-select @change="fetchData"
                           v-model="fetchParam.status">
                    <el-option v-for="item in selectStatus"
                               :label="item.name" :value="item.id" :key="item.id">
                    </el-option>
                </el-select>
            </section>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    width="110"
                    prop="image"
                    label="图片">
                <template slot-scope="props">
                    <img :src="props.row.image">
                </template>
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="ent_name"
                    label="工业">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="product_name"
                    label="药品">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="user_name"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    width="330"
                    label="门店">
                <template slot-scope="props">
                    <i>{{props.row.store_name + ' ' + props.row.department_name}}</i>
                </template>
            </el-table-column>
            <el-table-column
                    prop="amount"
                    label="数量">
            </el-table-column>
            <el-table-column
                    prop="money_name"
                    label="价格">
            </el-table-column>
            <el-table-column
                    prop="rebate_name"
                    label="返现">
            </el-table-column>
            <el-table-column
                    width="88"
                    prop="status"
                    label="状态">
                <template slot-scope="t">
                    <el-tag type="primary" v-if="t.row.status == 1">待支付</el-tag>
                    <el-tag type="success" v-else-if="t.row.status == 2">已完成</el-tag>
                    <el-tag v-else-if="t.row.status == 0">待确认</el-tag>
                    <el-tag v-else-if="t.row.status == 3">已关闭</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time_name"
                    label="晒单时间">
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="update_time_name"
                    label="更新时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    align="center"
                    fixed="right"
                    label="操作">
                <template slot-scope="scope">
                    <el-button @click="showDetail(scope.$index)" type="text" size="small">查看依据</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @current-change="handleCurrentChange"
                       :current-page="fetchParam.start"
                       :page-size="fetchParam.length"
                       layout="total, prev, pager, next"
                       :total="total">
        </el-pagination>
    </article>
</template>

<script>
    import IndustrySelect from '../component/select/IndustryCompany.vue'
    import salesService from '../../services/salesService'
    import DateRange from '../component/form/DateRangePicker.vue'
    function clearFn() {
        return {
            product_id: void 0,
            time_start: void 0,
            time_end: void 0,
            enterprise_id: void 0,
            status: void 0,
            username: void 0,
            length: 15, // 每页大小
            start: 1, // 当前页数
        }
    }

    export default{
        data () {
            return {
                loadingDrug: false,
                loadingData: false,
                total: 0,
                data: [],
                drugList: [{name: '全部'}],
                selectStatus: [{name: '全部'}, {name: '待确认', id: 0}, {name: '待支付', id: 1}, {
                    name: '已完成',
                    id: 2
                }, {name: '已关闭', id: 3}],
                fetchParam: clearFn()
            }
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.fetchParam = clearFn()
            },
            fetchData () {
                this.loadingData = true

                return salesService.getHistory(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            handleCurrentChange (val) {
                this.fetchParam.start = val
                this.fetchData()
            },
            // 查看凭据
            showDetail (index) {
                this.$alert(this.data[index].receipts, '查看依据', {
                    confirmButtonText: '确定',
                    closeOnClickModal: true
                })
            },
            // 处理药品下拉框点击后的数据处理
            handleDruglistchange () {
                if (this.drugList.length > 1)
                    return

                this.loadingDrug = true
                setTimeout(() => {
                    salesService.getProductList({length: 100}).then(ret => {
                        this.drugList.push(...ret.data)
                        this.loadingDrug = false
                    })
                }, 1500)
            }
        },
        components: {
            IndustrySelect, DateRange
        }
    }

</script>
