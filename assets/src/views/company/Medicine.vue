<!--拿药练习-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    .company-manager {
        @extend %content-container;
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="company-manager">
        <el-table
                v-loading="loading"
                border
                :data="medicineData"
                stripe
                style="width: 100%">
            <el-table-column
                    prop="name"
                    label="连锁">
            </el-table-column>
            <el-table-column
                    prop="contact"
                    label="管理员"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="电话">
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
    import companyService from '../../services/companyService'
    export default {
        data () {
            return {
                loading: false,
                currentPage: 1,
                pageSize: 15,
                medicineData: [],
                total: 0,
            }
        },
        activated () {
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
                    page_size: this.pageSize
                }
                return companyService.getMedicineList(params).then((ret) => {
                    this.medicineData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
        }
    }
</script>
