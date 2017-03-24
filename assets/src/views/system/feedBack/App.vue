<!--客户端-->
<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";
    .table-container {
        border: 1px solid #ededed;
        .main-container {
            background: #fff;
            padding: 20px;
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
            .block {
                text-align: right;
                margin-top: 10px;
            }
        }
        .showDetail {
            .info {
                display: inline-block;
                vertical-align: top;
                > p {
                    > span {
                        display: inline-block;
                        width:px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                    }
                }
            }
        }
    }
</style>
<template>
    <article class="table-container">
        <!--删除弹窗-->
        <delete-dialog :text="itemName" :isShow="deletDialog" :callback="deleteItem"></delete-dialog>
        <!--详情-->
        <el-dialog class="showDetail" v-model="showDetial">
            <div class="info">
                <p><span>企业名称：</span>{{details.company}}</p>
                <p><span>门店：</span>{{details.department}}</p>
                <p><span>提交人：</span>{{details.submitter}}</p>
                <p><span>联系方式：</span> {{details.link}}</p>
                <p><span>问题描述：</span> {{details.description}}</p>
                <p><span>问题截取：</span><img :src="details.questionImg" /></p>
                <p>
                    <span>状态：</span>
                    <el-select v-model="details.status">
                        <el-option
                                v-for="(item, index) in processState"
                                :label="item.status"
                                :value="item.value"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </p>
            </div>
        </el-dialog>
        <div class="main-container">
            <section class="search">
                <div>
                    <label>类型</label>
                    <el-select>
                        <el-option
                                v-for="(item, index) in questionType"
                                :label="item.name"
                                :value="item.value"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>状态</label>
                    <el-select>
                        <el-option
                                v-for="(item, index) in processState"
                                :label="item.status"
                                :value="item.value"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>日期</label>
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
                <div><label>关键字</label><el-input v-model="keywords"></el-input></div>
            </section>
            <el-table border :data="tableData">
                <el-table-column
                        prop="type"
                        label="类型"
                        width="100%">
                </el-table-column>
                <el-table-column
                        prop="instruction"
                        label="说明">
                </el-table-column>
                <el-table-column
                        prop="appVersion"
                        label="APP版本"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="systemVersion"
                        label="系统版本"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="time"
                        label="时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="status"
                        label="状态"
                        width="200">
                </el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showFn(scope.$index, scope.row)">
                            查看
                        </el-button>
                        <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                            删除
                        </el-button>
                    </template>
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
        </div>
    </article>
</template>
<script lang="babel">
    import deleteDialog from '../../component/dialog/Delete'
    export default {
        components: {
            deleteDialog
        },
        data () {
            return {
                createTime: '',
                endTime: '',
                keywords: '', // 关键字
                questionType: [
                    {
                        id: 1,
                        name: '建议',
                        value: 1
                    },
                    {
                        id: 2,
                        name: '操作体验不好',
                        value: 2
                    },
                    {
                        id: 3,
                        name: '程序闪退',
                        value: 3
                    },
                    {
                        id: 4,
                        name: '视频无法播放',
                        value: 4
                    }
                ],
                // 处理状态
                processState: [
                    {
                        id: 1,
                        status: '待处理',
                        value: 1
                    },
                    {
                        id: 2,
                        status: '已处理',
                        value: 2
                    }
                ],
                details: {}, // 详情
                itemName: '',           // 要删除项名称
                deletDialog: false,     // 删除弹窗
                showDetial: false,     // 是否显示详情对话框
                currentPage: 1, // 分页当前显示的页数
                tableData: [ // 列表数据
                    {
                        id: 1,
                        type: '销售',
                        instruction: '销售',
                        appVersion: '销售',
                        systemVersion: '13920307216',
                        time: '13@vod.com',
                        status: '正常'
                    }
                ]
            }
        },
        methods: {
            showFn (index, row) {
                this.showDetial = true
                // 获取数据
                // row.id
                this.details = {
                    company: '演示医药连锁',
                    department: '演示医药连锁',
                    submitter: '提交人',
                    link: '林夕方式',
                    description: '问题描述',
                    questionImg: 'http://sys.yst.vodjk.dev/assets/img/user-default-female.jpg?00da903dc4d95b13b46f',
                    status: 1
                }
            },
            // 显示删除dialog
            handleDelete (index, row) {
                this.deletDialog = true
                this.itemName = row.chain
            },
            // 处理删除动作
            deleteItem (confirm) {
                this.deletDialog = false
                if (!confirm) {
                    return false
                }
                // 以下执行接口删除动作
                console.log(11)
            },
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`)
                // 当切换每页条数得时候 获取当前第一页得数据
                this.handleCurrentChange(1)
            },
            handleCurrentChange (val) {
                this.currentPage = val
                console.log(`当前页: ${val}`)
                // 以下获取当页数据
            }
        }
    }
</script>
