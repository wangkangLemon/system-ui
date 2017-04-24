<!--系统-设置-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
    .system-set {
        .box-card {
            margin-bottom: 20px;
            .clearfix {
                text-align: right;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                .icon-iconfontexcel {
                    position: relative;
                    top: -2px;
                    margin-right: 5px;
                }
            }
            .search {
                @extend %top-search-container;
            }
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="system-set">
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>项目</i>
                    <el-input @change="getData" v-model="search.name"></el-input>
                </section>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="listData">
                <el-table-column
                        prop="app"
                        label="app"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="key"
                        label="key"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="val"
                        label="value">
                </el-table-column>
                <el-table-column
                        prop="desc"
                        label="desc">
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
<script lang="babel">
    import settingService from '../../services/settingService'
    export default {
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 15,
                listData: [],
                total: 0,
                search: {
                    name: ''
                }
            }
        },
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
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
                    keyword: this.search.name,
                }
                return settingService.getSettingList(params).then((ret) => {
                    this.listData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>
