<!--权限管理-->
<style lang="scss">
    @import "../../../utils/mixins/showDetail";
    @import "../../../utils/mixins/common";

    .rbac-operation-container {
        @extend %content-container;
        .add {
            @extend %right-top-btnContainer;
        }
        .block {
            margin-top: 10px;
            text-align: right;
        }
    }
</style>
<template>
    <article class="rbac-operation-container">
        <section class="add">
            <el-button icon="plus" type="primary" @click="add()">添加</el-button>
        </section>
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
    </article>
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
