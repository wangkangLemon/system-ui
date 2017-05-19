<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #usersystem-grow-behavior {
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
    <main id="usersystem-grow-behavior">
        <main class="search">
            <section>
                <i>用户行为</i>
                <vInput :enter="fetchData" v-model="fetchParam.name"></vInput>
            </section>
        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" border>
            <el-table-column prop="name" label="用户行为"></el-table-column>
            <el-table-column prop="growth" label="完成一次成长值"></el-table-column>
            <el-table-column prop="limit" label="最多获取成长值"></el-table-column>
            <el-table-column prop="description" label="说明"></el-table-column>
            <el-table-column prop="update_time_name" label="更新时间"></el-table-column>
            <el-table-column
                    width="207"
                    label="操作">
                <template scope="scope">
                    <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
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
    import growService from '../../../services/usersystem/growService'
    import vInput from '../../component/form/Input.vue'
    export default {
        components: {
            vInput
        },
        data() {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                fetchParam: {
                    name: void '',
                    page: 1,
                    page_size: 15
                }
            }
        },
        activated () {
            this.fetchData()
        },
        methods: {
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
                return growService.search(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            },
             // 编辑
            edit (index, row) {
            },
        }
    }
</script>
