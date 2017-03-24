<!--日志-->
<style lang='scss' rel='stylesheet/scss' scoped>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/table";
</style>
<template>
    <article class="main-container">
        <section class="search">
            <div>
                <label>管理员</label>
                <el-select v-model="managerSelect" placeholder="请选择">
                    <el-option
                            v-for="(item, index) in manager"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id">
                    </el-option>
                </el-select>
            </div>
            <div><label>操作IP</label><el-input v-model="ip"></el-input></div>
            <div>
                <label>操作时间</label>
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
                    prop="manager"
                    label="管理员"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作">
            </el-table-column>
            <el-table-column
                    prop="targetType"
                    label="目标类型"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="target"
                    label="目标"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="ip"
                    label="操作IP"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="operateTime"
                    label="操作时间"
                    width="180">
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
                managerSelect: '',
                ip: '',
                data: [
                    {
                        id: 1,
                        operateTime: '2016-05-02',
                        manager: '王小虎1',
                        operate: '上海市普陀区金沙江路 1518 弄',
                        targetType: '1',
                        target: '2',
                        ip: '10.1.1.1'
                    }
                ],
                manager: [
                    {
                        id: 1,
                        name: '选项1'
                    }
                ]
            }
        }
    }
</script>
