<!--企业药我说统计-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";
    .speaking-company-container {
        .export {
            float: right;
            margin-top: 7px;
        }

        .el-tabs {
            display: inline-block;
        }
        .tab-container {
            @extend %content-container;
            .search {
                @extend %top-search-container;
            }
        }
    }
</style>
<template>
    <article class="speaking-company-container">
        <el-tabs v-model="search.date" @tab-click="getData">
            <el-tab-pane label="昨日" name="yesterday"></el-tab-pane>
            <el-tab-pane label="本周" name="week"></el-tab-pane>
            <el-tab-pane label="上周" name="prevweek"></el-tab-pane>
            <el-tab-pane label="本月" name="month"></el-tab-pane>
            <el-tab-pane label="上月" name="prevmonth"></el-tab-pane>
        </el-tabs>
        <el-button type="warning" class="export"><i class="iconfont icon-iconfontexcel"></i> <i>导出</i></el-button>
        <article class="tab-container">
            <section class="search">
                <!--统计连锁----------------------------------------->
                <section v-if="type == 0">
                    <i>连锁</i>
                    <IndustrySelect :type="2" v-model="search.store_id"
                                    v-on:change="val=>search.store_id=val"
                                    :change="getData">
                    </IndustrySelect>
                </section>
                <section v-if="type == 1">
                    <i>标题</i>
                    <SpeakingSelect v-model="search.speaking_id"
                                    v-on:change="val=>search.speaking_id=val"
                                    :change="getData">
                    </SpeakingSelect>
                </section>
                <section>
                    <i>状态</i>
                    <el-select @change="getData" clearable v-model="search.status">
                        <el-option label="全部" :value="-1"></el-option>
                        <el-option label="正常" :value="0"></el-option>
                        <el-option label="下线" :value="2"></el-option>
                    </el-select>
                </section>
            </section>
            <el-table :data="tableData" border v-loading="loading">
                <el-table-column v-if="!type" label="连锁" prop="company_name" min-width="180">
                    <template scope="scope">
                        <el-button type="text" @click="$router.push({name: 'speaking-company-index', query: {type: 1, store_id: scope.row.company_id}})">{{scope.row.company_name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column v-if="!type" label="药我说条数" prop="speaking_count" width="120"></el-table-column>
                <el-table-column v-if="type" label="标题" prop="speaking_name" min-width="180"></el-table-column>
                <el-table-column v-if="type" label="内容" prop="content" min-width="200"></el-table-column>
                <el-table-column label="练习人数" prop="speaking_user_num" width="100"></el-table-column>
                <el-table-column label="未练习人数" prop="no_speaking_user_num" width="120"></el-table-column>
                <el-table-column label="满分人数" prop="high_score_num" width="100"></el-table-column>
                <el-table-column label="满分率" prop="high_score_rate" width="100"></el-table-column>
            </el-table>
            <el-pagination class="pagin"
                           @size-change="val => {search.page_size = val; getData() }"
                           @current-change="val => {search.page = val; getData() }"
                           :current-page="search.page"
                           :page-size="search.page_size"
                           :page-sizes="[15, 30, 60, 100]"
                           layout="sizes,total, prev, pager, next"
                           :total="total">
            </el-pagination>
        </article>
    </article>
</template>
<script>
    import IndustrySelect from '../../component/select/IndustryCompany.vue'
    import SpeakingSelect from '../../component/select/Speaking.vue'
    import speakingService from '../../../services/speaking/statService'
    export default {
        components: {
            IndustrySelect,
            SpeakingSelect
        },
        data () {
            return {
                type: 0,
                loading: false,
                search: {
                    date: 'yesterday',
                    speaking_id: '',
                    status: -1,
                    store_id: '',
                    page_size: 15,
                    page: 1
                },
                tableData: [],
                total: 0
            }
        },
        watch: {
            '$route' () {
                if (this.$route.name != 'speaking-company-index') return
                this.type = parseInt(this.$route.query.type) || 0
                this.search.store_id = this.$route.query.store_id
                this.search.status = -1
                this.getData()
                xmview.setContentBack(this.type > 0)
            }
        },
        activated () {
            this.type = parseInt(this.$route.query.type) || 0
            this.search.store_id = this.$route.query.store_id
            this.search.status = -1
            this.search.page = 1
            this.getData()
        },
        methods: {
            getData () {
                this.loading = true
                let p
                p = this.type ? speakingService.companySpeakingSearch(this.search) : speakingService.companySearch(this.search)
                p.then((ret) => {
                    this.tableData = ret.data
                    this.total = ret.total
                    this.loading = false
                    xmview.setContentLoading(false)
                })
                return p
            }
        }
    }
</script>
