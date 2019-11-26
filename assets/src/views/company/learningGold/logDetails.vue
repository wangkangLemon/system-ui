<!--企业列表-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/showDetail";

    .company-index {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
        .addForm {
            .tip {
                text-align: center;
                border-top: 1px solid #ddd;
                color: #ff0000;
                line-height: 50px;
            }
        }
    }
</style>
<template>
    <article class="company-index">
        <section class="search">
             <section>
                <i>状态</i>
                <el-select @change="getData" v-model="fetchParam.taxTypeSelect" placeholder="未选择">
                    <el-option
                            v-for="item in taxType"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id">
                    </el-option>
                </el-select>
            </section>
        </section>
        <el-table
                v-loading="loading"
                border
                :data="companyData"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="员工姓名" width="150">
            </el-table-column>
            <el-table-column
                    prop="department_name"
                    label="所属部门"
                    min-width="180">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="job"
                    label="职位">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="staff_id"
                    label="工号">
            </el-table-column>
            <el-table-column
                    width="180"
                    label="缴纳状态">
                     <template slot-scope="scope">
                        <span v-if="scope.row.buy==0">未缴纳</span>
                        <span v-else-if="scope.row.buy==1">已缴纳</span>
                     </template>
            </el-table-column>
            <!-- <el-table-column
                    prop="operate"
                    label="操作"
                    width="200"
                    fixed="right"
                    align="center">
                <template scope="scope">
                    <el-button type="text" size="small" @click="adminPage(scope.$index, scope.row)">
                        发送系统消息
                    </el-button>
                </template>
            </el-table-column> -->
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[15, 30, 60, 100]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
    </article>
</template>
<script>
    import companyGold from '../../../services/companyGold'
    function clearFn() {
        return {
            typeSelect: '',
            taxTypeSelect:'',
            provinceSelect: '',
            name: ''
        }
    }
    export default {
        data () {
            return {
                 taxType: [ // 类型
                    {
                        name: '全部',
                        id: 0
                    },
                    {
                        name: '已缴纳',
                        id: 1
                    },
                    {
                        name:'未缴纳',
                        id:2
                    }
                ],
                editloading: false,
                details: null,
                showDetail: false, // 显示详情弹窗 
                loading: false,
                currentPage: 1,
                pageSize: 15,
                companyData: [],
                fetchParam: {
                    createTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    endTime: this.$route.query.yesterday == undefined ? '' : this.$route.query.yesterday,
                    typeSelect: '',
                    provinceSelect: '',
                    citySelect: '',
                    areaSelect: '', 
                    name: ''
                },
                total: 0
            }
        },
        activated () {
            this.fetchParam.taxTypeSelect=Number(this.$route.query.ispay)
            console.log(this.fetchParam.taxTypeSelect)
             xmview.setContentTile(`学习金-${this.$route.query.name}`)
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam () {
                this.currentPage = 1
                this.fetchParam = clearFn()
            },
            // 显示详情
            showFn (index, row) {
                companyService.getCompanyInfo(row.id).then((ret) => {
                    this.details = ret.data
                    this.showDetail = true
                })
            },
            adminPage (index, item) {
                this.$router.push({name: 'company-admin', params: {company_id: item.id || 1}, query: {category: item.category}})
            },
            // 添加
            add () {
                this.$router.push({name: 'company-learningGold-companyRoster'})
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                this.loading = true
                return companyGold.getCompanyUserList({
                    page_size: this.pageSize,
                    page: this.currentPage,
                    keyword: this.fetchParam.name,
                    company_id:this.$route.query.company_id,
                   _ispay:this.fetchParam.taxTypeSelect
                }).then((ret) => {
                    this.companyData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
