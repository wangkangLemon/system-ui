<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #usersystem-grow-behavior {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <main id="usersystem-grow-behavior">
         <!--修改表单-->
        <el-dialog :visible.sync="addForm" title="成长值获取方式" width="30%">
            <el-form class="addForm" :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item  prop="name" label="用户行为">
                    <el-input type="text" v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item  prop="growth" label="完成一次成长值">
                    <el-input-number v-model="form.growth"  auto-complete="off"></el-input-number>
                </el-form-item>
                <el-form-item  prop="limit" label="最多可获取的成长值">
                    <el-input-number v-model="form.limit"  auto-complete="off"></el-input-number>
                </el-form-item>
                <el-form-item  prop="description" label="行为说明">
                    <el-input type="textarea" :rows="3" v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="submit('form')">保存</el-button>
            </div>
        </el-dialog>
        <main class="search">
            <section>
                <i>用户行为</i>
                <el-input type="text" v-model="fetchParam.name" @keyup.enter.native="fetchData"></el-input>
            </section>
        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" border>
            <el-table-column prop="name" label="用户行为"></el-table-column>
            <el-table-column prop="growth" label="完成一次成长值"></el-table-column>
            <el-table-column prop="limit" label="最多获取成长值"></el-table-column>
            <el-table-column prop="description" label="说明"></el-table-column>
            <el-table-column prop="update_time_name" label="更新时间" width="170"></el-table-column>
            <el-table-column
                width="80"
                label="操作"
                fixed="right"
                align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination 
            class="pagin"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes,total, prev, pager, next"
            :total="total">
        </el-pagination>

    </main>
</template>

<script>
    import growService from '../../../services/usersystem/growService'
    export default {
        data() {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                addForm: false, // 表单弹窗是否显示
                fetchParam: {
                    name: void '',
                    page: 1,
                    page_size: 15
                },
                form: {
                    id: 0,
                    name: void '',
                    growth: 0,
                    limit: 0,
                    description: void ''
                },
                rules: {
                    id: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    growth: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    limit: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    name: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ],
                    description: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                },
            }
        },
        activated () {
            this.fetchData()
        },
        methods: {
            handleCurrentChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            fetchData (val) {
                this.loadingData = true
                return growService.search(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            },
             // 编辑
            edit (row) {
                this.addForm = true
                this.form.id = row.id
                this.form.name = row.name
                this.form.growth = row.growth
                this.form.limit = row.limit
                this.form.description = row.description
            },
            submit (form) { // 表单提交
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        growService.updateBehavior(this.form).then((ret) => {
                            this.addForm = false
                            xmview.showTip('success', '保存成功')
                            this.fetchData()
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>
