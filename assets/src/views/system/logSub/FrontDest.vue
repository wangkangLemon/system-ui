<!--日志-->
<style lang='scss' rel='stylesheet/scss' scoped>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/table";
</style>
<template>
    <article class="main-container">
        <section class="search">
            <div>
                <label>用户</label>
                <el-select v-model="userSelect" placeholder="请选择">
                    <el-option
                            v-for="(item, index) in user"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id">
                    </el-option>
                </el-select>
            </div>
            <div>
                <label>登录方式</label>
                <el-select v-model="loginTypeSelect" placeholder="请选择">
                    <el-option
                            v-for="(item, index) in loginType"
                            :label="item.name"
                            :value="item.id"
                            :key="item.id">
                    </el-option>
                </el-select>
            </div>
            <div><label>操作IP</label>
                <el-input v-model="ip"></el-input>
            </div>
            <div>
                <label>登录时间</label>
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
                    prop="user"
                    label="用户"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="chain"
                    label="连锁">
            </el-table-column>
            <el-table-column
                    prop="department"
                    label="门店"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="loginType"
                    label="登录方式"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="ip"
                    label="登录IP"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="loginTime"
                    label="登录时间"
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
                userSelect: '',
                loginTypeSelect: '',
                ip: '',
                data: [
                    {
                        id: 1,
                        chain: '2016-05-02',
                        user: '王小虎1',
                        department: '上海市普陀区金沙江路 1518 弄',
                        loginType: '方式',
                        ip: '10.1.1.1',
                        loginTime: '21-22-2'
                    }
                ],
                user: [
                    {
                        id: 1,
                        name: '用户1'
                    }
                ],
                loginType: [
                    {
                        id: 1,
                        name: '邮箱'
                    },
                    {
                        id: 2,
                        name: '手机号'
                    }
                ]
            }
        }
    }
</script>
