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
            <el-button icon="plus" type="primary" @click="add()">添加</el-button>
        </section>
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
                    prop="level"
                    width="100"
                    label="用户等级">
            </el-table-column>
            <el-table-column
                    prop="growth"
                    label="所需成长值"
                    width="110">
            </el-table-column>
            <el-table-column
                    prop="description"
                    min-width="100"
                    label="对应特权">
            </el-table-column>
            <el-table-column
                    prop="credit_times"
                    label="积分收益系数"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="growth_times"
                    label="每日启动成长值倍数"
                    width="170">
            </el-table-column>
            <el-table-column
                    prop="limit"
                    label="每日成长值上限"
                    width="140">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作"
                    width="80"
                    fixed="right"
                    align="center">
                <template scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
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
        <el-dialog :visible.sync="updateForm" size="tiny" title="等级特权设置">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="用户等级">
                    <el-input-number v-model="form.level" :disabled="flag == 1"></el-input-number>
                </el-form-item>
                <el-form-item label="所需成长值">
                    <el-input-number v-model="form.growth"></el-input-number>
                </el-form-item>
                <el-form-item label="对应特权">
                    <el-input v-model="form.description" type="textarea"  :rows="6" :disabled="flag == 1"></el-input>
                </el-form-item>
                <el-form-item label="成长值增益倍数">
                    <el-input-number v-model="form.growth_times"></el-input-number>
                </el-form-item>
                <el-form-item label="积分收益系数">
                    <el-input-number v-model="form.credit_times"></el-input-number>
                </el-form-item>
                <el-form-item label="每日成长值上限">
                    <el-input-number v-model="form.limit"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">保 存</el-button>
            </span>
        </el-dialog>
    </article>
</template>
<script>
    import growService from '../../../services/usersystem/growService'
    export default {
        data () {
            return {
                loading: false,
                updateForm: false,
                search: {
                    page: 1,
                    page_size: 15
                },
                flag: 0,
                form: clearFn(),
                dataList: [{}],
                total: 0,
                rules: {
                    id: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    level: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    growth: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    limit: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    growth_times: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    credit_times: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    description: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            getData () {
                this.loading = true
                return growService.gradeSearch(this.search).then((ret) => {
                    this.dataList = ret.data
                    this.loading = false
                }).catch((ret) => {
                    this.xmviex.showTip('error', ret.message)
                })
            },
             // 编辑
            edit (row) {
                this.flag = 1
                this.updateForm = true
                this.form.id = row.id
                this.form.level = row.level
                this.form.growth = row.growth
                this.form.limit = row.limit
                this.form.growth_times = row.growth_times
                this.form.credit_times = row.credit_times
                this.form.description = row.description
            },
            add () {
                this.flag = 0
                this.form = clearFn()
                this.updateForm = true
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (this.flag) {
                            growService.updateGrade(this.form).then((ret) => {
                                this.updateForm = false
                                xmview.showTip('success', '保存成功')
                                this.getData()
                            }).catch((ret) => {
                                xmview.showTip('error', ret.message)
                            })
                        } else {
                            growService.addGrade(this.form).then((ret) => {
                                this.updateForm = false
                                xmview.showTip('success', '保存成功')
                                this.getData()
                            }).catch((ret) => {
                                xmview.showTip('error', ret.message)
                            })
                        }
                    } else {
                        return false
                    }
                })
            }
        }
    }
    function clearFn() {
        return {
            id: '',
            level: '',
            grow: '',
            limit: '',
            daygrow: '',
            growth_times: '', // 成长值成长倍数
            credit_times: '', // 积分增益倍数
            description: '', // 描述
        }
    }
</script>
