<!--企业列表-管理员-->
<style lang='scss' scoped rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    .table-container {
        .status {
            padding: 2px 5px;
            background: #00acac;
            border-radius: 5px;
            color: #fff;
        }
        border: 1px solid #ededed;
        .add {
            background: #ededed;
            padding: px2rem(10) px2rem(20);
            border-bottom: 1px solid #ededed;

            .back {
                float: right;
            }
        }
        .main-container {
            background: #fff;
            padding: 20px;
            .search {
                display: flex;
                padding: 0 px2rem(20) px2rem(15);
                > div {
                    display: inline-block;
                    vertical-align: top;
                    label {
                        margin-right: 2%;
                    }
                    .name {
                        width: 80%;
                    }
                }
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
                        width:px2rem(100);
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
        <delete-dialog :text="itemName" v-model="deletDialog" v-on:callback="deleteItem"></delete-dialog>
        <!--详情-->
        <el-dialog class="showDetail" title="查看管理员账号" v-model="showDetail">
            <div class="avatar">
                <img src="http://sys.yst.vodjk.dev/assets/img/user-default-female.jpg?00da903dc4d95b13b46f" />
            </div>
            <div class="info">
                <p><span>测试营销员</span></p>
                <p><span>所属门店：</span>{{clerkDetail.department}}</p>
                <p><span>Mobile：</span> <i class="iconfont icon-oslash"></i>{{clerkDetail.mobile}}</p>
                <p><span>Email：</span> <i class="el-icon-message"></i>{{clerkDetail.email}}</p>
                <p><span>状态：</span> <i class="status">{{clerkDetail.status}}</i></p>
                <p><span>性别：</span> {{clerkDetail.sex ? '男' : '女'}}</p>
                <p><span>生日：</span> {{clerkDetail.birthday}}</p>
                <p><span>地址：</span> {{clerkDetail.address}}</p>
                <p><span>注册时间：</span>{{clerkDetail.create_time_name}}</p>
            </div>
        </el-dialog>
        <!--添加/编辑表单-->
        <el-dialog v-model="addForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="department_id" label="门店" :label-width="formLabelWidth">
                    <el-select v-model="form.department_id" placeholder="请选择">
                        <el-option v-for="item in departmentData" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="店员姓名" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="性别" :label-width="formLabelWidth">
                    <el-radio class="radio" v-model="form.sex" :label="1">男</el-radio>
                    <el-radio class="radio" v-model="form.sex" :label="0">女</el-radio>
                </el-form-item>
                <el-form-item prop="mobile" label="手机号" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" type="number" placeholder="手机号" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="passwd" label="密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.passwd" placeholder="密码" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="birthday" label="生日" :label-width="formLabelWidth">
                    <el-input v-model="form.birthday" placeholder="生日" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" placeholder="地址" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <section class="add">
            <!--点击添加 form数据取邮箱/手机号 密码-->
            <el-button icon="plus" @click="addAdmin">添加</el-button>
            <el-button class="back" @click="goBack">返回</el-button>
        </section>
        <div class="main-container">
            <section class="search">
                <div>
                    <label>姓名</label>
                    <el-input @change="getData" class="name" v-model="search.name" placeholder="请输入姓名"></el-input>
                </div>
            </section>
            <el-table border :data="adminData">
                <el-table-column
                        prop="name"
                        label="姓名"
                        width="100%">
                </el-table-column>
                <el-table-column
                        prop="mobile"
                        label="手机"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="email"
                        label="邮箱"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="last_login_time"
                        label="上次登录时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="last_login_ip"
                        label="上次登录IP"
                        width="200">
                </el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="checkClerkDetail(scope.$index, scope.row)">
                            详情
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
                        :current-page="currentPage"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, ->, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </section>
        </div>
    </article>
</template>
<script lang="babel">
    import deleteDialog from '../component/dialog/Delete'
    import companyService from '../../services/companyService'
    import departmentService from '../../services/departmentService'
//    import adminService from '../../services/adminService'
    export default {
        components: {
            deleteDialog
        },
        data () {
            let validateMobile = (rule, value, callback) => {
                if (!(value || '').match(/^1[34578]\d{9}$/)) {
                    callback(new Error('请填写正确的手机号'))
                }
                callback()
            }
            return {
                // 查看店员详情
                clerkDetail: {
                    name: '',          // 姓名
                    department: '',       // 门店
                    mobile: '',        // 手机
                    pass: '',          // 密码
                    address: '',       // 地址
                    sex: 0,            // 性别
                    birthday: '',          // 生日
                    create_time_name: ''
                },
                departmentData: [],
                companyID: this.$route.params.company_id,
                itemName: '',           // 要删除项名称
                deletDialog: false,     // 删除弹窗
                showDetail: false,     // 是否显示详情对话框
                form: {                // 表单属性值
                    name: '',          // 姓名
                    department_id: '',       // 门店
                    mobile: '',        // 手机
                    passwd: '',          // 密码
                    address: '',       // 地址
                    sex: 0,            // 性别
                    birthday: ''          // 生日
                },
                rules: {
                    department_id: [
                        {type: 'number', required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '必须填写', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    passwd: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ]
                },
                formLabelWidth: '120px', // 表单label的宽度
                addForm: false, // 表单弹窗是否显示
                currentPage: 1, // 分页当前显示的页数
                total: 0,
                pageSize: 15,
                search: { // 搜索的姓名
                    name: ''
                },
                adminData: []
            }
        },
        activated () {
            console.log(this.companyID)
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            addAdmin () {
                departmentService.getDepartment({
                    company_id: this.companyID
                }).then((ret) => {
                    if (ret.data.length > 0) {
                        this.departmentData = ret.data
                    }
                }).then(() => {
                    this.addForm = true
                })
            },
            getData () {
                return companyService.companyAdmin({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    keyword: this.search.name,
                    company_id: this.companyID
                }).then((ret) => {
                    this.adminData = ret.data
                    this.total = ret.total
                })
            },
            // 查看店员详情
            checkClerkDetail (index, row) {
                this.showDetail = true
                this.clerkDetail = row
            },
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
//                adminService.adminDelete()
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        this.form.company_id = this.companyID
                        companyService.addCompanyAdmin(this.form).then((ret) => {
                            xmview.showTip('success', '添加成功')
                        }).then(() => {
                            this.addForm = false
                            this.getData()
                            this.currentPage = 1
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
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
            goBack () {
                window.history.back()
            }
        }
    }
</script>
