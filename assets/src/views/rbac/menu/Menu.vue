<!--菜单管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";

    #sys-rbac-menu {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
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

            .btn-selected {
                background: #20A0FF;
                color: #fff;
            }
        }

        .el-dialog__wrapper {
            padding-top: 15px;
            background: rgba(0, 0, 0, .5);
            z-index: 1000;
        }
    }
</style>

<template>
    <article id="sys-rbac-menu">
        <section class="left-container">
              <EditorTree v-model='treeData' ref="tree"  @onNodeClick="treeClick"></EditorTree>    
        </section>

        <section class="right-container">
            <div>
                <el-button :class="{'btn-selected': activeTab == 'edit'}" @click="activeTab = 'edit'">修改菜单</el-button>
                <el-button :class="{'btn-selected': activeTab == 'add'}" @click="activeTab = 'add'">添加子菜单</el-button>            
                <el-button :class="{'btn-selected': activeTab == 'root'}" @click="activeTab = 'root'">添加一级菜单</el-button>
                <el-button type="success" @click="moveSubMenu">移动菜单</el-button>
                <el-button type="danger" @click="deleteMenu">删除菜单</el-button>
            </div>
            <el-card class="edit-content">
                <el-form label-position="right" label-width="90px" :rules="rules" :model="fetchParam" ref="form">
                    <el-form-item label="菜单名称" prop="menu_name">
                        <el-input v-model="fetchParam.menu_name" ></el-input>
                    </el-form-item>
                    <el-form-item label="菜单URL" prop="menu_url">
                        <el-input v-model="fetchParam.menu_url" ></el-input>
                    </el-form-item>
                    <el-form-item label="菜单图标" prop="menu_icon">
                        <el-input v-model="fetchParam.menu_icon" ></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="menu_order">
                        <el-input-number  placeholder="最小的排在前面" v-model.number="fetchParam.menu_order"></el-input-number>
                    </el-form-item>
                    <el-form-item label="状态" prop="disabled">
                        <el-radio-group v-model="fetchParam.disabled">
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

        <el-dialog title="操作提示" :visible.sync="dialogConfirm.isShow" width="30%">
            <span v-html="dialogConfirm.msg"></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogConfirm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirm.confirmClick">确 定</el-button>
            </span>
        </el-dialog>
         <!--移动子分类的弹出框-->
        <div class="el-dialog__wrapper" v-show="dialogTree.isShow">
            <article class="el-dialog el-dialog--tiny">
                <section class="el-dialog__header">
                    移动分类【
                    <span style="color:red">
                        {{nodeSelected && nodeSelected.label}}
                    </span> <i>】到</i>
                </section>
                <section class="el-dialog__body">
                     <el-tree highlight-current :data="moveTreeData" :props="defaultProps" @node-click="moveTreeClick">
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
    </article>
</template>
<script type="text/jsx">
    import menuService from '../../../services/rbac/menuService'
    import EditorTree from '../../component/tree/EditorTree.vue'
    export default{
        data () {
            return {
                activeTab: 'root',
                nodeSelected: void 0, // 被选中的node节点
                moveToNode: void 0, // 将要移动到最终的分类
                nodeItem:'',
                treeData: [],
                moveTreeData: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                dialogConfirm: {
                    isShow: false,
                    msg: '',
                    confirmClick: {}
                },
                dialogTree: {
                    isShow: false,
                    confirmClick: {}
                },
                item: {   // 添加元素
                    id: -1,
                    label: '',
                    children: null
                },
                fetchParam: getFetchParam(),
                rules: {
                    menu_name: [
                        {required: true, message: '请菜单名称', trigger: 'blur'},
                    ],
                    menu_url: [
                        {required: true, message: '请菜单URL', trigger: 'blur'},
                    ]
                }
            }
        },
        watch: {
            'activeTab'(val) {
                if (val !== 'edit') {
                    this.resetForm()
                } else {
                    if (typeof(this.nodeSelected) !== 'undefined' && typeof(this.nodeSelected.id) !== 'undefined') {
                        menuService.getInfo(this.nodeSelected.id).then((ret) => {
                            if (ret.code === 0) {
                                this.fetchParam = ret.data.data
                            }
                        })
                    }
                }
            },
        },
        activated () {
            xmview.setContentLoading(false)
            this.getTreeData()
        },
        methods: {
            moveTreeClick(obj, node, self) {
                this.moveToNode = obj
                
            },
            // 点击树发生动作
            treeClick(obj, node, self) {
                this.activeTab = 'edit'
                this.nodeSelected = obj
                this.nodeItem =node
                menuService.getInfo(this.nodeSelected.id).then((ret) => {
                    if (ret.code === 0) {
                        this.fetchParam = ret.data.data
                        
                    }
                })
            },
            // 获取树结构结构
            getTreeData (){
                menuService.search().then((ret) => {
                    this.treeData = ret.data
                })
            },
            // 删除分类
            deleteMenu (){
                if (!this.nodeSelected) {
                    xmview.showTip('warning', '请先选中一个分类')
                    return
                }
                let nodeitem = this.nodeItem //查看是子节点
                let node = this.nodeSelected
                if (node && nodeitem.childNodes.length > 0) {
                    xmview.showTip('warning', '该分类下还有子分类,不能被删除')
                    return
                }

                this.dialogConfirm.isShow = true
                this.dialogConfirm.msg = `是否确认删除分类 <i style="color:red">${node.label}</i> 吗？`
                this.dialogConfirm.confirmClick = () => {
                    menuService.delete(node.id).then(() => {
                        xmview.showTip('success', '操作成功!')
                        node = null
                        nodeitem = null
                        this.$refs.tree.removeItem(this.nodeSelected,this.nodeparent) // 删除选中元素
                        this.dialogConfirm.isShow = false
                        this.resetForm()
                        
                    })
                }
                this.fetchParam = getFetchParam()
            },
            // 提交表单
            submitForm () {
                this.$refs.form.validate((ret) => {
                    if (!ret) return

                    let p
                    if (this.activeTab === 'add') {
                        if (this.fetchParam.id === 0 || typeof(this.fetchParam.id) == 'undefined') {
                            xmview.showTip('warning', '请先选中一个分类')
                            return
                        }
                        this.fetchParam.parent_id = this.fetchParam.id
                        p = menuService.add(this.fetchParam)
                    } else if (this.activeTab === 'edit') {
                        p = menuService.update(this.fetchParam)
                    } else {
                        this.fetchParam.parent_id = 0
                        p = menuService.add(this.fetchParam)
                    }
        
                    p.then((ret) => {
                        if(this.activeTab === 'add') {
                            this.item.id = ret.data.id
                            this.item.label = this.fetchParam.menu_name
                            this.$refs.tree.addItem(this.item, this.nodeSelected)
                        }else if (this.activeTab==='root') {
                              this.item.id = ret.data.id
                              this.item.label = this.fetchParam.menu_name
                            this.$refs.tree.addItem(this.item)
                        }else if(this.activeTab==='edit') {
                                this.nodeSelected.label = this.fetchParam.menu_name
                        }
                        this.$forceUpdate()
                        xmview.showTip('success', '操作成功!')
                        // this.getTreeData()
                    })
                })
            },
            // 重置表单
            resetForm () {
                this.$refs.form.resetFields()
            },
            // 移动子分类点击
            moveSubMenu () {
                if (!this.nodeSelected) {
                    xmview.showTip('warning', '请先选中一个分类')
                    return
                }
                menuService.search().then((ret) => {
                    this.moveTreeData = ret.data
                    this.dialogTree.isShow = true
                    this.dialogTree.confirmClick = () => {
                        let id = this.nodeSelected.id
                        let to = this.moveToNode.id
                        if (id === to) {
                            xmview.showTip('warning', '请选择不同的分类')
                            return
                        }
                        this.fetchParam.parent_id = to
                        menuService.update(this.fetchParam).then((ret) => {
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
        },
        components: {EditorTree}
    }
    function getFetchParam () {
        return {
            parent_id: void 0,
            menu_name: void '',
            menu_url: void '',
            menu_icon: void '',
            menu_order: void 0,
            disabled: void 0,
            id: void 1,
        }
    }
</script>
