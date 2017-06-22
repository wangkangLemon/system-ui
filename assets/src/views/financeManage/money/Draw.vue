<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    .financeManage-money-draw {
        @extend %content-container;
        .search {
            @extend %top-search-container;
        }
        .header-button {
            @extend %right-top-btnContainer;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="financeManage-money-draw">
        <!--详情-->
        <el-dialog size="tiny" class="show-detail" title="提供凭据" v-model="showDetail">
            <div v-if="currentData != null">{{currentData.receipts || '未提供凭据'}}</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="showDetail = false">关 闭</el-button>
            </div>
        </el-dialog>
        <!--结束或确认提取-->
        <el-dialog v-model="showDrawInfo" :title="title" size="tiny" v-loading="dialogLoading">
            <el-form class="addForm" :model="submitParam" :rules="rules" ref="form" label-width="100px">
                <el-form-item  label="注意">
                    请通过线下渠道给该提现请求打款, 完成后在此输入打款得到的凭据.
                </el-form-item>
                <el-form-item  prop="receipts" label="提现凭证">
                    <el-input type="textarea" :rows="4" v-model="submitParam.receipts" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit()">完成</el-button>
            </div>
        </el-dialog>
        <div class="header-button">
            <el-button type="primary" @click="exportData"><i class="iconfont icon-iconfontexcel"></i>导出Excel</el-button>
        </div>
        <section class="search">
            <section>
                <i>用户</i>
                <UserList v-model="fetchParam.userSelect"
                          v-on:change="val=>fetchParam.userSelect=val"
                          :change="getData">
                </UserList>
            </section>
            <section>
                <label>提现状态</label>
                <el-select @change="getData" clearable v-model="fetchParam.drawStatusSelect" placeholder="未选择">
                    <el-option
                            v-for="(item, index) in drawStatus"
                            :label="item.name"
                            :value="item.value"
                            :key="item.id">
                    </el-option>
                </el-select>
            </section>
            <DateRange title="申请时间" :start="fetchParam.createTime" :end="fetchParam.endTime"
                       v-on:changeStart="val=> fetchParam.createTime=val"
                       v-on:changeEnd="val=> fetchParam.endTime=val"
                       :change="getData">
            </DateRange>
        </section>
        <el-table
                v-loading="loading"
                border
                :data="drawData">
            <el-table-column
                    prop="draw_no"
                    min-width="300"
                    label="编号">
            </el-table-column>
            <el-table-column
                    prop="money"
                    label="金额"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="user_name"
                    width="100"
                    label="姓名">
            </el-table-column>
            <el-table-column
                    prop="company_name"
                    width="100"
                    label="连锁">
            </el-table-column>
            <el-table-column
                    prop="department_name"
                    width="100"
                    label="门店">
            </el-table-column>
            <el-table-column
                    prop="bank_name"
                    width="120"
                    label="银行">
            </el-table-column>
            <el-table-column
                    prop="card"
                    width="200"
                    label="卡号">
            </el-table-column>
            <el-table-column
                    prop="status"
                    width="100"
                    label="状态">
                <template scope="scope">
                    <el-tag type="success" v-if="scope.row.status">{{scope.row.status}}</el-tag>
                    <el-tag type="gray" v-else>未知</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="admin_name"
                    width="100"
                    label="管理员">
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    width="180"
                    label="申请时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="operate"
                    label="操作">
                <template scope="scope">
                    <el-button type="text" size="small" v-if="scope.row.status == '已完成' || scope.row.status == '已关闭'" @click="showFn(scope.row)">
                        凭据
                    </el-button>
                    <el-button type="text" size="small" v-if="scope.row.status == '待提现'" @click="confirmFn(scope.row, 'confirm')">
                        提现
                    </el-button>
                    <el-button type="text" size="small" v-if="scope.row.status == '待提现'" @click="confirmFn(scope.row, 'cancle')">
                        结束
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
    </article>
</template>
<script>
    import {drawList, exportDraw, confirmDraw, cancleDraw} from '../../../services/fianace/money'
    import UserList from '../../component/select/User'
    import DateRange from '../../component/form/DateRangePicker.vue'
    export default {
        components: {
            UserList,
            DateRange
        },
        data () {
            return {
                fetchParam: {
                    drawStatusSelect: '',
                    userSelect: '',
                    createTime: '',
                    endTime: '',
                },
                submitParam: {
                    id: 0,
                    receipts: '',
                },
                flag: '',
                title: '',
                currentData: null,
                showDetail: false,
                showDrawInfo: false,
                loading: false,
                dialogLoading: false,
                currentPage: 1,
                pageSize: 10,
                drawData: [],
                drawStatus: [
                    {
                        id: 1,
                        name: '全部',
                        value: ''
                    },
                    {
                        id: 2,
                        name: '待提现',
                        value: 'pending'
                    },
                    {
                        id: 3,
                        name: '已完成',
                        value: 'complete'
                    },
                    {
                        id: 4,
                        name: '已关闭',
                        value: 'close'
                    }
                ],
                rules: {
                    receipts: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
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
            initFetchParam () {
                this.currentPage = 1
            },
            showFn (row) {
                this.showDetail = true
                this.currentData = row
            },
            confirmFn (row, type) {
                this.showDrawInfo = true
                this.flag = type
                this.title = '确认提现 ' + row.bank_name + '(' + row.card + ') $' + row.money_name
                this.submitParam.id = row.id
                this.submitParam.receipts = ''
            },
            submit () {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.dialogLoading = true
                        let p
                        if (this.flag == 'confirm') {
                            p = confirmDraw(this.submitParam)
                        } else {
                            p = cancleDraw(this.submitParam)
                        }

                        p.then(() => {
                            this.dialogLoading = false
                            this.showDrawInfo = false
                            this.getData()
                        })
                    } else {
                        return false
                    }
                })
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getData()
            },
            getData () { // 获取列表数据
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    status: this.fetchParam.drawStatusSelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    user_id: this.fetchParam.userSelect
                }
                return drawList(params).then((ret) => {
                    let status = {pending: '待提现', complete: '已完成', close: '已关闭'}
                    this.drawData = ret.data.sort((x, y) => {
                        return y.id - x.id
                    })
                    ret.data.forEach((item) => {
                        item.status = status[item.status]
                    })
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            exportData () {
                exportDraw({
                    status: this.fetchParam.drawStatusSelect,
                    time_start: this.fetchParam.createTime,
                    time_end: this.fetchParam.endTime,
                    user_id: this.fetchParam.userSelect
                })
            }
        }
    }
</script>
