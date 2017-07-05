<!--权限管理-->
<style lang="scss">
    @import "../../../utils/mixins/showDetail";
    @import "../../../utils/mixins/common";

    .rbac-permission-container {
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
    <article class="rbac-permission-container">
        <section class="add">
            <el-button icon="plus" type="primary" @click="add()">添加</el-button>
        </section>
         <!--添加/修改 弹窗-->
        <el-dialog :visible.sync="updateForm" size="tiny" title="添加">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="权限名称" prop="permission_name">
                    <el-input  v-model="form.permission_name" type="text"></el-input>
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
        <!-- 分配权限API 弹窗-->
        <el-dialog :visible.sync="apiForm" size="tiny" title="API分配">
            <el-transfer v-model="toData" :data="fromData" :titles="['未选择', '已选择']" filterable></el-transfer>      
            <span slot="footer" class="dialog-footer">
                <el-button @click="apiForm = false">取 消</el-button>
                <el-button type="primary" @click="apiSubmit()">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限菜单 弹窗-->
        <el-dialog :visible.sync="menuForm" size="tiny" title="菜单分配">
            <el-tree :data="fromData" node-key="id" show-checkbox  default-expand-all :default-checked-keys="toData" ref="tree"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="menuForm = false">取 消</el-button>
                <el-button type="primary" @click="menuSubmit()">保 存</el-button>
            </span>
        </el-dialog>
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
                    prop="permission_name"
                    label="权限名称">
            </el-table-column>
            <el-table-column
                    prop="disabled"
                    label="状态">
                    <template scope="scope">
                        <el-tag type="success" v-if="!scope.row.disabled">启用</el-tag>
                        <el-tag type="gray" v-if="scope.row.disabled">禁用</el-tag>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="update_time_name"
                    label="最后编辑时间">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作">
                <template scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small" @click="disable(scope.row)">
                            {{scope.row.disabled === 0 ? '禁用' : '启用'}}
                    </el-button>
                    <el-button @click="del(scope.$index,scope.row)" type="text" size="small">删除</el-button>
                    <el-button @click="apiRelate(scope.row)" type="text" size="small">API分配</el-button>
                    <el-button @click="menuRelate(scope.row)" type="text" size="small">菜单分配</el-button>
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
    </article>
</template>
<script>
    import permissionService from '../../../services/rbac/permissionService'
    function clearFn() {
        return {
            id: '',
            permission_name: '',
            disabled: 0
        }
    }
    export default {
        data () {
            return {
                form: clearFn(),
                loading: false,
                updateForm: false, // 弹框
                apiForm: false,
                menuForm: false,
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
                rules: {
                    id: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    disabled: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    permission_name: [
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
            // 获取选中的id
            getcheckData() {
                this.list = this.$refs.tree.store
                let nodes = this.list.nodesMap
                let newlist = []
                for (let index in nodes) {
                    let node = nodes[index]
                    if (node.checked) {
                        newlist.push(node.data.id)
                    } else if (node.indeterminate && !node.checked) {
                        newlist.push(node.data.id)
                    }
                }
                this.permissionForm.ids = newlist.toString()
                console.log(this.permissionForm.ids)
            },
            initFetchParam () {
                this.search.Page = 1
            },
            getData () {
                this.loading = true
                return permissionService.search(this.search).then((ret) => {
                    this.dataList = ret.data
                    this.total = ret.total
                    this.loading = false
                }).catch((ret) => {
                    this.xmviex.showTip('error', ret.message)
                })
            },
            add() {
                this.form = clearFn()
                this.updateForm = true
            },
            edit(row) {
                this.form.id = row.id
                this.form.permission_name = row.permission_name
                this.form.disabled = row.disabled

                this.updateForm = true
            },
            del(index, row) {
                xmview.showDialog(`你确认要删除【<i style="color: red">${row.permission_name}</i>】的管理权限吗？`, () => {
                    permissionService.delete(row.id).then(() => {
                        this.dataList.splice(index, 1)
                        xmview.showTip('success', '操作成功')
                    })
                })
            },
            disable(row) {
                xmview.showDialog(`你是要${row.disabled === 1 ? '禁用' : '启用'}【<i style="color: red">${row.permission_name}</i>】确认吗？`, () => {
                    permissionService.disable({
                        id: row.id,
                        disabled: row.disabled === 1 ? 0 : 1
                    }).then(() => {
                        xmview.showTip('success', `${row.disabled === 1 ? '禁用' : '启用'}成功 `)
                        this.getData()
                    })
                })
            },
            apiRelate(row) {
                this.permissionForm = clearFn()
                this.permissionForm.id = row.id
                permissionService.searchOperation(row.id).then((ret) => {
                    this.fromData = ret.from === null ? [{}] : ret.from
                    this.toData = ret.to === null ? [] : ret.to
                    this.apiForm = true
                })
            },
            menuRelate(row) {
                this.permissionForm = clearFn()
                this.permissionForm.id = row.id
                permissionService.searchMenu(row.id).then((ret) => {
                    this.fromData = ret.from === null ? [{}] : ret.from
                    this.toData = ret.to === null ? [] : ret.to
                    this.menuForm = true
                })
            },
            submit(form) {
                this.$refs[form].validate((valid) => {
                    let msg = '添加成功'
                    let reqFn = permissionService.add
                    if (this.form.id) {
                        msg = '修改成功'
                        reqFn = permissionService.update
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
            apiSubmit() {
                this.permissionForm.ids = this.toData.toString()
                let reqFn = permissionService.operation
                reqFn(this.permissionForm).then((ret) => {
                    if (ret.code === 0) {
                        xmview.showTip('success', '操作成功!')
                        this.apiForm = false
                    } else if (ret.code === 1) {
                        xmview.showTip('error', ret.message)
                    }
                })
            },
            menuSubmit() {
                this.getcheckData()
                let reqFn = permissionService.menu
                reqFn(this.permissionForm).then((ret) => {
                    if (ret.code === 0) {
                        xmview.showTip('success', '操作成功!')
                        this.menuForm = false
                    } else if (ret.code === 1) {
                        xmview.showTip('error', ret.message)
                    }
                })
            }
        }
    }
    function clearRelateFn() {
        return {
            id: '',
            ids: '',
        }
    }
</script>
