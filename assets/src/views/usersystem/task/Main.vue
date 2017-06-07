<!--活动任务-->
<style lang="scss">
    @import "../../../utils/mixins/topSearch";
    @import "../../../utils/mixins/showDetail";
    @import "../../../utils/mixins/common";

    .task-daily-container {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            margin-top: 10px;
            text-align: right;
        }
    }
</style>
<template>
    <article class="task-daily-container">
        <section class="add">
            <el-button v-if="$route.name == 'play' || $route.name == 'growth'" icon="plus" type="primary" @click="addFn">添加</el-button>
        </section>
        <section class="search">
            <section>
                <i>任务标题</i>
                <el-input @keyup.enter.native="getData" v-model="search.title"></el-input>
            </section>
            <section>
                <i>任务类型</i>
                <el-select clearable @change="getData" v-model="search.user_action_name">
                    <el-option v-for="(item,index) in useraction" :label="item.alias" :value="item.name" :key="index"></el-option>
                </el-select>
            </section>
        </section>
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
                    prop="title"
                    min-width="180"
                    label="任务标题">
            </el-table-column>
            <el-table-column
                    v-if="search.category == 'play'"
                    prop="description"
                    label="说明"
                    min-width="180">
            </el-table-column>
            <el-table-column
                    v-if="search.category == 'growth'"
                    prop="count"
                    label="累计次数"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="user_action_alias"
                    label="任务类型"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="reward"
                    label="奖励"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="update_time_name"
                    label="上次设置时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作"
                    width="180">
                <template scope="scope">
                    <el-button type="text" @click="editFn(scope.row)">修改</el-button>
                    <el-button type="text" @click="delFn(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <section class="block">
            <el-pagination
                    @size-change="val=> {search.page_size=val; getData()}"
                    @current-change="val=> {search.page=val; getData()}"
                    :current-page="search.page"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </section>
        <el-dialog :visible.sync="addForm" size="tiny" :title="dialogTitle[search.category]">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item prop="user_action_name" label="任务类型">
                    <el-select v-model="form.user_action_name">
                        <el-option :key="index" v-for="(item,index) in useraction" :label="item.alias" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="title" label="任务标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item prop="user_action_object_id" label="选择" v-if="search.category == 'play'">
                    <span class="choose-title" v-if="form.user_action_object_id">
                        {{form.user_action_object_title}}
                    </span>
                    <el-button type="primary" @click="chooseFn">选取</el-button>
                </el-form-item>
                <el-form-item prop="count" v-if="search.category == 'growth'" label="累计次数">
                    <el-input type="number" v-model="form.count">
                        <template slot="append">次</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="reward" label="任务奖励">
                    <el-input type="number" v-model.number="form.reward">
                        <template slot="append">积分</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">保 存</el-button>
            </span>
        </el-dialog>
        <ChooseContent :category="form.user_action_name" v-model="choose.isShow" v-on:result="chooseConfirm"></ChooseContent>
    </article>
</template>
<script>
    import ChooseContent from '../component/ChooseContent.vue'
    import TaskService from '../../../services/usersystem/taskService'
    import clone from 'clone'
    export default {
        components: {
            ChooseContent
        },
        data () {
            return {
                dialogTitle: {'daily': '日常任务设置', 'play': '活动任务设置', 'newbie': '新手任务设置', 'growth': '成长任务设置'},
                choose: {
                    isShow: false,
                    currContent: null
                },
                loading: false,
                addForm: false,
                search: {
                    category: this.$route.name, // 任务类型
                    title: '',
                    status: '',
                    user_action_name: '',
                    page: 1,
                    page_size: 15
                },
                form: clearFn.call(this),
                dataList: [],
                useraction: [],
                total: 0,
                rules: {
                    user_action_name: {required: true, message: '必填', trigger: 'change'},
                    title: {required: true, message: '必填', trigger: 'blur'},
                    count: {required: true, message: '必填', trigger: 'blur'},
                    user_action_object_id: {type: 'number', required: true, message: '必填', trigger: 'blur'},
                    reward: {type: 'number', required: true, message: '必填', trigger: 'blur'}
                }
            }
        },
        activated () {
            console.log(this.$route.name)
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            delFn (row) {
                xmview.showDialog(`你将要删除任务 <span style="color:red">${row.title}</span> 操作不可恢复确认吗?`, () => {
                    TaskService.del({task_id: row.id}).then(() => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                })
            },
            addFn () {
                this.addForm = true
                this.$nextTick(() => {
                    this.form = clearFn.call(this)
                    this.$refs.form.resetFields()
                })
            },
            editFn (row) {
                this.addForm = true
                this.$nextTick(() => {
                    this.form = clearFn.call(this)
                    this.$refs.form.resetFields()
                    this.search.category = row.category
                    this.form = clone(row)
                })
            },
            chooseFn () {
                if (!this.form.user_action_name) {
                    xmview.showTip('error', '请选择任务类型')
                    return
                }
                this.choose.isShow = true
            },
            getData () {
                return Promise.all([TaskService.userAction({category: this.search.category}), TaskService.search(this.search)]).then((result) => {
                    this.useraction = result[0].data
                    this.dataList = result[1].data
                    this.total = result[1].total
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        let msg = '添加成功'
                        let reqFn = TaskService.add
                        if (this.form.id) {
                            msg = '修改成功'
                            reqFn = TaskService.update
                        }
                        reqFn(this.form).then(() => {
                            xmview.showTip('success', msg)
                            this.getData()
                            this.addForm = false
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    }
                })
            },
            // 选取课程
            chooseConfirm (choose) {
                this.choose.currContent = choose
                this.form.user_action_object_id = choose.id
                if (this.form.user_action_name == 'article' || this.form.user_action_name == 'share_article' || this.form.user_action_name == 'speaking_pass') this.form.user_action_object_title = choose.title
                else this.form.user_action_object_title = choose.name
                this.choose.isShow = false
            },
        }
    }
    function clearFn() {
        return {
            category: this.$route.name,
            user_action_name: '',
            title: '',
            reward: '',
            user_action_object_id: '',
            count: '', // 累计次数
        }
    }
</script>
