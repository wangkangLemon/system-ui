<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    #test-special-container {
        @extend %content-container;
        border: none;
        .manage-container {
            @extend %right-top-btnContainer;
            > * {
                color: #fff;
                border-radius: 5px;
            }
            top:-60px !important;
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
    <section id="test-special-container">
        <section class="manage-container">
            <el-button type="primary" icon="plus"
            @click="$router.push({ name:'test-special-add'})"><i>新增模板</i></el-button>
        </section>
    	<div id="special-content-container">
             <section class="search">
                <section>
                    <i>工业名称</i>
                    <IndustryCompanySelect :type="1" v-model="fetchParam.company_id"
                                           v-on:change="val=>fetchParam.company_id=val"
                                           :change="fetchData">
                    </IndustryCompanySelect>
                </section>
                <section>
                    <i>连锁名称</i>
                    <IndustryCompanySelect :type="2" v-model="fetchParam.store_id"
                                           v-on:change="val=>fetchParam.store_id=val"
                                           :change="fetchData">
                    </IndustryCompanySelect>
                </section>
                <section>
                    <i>当前状态</i>
                    <el-select v-model="fetchParam.status" placeholder="全部" @change="fetchData" :clearable="true">
                        <el-option label="执行中" value="1"></el-option>
                        <el-option label="已过期" value="2"></el-option>
                    </el-select>
                </section>
            </section>
    		<el-table class="data-table" v-loading="loadingData"
                      :data="data"
                      :fit="true"
                      @select="selectRow"
                      @select-all="selectRow"
                      border>
                <el-table-column
                        min-width="150"
                        prop="company_name"
                        label="特殊定价工业">
                </el-table-column>
                <el-table-column
                        width="150"
                        label="连锁名称"
                        prop="store_name">
                        <template slot-scope="scope">
                            <span v-if="scope.row.store_name == ''">全部连锁</span>
                            <span v-else>{{scope.row.store_name}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        width="190"
                        prop="speaking_price"
                        label="工业药我说(元/人)">
                        <template slot-scope="scope">
                            <span v-if="scope.row.speaking_price == 0"></span>
                            <span v-else>{{scope.row.speaking_price/100}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        width="150"
                        label="独立红包(元/人)"
                        prop="lucky_money_price">
                        <template slot-scope="scope">
                            <span v-if="scope.row.lucky_money_price == 0"></span>
                            <span v-else>{{scope.row.lucky_money_price/100}}</span>
                        </template>
                </el-table-column>
                <el-table-column
                        width="150"
                        label="工业课(元/人)"
                        prop="industry_course_price">
                        <template slot-scope="scope">
                            <span v-if="scope.row.industry_course_price == 0"></span>
                            <span v-else>{{scope.row.industry_course_price/100}}</span>
                        </template>
                </el-table-column>
               <el-table-column
                        width="180"
                        label="更新时间"
                        prop="created_at">
                </el-table-column>
                <el-table-column
                        width="180"
                        label="有效期限"
                        prop="deadline">
                </el-table-column>

                <el-table-column
                    width="100"
                    label="当前状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 1" type="success">执行中</el-tag>
                        <el-tag v-else-if="scope.row.status == 2" type="danger">已过期</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        fixed="right"
                        width="207"
                        label="操作">
                    <template slot-scope="scope">
                       
                        <el-button @click="$router.push({name: 'test-special-edit', params: {id: scope.row.id}})" 
                            type="text" size="small">修改
                        </el-button>

                        <el-button @click="del(scope.$index, scope.row)" 
                            type="text" size="small"> 删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-row :gutter="20" class="utils-top-15">
                <el-col :span="12" :offset="12">
                    <el-pagination
                        style="text-align: right"
                        @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                        @current-change="val=> {fetchParam.page=val; fetchData()}"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="fetchParam.page_total">
                    </el-pagination>
                </el-col>
            </el-row>

    	</div>
    </section>
</template>

<script>
    import DateRange from '../../component/form/DateRangePicker.vue'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import TestSpecialService from '../../../services/finance/specialService'

    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                fetchParam: this.newFetchParam(),
                editDialog: '新建题库'
            }
        },
        activated () {
            xmview.setContentLoading(false)
            this.fetchData()
        },
        methods: {
            initFetchParam() {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData() {
                xmview.setContentLoading(true)
                let data = Object.assign({}, this.fetchParam)
                if (data.status === '' || data.status === undefined) {
                    data.status = ''
                }
                TestSpecialService.search(data).then((ret) => {
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
                })
            },
            // 单行被选中
            selectRow(selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            del (index, row) {
                this.$confirm('您是否确定删除此模板？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return TestSpecialService.delete(row.id).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            newFetchParam () {
                return {
                    store_id: void '',
                    company_id: void '',
                    status: '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            }
        },
        components: {DateRange, IndustryCompanySelect}
    }
</script>
