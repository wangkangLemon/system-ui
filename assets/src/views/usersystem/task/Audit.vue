<style lang="scss">
@import "../../../utils/mixins/common";
@import "../../../utils/mixins/topSearch";
#task-audit-container {
    @extend %content-container;
    .search {
        @extend %top-search-container;
    }
    .header-button {
        @extend %right-top-btnContainer;
    }
    .block {
            margin-top: 10px;
            float: right;
        }
}
</style>
<template>
    <article id="task-audit-container">
        <article class="search">
            <section>
                <i>姓名</i>
                <el-input @keyup.enter.native="getData" v-model="fetchParam.user_name"></el-input>
            </section>
    
            <section>
                <label>状态</label>
                <el-select @change="getData" clearable v-model="fetchParam.status" placeholder="未审核">
                    <el-option label="未审核" value="0"></el-option>
                    <el-option label="已通过" value="1"></el-option>
                    <el-option label="已拒绝" value="2"></el-option>
                </el-select>
            </section>
            <section>
                <DateRange title="申请时间" :start="fetchParam.time_start" :end="fetchParam.time_end" v-on:changeStart="val=> fetchParam.start_time=val" v-on:changeEnd="val=> fetchParam.time_end=val" :change="getData">
                </DateRange>
            </section>
    
            <!-- 表格 -->
            <el-table border v-loading="loading" :data="dataList">
                <el-table-column prop="user_name" min-width="180" label="姓名">
                </el-table-column>
                <el-table-column prop="department_name" label="门店" min-width="200">
                </el-table-column>
                <el-table-column prop="status" width="180" label="状态">
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.status==1">已通过</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.status==0">未审核</el-tag>
                        <el-tag type="error" v-else-if="scope.row.status==2">已拒绝</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="admin_name" label="管理员" min-width="100">
                </el-table-column>
                <el-table-column prop="create_time_name" label="申请时间" min-width="150">
                </el-table-column>
                <el-table-column min-width="100" prop="operate" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="$router.push({name:'play-audit-details', 
                         query:scope.row})">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <section class="block">
            <el-pagination
                    @size-change="val=> {fetchParam.page_size=val; getData()}"
                    @current-change="val=> {fetchParam.page=val; getData()}"
                    :current-page="fetchParam.page"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
    </section>
        </article>
    </article>
</template>

<script>
import DateRange from '../../component/form/DateRangePicker.vue'
import auditService from '../../../services/usersystem/auditService'
function clearFn() {
    return {
        id: '',
        user_name: '',
        status: '',
        time_start: '',
        time_end: '',
        page: 0,
        page_size: 15,
    }
}
export default {
    components: { DateRange },
    data() {
        return {
            loading: false,
            dataList: [],
            fetchParam: clearFn(),
            total: 0
        }
    },
    activated() {
        this.fetchParam.id = this.$route.query.id
        this.getData()
    },
    methods: {
        getData() {
            this.loading = true
            auditService.search(this.fetchParam).then((res) => {
                xmview.setContentLoading(false)
                this.dataList = res.data
                this.total = res.total
                this.loading = false
            })
        }
    }
}
</script>
