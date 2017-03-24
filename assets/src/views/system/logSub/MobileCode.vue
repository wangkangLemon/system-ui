<!--日志-->
<style lang='scss' rel='stylesheet/scss' scoped>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/table";
</style>
<template>
    <article class="main-container">
        <section class="search">
            <div><label>手机号</label>
                <el-input v-model="mobile"></el-input>
            </div>
            <div>
                <label>是否成功</label>
                <el-select v-model="statusSelect" placeholder="请选择">
                    <el-option
                            v-for="(item, index) in status"
                            :label="item.name"
                            :value="item.value"
                            :key="item.id">
                    </el-option>
                </el-select>
            </div>
            <div><label>发送IP</label>
                <el-input v-model="ip"></el-input>
            </div>
            <div>
                <label>发送时间</label>
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
                    prop="mobile"
                    label="手机号"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="验证码">
            </el-table-column>
            <el-table-column
                    prop="message"
                    label="短信编号">
            </el-table-column>
            <el-table-column
                    prop="chain"
                    label="连锁"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="department"
                    label="门店"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="ip"
                    label="发送IP"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="sendTime"
                    label="发送时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
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
                statusSelect: '',
                mobile: '',
                ip: '',
                data: [
                    {
                        id: 1,
                        mobile: '2016-05-02',
                        code: '王小虎1',
                        message: '上海市普陀区金沙江路 1518 弄',
                        department: '上海市普陀区金沙江路 1518 弄',
                        chain: '方式',
                        ip: '10.1.1.1',
                        sendTime: '21-22-2',
                        status: '失败'
                    }
                ],
                status: [
                    {
                        id: 1,
                        name: '成功',
                        value: 1
                    },
                    {
                        id: 2,
                        name: '失败',
                        value: 0
                    }
                ]
            }
        }
    }
</script>
