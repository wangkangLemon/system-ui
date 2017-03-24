<!--设置-->
<style lang='scss' rel='stylesheet/scss' scoped>
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/table";
    .main-container {
        padding: 20px;
    }
</style>
<template>
    <article class="main-container">
        <section class="search">
            <div>
                <label>项目</label>
                <el-input class="name" v-model="name" placeholder=""></el-input>
            </div>
        </section>
        <el-table border :data="tableData">
            <el-table-column
                    prop="app"
                    label="app"
                    width="100%">
            </el-table-column>
            <el-table-column
                    prop="key"
                    label="key"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="value"
                    label="value">
            </el-table-column>
            <el-table-column
                    prop="desc"
                    label="desc"
                    width="200">
            </el-table-column>
        </el-table>
        <section class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[1, 2]"
                    layout="total, sizes, ->, prev, pager, next, jumper"
                    :total="4">
            </el-pagination>
        </section>
    </article>
</template>
<script lang="babel">
    export default {
        data () {
            return {
                name: '',
                currentPage: 1,
                tableData: [
                    {
                        id: 1,
                        app: '销售',
                        key: '13920307216',
                        value: '13@vod.com',
                        desc: '2133',
                    },
                    {
                        id: 2,
                        app: '销售',
                        key: '13920307216',
                        value: '13@vod.com',
                        desc: '2133',
                    },
                    {
                        id: 3,
                        app: '销售',
                        key: '13920307216',
                        value: '13@vod.com',
                        desc: '2133',
                    },
                    {
                        id: 4,
                        app: '销售',
                        key: '13920307216',
                        value: '13@vod.com',
                        desc: '2133',
                    },
                ]
            }
        },
        methods: {
            handleCurrentChange () {
            },
            handleSizeChange () {
            }
        }
    }
</script>
