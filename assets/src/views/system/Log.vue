<style lang='scss' rel='stylesheet/scss' scoped>
    @import "../../utils/mixins/mixins";
    .main-container {
        .search {
            display: flex;
            padding: 15px;
            > div {
                display: inline-block;
                vertical-align: top;
                label {
                    margin-right: 2%;
                }
                .el-input, .el-select, .el-date-editor {
                    width: 40%;
                }
            }
        }
        .el-table {
            width: 100%;
        }
        .block {
            text-align: right;
            margin-top: 10px;
        }
    }
</style>
<template>
    <article>
        <el-tabs type="border-card">
            <el-tab-pane label="系统管理操作">
                <article class="main-container">
                    <section class="search">
                        <div>
                            <label>管理员</label>
                            <el-select v-model="system.managerSelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in system.manager"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div><label>操作IP</label><el-input v-model="system.ip"></el-input></div>
                        <div>
                            <label>操作时间</label>
                            <el-date-picker
                                    v-model="system.createTime"
                                    type="date"
                                    placeholder="开始时间">
                            </el-date-picker>
                            <el-date-picker
                                    v-model="system.endTime"
                                    type="date"
                                    placeholder="结束时间">
                            </el-date-picker>
                        </div>
                    </section>
                    <el-table
                            :data="system.data">
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
                                :current-page="system.currentPage"
                                :page-sizes="[100, 200, 300, 400]"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="400">
                        </el-pagination>
                    </section>
                </article>
            </el-tab-pane>
            <el-tab-pane label="企业管理操作">
                <article class="main-container">
                    <section class="search">
                        <div>
                            <label>管理员</label>
                            <el-select v-model="company.managerSelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in company.manager"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div><label>操作IP</label><el-input v-model="company.ip"></el-input></div>
                        <div>
                            <label>操作时间</label>
                            <el-date-picker
                                    v-model="company.createTime"
                                    type="date"
                                    placeholder="开始时间">
                            </el-date-picker>
                            <el-date-picker
                                    v-model="company.endTime"
                                    type="date"
                                    placeholder="结束时间">
                            </el-date-picker>
                        </div>
                    </section>
                    <el-table
                            :data="company.data">
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
                                :current-page="company.currentPage"
                                :page-sizes="[100, 200, 300, 400]"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="400">
                        </el-pagination>
                    </section>
                </article>
            </el-tab-pane>
            <el-tab-pane label="系统后台登录">
                <article class="main-container">
                    <section class="search">
                        <div>
                            <label>管理员</label>
                            <el-select v-model="systemBackStage.managerSelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in systemBackStage.manager"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>登录方式</label>
                            <el-select v-model="systemBackStage.managerSelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in systemBackStage.loginType"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div><label>操作IP</label><el-input v-model="systemBackStage.ip"></el-input></div>
                        <div>
                            <label>登录时间</label>
                            <el-date-picker
                                    v-model="systemBackStage.createTime"
                                    type="date"
                                    placeholder="开始时间">
                            </el-date-picker>
                            <el-date-picker
                                    v-model="systemBackStage.endTime"
                                    type="date"
                                    placeholder="结束时间">
                            </el-date-picker>
                        </div>
                    </section>
                    <el-table
                            :data="systemBackStage.data">
                        <el-table-column
                                prop="company"
                                label="企业"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="manager"
                                label="管理员"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="loginType"
                                label="登录方式">
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
                                :current-page="systemBackStage.currentPage"
                                :page-sizes="[100, 200, 300, 400]"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="400">
                        </el-pagination>
                    </section>
                </article>
            </el-tab-pane>
            <el-tab-pane label="企业后台登录">
                <article class="main-container">
                    <section class="search">
                        <div>
                            <label>企业</label>
                            <el-select v-model="companyBackStage.companySelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in companyBackStage.company"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>用户</label>
                            <el-select v-model="companyBackStage.userSelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in companyBackStage.user"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>登录方式</label>
                            <el-select v-model="companyBackStage.loginTypeSelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in companyBackStage.loginType"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div><label>操作IP</label><el-input v-model="companyBackStage.ip"></el-input></div>
                        <div>
                            <label>登录时间</label>
                            <el-date-picker
                                    v-model="companyBackStage.createTime"
                                    type="date"
                                    placeholder="开始时间">
                            </el-date-picker>
                            <el-date-picker
                                    v-model="companyBackStage.endTime"
                                    type="date"
                                    placeholder="结束时间">
                            </el-date-picker>
                        </div>
                    </section>
                    <el-table
                            :data="companyBackStage.data">
                        <el-table-column
                                prop="company"
                                label="企业"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="user"
                                label="用户"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="loginType"
                                label="登录方式">
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
                                :current-page="companyBackStage.currentPage"
                                :page-sizes="[100, 200, 300, 400]"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="400">
                        </el-pagination>
                    </section>
                </article>
            </el-tab-pane>
            <el-tab-pane label="前台登录">
                <article class="main-container">
                    <section class="search">
                        <div>
                            <label>用户</label>
                            <el-select v-model="frontDest.userSelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in frontDest.user"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div>
                            <label>登录方式</label>
                            <el-select v-model="frontDest.loginTypeSelect" placeholder="请选择">
                                <el-option
                                        v-for="(item, index) in frontDest.loginType"
                                        :label="item.name"
                                        :value="item.id"
                                        :key="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <div><label>操作IP</label><el-input v-model="frontDest.ip"></el-input></div>
                        <div>
                            <label>登录时间</label>
                            <el-date-picker
                                    v-model="frontDest.createTime"
                                    type="date"
                                    placeholder="开始时间">
                            </el-date-picker>
                            <el-date-picker
                                    v-model="frontDest.endTime"
                                    type="date"
                                    placeholder="结束时间">
                            </el-date-picker>
                        </div>
                    </section>
                    <el-table
                            :data="frontDest.data">
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
                                :current-page="frontDest.currentPage"
                                :page-sizes="[100, 200, 300, 400]"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="400">
                        </el-pagination>
                    </section>
                </article>
            </el-tab-pane>
            <el-tab-pane label="手机验证码">手机验证码</el-tab-pane>
            <el-tab-pane label="邮件验证码">邮件验证码</el-tab-pane>
        </el-tabs>
    </article>
</template>
<script lang="babel">
    export default {
        data () {
            return {
                // 系统管理操作
                system: {
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
                },
                // 企业管理操作
                company: {
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
                },
                // 系统后台登录
                systemBackStage: {
                    createTime: '',
                    endTime: '',
                    currentPage: 1,
                    managerSelect: '',
                    ip: '',
                    data: [
                        {
                            id: 1,
                            company: '2016-05-02',
                            manager: '王小虎1',
                            loginType: '上海市普陀区金沙江路 1518 弄',
                            ip: '10.1.1.1',
                            loginTime: '21-22-2'
                        }
                    ],
                    manager: [
                        {
                            id: 1,
                            name: '选项1'
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
                },
                // 企业后台登录
                companyBackStage: {
                    createTime: '',
                    endTime: '',
                    currentPage: 1,
                    companySelect: '',
                    userSelect: '',
                    loginTypeSelect: '',
                    ip: '',
                    data: [
                        {
                            id: 1,
                            company: '2016-05-02',
                            user: '王小虎1',
                            loginType: '上海市普陀区金沙江路 1518 弄',
                            ip: '10.1.1.1',
                            loginTime: '21-22-2'
                        }
                    ],
                    company: [
                        {
                            id: 1,
                            name: '企业1'
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
                },
                // 企业后台登录
                frontDest: {
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
        },
        methods: {
        }
    }
</script>
