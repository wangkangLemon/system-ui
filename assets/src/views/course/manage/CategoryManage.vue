<!--栏目管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";

    #course-manage-coursecategory {
        @extend %content-container;

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
    }
</style>

<template>
    <article id="course-manage-coursecategory">
        <section class="left-container">
            <CourseCategoryTree :onNodeClick="treeNodeClick.bind(this,1)"></CourseCategoryTree>
        </section>

        <section class="right-container">
            <div>
                <el-button :class="{'btn-selected': activeTab == 'edit'}" @click="activeTab = 'edit'">修改栏目</el-button>
                <el-button :class="{'btn-selected': activeTab == 'add'}" @click="activeTab = 'add'">添加子栏目</el-button>

                <el-button>移动子栏目</el-button>
                <el-button>移动组栏目下内容</el-button>
                <el-button type="danger">删除栏目</el-button>
            </div>

            <el-card class="edit-content">
                <el-form label-position="right" label-width="90px" :rules="rules" :model="fetchParam" ref="form">
                    <el-form-item label="分类名称" prop="name">
                        <el-input v-model="fetchParam.name"></el-input>
                    </el-form-item>
                    <el-form-item label="栏目logo" prop="image">
                        <UploadImg ref="uploadImg" :defaultImg="fetchParam.image" :url="uploadImgUrl"
                                   :onSuccess="handleImgUploaded"></UploadImg>
                    </el-form-item>
                    <el-form-item label="栏目排序" prop="sort">
                        <el-input placeholder="最小的排在前面" v-model.number="fetchParam.sort"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="info" @click="submitForm">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </section>
    </article>
</template>

<script type="text/jsx">
    import courseService from '../../../services/courseService'
    import treeUtils from '../../../utils/treeUtils'
    import CourseCategoryTree from '../../component/tree/CourseCategory.vue'
    import UploadImg from '../../component/upload/UploadImg.vue'

    export default{
        data () {
            return {
                activeTab: 'add',
                uploadImgUrl: void 0,
                nodeSelected: void 0, // 被训中的node节点
                fetchParam: {
                    parent_id: void 0,
                    name: void 0,
                    image: void 0,
                    sort: void 0,
                    id: 0
                },
                rules: {
                    name: [
                        {required: true, message: '请输入栏目名称', trigger: 'blur'},
                    ],
                    image: [
                        {required: true, message: '请上传栏目logo', trigger: 'blur'}
                    ]
                }
            }
        },
        activated () {
            this.uploadImgUrl = courseService.getUploadCategoryImgUrl()
        },
        methods: {
            // 添加栏目
            addCategory (node, data, store) {
                store.preventDefault()
                store.stopPropagation()
            },
            deleteCategory (node, data, store){
                store.preventDefault()
                store.stopPropagation()
            },
            treeNodeClick (type, data) {
                if (type == 1) {
                    this.$refs.uploadImg.clearFiles()
                    this.nodeSelected = data
                    this.fetchParam = data.item
                    this.activeTab = 'edit'
                }
            },
            // 图片上传完毕
            handleImgUploaded (response) {
                this.fetchParam.image = response.data.url
            },
            // 提交表单
            submitForm () {
                this.$refs.form.validate((ret) => {
                    if (!ret) return

                    let p
                    if (this.activeTab === 'add')
                        p = courseService.addCategory(this.fetchParam)
                    else
                        p = courseService.updateCategory(this.fetchParam)

                    p.then((ret) => {
                        xmview.showTip('success', '操作成功!')
                        if (this.activeTab === 'edit') {
                            this.nodeSelected.label = this.fetchParam.name
                            this.nodeSelected.item = this.fetchParam
                            this.$forceUpdate()
                        }
                    })
                })
            },
        },
        components: {CourseCategoryTree, UploadImg}
    }
</script>
