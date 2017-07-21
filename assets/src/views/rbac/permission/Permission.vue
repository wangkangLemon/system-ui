<!--权限管理-->
<style lang="scss">
    @import "../../../utils/mixins/showDetail";
    @import "../../../utils/mixins/common";

    .rbac-permission-container {
        @extend %content-container;
        .el-dialog {
            min-width: 500px;
        }
         > section {
            display: inline-block;
            vertical-align: top;
        }
         .left-container {
            min-width: 300px;
            border-right: 1px solid #ededed;
        }

        .right-container {
            width: 558px;
            margin-left: 15px;
            .edit-content {
                margin: 10px 0 0
            }
        }
        .btn-selected {
                background: #20A0FF;
                color: #fff;
        }
        .el-dialog__wrapper {
            padding-top: 15px;
            background: rgba(0, 0, 0, .5);
            z-index: 1000;
        }
        .btn-group {
            margin-top: 20px;
        }
    }
</style>
<template>
    <article class="rbac-permission-container">
        <!--移动的弹窗  -->
         <div class="el-dialog__wrapper" v-show="dialogTree.isShow">
            <article class="el-dialog el-dialog--tiny">
                <section class="el-dialog__header">
                    移动分类【
                    <span style="color:red">
                        {{nodeSelected && nodeSelected.label}}
                    </span> <i>】到</i>
                </section>
                <section class="el-dialog__body">
                     <el-tree highlight-current :data="moveTreeData"  @node-click="moveTreeClick">
                    </el-tree>

                </section>

                <section class="el-dialog__footer">
                    <span class="dialog-footer">
                          <el-button @click="dialogTree.isShow = false">取 消</el-button>
                        <el-button type="primary" @click="dialogTree.confirmClick">确 定</el-button>
                    </span>
                </section>
            </article>
        </div>
        <!-- 分配权限API 弹窗-->
        <el-dialog  :visible.sync="apiForm" size="tiny" title="API分配">
            <el-transfer v-model="toData" :data="fromData" :titles="['未选择', '已选择']" filterable></el-transfer>      
            <span slot="footer" class="dialog-footer">
                <el-button @click="apiForm = false">取 消</el-button>
                <el-button type="primary" @click="apiSubmit()">保 存</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限权限 弹窗-->
        <el-dialog :visible.sync="menuForm" size="tiny" title="权限分配">
            <el-tree :data="fromData" node-key="id" show-checkbox   :default-checked-keys="toData" ref="tree" :check-strictly="true"></el-tree>            <span slot="footer" class="dialog-footer">
                <el-button @click="menuForm = false">取 消</el-button>
                <el-button type="primary" @click="menuSubmit()">保 存</el-button>
            </span>
        </el-dialog>
        <section class="left-container">
         <EditorTree v-model='dataTree' ref="tree"  @onNodeClick="treeClick"></EditorTree>
        </section>
        <section class="right-container">
            <section>
                <el-button :class="{'btn-selected': activeTab == 'edit'}" @click="activeTab = 'edit'">修改权限</el-button>
                <el-button :class="{'btn-selected': activeTab == 'add'}" @click="activeTab = 'add'">添加子权限</el-button>            
                <el-button :class="{'btn-selected': activeTab == 'root'}" @click="activeTab = 'root'">添加一级权限</el-button>
                <el-button type="success" @click="move">移动权限</el-button>
                <el-button type="danger" @click="del">删除权限</el-button>
                 <div class="btn-group" v-if="isShowBtn" >
                    <el-button type='info' @click="apiRelate">API分配</el-button>
                    <el-button type='info' @click="menuRelate">菜单分配</el-button> 
                </div> 
            </section>

            <el-card class="edit-content">
                <el-form label-position="right" label-width="90px" :rules="rules" :model="form" ref="form">
                    <el-form-item label="权限名称" prop="permission_name">
                        <el-input v-model="form.permission_name" ></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="disabled">
                    <el-radio-group v-model="form.disabled">
                            <el-radio :label="0">启用</el-radio>
                            <el-radio :label="1">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
                    <el-form-item>
                        <el-button  type="info" @click="submitForm">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </section>
    </article>
</template>
<script>
    import permissionService from '../../../services/rbac/permissionService'
    import EditorTree from '../../component/tree/EditorTree.vue'
    function clearFn() {
        return {
            id: '',
            permission_name: '',
            disabled: 0,
            parent_id: 0
        }
    }
    export default {
        components: {EditorTree},
        data () {
            return {
                dataTree: [{}],
                activeTab: 'root',
                nodeSelected: void 0, // 被选中的node节点
                moveToNode: void 0, // 将要移动到最终的分类
                nodeStore: void '', // 当前stroe
                isShowBtn: false,
                form: clearFn(),
                item: {   // 添加元素
                    id: -1,
                    label: '',
                    children: null
                },
                moveTreeData: [],
                dialogTree: {
                    isShow: false,
                    confirmClick: {}
                },
                loading: false,
                updateForm: false, // 弹框
                apiForm: false,
                menuForm: false,
                fromData: [{}],
                toData: [],
                permissionForm: clearRelateFn(),
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
        watch: {
            'activeTab'(val) {
                if (val !== 'edit') {
                    this.resetForm()
                } else {
                    if (typeof (this.nodeSelected) !== 'undefined' && typeof (this.nodeSelected.id) !== 'undefined') {
                        permissionService.getInfo(this.nodeSelected.id).then((ret) => {
                            if (ret.code === 0) {
                                this.form = ret.data.data
                            }
                        })
                    }
                }
            },
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            //  tree 操作
            treeClick(value, node, self) {
                this.activeTab = 'edit'
                this.nodeSelected = value
                this.nodeStore = node
                this.isShowBtn = this.nodeSelected && this.nodeStore.childNodes.length == 0
                console.log(this.isShowBtn)
                permissionService.getInfo(this.nodeSelected.id).then((ret) => {
                    if (ret.code === 0) {
                        this.form = ret.data.data
                    }
                })
            },
            moveTreeClick(obj, node, self) {
                this.moveToNode = obj
            },
            del() {
                let nodeStore = this.nodeStore // 查看是子节点
                let node = this.nodeSelected
                if (node && nodeStore.childNodes.length > 0) {
                    xmview.showTip('warning', '该分类下还有子分类,不能被删除')
                } else {
                    xmview.showDialog(`你确认要删除【<i style="color: red">${node.label}</i>】吗？`, () => {
                        permissionService.delete(node.id).then(() => {
                            xmview.showTip('success', '操作成功')
                            this.$refs.tree.removeItem(this.nodeSelected) // 删除选中元素
                            node = null
                            nodeStore = null
                            this.resetForm()
                        })
                    })
                }
            },
            move () {
                if (!this.nodeSelected) {
                    xmview.showTip('warning', '请先选中一个分类')
                    return
                }
                permissionService.search().then((ret) => {
                    this.moveTreeData = ret.data
                    this.dialogTree.isShow = true
                    this.dialogTree.confirmClick = () => {
                        let id = this.nodeSelected.id
                        let to = this.moveToNode.id
                        if (id === to) {
                            xmview.showTip('warning', '请选择不同的分类')
                            return
                        }
                        this.form.parent_id = to
                        console.log(to)
                        permissionService.update(this.form).then((ret) => {
                            // 重新渲染树节点
                            if (ret.code === 0) {
                                xmview.showTip('success', '操作成功!')
                                this.dialogTree.isShow = false
                                 // 移动节点
                                this.$refs.tree.removeItem(this.nodeSelected)
                                this.$refs.tree.addItem(this.nodeSelected, this.moveToNode)
                                this.$forceUpdate()
                            } else if (ret.code === 1) {
                                xmview.showTip('error', ret.message)
                            }
                        })
                    }
                })
            },
            getData () {
                this.loading = true
                return permissionService.search().then((ret) => {
                    this.dataTree = ret.data
                    this.loading = false
                }).catch((ret) => {
                    this.xmviex.showTip('error', ret.message)
                })
            },
            apiRelate() {
                this.permissionForm = clearFn()
                this.permissionForm.id = this.nodeSelected.id
                permissionService.searchOperation(this.nodeSelected.id).then((ret) => {
                    this.fromData = ret.from === null ? [{}] : ret.from
                    this.toData = ret.to === null ? [] : ret.to
                    this.apiForm = true
                })
            },
            menuRelate() {
                this.permissionForm = clearFn()
                this.permissionForm.id = this.nodeSelected.id
                permissionService.searchMenu(this.nodeSelected.id).then((ret) => {
                    this.fromData = ret.from === null ? [{}] : ret.from
                    this.toData = ret.to === null ? [] : ret.to
                    this.menuForm = true
                })
            },
            // 保存
            submitForm() {
                this.$refs.form.validate((valid) => {
                    let p
                    if (this.activeTab === 'add') {
                        if (this.form.id === 0 || typeof (this.form.id) == 'undefined') {
                            xmview.showTip('warning', '请先选中一个分类')
                            return
                        }
                        this.form.parent_id = this.form.id
                        p = permissionService.add(this.form)
                    } else if (this.activeTab === 'edit') {
                        p = permissionService.update(this.form)
                    } else {
                        this.form.parent_id = 0
                        p = permissionService.add(this.form)
                    }
                    p.then((ret) => {
                        if (this.activeTab === 'add') {
                            this.item.id = ret.data.id
                            this.item.label = this.form.permission_name
                            this.$refs.tree.addItem(this.item, this.nodeSelected)
                        } else if (this.activeTab === 'root') {
                            this.item.id = ret.data.id
                            this.item.label = this.form.permission_name
                            this.$refs.tree.addItem(this.item)
                        } else if (this.activeTab === 'edit') {
                            this.nodeSelected.label = this.form.permission_name
                        }
                        this.$forceUpdate()
                        xmview.showTip('success', '操作成功!')
                    })
                })
            },
             // 重置表单
            resetForm () {
                this.$refs.form.resetFields()
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
                let checkData = this.$refs.tree.getCheckedKeys()
                this.permissionForm.ids = checkData.toString()
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
