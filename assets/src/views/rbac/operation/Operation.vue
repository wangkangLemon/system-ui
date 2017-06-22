<!--权限管理-->
<style lang="scss">
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    .rbac-operation-container {
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
    <main class="rbac-operation-container">
        <article class="manage-container">
            <el-button icon="plus" type="primary" @click="add()">添加</el-button>
        </article>
        <article class="search">
            <section>
                <i>操作名称</i>
                <el-input v-model="search.operation_name" @keyup.enter.native="getData"></el-input>
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
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
                    prop="operation_name"
                    label="操作名称">
            </el-table-column>
            <el-table-column
                    prop="operation_url"
                    label="操作地址">
            </el-table-column>
            <el-table-column
                    prop="operation_method"
                    label="操作方法">
                    <template scope="scope">
                        <el-tag type="success" v-if="scope.row.operation_method == '*'">get,put,post,delete</el-tag>
                        <el-tag type="success" v-if="scope.row.operation_method != '*'">{{scope.row.operation_method}}</el-tag>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="owner"
                    label="所有权">
                    <template scope="scope">
                        <el-tag type="success" v-if="scope.row.owner == 'public'">公共接口</el-tag>
                        <el-tag type="gray" v-if="scope.row.owner == 'role'">角色接口</el-tag>
                        <el-tag type="danger" v-if="scope.row.owner == 'disabled'">禁用接口</el-tag>
                    </template>
            </el-table-column>
            <el-table-column
                    prop="limit"
                    label="限制访问次数">
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    prop="update_time_name"
                    label="最后编辑时间">
            </el-table-column>
            <el-table-column
                    prop="operate"
                    label="操作">
                <template scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="pagin"
                @size-change="val=> {search.page_size=val; getData()}"
                @current-change="val=> {search.page=val; getData()}"
                :current-page="search.page"
                :page-sizes="[15, 30, 60, 100]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
        </el-pagination>
    </main>
</template>
<script>
    import operationService from '../../../services/rbac/operationService'
    export default {
        data () {
            return {
                loading: false,
                search: {
                    page: 0,
                    page_size: 15,
                    owner: void '',
                    operation_method: void '',
                    operation_name: void '',
                },
                dataList: [{}],
                total: 0,
                rules: {
                    id: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    owner: [
                        {required: true, message: '必填项', trigger: 'blur'}
                    ],
                    operation_name: [
                        {
                            required: true,
                            message: '必填项',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            getData () {
                this.loading = true
                return operationService.search(this.search).then((ret) => {
                    this.dataList = ret.data
                    this.loading = false
                }).catch((ret) => {
                    this.xmviex.showTip('error', ret.message)
                })
            }
        }
    }
</script>
