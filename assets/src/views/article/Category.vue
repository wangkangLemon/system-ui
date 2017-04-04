<!--文章分类管理-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";

    .article-category {
        .add-category {
            text-align: right;
        }
        .article-category-content {
            background: #fff;
            margin-top: 20px;
            @extend %justify;
            padding: 20px;
            .left-content {
                border-right: 1px solid #ededed;
                display: inline-block;
                vertical-align: top;
                width: 35%;
                .el-icon-plus {
                    margin-right: 10px;
                }
                .el-tree {
                    width: auto;
                    border: none;
                }
            }

            .right-content {
                width: 62%;
                display: inline-block;
                vertical-align: top;
                padding-bottom: 20px;

            }
        }
    }

</style>
<template>
    <article class="article-category">
        <div class="add-category">
            <el-button type="primary" @click="addCategory"><i class="el-icon-plus"></i>添加分类</el-button>
        </div>
        <article class="article-category-content">
            <section class="left-content" v-if="!addNewCategory">
                <el-tree
                        :current-node-key="currentNode.id"
                        :expand-on-click-node="false"
                        :default-expanded-keys="[2]"
                        :default-checked-keys="[2]"
                        node-key="id"
                        class="leftSubTree"
                        :highlight-current="true"
                        :data="categoryData"
                        :props="defaultProps"
                        @node-click="leftClassifyClick"></el-tree>
            </section>
            <section class="right-content">
                <el-tabs v-model="activeName" v-if="!addNewCategory" @tab-click="handleClick">
                    <el-tab-pane label="修改分类" name="1"></el-tab-pane>
                    <el-tab-pane label="添加子分类" name="2"></el-tab-pane>
                    <el-tab-pane label="移动分类" name="3"></el-tab-pane>
                    <el-tab-pane label="移动分类下内容" name="4"></el-tab-pane>
                    <el-tab-pane label="删除分类" name="5"></el-tab-pane>
                </el-tabs>
                <div>
                    <el-form label-position="top" class="addForm" :model="form" :rules="rules" ref="form">
                        <el-form-item prop="name" label="名称">
                            <el-input v-model="form.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item prop="sort" label="排序">
                            <el-input v-model="form.sort" auto-complete="off"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submit('form')">{{buttonText}}</el-button>
                        <el-button v-if="addNewCategory" @click="addNewCategory = false">取消</el-button>
                    </div>
                </div>
            </section>
        </article>
        <!--移动分类弹窗-->
        <el-dialog :title="'移动栏目【' + currentNode.label + '】到'" v-model="moveCategory" size="tiny">
            <el-tree
                    :current-node-key="currentNode.id"
                    node-key="id"
                    class="leftSubTree"
                    :highlight-current="true"
                    :data="categoryData"
                    :props="defaultProps"
                    @node-click="targetFn"></el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="moveCategory = false">取消</el-button>
                <el-button type="primary">保存</el-button>
            </div>
        </el-dialog>
        <!--删除弹窗-->
        <delete-dialog :text="deleteName" v-model="deletDialog" v-on:callback="deleteItem"></delete-dialog>
    </article>
</template>
<script lang="babel">
    import deleteDialog from '../component/dialog/Delete'
    export default {
        components: {
            deleteDialog
        },
        data () {
            return {
                buttonText: '修改',
                targetNode: {}, // 移动到目标分类
                currentNode: {}, // 当前选中节点的key
                moveCategory: false, // 移动分类弹窗的显示状态
                deleteName: '',
                deletDialog: false,
                addNewCategory: false,
                activeName: '1',
                categoryData: [
                    {
                        id: 1,
                        label: '一级 1',
                        children: [
                            {
                                id: 2,
                                label: '二级 1-1',
                                children: [
                                    {
                                        id: 3,
                                        label: '三级 1-1-1'
                                    }
                                ]
                            }
                        ]
                    },
                    { // 左侧分类数据
                        id: 4,
                        label: '一级 2'
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                form: {
                    id: '',
                    name: '',
                    sort: ''
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        created () {
            this.form = {
                name: this.categoryData[0].label,
                id: this.categoryData[0].id,
                sort: this.categoryData[0].id
            }
            this.currentNode = this.categoryData[0]
            xmview.setContentLoading(false)
        },
        methods: {
            deleteItem (confirm) {
                this.deletDialog = false
                if (!confirm) {
                    return false
                }
                // 以下执行接口删除动作
                console.log(11)
            },
            leftClassifyClick (item, node, ele) { // 左侧列表按照分类搜索
                console.log(item)
                console.log(node)
                console.log(ele)
                if (this.activeName == '1') {
                    this.form = {
                        name: item.label,
                        sort: item.id,
                        id: item.id
                    }
                }
                this.currentNode = {
                    id: item.id,
                    label: item.label
                }
//                this.currentClass = item.label
            },
            targetFn (item, node, ele) {
                this.targetNode = item
            },
            handleClick (tab, event) {
                // 添加分类
                if (tab.name == '2') {
                    this.form = {
                        name: '',
                        sort: '',
                        id: ''
                    }
                    this.buttonText = '添加'
                    // 移动分类
                } else if (tab.name == '3' || tab.name == '4') {
                    this.moveCategory = true
                    // 删除分类
                } else if (tab.name == '5') {
                    this.deletDialog = true
                }
            },
            submit (form) { // 表单提交
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(1)
                    } else {
                        return false
                    }
                })
            },
            addCategory () {
                this.addNewCategory = true
                this.form = {
                    name: '',
                    sort: '',
                    id: ''
                }
            }
        }
    }
</script>
