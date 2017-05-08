<!--公告-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/topSearch";
    .company-user-list {
        .show-detail {
            .info {
                h2 {
                    text-align: center;
                    margin-bottom: 10px;
                }
                > div {
                    text-indent: 2em;
                    line-height: 28px;
                }
            }
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
    <article class="company-user-list">
        <!--详情-->
        <el-dialog size="tiny" title="查看公告" class="show-detail" v-model="showDetail">
            <div class="info">
                <h2>{{currentItem.title}}</h2>
                <div>
                    {{currentItem.content}}
                </div>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>连锁</i>
                    <IndustryCompanySelect :type="2" v-model="searchParams.companySelect"
                                           v-on:change="val=>searchParams.companySelect=val"
                                           :change="getData">
                    </IndustryCompanySelect>
                </section>
                <section>
                    <i>类型</i>
                    <el-select clearable v-model="searchParams.type" @change="getData">
                        <el-option label="企业公告" value="company"></el-option>
                        <el-option label="分店公告" value="department"></el-option>
                    </el-select>
                </section>
                <section>
                    <i>标题</i>
                    <el-input @change="getData" v-model="searchParams.title" auto-complete="off"></el-input>
                </section>
                <section>
                    <i>状态</i>
                    <el-select clearable v-model="searchParams.status" @change="getData">
                        <el-option label="正常" value="0"></el-option>
                        <el-option label="草稿" value="1"></el-option>
                        <el-option label="撤销" value="2"></el-option>
                    </el-select>
                </section>
                <el-button type="primary" @click="clearFn">清空</el-button>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="announceData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="company_name"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="type"
                        width="100"
                        label="类型">
                    <template scope="scope">
                        <el-tag type="primary" v-if="scope.row.type == 'company'">企业公告</el-tag>
                        <el-tag type="success" v-if="scope.row.type == 'department'">分店公告</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="title"
                        label="标题">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        width="180"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        prop="status"
                        width="100"
                        label="状态">
                    <template scope="scope">
                        <el-tag type="gray">{{statusArr[scope.row.status]}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operate"
                        width="100"
                        label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showFn(scope.row)">
                            查看公告
                        </el-button>
                    </template>
                </el-table-column>
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
        </el-card>
    </article>
</template>
<script>
    import companyService from '../../services/companyService'
    import IndustryCompanySelect from '../component/select/IndustryCompany'
    export default {
        components: {
            IndustryCompanySelect
        },
        data () {
            return {
                currentItem: {
                    title: '',
                    content: ''
                },
                statusArr: ['正常', '草稿', '撤销'],
                showDetail: false,
                loading: false,
                currentPage: 1,
                pageSize: 15,
                announceData: [],
                total: 0,
                searchParams: clearSearch()
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            clearFn () {
                this.searchParams = clearSearch()
                this.getData()
            },
            showFn (row) {
                this.showDetail = true
                setTimeout(() => {
                    this.currentItem.title = row.title
                    this.currentItem.content = row.content
                }, 10)
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
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    company_id: this.searchParams.companySelect,
                    keyword: this.searchParams.title,
                    status: this.searchParams.status,
                    type: this.searchParams.type,
                }
                return companyService.getAnnounceList(params).then((ret) => {
                    this.announceData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
    function clearSearch() {
        return {
            companySelect: '',
            title: '',
            type: '',
            status: '',
        }
    }
</script>
