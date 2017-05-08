<!--企业药我说统计-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    .speaking-company-container {
        .export {
            float: right;
            margin-top: 7px;
        }

        .el-tabs {
            display: inline-block;
        }
        .tab-container {
            @extend %content-container;
            .search {
                @extend %top-search-container;
            }
        }
    }
</style>
<template>
    <article class="speaking-company-container">
        <el-tabs v-model="search.date" @tab-click="getData">
            <el-tab-pane label="昨日" name="yesterday"></el-tab-pane>
            <el-tab-pane label="本周" name="week"></el-tab-pane>
            <el-tab-pane label="上周" name="prevweek"></el-tab-pane>
            <el-tab-pane label="本月" name="month"></el-tab-pane>
            <el-tab-pane label="上月" name="prevmonth"></el-tab-pane>
        </el-tabs>
        <el-button type="warning" class="export"><i class="iconfont icon-iconfontexcel"></i> <i>导出</i></el-button>
        <article class="tab-container">
            <section class="search">
                <section>
                    <i>标题</i>
                    <el-input v-model="search.title" @change="getData"></el-input>
                </section>
                <section>
                    <i>状态</i>
                    <el-select @change="getData" v-model="search.status">
                        <el-option label="正常" :value="1"></el-option>
                        <el-option label="下线" :value="2"></el-option>
                    </el-select>
                </section>
            </section>
            <el-table :data="tableData" border v-loading="loading">
                <el-table-column label="标题" prop="title" min-width="180"></el-table-column>
                <el-table-column label="内容" prop="content" min-width="200"></el-table-column>
                <el-table-column label="练习人数" prop="testing" width="100"></el-table-column>
                <el-table-column label="未练习人数" prop="no-testing" width="120"></el-table-column>
                <el-table-column label="满分人数" prop="no-testing" width="100"></el-table-column>
                <el-table-column label="满分率" prop="no-testing" width="100"></el-table-column>
            </el-table>
            <el-pagination class="pagin"
                           @size-change="val => {page_size = val; getData() }"
                           @current-change="val => {page = val; getData() }"
                           :current-page="page"
                           :page-size="page_size"
                           :page-sizes="[15, 30, 60, 100]"
                           layout="sizes,total, prev, pager, next"
                           :total="total">
            </el-pagination>
        </article>
    </article>
</template>
<script>
    export default {
        data () {
            return {
                loading: false,
                search: {
                    date: 'yesterday',
                    title: '',
                    status: ''
                },
                tableData: [],
                total: 0,
                page_size: 15,
                page: 1
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            getData () {
                console.log(1)
            }
        }
    }
</script>
