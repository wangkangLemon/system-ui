<!--审计-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
    @import "../../utils/mixins/showDetail";
    .company-user-list {
        .show-detail {
            .info {
                p.select {
                    span.value {
                        .note {
                            width: 100%;
                        }
                    }
                }
            }
        }
        .status {
            padding: 2px 5px;
            background: #00acac;
            border-radius: 5px;
            color: #fff;
        }
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
    <article class="company-user-list">
        <!--详情-->
        <el-dialog class="show-detail" :title="show.title" v-model="show.showDetail">
            <div class="info" v-if="show.detail">
                <p><i class="title">药店地址：</i><span class="value">{{show.detail.address}}</span></p>
                <p><i class="title">门店数量：</i><span class="value">{{show.detail.department_range}}</span></p>
                <p><i class="title">店员数量：</i><span class="value">{{show.detail.user_range}}</span></p>
                <p><i class="title">运营联系人：</i><span class="value">{{show.detail.contact}}</span></p>
                <p><i class="title">联系人电话：</i><span class="value">{{show.detail.phone}}</span></p>
                <p><i class="title">联系人邮箱：</i><span class="value">{{show.detail.email}}</span></p>
                <p>
                    <i class="title">营业执照：</i><span class="value">
                    <img :src="show.detail.business_license | fillImgPath" alt="" @click="screenImg(show.detail.business_license)"></span></p>
                <p><i class="title">经营许可证：</i><span class="value"><img :src="show.detail.business_permit | fillImgPath" alt="" @click="screenImg(show.detail.business_permit)"></span></p>
                <p><i class="title">GSP/GSM认证：</i><span class="value"><img :src="show.detail.gsp | fillImgPath" alt="" @click="screenImg(show.detail.gsp)"></span></p>
                <p><i class="title">负责人身份证：</i><span class="value"><img :src="show.detail.id_card | fillImgPath" alt="" @click="screenImg(show.detail.id_card)"></span></p>
                <p class="select">
                    <i class="title">审核结果：</i>
                    <span class="value">
                        <el-select v-model="form.status">
                        <el-option label="待审核" :value="1"></el-option>
                        <el-option label="审核通过" :value="2"></el-option>
                        <el-option label="审核失败" :value="3"></el-option>
                    </el-select>
                    </span>
                </p>
                <p class="select">
                    <i class="title">备注：</i>
                    <span class="value">
                        <el-input class="note" type="textarea" v-model="form.note" :rows="6"></el-input>
                    </span>
                </p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">提 交</el-button>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <section class="search">
                <section>
                    <i>审核结果</i>
                    <el-select v-model="searchParams.result" @change="getData">
                        <el-option label="待审核" :value="1"></el-option>
                        <el-option label="审核通过" :value="2"></el-option>
                        <el-option label="审核失败" :value="3"></el-option>
                    </el-select>
                </section>
                <DateRange title="日期查找" :start="searchParams.createTime" :end="searchParams.endTime"
                           v-on:changeStart="val=> searchParams.createTime=val"
                           v-on:changeEnd="val=> searchParams.endTime"
                           :change="getData">
                </DateRange>
                <section>
                    <i>关键字</i>
                    <el-input @change="getData" v-model="searchParams.keyword" auto-complete="off"></el-input>
                </section>
            </section>
            <el-table
                    v-loading="loading"
                    border
                    :data="auditData"
                    stripe
                    style="width: 100%">
                <el-table-column
                        prop="name"
                        label="企业名称">
                </el-table-column>
                <el-table-column
                        prop="address"
                        label="企业地址">
                </el-table-column>
                <el-table-column
                        prop="contact"
                        label="联系人">
                </el-table-column>
                <el-table-column
                        prop="phone"
                        label="联系电话">
                </el-table-column>
                <el-table-column
                        prop="create_time_name"
                        label="申请时间">
                </el-table-column>
                <el-table-column
                        prop="operate"
                        label="操作">
                    <template scope="scope">
                        <router-link type="text" size="small" :to="{name: 'company-audit-show', params: {id: scope.row.id}}">
                            <el-tag type="primary" v-if="scope.row.status == 1">待审核</el-tag>
                            <el-tag type="success" v-if="scope.row.status == 2">审核通过</el-tag>
                            <el-tag type="danger" v-if="scope.row.status == 3">审核失败</el-tag>
                        </router-link>
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
        <screenImg></screenImg>
    </article>
</template>
<script>
    import companyService from '../../services/companyService'
    import DateRange from '../component/form/DateRangePicker'
    import screenImg from '../component/dialog/FullScreenImg.vue'
    import {fillImgPath} from '../../utils/filterUtils'
    export default {
        filters: {
            fillImgPath
        },
        components: {
            screenImg,
            DateRange
        },
        data () {
            return {
                show: {
                    showDetail: false,
                    detail: null,
                    title: ''
                },
                form: {
                    status: '',
                    note: ''
                },
                loading: false,
                currentPage: 1,
                pageSize: 15,
                auditData: [],
                total: 0,
                searchParams: {
                    createTime: '',
                    endTime: '',
                    keyword: '', // 关键字
                    result: '', // 审核结果
                }
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            screenImg (image) {
                screenImg.setShow(image)
            },
            checkDetail (item) {
                companyService.getAuditDetail(item.id).then((ret) => {
                    this.show.detail = ret.data
                    this.show.title = `${ret.data.name}(审核)`
                    this.form.status = ret.data.status
                    this.form.note = ret.data.note
                }).then(() => {
                    this.show.showDetail = true
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
            submit () {
                companyService.addAudit({
                    audit_id: this.show.detail.id,
                    status: this.form.status,
                    note: this.form.note
                }).then((ret) => {
                    this.show.showDetail = false
                    xmview.showTip('success', '提交成功')
                    this.getData()
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            },
            getData () {
                this.loading = true
                let params = {
                    page: this.currentPage,
                    page_size: this.pageSize,
                    keyword: this.searchParams.keyword,
                    status: this.searchParams.result,
                    time_start: this.searchParams.createTime,
                    time_end: this.searchParams.endTime
                }
                return companyService.getAuditList(params).then((ret) => {
                    this.auditData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            }
        }
    }
</script>
