<!--区块管理-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/table";

    .block-manage {
        @extend %justify;
        .content-title {
            padding: 10px 20px;
            background: #f0f3f5;
            text-align: left;
            line-height: 35px;
            button {
                float: right;
                display: block;
            }
        }
        .left-content {
            display: inline-block;
            vertical-align: top;
            width: 25%;
            background: #fff;

            .classify-tree {
                padding: 20px;
            }
        }

        .right-content {
            width: 74%;
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
                    <CourseCategorySelect :placeholder="editPlacehoder" v-model="form.course_category_id"></CourseCategorySelect>
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
                <router-link tag="el-button" :to="{name: 'client-recommend-classifyManage'}">管理分类</router-link>
            </div>
            <div class="classify-tree">
                <el-tree class="leftSubTree" :expand-on-click-node="false" :highlight-current="true" :data="category.data"
                         :props="defaultProps" @node-expand="leftClassifyExpend" @node-click="leftClassifyClick"></el-tree>
            </div>
        </section>
        <section class="right-content">
            <div class="content-title">
                <span v-if="category.title">{{category.title}}-</span>区块列表
                <el-button @click="addForm = true">添加区块</el-button>
            </div>
            <div class="content-list">
                <el-table v-loading="section.loading" border :data="section.data">
                    <el-table-column prop="name" label="名称"></el-table-column>
                    <el-table-column prop="course_category_name" label="绑定栏目" width="200">
                        <template scope="scope">
                            {{scope.row.course_category_name || '无'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="sort" label="排序" width="100"></el-table-column>
                    <el-table-column prop="update_time_name" label="更新时间" width="200"></el-table-column>
                    <el-table-column prop="operate" label="操作" width="100">
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
                            @current-change="sectionPageChange"
                            :current-page="section.page"
                            :page-size="section.page_size"
                            small
                            layout="prev, pager, next"
                            :total="section.total">
                    </el-pagination>
                </div>
            </div>
        </section>
    </article>
</template>
<script>
    import sectionService from '../../../services/sectionService'
    import CourseCategorySelect from '../../component/select/CourseCategory.vue'
    export default {
        components: {
            CourseCategorySelect
        },
        data () {
            return {
                category: {
                    currentData: null,
                    loading: false,
                    title: '',
                    data: []
                },
                formTitle: '', // 添加/编辑区块标题
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                editPlacehoder: '',
                form: {                // 表单属性值
                    name: '',          // 名称
                    sort: '',          // 排序
                    category_id: '',   // 分类ID
                    course_category_id: ''       // 绑定的栏目
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
                section: {
                    loading: false,
                    data: [],
                    page: 1,
                    page_size: 10,
                    total: 0
                },
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
            }
        },
        created () {
            this.category.loading = true
            this.getCategoryTree().then((ret) => {
                this.category.data = ret
                xmview.setContentLoading(false)
                this.category.loading = false
                this.category.currentData = ret[0]
                this.getSectionData()
            })
        },
        methods: {
            // 获取左侧分类
            getCategoryTree (id) {
                return sectionService.getSectionCategoryTree({id}).then((ret) => {
                    ret.map((item) => {
                        item.children = item.has_children ? [{label: '加载中...'}] : null
                    })
                    return ret
                })
            },
            leftClassifyClick (item) { // 左侧列表按照分类搜索
                this.category.title = item.name
                // 获取区块数据
                this.category.currentData = item
                this.getSectionData()
            },
            leftClassifyExpend (item) {
                if (item.has_children) {
                    this.category.loading = true
                    this.getCategoryTree(item.id).then((ret) => {
                        item.children = ret
                    }).then(() => {
                        this.category.loading = false
                    })
                }
            },
            getSectionData () {
                this.section.loading = true
                return sectionService.getSectionList({
                    page: this.section.page,
                    page_size: this.section.page_size,
                    category_id: this.category.currentData.id
                }).then((ret) => {
                    this.section.data = ret.data
                    this.section.total = ret.total
                    this.section.loading = false
                })
            },
            handleDelete (index, row) {
                xmview.showDialog(`确认要删除课程【<i style="color:red">${row.name}</i>】吗？`, () => {
                    sectionService.delSection(row.id).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getSectionData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
            submit (form) { // 表单提交
                this.form.category_id = this.category.currentData.id
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let reqFn = sectionService.createSection
                        let msg = '添加成功'
                        if (this.form.id) {
                            reqFn = sectionService.updateSection
                            msg = '修改成功'
                        }
                        reqFn(this.form).then(() => {
                            xmview.showTip('success', msg)
                            this.addForm = false
                            this.getSectionData()
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            update (index, row) {
                this.addForm = true
                this.formTitle = '编辑区块：' + row.name
                // 调用接口 获取数据并赋值给this.form
                this.editPlacehoder = row.course_category_name ? row.course_category_name : '请选择'
                this.form = row
            },
            sectionPageChange (val) {
                this.section.page = val
                this.getSectionData()
            }
        }
    }
</script>
