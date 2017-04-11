<!--系统-管理员-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    .admin-container {
        border: 1px solid #ededed;
        .add {
            background: #ededed;
            padding: px2rem(10) px2rem(20);
            border-bottom: 1px solid #ededed;
            text-align: right;
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
                width: 150px;
                height: 130px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .info {
                display: inline-block;
                vertical-align: top;
                > p {
                    line-height: 30px;
                    > span {
                        display: inline-block;
                        width:px2rem(100);
                        text-align: right;
                        padding-right: px2rem(10);
                        &.status {
                            width: auto;
                        }
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
    <article class="admin-container">
        修改的时候选择禁用 不起作用，接口问题
        <!--详情-->
        <el-dialog class="showDetail" title="查看管理员账号" v-model="showDetail">
            <section v-if="clerkDetail != null">
                <div class="avatar">
                    <img :src="{url:clerkDetail.avatar, sex: clerkDetail.sex} | defaultAvatar" />
                </div>
                <div class="info">
                    <p><span></span>{{clerkDetail.name}}({{clerkDetail.company}})</p>
                    <p><span>Mobile：</span> <i class="iconfont icon-oslash"></i>{{clerkDetail.mobile}}</p>
                    <p><span>Email：</span> <i class="el-icon-message"></i>{{clerkDetail.email}}</p>
                    <p>
                        <span>状态：</span>
                        <el-tag class="status" type="danger" v-if="clerkDetail.disabled">禁用</el-tag>
                        <el-tag class="status"  type="success" v-if="!clerkDetail.disabled">正常</el-tag>
                    </p>
                    <p><span>性别：</span> {{clerkDetail.sex ? '男' : '女'}}</p>
                    <p><span>地址：</span> {{clerkDetail.address}}</p>
                    <p><span>注册时间：</span>{{clerkDetail.create_time_name}}</p>
                </div>
            </section>
        </el-dialog>
        <!--添加/编辑表单-->
        <el-dialog v-model="addForm">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="role_id" label="角色" :label-width="formLabelWidth">
                    <el-select clearable v-model="form.role_id">
                        <el-option label="管理员" :value="1"></el-option>
                        <el-option label="编辑" :value="2"></el-option>
                        <el-option label="营销" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="name" label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="form.name" placeholder="管理员姓名" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="sex" label="性别" :label-width="formLabelWidth">
                    <el-radio class="radio" v-model="form.sex" :label="1">男</el-radio>
                    <el-radio class="radio" v-model="form.sex" :label="0">女</el-radio>
                </el-form-item>
                <el-form-item prop="mobile" label="手机号" :label-width="formLabelWidth">
                    <el-input v-model="form.mobile" type="number" placeholder="手机号" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱" :label-width="formLabelWidth">
                    <el-input v-model="form.email" placeholder="邮箱" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="passwd" label="密码" :label-width="formLabelWidth">
                    <el-input type="password" v-model="form.passwd" :placeholder="pwdPlaceholder" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                    <el-input v-model="form.address" placeholder="地址" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-radio class="radio" v-model="form.disabled" :label="0">正常</el-radio>
                    <el-radio class="radio" v-model="form.disabled" :label="1">禁用</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">确 定</el-button>
            </div>
        </el-dialog>
        <section class="add">
            <el-button icon="plus" @click="addAdmin">添加</el-button>
        </section>
        <div class="main-container">
            <section class="search">
                <div>
                    <label>姓名</label>
                    <el-input @change="getData" class="name" v-model="search.name" placeholder="请输入姓名"></el-input>
                </div>
            </section>
            <el-table border :data="adminData" v-loading="loading">
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
                        prop="last_login_time_name"
                        label="上次登录时间"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="last_login_ip"
                        label="上次登录IP"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="disabled"
                        label="状态"
                        width="200">
                    <template scope="scope">
                        <el-tag type="danger" v-if="scope.row.disabled">禁用</el-tag>
                        <el-tag type="success" v-if="!scope.row.disabled">正常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="operate" label="操作">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="checkClerkDetail(scope.$index, scope.row)">
                            详情
                        </el-button>
                        <el-button type="text" size="small" @click="editAdmin(scope.row)">
                            修改
                        </el-button>
                        <el-button type="text" size="small" @click="adminDisable(scope.row)">
                            禁用
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
    import adminService from '../../services/adminService'
    import {defaultAvatar} from '../../utils/filterUtils'
    export default {
        filters: {
            defaultAvatar
        },
        data () {
            let valMobile = (rule, value, callback) => {
                if (value && !value.match(/^1[34578]\d{9}$/)) {
                    callback(new Error('请填写正确的手机号'))
                }
                callback()
            }
            let valEmail = (rule, value, callback) => {
                if (value && !value.match(/^\w+([-+.]\w+)*@\w+([-+.]\w+)*.\w+([-+.]\w+)*$/)) {
                    callback(new Error('请输入正确的邮箱'))
                }
                callback()
            }
            return {
                pwdPlaceholder: '密码',
                loading: false,
                // 查看店员详情
                clerkDetail: null,
                showDetail: false,     // 是否显示详情对话框
                form: {                // 表单属性值
                    name: '',          // 姓名
                    role_id: '',       // 角色
                    mobile: '',        // 手机
                    email: '',        // 邮箱
                    passwd: '',          // 密码
                    address: '',       // 地址
                    sex: 0,            // 性别
                    disabled: 0,       // 状态
                },
                rules: {
                    role_id: {type: 'number', required: true, message: '必须填写', trigger: 'change'},
                    name: [
                        {required: true, message: '必须填写', trigger: 'blur'}
                    ],
                    email: {validator: valEmail, message: '请填写正确的邮箱地址'},
                    mobile: {validator: valMobile, message: '请填写正确的手机号'},
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
        created () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            addAdmin () {
                this.addForm = true
                setTimeout(() => {
                    this.$refs['form'].resetFields()
                    if (this.form.id) delete this.form.id
                    this.pwdPlaceholder = '密码'
                }, 0)
            },
            editAdmin (row) {
                this.addForm = true
                adminService.editAdmin(row.id).then((ret) => {
                    this.$refs['form'].resetFields()
                    this.validate = null
                    this.form = {
                        id: ret.id,
                        name: ret.name,          // 姓名
                        role_id: ret.role_id,       // 角色
                        mobile: ret.mobile,        // 手机
                        email: ret.email,        // 邮箱
                        address: ret.address,       // 地址
                        sex: ret.sex,            // 性别
                        disabled: ret.disabled,       // 状态
                    }
                }).then(() => {
                    this.pwdPlaceholder = '密码、不修改请留空'
                })
            },
            getData () {
                this.loading = true
                return adminService.adminList({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    keyword: this.search.name
                }).then((ret) => {
                    this.adminData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            // 查看店员详情
            checkClerkDetail (index, row) {
                adminService.adminDetail(row.id).then((ret) => {
                    this.clerkDetail = ret.data
                    console.log(this.clerkDetail)
                }).then(() => {
                    this.showDetail = true
                })
            },
            adminDisable (row) {
                xmview.showDialog(`你将要禁用管理员【<i style="color: red">${row.name}</i>】确认吗？`, () => {
                    adminService.adminDisable({
                        adminID: row.id,
                        disabled: 1
                    }).then(() => {
                        xmview.showTip('success', '禁用成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message || '操作失败')
                    })
                })
            },
            handleDelete (index, row) {
                xmview.showDialog(`你确认要删除用户【<i style="color: red">${row.name}</i>】的管理权限吗？`, this.deleteItem(row.id))
            },
            deleteItem (id) {
                // 以下执行接口删除动作
                return () => {
                    adminService.adminDelete(id).then((ret) => {
                        xmview.showTip('success', '删除成功')
                        this.getData()
                    }).catch((ret) => {
                        xmview.showTip('error', ret.message)
                    })
                }
            },
            submit (form) {
                console.log(this.form)
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        if (!this.form.id && !this.form.passwd) {
                            xmview.showTip('error', '请填写密码')
                            return false
                        }
                        let msg = '添加成功'
                        let reqFn = adminService.addAdmin
                        if (this.form.id) {
                            msg = '修改成功'
                            reqFn = adminService.updateAdmin
                        }
                        reqFn(this.form).then((ret) => {
                            this.addForm = false
                            this.getData()
                            xmview.showTip('success', msg)
                        }).catch((ret) => {
                            xmview.showTip('error', ret.message)
                        })
                    } else {
                        return false
                    }
                })
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            }
        }
    }
</script>
