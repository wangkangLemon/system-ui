<!--导出-->
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
                <label>状态</label>
                <el-select v-model="statusSelect">
                    <el-option
                            v-for="(item, index) in exportStatus"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id">
                    </el-option>
                </el-select>
            </div>
            <div>
                <label>时间</label>
                <div class="time-container">
                    <el-date-picker
                            v-model="createTime"
                            type="date"
                            placeholder="开始时间">
                    </el-date-picker>
                    <el-date-picker
                            v-model="endTime"
                            type="date"
                            placeholder="结束时间">
                    </el-date-picker>
                </div>
            </div>
        </section>
        <el-table
                :data="data" border>
            <el-table-column
                    prop="name"
                    label="名称">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="createTime"
                    label="创建时间"
                    width="180">
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="180">
                <template scope="scope">
                    <el-button type="text" size="small">
                        下载
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <section class="block">
            <el-pagination
                    :current-page="currentPage"
                    :page-sizes="[100, 200, 300, 400]"
                    layout="total, sizes, ->, prev, pager, next, jumper"
                    :total="400">
            </el-pagination>
        </section>
    </article>
</template>
<script lang="babel">
    export default {
        data () {
            return {
                createTime: '',
                endTime: '',
                currentPage: 1,
                statusSelect: 0,
                ip: '',
                data: [
                    {
                        id: 1,
                        name: '上海市普陀区金沙江路 1518 弄',
                        status: '10.1.1.1',
                        createTime: '21-22-2'
                    }
                ],
                exportStatus: [
                    {
                        id: 0,
                        name: '未选择'
                    },
                    {
                        id: 1,
                        name: '已完成'
                    },
                    {
                        id: 2,
                        name: '待处理'
                    },
                    {
                        id: 3,
                        name: '进行中'
                    },
                    {
                        id: 4,
                        name: '失败'
                    }
                ]
            }
        },
        created () {
            xmview.setContentLoading(false)
        }
    }
</script>
