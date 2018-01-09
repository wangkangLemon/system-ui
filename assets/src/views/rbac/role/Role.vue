<!--角色管理-->
<style lang="scss">
    @import "../../../utils/mixins/showDetail";
    @import "../../../utils/mixins/common";

    .rbac-role-container {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .block {
            margin-top: 10px;
            text-align: right;
        }
        .el-dialog {
            min-width: 500px;
        }
        
    }
</style>
<template>
    <article class="rbac-role-container">
        
        <section class="add">
            <el-button icon="plus" type="primary" @click="add()">添加</el-button>
        </section>
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
                    prop="role_name"
                    label="角色名称">
            </el-table-column>
            <el-table-column
                    prop="disabled"
                    label="状态"
                    width="100">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="!scope.row.disabled">启用</el-tag>
                        <el-tag type="gray" v-if="scope.row.disabled">禁用</el-tag>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间"
                    width="170">
            </el-table-column>
            <el-table-column
                    prop="update_time_name"
                    label="最后编辑时间"
                    width="170">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作"
                    width="200"
                    fixed="right"
                    align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" @click="disable(scope.row)">
                            {{scope.row.disabled === 1 ? '启用' : '禁用'}}
                    </el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                    <el-button @click="relate(scope.row)" type="text" size="small">权限分配</el-button>
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
        <!--添加 修改 弹窗-->
        <el-dialog :visible.sync="updateForm" size="tiny" title="角色设置">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="角色名称" prop="role_name">
                    <el-input v-model="form.role_name" type="text"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                   <el-radio-group v-model="form.disabled">
                            <el-radio :label="0">启用</el-radio>
                            <el-radio :label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限 弹窗-->
        <el-dialog class="dialog" :visible.sync="relateForm" size="tiny" title="分配权限">
            <el-tree :data="fromData" node-key="id" show-checkbox :default-checked-keys="toData" ref="tree"></el-tree>     
            <span slot="footer" class="dialog-footer">
                <el-button @click="relateForm = false">取 消</el-button>
                <el-button type="primary" @click="relateSubmit()">保 存</el-button>
            </span>
        </el-dialog>
    </article>
</template>
<script>
    import roleService from '../../../services/rbac/roleService'
    export default {
        data () {
            return {
                loading: false,
                updateForm: false,
                relateForm: false,
                fromData: [{}],
                toData: [],
                search: {
                    page: 0,
                    page_size: 15,
                    disabled: -1,
                },
                permissionForm: clearRelateFn(),
                dataList: [{}],
                total: 0,
                form: clearFn(),
                rules: {
                    id: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    disabled: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    role_name: [
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
            initFetchParam () {  // 初始化分页
                this.search.Page = 1
            },
            getData () {
                this.loading = true
                return roleService.search(this.search).then((ret) => {
                    this.dataList = ret.data
                    this.total = ret.total
                    this.loading = false
                }).catch((ret) => {
                    this.xmviex.showTip('error', ret.message)
                })
            },
             // 编辑
            edit (row) {
                this.form.id = row.id
                this.form.role_name = row.role_name
                this.form.disabled = row.disabled
                this.updateForm = true
            },
            add () {
                this.form = clearFn()
                this.updateForm = true
            },
            del(index, row) {
                xmview.showDialog(`你确认要删除用户【<i style="color: red">${row.role_name}</i>】的管理权限吗？`, () => {
                    roleService.delete(row.id).then(() => {
                        this.dataList.splice(index, 1)
                        xmview.showTip('success', '操作成功')
                    })
                })
            },
            disable(row) {
                xmview.showDialog(`你将要${row.disabled === 1 ? '启用' : '禁用'}【<i style="color: red">${row.role_name}</i>】确认吗`, () => {
                    this.form.id = row.id
                    this.form.disabled = row.disabled === 1 ? 0 : 1
                    this.form.role_name = row.role_name
                    roleService.update(this.form).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message || '操作失败')
                    })
                })
            },
            relate(row) {
                this.permissionForm = clearRelateFn()
                this.permissionForm.id = row.id
                roleService.searchPermission(row.id).then((ret) => {
                    this.fromData = ret.from === null ? [{}] : ret.from
                    this.toData = ret.to === null ? [] : ret.to
                    this.relateForm = true
                })
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    let msg = '添加成功'
                    let reqFn = roleService.add
                    if (this.form.id) {
                        msg = '修改成功'
                        reqFn = roleService.update
                    }
                    reqFn(this.form).then(() => {
                        this.updateForm = false
                        this.getData()
                        xmview.showTip('success', msg)
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
            relateSubmit() {
                let checkData = this.$refs.tree.getCheckedKeys(false)
                this.permissionForm.ids = checkData.toString()
                roleService.permission(this.permissionForm).then((ret) => {
                    if (ret.code === 0) {
                        xmview.showTip('success', '操作成功!')
                        this.relateForm = false
                    } else if (ret.code === 1) {
                        xmview.showTip('error', ret.message)
                    }
                })
            }
        }
    }
    function clearFn() {
        return {
            id: '',
            role_name: '',
            disabled: 1,
        }
    }
    function clearRelateFn() {
        return {
            id: '',
            ids: '',
        }
    }
</script>
