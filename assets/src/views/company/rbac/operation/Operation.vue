<!--权限管理-->
<style lang="scss">
@import "../../../../utils/mixins/common";
@import "../../../../utils/mixins/topSearch";

#company-rbac-operation-container {
    @extend %content-container;

    .manage-container {
        @extend %right-top-btnContainer;
    }

    .search {
        @extend %top-search-container;
    }

    .data-table {
        .el-button {
            margin-left: 2px;
        }
    }
}
</style>

<template>
    <main id="company-rbac-operation-container">
        <article class="manage-container">
            <el-button icon="plus" type="primary" @click="add()">添加</el-button>
        </article>
        <article class="search">
            <section>
                <i>操作名称</i>
                <el-input v-model="search.operation_name" @keyup.enter.native="getData"></el-input>
            </section>
            <section>
                <i>操作地址</i>
                <el-input v-model="search.operation_url" @keyup.enter.native="getData"></el-input>
            </section>
            <section>
                <i>API所有权</i>
                <el-select v-model="search.owner" placeholder="全部" @change="getData" :clearable="true">
                    <el-option label="公共" value="public"></el-option>
                    <el-option label="角色" value="role"></el-option>
                    <el-option label="禁用" value="diabled"></el-option>
                </el-select>
            </section>
            <section>
                <i>访问方法</i>
                <el-select v-model="search.operation_method" placeholder="全部" @change="getData" :clearable="true">
                    <el-option label="GET" value="get"></el-option>
                    <el-option label="POST" value="post"></el-option>
                    <el-option label="PUT" value="put"></el-option>
                    <el-option label="DELETE" value="delete"></el-option>
                    <el-option label="*" value="*"></el-option>
                </el-select>
            </section>
        </article>
        <!--添加/删除 -->
        <el-dialog :visible.sync="updateForm" size="tiny" title="API管理">
            <el-form :model="form" :rules="rules" ref="form" label-width="120px">
                <el-form-item label="操作名称" prop="operation_name">
                    <el-input v-model="form.operation_name" type="text"></el-input>
                </el-form-item>
                <el-form-item label="操作地址" prop="operation_url">
                    <el-input v-model="form.operation_url" type="text"></el-input>
                </el-form-item>
                <el-form-item label="操作方法">
                    <el-select v-model="form.operation_method" placeholder="全部" @change="getData" :clearable="true">
                    <el-option label="GET" value="get"></el-option>
                    <el-option label="POST" value="post"></el-option>
                    <el-option label="PUT" value="put"></el-option>
                    <el-option label="DELETE" value="delete"></el-option>
                    <el-option label="全部" value="*"></el-option>
                </el-select>    
                </el-form-item>
                <el-form-item label="所有权">
                    <el-select v-model="form.owner" placeholder="角色接口" @change="getData" :clearable="true">
                    <el-option label="角色接口" value="role"></el-option>
                    <el-option label="公共接口" value="public"></el-option>
                    <el-option label="禁用" value="disabled"></el-option>
                   
                </el-select>    
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateForm = false">取 消</el-button>
                <el-button type="primary" @click="submit('form')">保 存</el-button>
            </span>
        </el-dialog>
    
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column prop="operation_name" label="操作名称" min-width="100">
            </el-table-column>
            <el-table-column prop="operation_url" label="操作地址" min-width="200">
            </el-table-column>
            <el-table-column prop="operation_method" label="操作方法" width="160">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.operation_method == '*'">get,put,post,delete</el-tag>
                    <el-tag type="success" v-if="scope.row.operation_method != '*'">{{scope.row.operation_method}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="owner" label="所有权" width="100">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.owner == 'public'">公共接口</el-tag>
                    <el-tag type="gray" v-if="scope.row.owner == 'role'">角色接口</el-tag>
                    <el-tag type="danger" v-if="scope.row.owner == 'disabled'">禁用接口</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="limit" label="限制访问次数" width="130">
            </el-table-column>
            <el-table-column prop="create_time_name" label="创建时间" width="170">
            </el-table-column>
            <el-table-column prop="update_time_name" label="最后编辑时间" width="170">
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="100" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagin" @size-change="val=> {search.page_size=val; getData()}" @current-change="val=> {search.page=val; getData()}" :current-page="search.page" :page-sizes="[15, 30, 60, 100]" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </main>
</template>

<script>
import operationService from '../../../../services/companyrbac/operationService'

function clearFn() {
    return {
        id: '',
        category: '',
        operation_name: '',
        operation_url: '',
        operation_method: '',
        owner: '',
        limit: ''
    }
}
function clearSearch() {
    return {
        category: '',
        page: 1,
        page_size: 15,
        owner: void '',
        operation_method: void '',
        operation_name: void '',
        operation_url: void '',
    }
}

export default {
    data() {
        return {
            category: '',
            loading: false,
            updateForm: false,
            search: clearSearch(),
            dataList: [{}],
            total: 0,
            form: clearFn(),
            rules: {
                id: [
                    { type: 'number', required: true, message: '必填项', trigger: 'change' }
                ],
                owner: [
                    { required: true, message: '必填项', trigger: 'blur' }
                ],
                operation_name: [
                    {
                        required: true,
                        message: '必填项',
                        trigger: 'blur'
                    }
                ],
                operation_url: [
                    {
                        required: true,
                        message: '必填项',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    activated() {
        this.category = this.$route.params.category
        this.getData().then(() => {
            xmview.setContentLoading(false)
        })
    },
    methods: {
        initFetchParam() {
            this.search = clearSearch()
        },
        getData() {
            this.loading = true
            this.search.category = this.category
            return operationService.search(this.search).then((ret) => {
                this.dataList = ret.data
                this.loading = false
                this.total = ret.total
            }).catch((ret) => {
                this.xmviex.showTip('error', ret.message)
            })
        },
        add () {
            this.form = clearFn()
            this.form.category = this.category
            this.updateForm = true
        },
        edit (row) {
            this.form = row
            this.updateForm = true
        },
        del(index, row) {
            xmview.showDialog(`你确认要删除【<i style="color: red">${row.operation_name}</i>】吗？`, () => {
                operationService.delete({category: this.category, id: row.id}).then(() => {
                    this.dataList.splice(index, 1)
                    xmview.showTip('success', '操作成功')
                })
            })
        },
        submit(form) {
            this.$refs[form].validate((valid) => {
                let msg = '添加成功'
                let reqFn = operationService.add
                if (this.form.id) {
                    msg = '修改成功'
                    reqFn = operationService.update
                }
                this.form.category = this.category
                reqFn(this.form).then(() => {
                    this.updateForm = false
                    this.getData()
                    xmview.showTip('success', msg)
                }).catch((ret) => {
                    xmview.showTip('error', ret.message)
                })
            })
        }

    }
}
</script>
