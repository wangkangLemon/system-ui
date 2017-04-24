<!--表格 测试-->
<style scope lang="scss" scoped>
    @import "../utils/mixins/mixins";
    .table-container {
        .search {
            padding: px2rem(20);
            > div {
                display: inline-block;
                vertical-align: top;
                width: 30%;
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
    }
</style>
<template>
    <article class="table-container">
        <section class="search">
            <div><label>标题</label><el-input v-model="title" placeholder="请输入内容"></el-input></div>
            <div>
                <label>选择</label>
                <el-select v-model="selectValue" placeholder="请选择">
                    <el-option
                        v-for="(item, index) in createTimeData"
                        :label="item.label"
                        :value="item.val"
                        :key="item.id">
                    </el-option>
                </el-select>
            </div>
            <div>
                <label>创建时间</label>
                <el-date-picker
                        v-model="value1"
                        type="date"
                        placeholder="开始时间"
                        :picker-options="pickerOptions0">
                </el-date-picker>
                <el-date-picker
                        v-model="value1"
                        type="date"
                        placeholder="结束时间"
                        :picker-options="pickerOptions0">
                </el-date-picker>
            </div>
        </section>
        <el-table
                :data="tableData">
            <el-table-column
                    prop="date"
                    label="日期"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址">
            </el-table-column>
        </el-table>
        <section class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[100, 200, 300, 400]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="400">
            </el-pagination>
        </section>
    </article>
</template>
<script lang="babel">
    export default {
        data () {
            return {
                value1: '',
                currentPage4: 1,
                title: '',
                selectValue: '全部',
                pickerOptions0: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                createTimeData: [
                    {
                        id: 1,
                        val: '选项1',
                        label: '黄金糕'
                    },
                    {
                        id: 2,
                        val: '选项2',
                        label: '双皮奶'
                    },
                    {
                        id: 3,
                        val: '选项3',
                        label: '蚵仔煎'
                    },
                    {
                        id: 4,
                        val: '选项4',
                        label: '龙须面'
                    },
                    {
                        id: 5,
                        val: '选项5',
                        label: '北京烤鸭'
                    }
                ],
                tableData: [
                    {
                        id: 1,
                        date: '2016-05-02',
                        name: '王小虎1',
                        address: '上海市普陀区金沙江路 1518 弄'
                    }, {
                        id: 2,
                        date: '2016-05-04',
                        name: '王小虎2',
                        address: '上海市普陀区金沙江路 1517 弄'
                    }, {
                        id: 3,
                        date: '2016-05-01',
                        name: '王小虎4',
                        address: '上海市普陀区金沙江路 1519 弄'
                    }, {
                        id: 4,
                        date: '2016-05-03',
                        name: '王小虎5',
                        address: '上海市普陀区金沙江路 1516 弄'
                    }
                ]
            }
        },
        methods: {
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`)
            },
            handleCurrentChange (val) {
                this.currentPage = val
                console.log(`当前页: ${val}`)
            }
        }
    }
</script>
