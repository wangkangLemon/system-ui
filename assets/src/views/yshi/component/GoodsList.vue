<template>
    <main>
        <el-table class="data-table" :data="list" :fit="true" border style="margin-top: 5px;">
            <el-table-column 
                label="类型" 
                :prop="columnType"
                width="100">
                <el-tag slot-scope="scope" :type="scope.row[columnType] | taskType('tag')">
                    {{scope.row[columnType] | taskType('label')}}
                </el-tag>
            </el-table-column>
            <el-table-column 
                label="名称" 
                :prop="columnName">
            </el-table-column>
        </el-table>
        <el-pagination 
            class="block"
            @size-change="val=> {fetchParam.page_size=val; fetchData()}"
            @current-change="val=> {fetchParam.page=val; fetchData()}"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[10, 15, 30, 60, 100]"
            layout="sizes, total, prev, pager, next" 
            :total="total">
        </el-pagination>
        <el-tag>总计：{{data.length}}个商品</el-tag>
    </main>
</template>

<script>
    export default {
        props: {
            data: Array,
            columnType: {
                type: String,
                default: 'goods_type'
            },
            columnName: {
                type: String,
                default: 'goods_name'
            }
        },
        created () {
            this.fetchData()
        },
        watch: {
            data () {
                this.total = this.data.length
                this.fetchData()
            }
        },
        data () {
            return {
                fetchParam: {
                    page: 1,
                    page_size: 10,
                },
                list: this.data,
                total: this.data.length,
            }
        },
        methods: {
            fetchData () {
                this.list = this.data.slice((this.fetchParam.page - 1) * this.fetchParam.page_size, this.fetchParam.page * this.fetchParam.page_size)
            }
        }
    }
</script>
