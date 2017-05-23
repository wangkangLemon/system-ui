<!--成长任务-->
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
            <el-button icon="plus" type="primary" @click="addForm = true">添加</el-button>
        </section>
        <section class="search">
            <section>
                <i>任务标题</i>
                <el-input @change="getData" v-model="search.title"></el-input>
            </section>
            <section>
                <i>任务类型</i>
                <el-select v-model="search.type">
                    <el-option label="累计分享" :value="1"></el-option>
                    <el-option label="考试合格" :value="2"></el-option>
                    <el-option label="添加好友" :value="3"></el-option>
                    <el-option label="阅读资讯" :value="4"></el-option>
                </el-select>
            </section>
        </section>
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
                    prop="title"
                    label="任务标题">
            </el-table-column>
            <el-table-column
                    prop="introduce"
                    width="200"
                    label="累计次数">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="任务类型"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="award"
                    label="奖励"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="last_time_name"
                    label="上次设置时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作"
                    width="180">
                <template scope="scope">
                    <el-button type="text">修改</el-button>
                    <el-button type="text">删除</el-button>
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
        <el-dialog :visible.sync="addForm" size="tiny" title="活动任务设置" @open="dialogOpen">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item prop="type" label="任务类型">
                    <el-select v-model="form.type">
                        <el-option label="累计分享" :value="1"></el-option>
                        <el-option label="考试合格" :value="2"></el-option>
                        <el-option label="添加好友" :value="3"></el-option>
                        <el-option label="阅读资讯" :value="4"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="title" label="任务标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item prop="times" label="累计次数">
                    <el-input type="number" v-model="form.times">
                        <template slot="append">次</template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="integral" label="任务奖励">
                    <el-input type="number" v-model="form.integral">
                        <template slot="append">积分</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">保 存</el-button>
            </span>
        </el-dialog>
    </article>
</template>
<script>
    export default {
        data () {
            return {
                course: {
                    isShow: false,
                    currCourse: null
                },
                loading: false,
                addForm: false,
                search: {
                    title: '',
                    type: '',
                    page: 1,
                    page_size: 15
                },
                form: clearFn(),
                dataList: [{}],
                total: 0,
                rules: {
                    type: {required: true, message: '必须填', trigger: 'change'},
                    title: {required: true, message: '必须填', trigger: 'blur'},
                    integral: {required: true, message: '必须填', trigger: 'blur'}
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            getData () {
                console.log(11)
            },
            dialogOpen () {
                this.$nextTick(() => {
                    this.form = clearFn()
                    this.$refs.form.resetFields()
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(valid)
                    }
                })
            },
            // 选取课程
            courseConfirm (course) {
                this.course.currCourse = course
                this.course.isShow = false
                this.form.course_id = course.id
            },
        }
    }
    function clearFn() {
        return {
            type: '',
            title: '',
            integral: '',
            times: ''
        }
    }
</script>
