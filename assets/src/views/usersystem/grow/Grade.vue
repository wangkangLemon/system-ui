<!--等级特权-->
<style lang="scss">
    @import "../../../utils/mixins/showDetail";
    @import "../../../utils/mixins/common";

    .task-daily-container {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .block {
            margin-top: 10px;
            text-align: right;
        }
    }
</style>
<template>
    <article class="task-daily-container">
        <section class="add">
            <el-button icon="plus" type="primary" @click="addForm = true">添加</el-button>
        </section>
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
                    prop="level"
                    width="100"
                    label="用户等级">
            </el-table-column>
            <el-table-column
                    prop="grow"
                    label="所需成长值"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="award"
                    label="对应特权">
            </el-table-column>
            <el-table-column
                    prop="last_time_name"
                    label="积分收益系数"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="last_time_name"
                    label="每日启动成长值倍数"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="last_time_name"
                    label="每日成长值上限"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作"
                    width="180">
                <template scope="scope">
                    <el-button type="text">修改</el-button>
                    <el-button type="text">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <section class="block">
            <el-pagination
                    @size-change="val=> {search.page_size=val; getData()}"
                    @current-change="val=> {search.page=val; getData()}"
                    :current-page="search.page"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </section>
        <el-dialog :visible.sync="addForm" size="tiny" title="等级特权设置" @open="dialogOpen">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item prop="level" label="用户等级">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="所需成长值">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="每日成长值上限">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="每日启动成长值">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="积分收益系数">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
                <el-form-item label="成长值增益倍数">
                    <el-input v-model="form.level"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">保 存</el-button>
            </span>
        </el-dialog>
    </article>
</template>
<script>
    export default {
        data () {
            return {
                loading: false,
                addForm: false,
                search: {
                    title: '',
                    type: '',
                    page: 1,
                    page_size: 15
                },
                form: clearFn(),
                dataList: [{}],
                total: 0,
                rules: {
                    type: {required: true, message: '必须填', trigger: 'change'},
                    title: {required: true, message: '必须填', trigger: 'blur'},
                    integral: {required: true, message: '必须填', trigger: 'blur'}
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            getData () {
                console.log(11)
            },
            dialogOpen () {
                this.$nextTick(() => {
                    this.form = clearFn()
                    this.$refs.form.resetFields()
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(valid)
                    }
                })
            }
        }
    }
    function clearFn() {
        return {
            level: '',
            grow: '',
            up: '',
            daygrow: '',
            multiple: '', // 倍数
            coefficient: '', // 系数
        }
    }
</script>
