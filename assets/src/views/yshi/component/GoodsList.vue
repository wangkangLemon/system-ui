<template>
    <main>
        <el-table class="data-table" :data="data" :fit="true" border style="margin-top: 5px;">
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
        }
    }
</script>
