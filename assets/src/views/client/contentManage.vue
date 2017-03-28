<!--内容维护-->
<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/table";

    .content-manage {
        // 同步时候的遮罩层
        .keep {
            position: absolute;
            width: 100%;
            left: 0;
            height: 250px;
            z-index: 99;
            background: rgba(255, 255, 255, 0.7);
            top: 140px;
        }
        .synchronize {
            background: cornflowerblue;
            color: #fff;
            padding: 10px;
            line-height: 35px;
            margin-bottom: 20px;
            .el-button {
                float: right;
            }
        }
        .addForm {
            text-align: left;
            text-align-last: left;
            .tag {
                span {
                    padding: 10px;
                    border: 1px solid #e2e7eb;
                    background: #fff;
                    border-right: none;
                    &:last-of-type {
                        border-right: 1px solid #e2e7eb;
                    }
                    &:hover {
                        background: #e2e7eb;
                    }
                    &.active {
                        background: #e2e7eb;
                    }
                }
            }
        }
        .dialog-footer {
            text-align: right;
            float: right;
            margin-bottom: 30px;
        }
        @extend %justify;
        .main-container {
            background: transparent;

            .search {
                position: relative;
                padding-top: 0;
                .categorySubTree {
                    position: absolute;
                    z-index: 9;
                    width: 20%;
                }
            }
        }
        .left-content {
            display: inline-block;
            vertical-align: top;
            width: 35%;

            .title {
                padding: 10px 20px;
                background: #ededed;
                position: relative;
                .leftSubTree {
                    position: absolute;
                    z-index: 5;
                    width: 50%;
                }
            }
            .left-list {
                background: #fff;
                padding: 20px;

                .list {
                    margin-bottom: 10px;
                    .name {
                        font-size: 16px;
                        padding-top: 10px;
                    }
                    .class {
                        color: #ddd;
                        font-size: 12px;
                        padding-bottom: 10px;
                    }
                }
            }
        }
        .right-content {
            width: 62%;
            display: inline-block;
            vertical-align: top;
            background: #fff;

            .title {
                padding: 10px 20px;
                background: #ededed;
                text-align: right;
                line-height: 35px;
                span {
                    float: right;
                    display: block;
                }
            }
            .right-list {
                padding: 20px;
                padding-bottom: 60px;
                .cell {
                    i.tag {
                        padding: 5px;
                        background: cornflowerblue;
                        color: #fff;
                        border-radius: 5px;
                    }
                    i.el-icon-picture {
                        position: relative;
                        .img-wrap {
                            padding: 5px;
                            border: 1px solid #ededed;
                            width: 213px;
                            height: 123px;
                            position: absolute;
                            bottom: -123px;
                            right: -213px;
                            z-index: 999 !important;
                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }
                }
            }
            .el-pagination {
                float: right;
                margin-top: 10px;
            }
        }
        .chooseCourse {
            .block {
                text-align: center !important;
                width: 50%;
                margin: 0 auto;
                margin-top: 10px;
            }
        }
    }
</style>
<template>
    <article class="content-manage">
        <!--添加/编辑课程-->
        <el-dialog v-model="addForm" :title="formTitle">
            <div class="keep" v-if="isKeep && isUpdate"></div>
            <div class="synchronize" @click="isKeep = false" v-if="isUpdate && isKeep">课程：{{form.title}}
                <el-button>关闭同步</el-button>
            </div>
            <div class="synchronize" @click="isKeep = true" v-if="isUpdate && !isKeep">课程：{{form.title}}
                <el-button>开启同步</el-button>
            </div>
            <el-form label-position="top" class="addForm" :model="form" :rules="rules" ref="form">
                <el-form-item prop="title" label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.title" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="link" label="链接" :label-width="formLabelWidth">
                    <el-input v-model="form.link" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="image" label="图片" :label-width="formLabelWidth">
                    <el-input v-model="form.image" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="description" label="描述" :label-width="formLabelWidth">
                    <el-input type="textarea" :rows="3" v-model="form.description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item class="tag" label="标签" :label-width="formLabelWidth">
                    <span @click="toggleTag(index)" :class="{'active': index == form.currentTag}"
                          v-for="(item, index) in form.tags">{{item}}</span>
                </el-form-item>
                <el-form-item prop="date" label="日期" :label-width="formLabelWidth">
                    <el-date-picker v-model="form.date" type="date"/>
                </el-form-item>
                <el-form-item prop="sort" label="排序" :label-width="formLabelWidth">
                    <el-input v-model="form.sort" auto-complete="off" placeholder="排序越大越靠前，留空则自动设为最靠前的排序"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <!--选取课程-->
        <el-dialog class="chooseCourse main-container" title="选取课程" v-model="chooseCourse">
            <section class="search">
                <div><label>名称</label>
                    <div class="el-input">
                        <input type="text" @keyup.enter="nameSearch($event)" autocomplete="off" class="el-input__inner">
                    </div>
                </div>
                <div>
                    <el-button @click="categoryShow = !categoryShow">栏目分类</el-button>
                    <el-tree class="categorySubTree" v-if="categoryShow" :highlight-current="true" :data="categoryData"
                             :props="defaultProps" @node-click="chooseCategory"></el-tree>
                </div>
            </section>
            <el-table @row-click="selectCurrentCourse" border :data="courseData" :highlight-current-row="true">
                <el-table-column property="course" label="课程"></el-table-column>
                <el-table-column property="company" label="企业" width="200"></el-table-column>
                <el-table-column property="type" label="类型" width="150"></el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        layout="prev, pager, next"
                        :total="1000">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="chooseCourse = false">取 消</el-button>
                <el-button type="primary" @click="courseConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <section class="left-content">
            <div class="classify title">
                <el-button @click="leftSubTree = !leftSubTree">
                    分类
                    <i class="el-icon-caret-bottom"></i>
                </el-button>
                <el-tree class="leftSubTree" v-if="leftSubTree" :highlight-current="true" :data="leftSubTreeData"
                         :props="defaultProps" @node-click="leftClassifyClick"></el-tree>
            </div>
            <div class="left-list">
                <div class="list">
                    <el-table :show-header="false" :highlight-current-row="true" :data="classifyData" border
                              style="width: 100%">
                        <el-table-column label="日期">
                            <template scope="scope">
                                <h2 class="name">{{scope.row.name}}</h2>
                                <p class="class">{{scope.row.class}}</p>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-pagination
                        small
                        layout="prev, pager, next"
                        :total="12">
                </el-pagination>
            </div>
        </section>
        <section class="right-content">
            <div class="title">
                test-内容列表（绑定公开）
                <span>
                    <el-button @click="chooseCourse = true">选取课程</el-button>
                    <el-button @click="addCourse('form')">添加内容</el-button>
                </span>
            </div>
            <div class="right-list">
                <el-table border :data="resultData">
                    <el-table-column
                            label="序号"
                            type="index"
                            width="100%">
                    </el-table-column>
                    <el-table-column
                            class="course-column"
                            label="标题"
                            width="200">
                        <template scope="scope">
                            <i class="tag">课程</i>
                            {{scope.row.title}}
                            <i class="el-icon-picture">
                                <div class="img-wrap">
                                    <img src="http://localhost:7010/static/img/logo.11729c9.png"/>
                                </div>
                            </i>
                            <el-tooltip class="item" effect="dark" content="与引用内容保持同步" placement="top">
                                <i class="iconfont icon-refresh"></i>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="sort"
                            label="排序"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="200">
                    </el-table-column>
                    <el-table-column prop="operate" label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click="updateCourse(scope.$index, scope.row)">
                                编辑
                                <!--点击详情 form数据变成当前管理员的信息-->
                            </el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                        small
                        layout="prev, pager, next"
                        :total="12">
                </el-pagination>
            </div>
        </section>
        <!--删除弹窗-->
        <delete-dialog :text="deleteItemName" :isShow="deletDialog" :callback="deleteItem"></delete-dialog>
    </article>
</template>
<script lang="babel">
    import deleteDialog from '../component/dialog/Delete.vue'
    export default {
        components: {
            deleteDialog
        },
        data () {
            return {
                isKeep: true, // 是否同步
                isUpdate: false,
                formTitle: '添加内容',
                addForm: false, // 表单弹窗是否显示
                formLabelWidth: '50px', // 表单label的宽度
                form: {                // 表单属性值
                    title: '',          // 标题
                    link: '',       // 链接
                    image: '',        // 图片
                    description: '',         // 描述
                    date: '',       // 日期
                    sort: '',            // 排序
                    tags: ['无', '热门', '最新', '推荐'],
                    currentTag: 0
                },
                rules: {
                    title: [
                        {
                            required: true,
                            message: '标题不能为空',
                            trigger: 'blur'
                        }
                    ],
                    link: [
                        {
                            required: true,
                            message: '链接不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                deleteItemName: '', // 要删除的title
                deletDialog: false,
                courseID: 0, // 选取课程的时候 存储课程ID
                courseName: '', // 选取课程 按照课程名称搜索
                leftSubTree: false, // 左侧分类是否显示
                categoryShow: false, // 选取课程的时候 是否显示栏目分类
                classifyData: [ // 左侧显示的列表数据
                    {
                        id: 1,
                        name: '推荐课程',
                        class: '首页推荐版块'
                    },
                    {
                        id: 2,
                        name: '推荐课程',
                        class: '首页推荐版块'
                    }
                ],
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
                }, {
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
                resultData: [
                    {
                        id: 1,
                        title: '课程',
                        sort: 12,
                        date: '2102'
                    }
                ],
                chooseCourse: false,
                courseData: [ // 选取课程
                    {
                        id: 1,
                        course: '测试一部发布',
                        company: '药视通',
                        type: '文档'
                    },
                    {
                        id: 2,
                        course: '测试',
                        company: '药视通',
                        type: '文档'
                    }
                ],
                categoryData: [{
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
                }, {
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
                }]
            }
        },
        methods: {
            leftClassifyClick (item) { // 左侧列表按照分类搜索
                console.log('调用接口数据 并赋值给classifyData')
            },
            chooseCategory (item) { // 选取课程时按照栏目分类搜索
                // 最后一级的时候调用接口
                if (item.children == undefined) {
                    console.log('调用接口 并赋值给courseDate')
                    this.categoryShow = false
                }
            },
            nameSearch (e) { // 选取课程时按照名称搜索
                console.log(e.target.value)
            },
            selectCurrentCourse (item) { // 选取课程 点击搜索之后的某一行存储当前选择的id 确定的时候调用
                this.courseID = item.id
            },
            courseConfirm () { // 点击确定的时候，进行搜索结果
                console.log(this.courseID)
                // 通过存储的课程ID 调用接口获取数据
                this.chooseCourse = false
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
                this.deleteItemName = row.title
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
            toggleTag (index) {
                this.form.currentTag = index
            },
            updateCourse (index, item) {
                // 根据item.id获取数据 并赋值给form
                this.isUpdate = true
                this.formTitle = '编辑内容'
                this.addForm = true
                setTimeout(() => {
                    this.$refs['form'].resetFields()
                }, 0)
                this.form.title = '哈哈'
            },
            addCourse (form) {
                this.addForm = true
                setTimeout(() => {
                    this.$refs[form].resetFields()
                }, 0)
                this.formTitle = '添加内容'
                this.isUpdate = false
            }
        }
    }
</script>
