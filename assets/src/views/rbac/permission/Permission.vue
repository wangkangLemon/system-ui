<!--权限管理-->
<style lang="scss">
    @import "../../../utils/mixins/showDetail";
    @import "../../../utils/mixins/common";

    .rbac-permission-container {
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
    <article class="rbac-permission-container">
        <section class="add">
            <el-button icon="plus" type="primary" @click="add()">添加</el-button>
        </section>
        <el-table border v-loading="loading" :data="dataList">
            <el-table-column
                    prop="permission_name"
                    label="权限名称">
            </el-table-column>
            <el-table-column
                    prop="disabled"
                    label="状态">
                    <template scope="scope">
                        <el-tag type="success" v-if="scope.row.disabled">启用</el-tag>
                        <el-tag type="gray" v-if="!scope.row.disabled">禁用</el-tag>
                    </template>
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
    import permissionService from '../../../services/rbac/permissionService'
    export default {
        data () {
            return {
                loading: false,
                search: {
                    page: 0,
                    page_size: 15,
                    disabled: -1,
                },
                dataList: [{}],
                total: 0,
                rules: {
                    id: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    disabled: [
                        {type: 'number', required: true, message: '必填项', trigger: 'change'}
                    ],
                    permission_name: [
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
                return permissionService.search(this.search).then((ret) => {
                    this.dataList = ret.data
                    this.loading = false
                }).catch((ret) => {
                    this.xmviex.showTip('error', ret.message)
                })
            }
        }
    }
</script>
