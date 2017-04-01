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
            <el-button type="primary" @click="addNewCategory = true"><i class="el-icon-plus"></i>添加分类</el-button>
        </div>
        <article class="article-category-content">
            <section class="left-content" v-if="!addNewCategory">
                <el-tree
                        :default-expanded-keys="[2]"
                        :default-checked-keys="[2]"
                        node-key="id"
                        :show-checkbox="true"
                        :check-strictly="true"
                        class="leftSubTree"
                        :highlight-current="true"
                        :data="categoryData"
                        :props="defaultProps"
                        @node-click="leftClassifyClick"></el-tree>
            </section>
            <section class="right-content">
                <el-tabs v-model="activeName" v-if="!addNewCategory" @tab-click="handleClick">
                    <el-tab-pane label="修改分类" name="first"></el-tab-pane>
                    <el-tab-pane label="添加子分类" name="second"></el-tab-pane>
                    <el-tab-pane label="移动分类" name="third"></el-tab-pane>
                    <el-tab-pane label="移动分类下内容" name="fourth"></el-tab-pane>
                    <el-tab-pane label="删除分类" name="fifth"></el-tab-pane>
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
                        <el-button type="primary" @click="submit('form')">修改</el-button>
                        <el-button v-if="addNewCategory" @click="addNewCategory = false">取消</el-button>
                    </div>
                </div>
            </section>
        </article>
    </article>
</template>
<script lang="babel">
    let id = 1000
    export default {
        data () {
            return {
                addNewCategory: false,
                activeName: 'second',
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
                        label: '一级 2'
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                form: {
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
            xmview.setContentLoading(false)
        },
        methods: {
            leftClassifyClick (item) { // 左侧列表按照分类搜索
                console.log('调用接口数据 并赋值给blockData')
                this.currentClass = item.label
            },
            handleClick (tab, event) {
                console.log(tab, event)
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
            append (store, data) {
                store.append({id: id++, label: 'testtest', children: []}, data)
            },
            remove (store, data) {
                store.remove(data)
            },
            renderContent (h, {node, data, store}) {
//                return (
//                    <span>
//                        <span>
//                          <span>{node.label}</span>
//                        </span>
//                        <span style="float: right; margin-right: 20px">
//                          <el-button size="mini" on-click={ () => this.append(store, data) }>Append</el-button>
//                          <el-button size="mini" on-click={ () => this.remove(store, data) }>Delete</el-button>
//                        </span>
//                    </span>
//                )
            }
        }
    }
</script>
