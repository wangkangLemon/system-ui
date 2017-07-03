<!--系统-管理员-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/showDetail";
    @import "../../utils/mixins/topSearch";
    .admin-container {
        @extend %content-container;
        .header-button {
            @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 10px;
        }
    }
</style>
<template>
    <article class="admin-container">
        <!--详情-->
        <el-dialog class="show-detail" title="查看管理员账号" v-model="showDetail">
            <div class="avatar" v-if="clerkDetail != null">
                <img :src="{url:clerkDetail.avatar, sex: clerkDetail.sex} | defaultAvatar"/>
            </div>
            <div class="info" v-if="clerkDetail != null">
                <h2>{{clerkDetail.name}}({{clerkDetail.company}})</h2>
                <p><i class="title">Mobile：</i><span class="value">{{clerkDetail.mobile}}</span></p>
                <p><i class="title">Email：</i><span class="value">{{clerkDetail.email}}</span></p>
                <p>
                    <i class="title">状态：</i>
                    <span class="value">
                        <el-tag class="status" type="danger" v-if="clerkDetail.disabled">禁用</el-tag>
                        <el-tag class="status" type="success" v-if="!clerkDetail.disabled">正常</el-tag>
                    </span>
                </p>
                <p><i class="title">性别：</i><span class="value">{{clerkDetail.sex ? '男' : '女'}}</span></p>
                <p><i class="title">地址：</i><span class="value">{{clerkDetail.address}}</span></p>
                <p><i class="title">注册时间：</i><span class="value">{{clerkDetail.create_time_name}}</span></p>
            </div>
        </el-dialog>
        <!--添加/编辑表单-->
        <el-dialog v-model="addForm">
            <el-form :model="form" :rules="rules" ref="form">
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
        <!-- 分配权限 弹窗-->
        <el-dialog :visible.sync="relateForm" size="tiny" title="分配角色">
            <el-transfer v-model="toData" :data="fromData" :titles="['未选择', '已选择']" filterable></el-transfer>      
            <span slot="footer" class="dialog-footer">
                <el-button @click="relateForm = false">取 消</el-button>
                <el-button type="primary" @click="relateSubmit()">保 存</el-button>
            </span>
        </el-dialog>
        <section class="header-button">
            <el-button type="primary" icon="plus" @click="addAdmin" v-show="isPermission('sys_admin_create')">添加</el-button>
        </section>
        <section class="search">
            <section>
                <i>姓名</i>
                <el-input @change="getData" class="name" v-model="fetchParam.name" placeholder="请输入姓名"></el-input>
            </section>
        </section>
        <el-table border :data="adminData" v-loading="loading">
            <el-table-column
                    prop="name"
                    label="姓名"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="role_name"
                    label="角色"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="mobile"
                    label="手机"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="last_login_time_name"
                    label="上次登录时间"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="last_login_ip"
                    label="上次登录IP"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="disabled"
                    label="状态"
                    width="80">
                <template scope="scope">
                    <el-tag type="danger" v-if="scope.row.disabled">禁用</el-tag>
                    <el-tag type="success" v-if="!scope.row.disabled">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="operate" label="操作" min-width="200">
                <template scope="scope">
                    <el-button type="text" size="small" @click="checkClerkDetail(scope.$index, scope.row)">
                        详情
                    </el-button>
                    <el-button type="text" size="small" @click="editAdmin(scope.row)">
                        修改
                    </el-button>
                    <el-button type="text" size="small" v-if="scope.row.disabled" @click="adminDisable(scope.row, 0)">
                        启用
                    </el-button>
                    <el-button type="text" size="small" v-if="!scope.row.disabled" @click="adminDisable(scope.row, 1)">
                        禁用
                    </el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">
                        删除
                    </el-button>
                    <el-button type="text" size="small" @click="relate(scope.row)" v-show="isPermission('sys_admin_role_update')">
                        分配角色
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
    </article>
</template>
<script>
    import adminService from '../../services/adminService'
    import {defaultAvatar} from '../../utils/filterUtils'
    export default {
        filters: {
            defaultAvatar,
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
                    mobile: '',        // 手机
                    email: '',        // 邮箱
                    passwd: '',          // 密码
                    address: '',       // 地址
                    sex: 0,            // 性别
                    disabled: 1,       // 状态
                },
                rules: {
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
                fetchParam: { // 搜索的姓名
                    name: ''
                },
                adminData: [],
                relateForm: false,
                fromData: [{}],
                toData: [],
                permissionForm: clearRelateFn(),
            }
        },
        activated () {
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
                    keyword: this.fetchParam.name
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
                }).then(() => {
                    this.showDetail = true
                })
            },
            adminDisable (row, val) {
                let state = val ? '启用' : '禁用'
                xmview.showDialog(`你将要${state}管理员【<i style="color: red">${row.name}</i>】确认吗？`, () => {
                    adminService.adminDisable({
                        adminID: row.id,
                        disabled: val
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
            },
            relate(row) {
                this.permissionForm = clearRelateFn()
                this.permissionForm.id = row.id
                adminService.searchRoles(row.id).then((ret) => {
                    this.fromData = ret.from === null ? [{}] : ret.from
                    this.toData = ret.to === null ? [] : ret.to
                    this.relateForm = true
                })
            },
            relateSubmit() {
                this.permissionForm.ids = this.toData.toString()
                adminService.role(this.permissionForm).then((ret) => {
                    if (ret.code === 0) {
                        xmview.showTip('success', '操作成功!')
                        this.relateForm = false
                        this.getData()
                    } else if (ret.code === 1) {
                        xmview.showTip('error', ret.message)
                    }
                })
            }
        }
    }
    function clearRelateFn() {
        return {
            id: '',
            ids: '',
        }
    }
</script>
