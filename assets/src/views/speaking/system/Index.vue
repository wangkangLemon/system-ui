<!--系统药我说统计-->
<style lang="scss" rel="stylesheet/scss">
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    .speaking-system-container {
        .export {
            float: right;
            margin-top: 7px;
        }

        .el-tabs {
            display: inline-block;
        }
        .tab-container {
            @extend %content-container;s
            .search {
                @extend %top-search-container;
            }
        }
    }
</style>
<template>
    <article class="speaking-system-container">
        <el-tabs v-model="fetchParam.date" @tab-click="getData">
            <el-tab-pane label="昨日" name="yesterday"></el-tab-pane>
            <el-tab-pane label="本周" name="week"></el-tab-pane>
            <el-tab-pane label="上周" name="prevweek"></el-tab-pane>
            <el-tab-pane label="本月" name="month"></el-tab-pane>
            <el-tab-pane label="上月" name="prevmonth"></el-tab-pane>
        </el-tabs>
        <el-button type="warning" class="export" @click="exportClick"><i class="iconfont icon-iconfontexcel"></i>
            <i>导出</i></el-button>
        <article class="tab-container">
            <section class="search">
                <!--药我说统计--------------------------------------->
                <section v-if="type == 0">
                    <i>标题</i>
                    <SpeakingSelect v-model="fetchParam.speaking_id"
                                    :change="getData">
                    </SpeakingSelect>
                </section>
                <!--统计连锁----------------------------------------->
                <section v-if="type == 1">
                    <i>连锁</i>
                    <IndustrySelect :type="2" v-model="fetchParam.store_id"
                                    v-on:change="val=>fetchParam.store_id=val"
                                    :change="getData">
                    </IndustrySelect>
                </section>
                <section v-if="type == 1">
                    <i>连锁练习</i>
                    <el-select @change="getData" v-model="fetchParam.status">
                        <el-option label="已练习" :value="1"></el-option>
                        <el-option label="未练习" :value="2"></el-option>
                    </el-select>
                </section>
                <!--统计门店--------------------------------------------->
                <section v-if="type == 2">
                    <i>门店</i>
                    <DepartmentSelect v-model="fetchParam.department_id"
                                      v-on:change="val=>fetchParam.department_id=val"
                                      :change="getData">
                    </DepartmentSelect>
                </section>
                <!--店员统计---------------------------------------------->
                <section v-if="type == 3">
                    <i>店员</i>
                    <UserSelect v-model="fetchParam.user_id" :change="getData"></UserSelect>
                </section>
            </section>
            <br>
            <el-table v-show="type == 0" :data="tableData" border v-loading="loading">
                <el-table-column label="标题" prop="speaking_name" min-width="180">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="$router.push({name: 'speaking-system-index', query: {type: 1, speaking_id: scope.row.speaking_id}})">
                            {{scope.row.speaking_name}}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="练习人数" prop="speaking_user_num" width="100"></el-table-column>
                <el-table-column label="练习次数" prop="speaking_times" width="120"></el-table-column>
                <el-table-column label="满分人数" prop="high_score_num" width="100"></el-table-column>
                <el-table-column label="满分率" prop="high_score_rate" width="100"></el-table-column>
            </el-table>
            <el-table v-show="type == 1 || type == 2" :data="tableData" border v-loading="loading">
                <el-table-column :label="type == 1 ? '连锁' : '门店'" prop="name"
                                 min-width="180">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   @click="$router.push({name: 'speaking-system-index', query: {type: type+1, speaking_id: scope.row.speaking_id, company_id: scope.row.company_id, department_id: scope.row.department_id}})">
                            {{type == 1 ? scope.row.company_name : scope.row.department_name}}

                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="未练习人数" prop="no_speaking_user_num"
                                 width="120"></el-table-column>
                <el-table-column label="练习人数" prop="speaking_user_num" width="100"></el-table-column>
                <el-table-column label="练习次数" prop="speaking_times" width="120"></el-table-column>
                <el-table-column label="满分人数" prop="high_score_num" width="100"></el-table-column>
                <el-table-column label="满分率" prop="high_score_rate" width="100"></el-table-column>
            </el-table>
            <el-table v-show="type == 3" :data="tableData" border v-loading="loading">
                <el-table-column label="员工姓名" prop="name" width="150"></el-table-column>
                <el-table-column label="职务" prop="job" width="100"></el-table-column>
                <el-table-column label="门店" prop="department_name" min-width="180"></el-table-column>
                <el-table-column label="练习次数" prop="speaking_times" width="100"></el-table-column>
                <el-table-column label="最高分数" prop="high_score" width="100"></el-table-column>
            </el-table>
            <el-pagination class="pagin"
                           @size-change="val => {fetchParam.page_size = val; getData() }"
                           @current-change="val => {fetchParam.page = val; getData() }"
                           :current-page="fetchParam.page"
                           :page-size="fetchParam.page_size"
                           :page-sizes="[15, 30, 60, 100]"
                           layout="sizes,total, prev, pager, next"
                           :total="total">
            </el-pagination>
        </article>
    </article>
</template>
<script>
    import IndustrySelect from '../../component/select/IndustryCompany.vue'
    import DepartmentSelect from '../../component/select/Department.vue'
    import UserSelect from '../../component/select/User.vue'
    import SpeakingSelect from '../../component/select/Speaking.vue'
    import speakingService from '../../../services/speaking/statService'
    export default {
        components: {
            IndustrySelect,
            DepartmentSelect,
            UserSelect,
            SpeakingSelect
        },
        data () {
            return {
                type: 0,
                loading: false,
                fetchParam: {
                    date: 'yesterday', // 日期
                    status: '', // 连锁练习
                    store_id: '', // 连锁搜索
                    speaking_id: '',
                    company_id: '',
                    department_id: '',
                    user_id: '', // 店员
                    is_test: '', // 有无练习
                    page_size: 15,
                    page: 1
                },
                tableData: [],
                total: 0
            }
        },
        watch: {
            '$route' () {
                if (this.$route.name != 'speaking-system-index') return
                this.type = parseInt(this.$route.query.type) || 0
                this.fetchParam.speaking_id = this.$route.query.speaking_id
                this.fetchParam.company_id = this.$route.query.company_id
                this.fetchParam.department_id = this.$route.query.department_id
                this.fetchParam.date = this.fetchParam.date || 'yesterday'
                this.getData()
                xmview.setContentBack(this.type > 0)
            }
        },
        activated () {
            this.type = parseInt(this.$route.query.type) || 0
            this.fetchParam.speaking_id = this.$route.query.speaking_id
            this.fetchParam.company_id = this.$route.query.company_id
            this.fetchParam.department_id = this.$route.query.department_id
            this.fetchParam.page = 1
            this.getData()
        },
        methods: {
            getData () {
                this.loading = true
                let p
                if (this.type == 0) p = speakingService.systemSpeakingSearch(this.fetchParam)
                else if (this.type == 1) p = speakingService.systemCompanySearch(this.fetchParam)
                else if (this.type == 2) p = speakingService.systemDepartmentSearch(this.fetchParam)
                else p = speakingService.systemUserSearch(this.fetchParam)
                p.then((ret) => {
                    this.total = ret.total
                    this.tableData = ret.data
                    this.loading = false
                    xmview.setContentLoading(false)
                })
                return p
            },
            exportClick () {
                if (this.type == 0) speakingService.exportSystemSpeaking(this.fetchParam)
                else if (this.type == 1) speakingService.exportSystemCompany(this.fetchParam)
                else if (this.type == 2) speakingService.exportSystemDepartment(this.fetchParam)
                else speakingService.exportSystemUser(this.fetchParam)
            }
        }
    }
</script>
