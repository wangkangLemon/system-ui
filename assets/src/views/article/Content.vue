<!--管理员-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";

    .table-container {
        border: 1px solid #ededed;
        .add {
            background: #ededed;
            padding: px2rem(10) px2rem(20);
            border-bottom: 1px solid #ededed;
        }
        .main-container {
            padding: 20px;
            background: #fff;
            .search {
                @extend %top-search-container;
            }
            .block {
                text-align: right;
                margin-top: 10px;
            }
        }
        .showDetail {
            .avatar {
                border: 1px solid #ededed;
                display: inline-block;
                vertical-align: top;
            }
            .info {
                display: inline-block;
                vertical-align: top;
                > p {
                    > span {
                        display: inline-block;
                        width: px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                    }
                }
            }
        }
        .forbidden-content {
            text-align: center;
            i {
                &:before {
                    display: block;
                    font-size: px2rem(60);
                    color: #f8bb86;
                    padding-bottom: px2rem(40);
                }
            }
            h1 {
                font-size: px2rem(20);
            }
            p {
                margin: px2rem(10);
                span {
                    color: red;
                }
            }
        }
    }
</style>
<template>
    <article class="table-container">
        <!--删除弹窗-->
        <delete-dialog :text="itemName" :isShow="deletDialog" :callback="deleteItem"></delete-dialog>
        <!--详情-->
        <el-dialog class="showDetail" title="查看管理员账号" v-model="showDetial">
            <div class="avatar">
                <img src="http://sys.yst.vodjk.dev/assets/img/user-default-female.jpg?00da903dc4d95b13b46f"/>
            </div>
            <div class="info">
                <p><span>测试营销员</span></p>
                <p><span>Mobile：</span> <i class="iconfont icon-oslash"></i>13012332324</p>
                <p><span>Email：</span><i class="el-icon-message"></i> 12@vodjk.com</p>
                <p><span>状态：</span> 正常</p>
                <p><span>性别：</span> 女</p>
                <p><span>地址：</span> 北京市朝阳区</p>
                <p><span>注册时间：</span>2017-03-17 12:333</p>
            </div>
        </el-dialog>
        <!--添加/编辑表单-->
        <el-dialog v-model="addForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="role" label="分类" :label-width="formLabelWidth">
                    <el-select v-model="form.role" placeholder="角色">
                        <el-option label="管理员" value="管理员"></el-option>
                        <el-option label="编辑" value="编辑"></el-option>
                        <el-option label="营销" value="营销"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="标题" :label-width="formLabelWidth">
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="封面" :label-width="formLabelWidth">
                    上传
                </el-form-item>
                <el-form-item prop="mobile" label="正文内容" id="editor" :label-width="formLabelWidth">
                    <script id="editor" type="text/plain" style="width:1024px;height:500px;"></script>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit('form')">确 定</el-button>
                <el-button type="primary" @click="submit('form')">存为草稿</el-button>
            </div>
        </el-dialog>
        <section class="add">
            <!--点击添加 form数据取邮箱/手机号 密码-->
            <el-button icon="plus" @click="addForm = true">添加</el-button>
        </section>
        <div class="main-container">
            <section class="search">
                <section>
                    <i>姓名</i>
                    <el-input class="name" v-model="name" placeholder="请输入姓名"></el-input>
                </section>
                <DateRange title="创建时间" :start="createTime" :end="endTime"
                           v-on:changeStart="val=> createTime=val"
                           v-on:changeEnd="val=> endTime=val"
                           :change="getData">
                </DateRange>
            </section>
            <el-card class="box-card">
                <el-table border :data="tableData">
                    <el-table-column
                            prop="title"
                            label="标题">
                    </el-table-column>
                    <el-table-column
                            prop="category_name"
                            label="类别"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="status_name"
                            label="状态"
                            width="200">
                    </el-table-column>
                    <el-table-column
                            prop="create_time_name"
                            label="创建时间"
                            width="200">
                    </el-table-column>
                    <el-table-column prop="operate" label="操作">
                        <template scope="scope">
                            <el-button type="text" size="small" @click="showDetial = true">
                                查看
                            </el-button>
                            <el-button type="text" size="small" @click="addForm = true">
                                修改
                                <!--点击详情 form数据变成当前管理员的信息-->
                            </el-button>
                            <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                                删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <section class="block">
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage4"
                            :page-sizes="[1, 2]"
                            layout="total, sizes, ->, prev, pager, next, jumper"
                            :total="4">
                    </el-pagination>
                </section>
            </el-card>
        </div>
    </article>
</template>
<script lang="babel">
    import deleteDialog from '../component/dialog/Delete'
    import DateRange from '../component/form/DateRangePicker.vue'

    export default {
        components: {
            deleteDialog,
            DateRange
        },
        data () {
            let validateName = (rule, value, callback) => {
                if ((value || '') === '') {
                    callback(new Error('请输入姓名'))
                }
                callback()
            }
            let validateEmail = (rule, value, callback) => {
                if (!(this.form.mobile || '').match(/^1[34578]\d{9}$/) && !(value || '').match(/^\w+([-+.]\w+)*@\w+([-+.]\w+)*.\w+([-+.]\w+)*$/)) {
                    callback(new Error('邮箱或手机号至少填写一个'))
                }
                callback()
            }
            let validatePass = (rule, value, callback) => {
                if ((value || '') === '') {
                    callback(new Error('请输入密码'))
                }
                callback()
            }
            return {
                createTime: '',
                endTime: '',
                itemName: '',           // 要删除项名称
                deletDialog: false,     // 删除弹窗
                showDetial: false,     // 是否显示详情对话框
                form: {                // 表单属性值
                    name: '',          // 姓名
                    role: '编辑',       // 权限
                    mobile: '',        // 手机
                    email: '',         // 邮箱
                    pass: '',          // 密码
                    address: '',       // 地址
                    sex: 0,            // 性别
                    status: 0          // 状态
                },
                rules: {
                    name: [
                        {validator: validateName, trigger: 'blur'}
                    ],
                    email: [
                        {validator: validateEmail, trigger: 'blur'}
                    ],
                    pass: [
                        {validator: validatePass, trigger: 'blur'}
                    ]
                },
                formLabelWidth: '120px', // 表单label的宽度
                addForm: false, // 表单弹窗是否显示
                currentPage4: 1, // 分页当前显示的页数
                name: '', // 搜索的姓名
                tableData: [
                    {
                        id: 1,
                        title: '销售',
                        category_name: '13920307216',
                        create_time_name: '2133',
                        status_name: '正常'
                    }
                ]
            }
        },
        created () {
            xmview.setContentLoading(false)
        },
        methods: {
            handleDelete (index, row) {
                this.deletDialog = true
                this.itemName = row.name
            },
            deleteItem (confirm) {
                this.deletDialog = false
                if (!confirm) {
                    return false
                }
                // 以下执行接口删除动作
                console.log(11)
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    console.log(valid)
                    if (valid) {
                        console.log(1)
                    } else {
                        return false
                    }
                })
            },
            handleSizeChange (val) {
                console.log(`每页 ${val} 条`)
                // 当切换每页条数得时候 获取当前第一页得数据
                this.handleCurrentChange(1)
            },
            handleCurrentChange (val) {
                this.currentPage = val
                console.log(`当前页: ${val}`)
                // 以下获取当页数据
            },
            getData () {
                console.log(1)
            }
        }
    }
</script>
