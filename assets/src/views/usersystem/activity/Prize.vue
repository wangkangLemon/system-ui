<!--领取积分详情-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    #activity-prize-container {
        @extend %content-container;
        .top-btn {
             @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }

        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
<article id="activity-prize-container">
    <section class="top-btn">
        <el-button icon="document" type="warning">导出</el-button>
    </section>
    <article class="search">
      <section>
        <i>姓名</i>
        <el-input v-model="fetchParam.user_name" @keyup.enter.native="getData"></el-input>
    </section>
      <section>
        <i>手机号</i>
        <el-input v-model="fetchParam.mobile" @keyup.enter.native="getData"></el-input>
    </section>
      <section>
        <i>企业</i>
          <IndustryCompanySelect :type="2"
                v-model="fetchParam.company_id"
                v-on:change="val=>fetchParam.company_id=val"
                :change="getData">
        </IndustryCompanySelect>
    </section>

    <DateRange title="领取时间" :start="fetchParam.start_time" :end="fetchParam.end_time"
                       v-on:changeStart="val=>fetchParam.start_time=val"
                       v-on:changeEnd="val=>fetchParam.end_time=val"
                       :change="getData">
    </DateRange>

    </article>

   <el-table border v-loading="loading" :data="dataList">
           
            <el-table-column
                    prop="user_name"
                    min-width="180"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机号"
                    min-width="180">
            </el-table-column>
            <el-table-column
                    prop="company_name"
                    label="所属企业"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="department_name"
                    label="门店"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="领取时间"
                    min-width="150">
            </el-table-column>
         
            </el-table>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="fetchParam.page"
                    :page-sizes="[15, 30, 60, 100]"
                    :page-size="fetchParam.page_size"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
</article>
</template>


<script>
import prizeService from '../../../services/usersystem/prizeService'
import IndustryCompanySelect from '../../component/select/IndustryCompany'
import DateRange from '../../component/form/DateRangePicker.vue'
function clearFn() {
    return {
        user_name: void 0,
        mobile: void 0,
        page: 0,
        page_size: 15,
        company_id: '',
        start_time: '',
        end_time: ''
    }
}
export default {
    components: {
        IndustryCompanySelect,
        DateRange
    },
    data() {
        return {
            dataList: [],
            loading: false,
            total: 0,
            fetchParam: {
                play_type: this.$route.params.play_type, // 类型
                user_name: void 0,
                mobile: void 0,
                page: 0,
                page_size: 15,
                company_id: '',
                id: this.$route.params.id,   // 物品id
                start_time: '',
                end_time: ''
            }
        }
    },

    activated () {
        this.$route.meta.title = `领取详情-${this.$route.params.product_name}`
        console.log(this.$route.params.product_name)
        this.fetchParam.play_type = this.$route.params.play_type
        this.fetchParam.id = this.$route.params.id
        this.getData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        initFetchParam() {
            this.fetchParam = clearFn()
        },
        getData() {
            this.loading = true
            return prizeService.getAll(this.fetchParam).then((ret) => {
                this.dataList = ret.historys
                this.total = ret.total
                this.loading = false
            })
        },
        export() {
            return prizeService.export(this.fetchParam)
        },
        handleSizeChange (val) {
            this.fetchParam.page_size = val
            this.getData()
        },
        handleCurrentChange(val) {
            this.fetchParam.page = val
            this.getData()
        },
    }
}
</script>
