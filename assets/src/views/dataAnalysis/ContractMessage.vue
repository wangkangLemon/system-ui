<!--企业签约信息-->
<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/table";

    .el-upload {
        width: 100%;
    }
    .table-container {
        .el-dialog {
            .upload-tip {
                padding-top: 10px;
                margin-top: 10px;
                border-top: 1px solid #ededed;
                h2 {
                    font-size: 14px;
                }
            }
        }

        .add {
            background: #f0f3f5;
            padding: 10px 20px;
            .el-icon-upload2 {
                padding-right: 5px;
            }
        }
        .import-container {
            padding: 20px;
        }
        .main-container {
            background: #fff;
            padding: 20px;
            .block {
                text-align: right;
                margin-top: 10px;
            }
        }
        .showDetail {
            .avatar {
                border: 1px solid #ededed;
                display: inline-block;
                vertical-align: top;
            }
            .info {
                display: inline-block;
                vertical-align: top;
                > p {
                    > span {
                        display: inline-block;
                        width: px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                    }
                }
            }
        }
        .show-sum-count {
            @extend %justify;
            > div {
                display: inline-block;
                width: 32%;
                background: blanchedalmond;
                .intro {
                    padding: 10px;
                    border-top: 1px solid #000;
                }
            }
        }
    }
</style>
<template>
    <article class="table-container">
        <div class="show-sum-count">
            <panel content="6" title="签约连锁" bgColor="#00acac" footer="签约连锁总数"></panel>
            <panel content="6" title="签约门店" bgColor="#348fe2" footer="已录入 638家, 录入率为 173.84%"></panel>
            <panel content="6" title="签约店员" bgColor="#727cb6" footer="已录入 638家, 录入率为 173.84%"></panel>
        </div>
        <!--导入弹窗-->
        <el-dialog v-model="isImport" title="导入企业签约信息" size="tiny">
            <el-upload
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :show-file-list="false">
                <i class="el-icon-plus"></i>
                <i>点击此处上传文件</i>
            </el-upload>
            <div class="upload-tip">
                <h2>注意事项</h2>
                <p>1. 模板中的字段请对照填写，不能为空</p>
                <p>2. 如果有某些内容为空，导入时将跳过</p>
            </div>
            <el-button type="primary" @click="isImport = false">关闭</el-button>
        </el-dialog>
        <!--详情-->
        <el-dialog class="showDetail" title="测试添加企业签约信息" v-model="showDetial">
            <div class="info">
                <p><span>门店数量：</span>80</p>
                <p><span>签约店员数量：</span> <i class="iconfont icon-oslash"></i>1200</p>
                <p><span>对方联系人：</span><i class="el-icon-message"></i> 12@vodjk.com</p>
                <p><span>联系方式：</span> 正常</p>
                <p><span>签约人：</span> 女</p>
                <p><span>签约时间：</span> 北京市朝阳区</p>
                <p><span>录入系统时间：</span>2017-03-17 12:333</p>
            </div>
        </el-dialog>
        <section class="add">
            <el-button @click="isImport = true"><i class="el-icon-upload2"></i>导入</el-button>
        </section>
        <div class="main-container">
            <section class="search">
                <div>
                    <label>连锁名称</label>
                    <el-input class="name" v-model="searchName"></el-input>
                </div>
                <div>
                    <label>是否录入门店</label>
                    <el-select v-model="inputDepSelect">
                        <el-option
                                v-for="(item, index) in inputDeps"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>是否录入店员</label>
                    <el-select v-model="inputMemSelect">
                        <el-option
                                v-for="(item, index) in inputMembers"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
                <div>
                    <label>签约时间</label>
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
                <div>
                    <label>签约人</label>
                    <el-select v-model="constructorSelect">
                        <el-option
                                v-for="(item, index) in constructor"
                                :label="item.name"
                                :value="item.id"
                                :key="item.id">
                        </el-option>
                    </el-select>
                </div>
            </section>
            <el-table border :data="tableData">
                <el-table-column
                        prop="name"
                        label="连锁名称"
                        width="100%">
                </el-table-column>
                <el-table-column
                        prop="contractDep"
                        label="签约门店"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="inputDep"
                        label="录入门店"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="contractMem"
                        label="签约店员"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="inputMember"
                        label="录入店员"
                        width="200">
                </el-table-column>
                <el-table-column prop="operate" label="查看">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showDetial = true">
                            连锁信息
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <section class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="[1, 2]"
                        layout="total, sizes, ->, prev, pager, next, jumper"
                        :total="4">
                </el-pagination>
            </section>
        </div>
    </article>
</template>
<script lang="babel">
    import panel from '../component/panel/AmountPanel'
    export default {
        components: {
            panel
        },
        data () {
            return {
                searchName: '',        // 连锁名称
                inputDepSelect: '',
                inputDeps: [            // 是否录入门店
                    {
                        id: 0,
                        name: '已录入',
                    },
                    {
                        id: 1,
                        name: '未录入',
                    }
                ],
                inputMemSelect: '',
                inputMembers: [            // 是否录入店员
                    {
                        id: 0,
                        name: '已录入',
                    },
                    {
                        id: 1,
                        name: '未录入',
                    }
                ],
                constructorSelect: '',
                constructor: [
                    {
                        id: 1,
                        name: '测试营销员'
                    },
                    {
                        id: 2,
                        name: '管理员'
                    },
                ],
                createTime: '',
                endTime: '',
                isImport: false,    // 导入弹窗显示状态
                showDetial: false,     // 是否显示详情对话框
                currentPage4: 1, // 分页当前显示的页数
                tableData: [
                    {
                        id: 1,
                        name: '销售',
                        contractDep: '13920307216',
                        inputDep: '13@vod.com',
                        contractMem: '2133',
                        inputMember: '102,2202',
                        status: '正常'
                    }
                ]
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
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
