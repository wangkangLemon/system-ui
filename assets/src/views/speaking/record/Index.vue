<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #speaking-record-index {
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
    <main id="speaking-record-index">
        <main class="search">
            <section>
                <i>标题</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>类型</i>
                <el-select v-model="fetchParam.speaking_company_id" placeholder="全部" @change="fetchData"
                           :clearable="true">
                    <el-option label="系统药我说" value="0"></el-option>
                    <el-option label="企业药我说" value="1"></el-option>
                </el-select>
            </section>
            <section>
                <i>连锁</i>
                <CompanySelect v-model="fetchParam.company_id" :change="fetchData">
                </CompanySelect>
            </section>
            <section>
                <i>门店</i>
                <DepSelect v-model="fetchParam.department_id" :change="fetchData"></DepSelect>
            </section>
            <DateRange title="练习时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       v-on:changeStart="val=> fetchParam.time_start=val"
                       v-on:changeEnd="val=> fetchParam.time_end=val"
                       :change="fetchData">
            </DateRange>
        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" border>
            <el-table-column prop="speaking_title" label="标题" width="180"></el-table-column>
            <el-table-column prop="company_name" label="连锁" width="200"></el-table-column>
            <el-table-column prop="department_name" label="门店" width="150"></el-table-column>
            <el-table-column prop="user_name" label="店员" width="120"></el-table-column>
            <el-table-column prop="score" label="分数" width="100"></el-table-column>
            <el-table-column prop="speaking_content" label="标准录音"></el-table-column>
            <el-table-column label="用户录音">
                <template scope="scope">
                    <VueAmrPlayer :url="scope.row.recording"></VueAmrPlayer>
                    <i>{{scope.row.recording_text}}</i>
                </template>
            </el-table-column>
            <el-table-column prop="create_time_name" label="练习时间" width="180"></el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>

    </main>
</template>

<script>
    import speakingRecordService from '../../../services/speaking/recordService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import CompanySelect from '../../component/select/IndustryCompany.vue'
    import DepSelect from '../../component/select/Department.vue'
    import VueAmrPlayer from '../../component/table/AmrPlayer.vue'
    function getFetchParam() {
        return {
            company_id: void 0,
            department_id: void 0,
            user_id: void 0,
            speaking_company_id: void -1,
            keyword: void '',
            page: 1,
            page_size: 15,
            time_start: void '',
            time_end: void ''
        }
    }
    export default {
        components: {
            DateRange,
            CompanySelect,
            DepSelect,
            VueAmrPlayer
        },
        data() {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                dialogVisible: false,
                fetchParam: getFetchParam(),
            }
        },
        activated () {
//            if (this.$route.params['reload']) {
//            this.fetchData()
//            }
            this.fetchData()
            xmview.setContentLoading(false)
        },
        methods: {
            initFetchParam() {
                this.fetchParam = getFetchParam()
            },
            handleCurrentChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            fetchData (val) {
                this.loadingData = true
                return speakingRecordService.search(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            }
        }
    }
</script>
