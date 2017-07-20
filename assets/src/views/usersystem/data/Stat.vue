<!--积分统计-->
<style lang="scss">
@import "../../../utils/mixins/topSearch";
@import "../../../utils/mixins/common";
    #usersystem-data-stat-container{
        @extend %content-container;
        .export{
            @extend %right-top-btnContainer
        }
         .search {
            @extend %top-search-container;
        }

        .block {
            margin-top: 10px;
            text-align: right;
        }
    }
</style>
<template>
<article id="usersystem-data-stat-container">
   <el-button type="warning" icon='document' class="export" @click="exportClick()">导出</el-button>

   <article class="search">
    <section>
        <i>姓名</i>
        <el-input v-model="fetchParam.user_name" @keyup.enter.native="getData"></el-input>
    </section>
    <section>
        <i>手机</i>
        <el-input  v-model="fetchParam.mobile" @keyup.enter.native="getData"></el-input>
    </section>
    <section>
        <i>企业</i>
        <IndustryCompanySelect :type="2"
                v-model="fetchParam.company_id"
                v-on:change="val=>fetchParam.company_id=val"
                :change="getData">
        </IndustryCompanySelect>
    </section>

   </article>
    <el-table border  v-loading="loading" :data="dataList">
     <el-table-column
            prop="user_name"
            width="200"
            label="姓名">
    </el-table-column>
     <el-table-column
            prop="mobile"
            width="200"
            label="手机号">
    </el-table-column>
    <el-table-column 
            prop="company_name"
            min-width="200"
            label="企业">
    </el-table-column>
     <el-table-column 
            prop="department_name"
            min-width="200"
            label="门店">
    </el-table-column>
    <el-table-column 
            prop="level"
            min-width="100"
            label="用户等级">
            <template scope="scope">
                <span>Lv{{scope.row.level}}</span>
            </template>
    </el-table-column>
     <el-table-column 
            prop="growth"
            min-width="100"
            label="成长值">
    </el-table-column>
     <el-table-column 
            prop="credit"
            min-width="120"
            label="现有积分">
    </el-table-column>
     <el-table-column 
            prop="left_credit"
            min-width="100"
            label="消费积分">
    </el-table-column>
     <el-table-column 
            prop="total_credit"
            min-width="100"
            label="累计获得积分">
    </el-table-column>
    <el-table-column 
            prop="product_count"
            min-width="100"
            label="物品获取">
    </el-table-column>
    </el-table>
     
    <section class="block">
            <el-pagination
                    @size-change="val=> {fetchParam.page_size=val; getData()}"
                    @current-change="val=> {fetchParam.page=val; getData()}"
                    :current-page="fetchParam.page"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
    </section>
</article>
</template>


<script>
import integralService from '../../../services/usersystem/statService'
import IndustryCompanySelect from '../../component/select/IndustryCompany'
export default {
    components: {
        IndustryCompanySelect
    },
    data () {
        return {
            dataList: [],
            loading: false,
            fetchParam: {
                page: 0,
                page_size: 15,
                user_name: '',
                mobile: '',
                company_id: ''
            },
            total: 0
        }
    },
    activated () {
        this.getData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {

        getData() {
            this.loading = true
            return integralService.getAll(this.fetchParam).then((ret) => {
                this.loading = false
                this.dataList = ret.historys
                this.total = ret.total
            })
        },
        exportClick() {
            integralService.exportStat()
        }
    }
}
</script>
