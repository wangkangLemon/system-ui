<!--区块管理-->
<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/table";

    .block-manage {
        @extend %justify;
        .content-title {
            padding: 10px 20px;
            background: #ededed;
            text-align: right;
            line-height: 35px;
            button {
                float: right;
                display: block;
            }
        }
        .left-content {
            display: inline-block;
            vertical-align: top;
            width: 35%;
            background: #fff;

            .classify-tree {
                padding: 20px;
            }
        }

        .right-content {
            width: 62%;
            display: inline-block;
            vertical-align: top;
            background: #fff;
            padding-bottom: 20px;

            .content-list {
                padding: 20px;
            }
            .el-pagination {
                float: right;
                margin-top: 10px;
            }
        }
    }
</style>
<template>
    <article class="block-manage">
        <!--添加/编辑区块-->
        <el-dialog v-model="addForm" :title="formTitle" size="tiny">
            <el-form label-position="top" class="addForm" :model="form" :rules="rules" ref="form">
                <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sort" label="排序" :label-width="formLabelWidth">
                    <el-input v-model="form.sort" placeholder="最小的排在前面" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="绑定公开课栏目（可选）" :label-width="formLabelWidth">
                    <el-button @click="cateSubTree = !cateSubTree">
                        {{form.category || '选择栏目'}}
                        <i class="el-icon-caret-bottom"></i>
                    </el-button>
                    <el-tree class="cateSubTree" v-if="cateSubTree" :highlight-current="true" :data="cateSubTreeData"
                             :props="defaultProps" @node-click="cateSubTreeClick"></el-tree>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <section class="left-content">
            <div class="content-title">
                所有分类
                <el-button>管理分类</el-button>
            </div>
            <div class="classify-tree">
                <el-tree class="leftSubTree" :highlight-current="true" :data="leftSubTreeData"
                         :props="defaultProps" @node-click="leftClassifyClick"></el-tree>
            </div>
        </section>
        <section class="right-content">
            <div class="content-title">
                <span v-if="currentClass">{{currentClass}}-</span>区块列表
                <el-button @click="addForm = true">添加区块</el-button>
            </div>
            <div class="content-list">
                <el-table border :data="blockData">
                    <el-table-column property="name" label="名称"></el-table-column>
                    <el-table-column property="bindCate" label="绑定栏目" width="200"></el-table-column>
                    <el-table-column property="sort" label="排序" width="150"></el-table-column>
                    <el-table-column property="updateTime" label="更新时间" width="150"></el-table-column>
                    <el-table-column prop="operate" label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click="update(scope.$index, scope.row)">
                                编辑
                            </el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="block">
                    <el-pagination
                            small
                            layout="prev, pager, next"
                            :total="12">
                    </el-pagination>
                </div>
            </div>
        </section>
        <!--删除弹窗-->
        <delete-dialog :text="deleteItemName" :isShow="deletDialog" :callback="deleteItem"></delete-dialog>
    </article>
</template>
<script lang="babel">
    import deleteDialog from '../../component/dialog/Delete.vue'
    export default {
        data () {
            return {
                cateSubTree: false, // 是否显示
                cateSubTreeData: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 2,
                        label: '二级 1-1',
                        children: [{
                            id: 3,
                            label: '三级 1-1-1'
                        }]
                    }]
                }, { // 添加/ 编辑区块的栏目分类数据
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }],
                formTitle: '', // 添加/编辑区块标题
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                form: {                // 表单属性值
                    name: '',          // 名称
                    sort: '',          // 排序
                    category: ''       // 绑定的栏目
                },
                rules: {
                    name: [
                        {
                            required: true,
                            message: '名称不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                deleteItemName: '', // 要删除的列表名称
                deletDialog: false, // 是否显示
                currentClass: '', // 选择的当前分类
                blockData: [
                    {
                        name: '推荐课程',
                        bindCate: '无',
                        sort: '3',
                        updateTime: '2012-2-23'
                    }
                ], // 区块数据
                leftSubTreeData: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 2,
                        label: '二级 1-1',
                        children: [{
                            id: 3,
                            label: '三级 1-1-1'
                        }]
                    }]
                }, { // 左侧分类数据
                    label: '一级 2',
                    children: [{
                        label: '二级 2-1',
                        children: [{
                            label: '三级 2-1-1'
                        }]
                    }, {
                        label: '二级 2-2',
                        children: [{
                            label: '三级 2-2-1'
                        }]
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
            }
        },
        components: {
            deleteDialog
        },
        methods: {
            leftClassifyClick (item) { // 左侧列表按照分类搜索
                console.log('调用接口数据 并赋值给blockData')
                this.currentClass = item.label
            },
            cateSubTreeClick (item) {
                if (item.children == undefined) {
                    this.form.category = item.label
                }
            },
            deleteItem (confirm) {
                this.deletDialog = false
                if (!confirm) {
                    return false
                }
                // 以下执行接口删除动作
                console.log(11)
            },
            handleDelete (index, row) {
                this.deleteItemName = row.name
                this.deletDialog = true
            },
            submit (form) { // 表单提交
                this.$refs[form].validate((valid) => {
                    console.log(valid)
                    if (valid) {
                        console.log(1)
                    } else {
                        return false
                    }
                })
            },
            update (index, row) {
                this.addForm = true
                this.formTitle = '编辑区块：' + row.name
                // 调用接口 获取数据并赋值给this.form
                this.form = {
                    name: 1,
                    sort: 10,
                    category: '编辑'
                }
            }
        }
    }
</script>
