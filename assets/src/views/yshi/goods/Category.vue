<!--分类管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "~utils/mixins/common";
    @import "~utils/mixins/mixins";

    #course-manage-coursecategory {
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
            width: 605px;
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
    <article id="course-manage-coursecategory">
        <section class="manage-container">
            <el-button 
                type="primary" 
                @click="addRootCategory">
                新建分类
            </el-button>
        </section>

        <section class="left-container">
            <ArticleCategoryTree 
                v-model="treeData" 
                type="goods"
                ref="articleCategory"
                :onNodeClick="treeNodeClick.bind(this,1)">
            </ArticleCategoryTree>
        </section>

        <section class="right-container">
            <div v-if="fetchParam.parent_id === 0 && activeTab === 'root'">
                <el-button type="primary" @click>添加根节点</el-button>
            </div>
            <div v-else>
                <el-button 
                    :class="{'btn-selected': activeTab == 'edit'}" 
                    @click="activeTab = 'edit'">
                    修改分类
                </el-button>
                <el-button 
                    :class="{'btn-selected': activeTab == 'add'}" 
                    @click="activeTab = 'add'"
                    :disabled="!fetchParam.has_children">
                    添加子分类
                </el-button>
                <el-button @click="moveSubCategory">移动分类</el-button>
                <el-button @click="moveSubCategoryContent">移动分类下内容</el-button>
                <el-button type="danger" @click="deleteCategory">删除分类</el-button>
            </div>
            <el-card class="edit-content">
                <el-form 
                    label-position="right" 
                    label-width="90px" 
                    :rules="rules" 
                    :model="fetchParam" 
                    ref="form">
                    <el-form-item label="分类名称" prop="name">
                        <el-input 
                            v-model="fetchParam.name" 
                            :disabled="fetchParam.parent_id == null">
                        </el-input>
                    </el-form-item>
                    <!-- <el-form-item label="图片" prop="image">
                        <UploadImg 
                            ref="uploadImg"
                            :disabled="fetchParam.parent_id == null"
                            :defaultImg="fetchParam.image | fillImgPath"
                            :url="uploadImgUrl"
                            :onSuccess="handleImgUploaded">
                        </UploadImg>
                    </el-form-item> -->
                    <el-form-item label="栏目展示">
                        <el-checkbox 
                            v-model="fetchParam.show_in_app"
                            :true-label="1"
                            :false-label="0"
                            :disabled="fetchParam.parent_id == null || !fetchParam.has_children">
                            前端展示
                        </el-checkbox>
                        <el-checkbox 
                            v-model="fetchParam.show_in_com"
                            :true-label="1"
                            :false-label="0"
                            :disabled="!fetchParam.has_children || fetchParam.parent_id == null">
                            后端展示
                        </el-checkbox>
                    </el-form-item>
                    <el-form-item label="分类排序" prop="sort">
                        <el-input 
                            :disabled="fetchParam.parent_id == null"
                            placeholder="最小的排在前面" 
                            v-model.number="fetchParam.sort">
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button 
                            :disabled="fetchParam.parent_id == null" 
                            type="primary" 
                            @click="submitForm">
                            保存
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </section>

        <el-dialog 
            title="操作提示" 
            :visible.sync="dialogConfirm.isShow"
             width="30%">
            <span v-html="dialogConfirm.msg"></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogConfirm.isShow = false">取 消</el-button>
                <el-button type="primary" @click="dialogConfirm.confirmClick">确 定</el-button>
            </span>
        </el-dialog>

        <!--移动子分类的弹出框-->
        <el-dialog 
            v-if="dialogTree.isShow"
            title="移动分类" 
            :visible.sync="dialogTree.isShow">
            <article>
                <section>
                    移动分类【
                    <span style="color:red">
                        {{nodeSelected && nodeSelected.label}}
                    </span> <i>】到</i>
                </section>
                <section>
                    <ArticleCategoryTree 
                        v-model="treeData" 
                        node-key="id"
                        type="goods"
                        :onNodeClick="treeNodeClick.bind(this,2)">
                    </ArticleCategoryTree>
                </section>
            </article>
            <span slot="footer">
                <el-button @click="dialogTree.isShow = false">取 消</el-button>
                <el-button type="primary" @click="dialogTree.confirmClick">确 定</el-button>
            </span>
        </el-dialog>
    </article>
</template>

<script>
    import goodsService from 'services/yshi/goodsService'
    import treeUtils from 'utils/treeUtils'
    import ArticleCategoryTree from 'components/tree/ArticleCategory.vue'
    import UploadImg from 'components/upload/UploadImg.vue'
    import clone from 'clone'
    export default{
        data () {
            return {
                activeTab: 'add',
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
                fetchParam: getFetchParam(),
                rules: {
                    name: [
                        {required: true, message: '请输入分类名称', trigger: 'blur'},
                    ]
                }
            }
        },
        watch: {
            'activeTab'(val) {
                if (!this.nodeSelected && val !== 'root') {
                    xmview.showTip('warning', '请先选中一个分类')
                    return
                }
                if (val === 'add') {
                    let show_in_app = this.fetchParam.show_in_app
                    let show_in_com = this.fetchParam.show_in_com
                    this.resetForm()
                    this.fetchParam.show_in_app = show_in_app
                    this.fetchParam.show_in_com = show_in_com
                } else if (val === 'edit') {
                    this.fetchParam = clone(this.nodeSelected.item)
                    this.fetchParam.has_children = !this.nodeSelected.item.parent_id
                    // this.fetchParam.parent_id = this.nodeSelected.item.parent_id
                }
            },
        },
        created () {
            xmview.setContentLoading(false)
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
                    goodsService.delCategory({id: node.value}).then(() => {
                        xmview.showTip('success', '操作成功!')
                        this.$refs.articleCategory.removeItem(node, this.nodeParentSelected)
                        node = null
                        this.dialogConfirm.isShow = false
                        this.resetForm()
                    })
                }
                this.fetchParam = getFetchParam()
            },
            // 左边的节点被点击
            treeNodeClick (type, data, node, store) {
                if (type == 1) {
                    if (this.nodeSelected && this.nodeSelected.value === data.value) return
                    this.activeTab = 'edit'
                    this.nodeParentSelected = node.parent// 记录父节点
                    if (data.item.parent_id && data.item.parent_id === this.nodeParentSelected.data.item.id) {
                        var show_in_app = this.nodeParentSelected.data.item.show_in_app
                        var show_in_com = this.nodeParentSelected.data.item.show_in_com
                        var nodeParentSelectedId = this.nodeParentSelected.data.item.id
                    }
                    this.nodeSelected = data // 记录当前节点
                    // this.$refs.uploadImg.clearFiles()
                    // this.$refs.form.resetFields()
                    this.fetchParam = clone(data.item)
                    this.fetchParam.has_children = !data.item.parent_id
                    // this.fetchParam.parent_id = data.value // 重新指向当前的id
                    // console.log(this.fetchParam, this.nodeSelected)
                    if (data.item.parent_id && data.item.parent_id === nodeParentSelectedId) {
                        this.fetchParam.show_in_app = show_in_app
                        this.fetchParam.show_in_com = show_in_com
                    }
                } else if (type == 2) {
                    this.moveToNode = node
                    console.log(this.moveToNode)

                }
            },
            // 图片上传完毕
            handleImgUploaded (response) {
                this.fetchParam.image = response.data.url
            },
            // 新建根节点
            addRootCategory () {
                this.activeTab = 'root'
                // 清空选中项
                this.$refs.articleCategory.clearSelected()
                this.resetForm()
                this.fetchParam.parent_id = 0
                this.fetchParam.has_children = true
            },
            // 提交表单
            submitForm () {
                this.$refs.form.validate((ret) => {
                    if (!ret) return

                    let p
                    if (this.activeTab != 'edit') {
                        if (this.activeTab === 'add') {
                            this.fetchParam.parent_id = this.nodeSelected.value
                        }
                        p = goodsService.createCategory(this.fetchParam)
                    } else {
                        p = goodsService.updateCategory(this.fetchParam)
                    }
                    p.then((ret) => {
                        xmview.showTip('success', '操作成功!')
                        // debugger
                        console.log(this.fetchParam)
                        if (this.activeTab === 'edit') {
                            this.nodeSelected.label = this.fetchParam.name
                            this.nodeSelected.item = this.fetchParam
                            this.$forceUpdate()
                        } else {
                            let addedItem = {
                                label: this.fetchParam.name,
                                value: this.fetchParam.id,
                                item: this.fetchParam
                            }
                            // 如果是添加的根节点
                            if (this.activeTab === 'root') {
                                this.$refs.articleCategory.initData()
                            } else if (!this.nodeSelected.children) {
                                this.nodeSelected.children = [{label: '加载中...'}]
                            } else if (this.nodeSelected.children[0].value) {
                                this.nodeSelected.children.push(addedItem) 
                                this.fetchParam = getFetchParam()
                            }
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                })
            },
            // 重置表单
            resetForm () {
                let parent_id = this.fetchParam.parent_id
                this.fetchParam = getFetchParam()
                this.fetchParam.parent_id = parent_id
            },
            // 移动子分类点击
            moveSubCategory () {
                if (!this.nodeSelected) {
                    xmview.showTip('warning', '请先选中一个分类')
                    return
                }
                if (this.fetchParam.has_children) {
                    xmview.showTip('warning', '不能移动根节点')
                    return
                }
                this.dialogTree.isShow = true
                this.dialogTree.confirmClick = () => {
                    let id = this.nodeSelected.value     // 当前节点
                    let to = this.moveToNode.data.value  // 移动区的节点
                    let has_children = this.moveToNode.data.item.has_children
                    if (id === to) {
                        xmview.showTip('warning', '请选择不同的分类')
                        return
                    }
                    if (!has_children) {
                        xmview.showTip('warning', '不能移动到子分类下，请选择顶级分类')
                        return
                    }
                    goodsService.moveCategory({id, to}).then((ret) => {
                        // 重新渲染树节点
                        if (ret.code === 0) {
                            xmview.showTip('success', '操作成功!')
                            this.$refs.articleCategory.initData()
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
                    goodsService.moveCategoryContent({id, to}).then((ret) => {
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
        components: {ArticleCategoryTree, UploadImg}
    }
    function getFetchParam () {
        return {
            parent_id: void 0,
            name: void 0,
            // image: void 0,
            sort: void 0,
            show_in_app: 0,
            show_in_com: 0,
            id: 0
        }
    }
</script>
