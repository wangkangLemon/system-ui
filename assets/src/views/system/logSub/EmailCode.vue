<!--日志-邮件验证码-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .system-manage {
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
    <article class="system-manage">
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>邮件</i>
                    <el-input @change="getData" v-model="search.mail"></el-input>
                </section>
                <section>
                    <i>发送IP</i>
                    <el-input @change="getData" v-model="search.ip"></el-input>
                </section>
                <DateRange title="发送时间" :start="search.time_start" :end="search.time_end"
                           v-on:changeStart="val=> search.time_start=val "
                           v-on:changeEnd="val=> search.time_end=val "
                           :change="getData"></DateRange>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="listData">
                <el-table-column
                        prop="email"
                        label="邮件"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="code"
                        label="验证码"
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="company"
                        min-width="200"
                        label="连锁">
                </el-table-column>
                <el-table-column
                        prop="department"
                        label="门店"
                        min-width="200">
                </el-table-column>
                <el-table-column
                        width="100"
                        prop="send_ip_name"
                        label="发送IP">
                </el-table-column>
                <el-table-column
                        prop="send_time_name"
                        label="发送时间"
                        width="180">
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
    import logService from '../../../services/logService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            DateRange,
        },
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 15,
                listData: [],
                total: 0,
                search: {
                    mail: '',
                    ip: '',
                    time_start: '',
                    time_end: '',
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
                    email: this.search.mail,
                    ip: this.search.ip,
                    time_start: this.search.time_start,
                    time_end: this.search.time_end,
                }
                return logService.getMailCodeList(params).then((ret) => {
                    this.listData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>
