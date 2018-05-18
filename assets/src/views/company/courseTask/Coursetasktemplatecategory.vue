<!--分类管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/mixins";

    #course-task-template-category {
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
    <article id="course-task-template-category">
        <section class="manage-container">
            <el-button type="primary" @click="addRootCategory">新建分类</el-button>
        </section>

        <section class="left-container">
            <CourseTaskTemplateCategoryTree v-model="treeData" ref="courseTaskTemplateCategory"
                                            :onNodeClick="treeNodeClick.bind(this,1)"></CourseTaskTemplateCategoryTree>
        </section>

        <section class="right-container">
            <div v-if="fetchParam.parent_id != 0">
                <el-button :class="{'btn-selected': activeTab == 'edit'}" @click="activeTab = 'edit'">修改分类</el-button>
                <el-button :class="{'btn-selected': activeTab == 'add'}" @click="activeTab = 'add'">添加子分类</el-button>

                <el-button @click="moveSubCategory">移动分类</el-button>
                <el-button @click="moveSubCategoryContent">移动分类下内容</el-button>
                <el-button type="danger" @click="deleteCategory">删除分类</el-button>
            </div>

            <div v-if="fetchParam.parent_id === 0">
                <el-button type="primary">添加根节点</el-button>
            </div>
            <el-card class="edit-content">
                <el-form label-position="right" label-width="90px" :rules="rules" :model="fetchParam" ref="form">
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="fetchParam.name" :disabled="fetchParam.parent_id == null"></el-input>
                    </el-form-item>
                    <el-form-item label="图片" prop="image">
                        <UploadImg ref="uploadImg" :defaultImg="fetchParam.image" :url="uploadImgUrl"
                                   :onSuccess="handleImgUploaded"></UploadImg>
                    </el-form-item>
                    <el-form-item label="分类排序" prop="sort">
                        <el-input :disabled="fetchParam.parent_id == null" placeholder="最小的排在前面" v-model.number="fetchParam.sort"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button :disabled="fetchParam.parent_id == null" type="info" @click="submitForm">保存</el-button>
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
                    <CourseTaskTemplateCategoryTree v-model="treeData" node-key="id"
                                                    :onNodeClick="treeNodeClick.bind(this,2)"></CourseTaskTemplateCategoryTree>
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
    import companyService from '../../../services/companyService'
    import treeUtils from '../../../utils/treeUtils'
    import CourseTaskTemplateCategoryTree from '../../component/tree/CourseTaskTemplateCategory.vue'
    import UploadImg from '../../component/upload/UploadImg.vue'

    export default{
        data () {
            return {
                activeTab: 'add',
                uploadImgUrl: void 0,
                nodeSelected: void 0, // 被选中的node节点
                nodeParentSelected: void 0, // 被选中node节点的父节点
                moveToNode: void 0, // 将要移动到最终的分类
                treeData: [],
                dialogConfirm: {
                    isShow: false,
                    msg: '',
                    confirmClick: {}
                },
                dialogTree: {
                    isShow: false,
                    confirmClick: {}
                },
                fetchParam: {
                    parent_id: void 0,
                    name: void 0,
                    image: void 0,
                    sort: void 0,
                    id: 0
                },
                rules: {
                    name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                    ]
                }
            }
        },
        watch: {
            'activeTab'(val) {
                if (val === 'add') {
                    this.resetForm()
                }
            },
        },
        activated () {
            xmview.setContentLoading(false)
            this.uploadImgUrl = companyService.getCategoryImageUrl()
        },
        methods: {
            // 删除分类
            deleteCategory (){
                let node = this.nodeSelected
                if (node && node.children) {
                    xmview.showTip('warning', '该分类下还有子分类,不能被删除')
                    return
                }

                this.dialogConfirm.isShow = true
                this.dialogConfirm.msg = `是否确认删除分类 <i style="color:red">${node.label}</i> 吗？`
                this.dialogConfirm.confirmClick = () => {
                    companyService.delCategory({id: node.value}).then(() => {
                        xmview.showTip('success', '操作成功!')
                        this.$refs.courseTaskTemplateCategory.removeItem(node, this.nodeParentSelected)
                        node = null
                        this.dialogConfirm.isShow = false
                        this.resetForm()
                    })
                }
            },
            // 左边的节点被点击
            treeNodeClick (type, data, node, store) {
                if (type == 1) {
                    if (this.nodeSelected && this.nodeSelected.value === data.value) return
                    this.nodeParentSelected = node.parent// 记录父节点
                    this.nodeSelected = data // 记录当前节点
                    this.$refs.uploadImg.clearFiles()
                    this.fetchParam = data.item
                    this.fetchParam.parent_id = data.value // 重新指向当前的id
                    this.activeTab = 'edit'
                } else if (type == 2) {
                    this.moveToNode = node
                }
            },
            // 图片上传完毕
            handleImgUploaded (response) {
                this.fetchParam.image = response.data.url
            },
            // 新建根节点
            addRootCategory () {
                this.activeTab = 'add'
                // 清空选中项
                this.$refs.courseTaskTemplateCategory.clearSelected()
                this.fetchParam.parent_id = 0
            },
            // 提交表单
            submitForm () {
                this.$refs.form.validate((ret) => {
                    if (!ret) return

                    let p
                    if (this.activeTab === 'add')
                        p = companyService.createCategory(this.fetchParam)
                    else
                        p = companyService.updateCategory(this.fetchParam)

                    p.then((ret) => {
                        xmview.showTip('success', '操作成功!')
                        if (this.activeTab === 'edit') {
                            this.nodeSelected.label = this.fetchParam.name
                            this.nodeSelected.item = this.fetchParam
                            this.$forceUpdate()
                        } else {
//                            this.fetchParam.id = ret.data.id
                            let addedItem = {
                                label: this.fetchParam.name,
                                value: this.fetchParam.id,
                                item: this.fetchParam
                            }

                            // 如果是添加的根节点
                            if (this.fetchParam.parent_id === 0) {
                                this.treeData.push(addedItem)
                            } else if (!this.nodeSelected.children) {
                                this.nodeSelected.children = [{label: '加载中...'}]
                            } else if (this.nodeSelected.children[0].value) {
                                this.nodeSelected.children.push(addedItem)
                            }
                        }
                    })
                })
            },
            // 重置表单
            resetForm () {
                this.$refs.form.resetFields()
            },
            // 移动子分类点击
            moveSubCategory () {
                if (!this.nodeSelected) {
                    xmview.showTip('warning', '请先选中一个分类')
                    return
                }

                this.dialogTree.isShow = true
                this.dialogTree.confirmClick = () => {
                    let id = this.nodeSelected.value
                    let to = this.moveToNode.data.value
                    if (id === to) {
                        xmview.showTip('warning', '请选择不同的分类')
                        return
                    }
                    companyService.moveCategory({id, to}).then((ret) => {
                        // 重新渲染树节点
                        if (ret.code === 0) {
                            xmview.showTip('success', '操作成功!')
                            this.$refs.courseTaskTemplateCategory.initData()
                            this.dialogTree.isShow = false
                        } else if (ret.code === 1) {
                            xmview.showTip('error', ret.message)
                        }
                    })
                }
            },
            // 移动分类下的内容
            moveSubCategoryContent () {
                if (!this.nodeSelected) {
                    xmview.showTip('warning', '请先选中一个分类')
                    return
                }

                this.dialogTree.isShow = true
                this.dialogTree.confirmClick = () => {
                    let id = this.nodeSelected.value
                    let to = this.moveToNode.data.value
                    if (id === to) {
                        xmview.showTip('warning', '请选择不同的分类')
                        return
                    }
                    companyService.moveCategoryContent({id, to}).then((ret) => {
                        // 重新渲染树节点
                        if (ret.code === 0) {
                            xmview.showTip('success', '操作成功!')
                            this.dialogTree.isShow = false
                        } else if (ret.code === 1) {
                            xmview.showTip('error', ret.message)
                        }
                    })
                }
            }
        },
        components: {CourseTaskTemplateCategoryTree, UploadImg}
    }
</script>
