<!--内测应用管理-->
<!--文档管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";

    #sys-alpha-container {
        @extend %content-container;

        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <article id="sys-alpha-container">
        <article class="search">
            <section>
                <i>内测应用</i>
                <el-select :clearable="true" v-model="fetchParam.appid" placeholder="请选择" @change="fetchData">
                    <el-option label="流利说" value="10"></el-option>
                </el-select>
            </section>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    min-width="250"
                    prop="company_name"
                    label="连锁">
            </el-table-column>
            <el-table-column
                    width="240"
                    prop="department_name"
                    label="门店">
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="app_name"
                    label="内测应用">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="user_name"
                    label="申请人">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="user_mobile"
                    label="联系方式">
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="操作">
                <template scope="scope">
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>


        <el-pagination class="pagin"
                       @size-change="val => fetchParam.page_size = val "
                       @current-change="val => fetchParam.page = val"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>
    </article>
</template>

<script>
    import adminService from '../../services/adminService'
    export default{
        data () {
            return {
                loadingData: false,
                total: 0,
                data: [],
                fetchParam: {
                    page: 1,
                    page_size: 15,
                    appid: void 0
                }
            }
        },
        watch: {
            'fetchParam.page_size'() {
                this.fetchData()
            },
            'fetchParam.page'() {
                this.fetchData()
            }
        },
        created () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loadingData = true
                return adminService.getAlphaApplyList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            del (index, row) {
                xmview.showDialog(`你要执行删除操作且操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    adminService.delAlphaApply(row.id).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.data.splice(index, 1)
                    }, () => {
                    }).then(() => {
                        this.loadingData = false
                    })
                })
            },
        },
        components: {}
    }
</script>
