<!--日志-操作行为-->
<style lang="scss" rel='stylesheet/scss'>
    @import "../../../utils/mixins/mixins";
    @import "../../../utils/mixins/topSearch";
    .behavior-manage {
        padding:20px;
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>

<template>
    <article class="behavior-manage">
        <section class="search">
            <section>
                <i>企业</i>
                <CompanySelect v-model="fetchParam.company_id" :change="getData" :list="companyList" @changelist="val=>companyList=val"></CompanySelect>
            </section>
            <section>
                <i>门店</i>
                <DepSelect v-model="fetchParam.department_id" :change="getData"></DepSelect>
            </section>
            <section>
                <i>行为类型</i>
                <el-select placeholder="未选择" v-model="fetchParam.action" :clearable="true" @change="getData()">
                    <el-option label="创建" value="CREATE"></el-option>
                    <el-option label="更新" value="UPDATE"></el-option>
                    <el-option label="删除" value="DELETE"></el-option>
                    <el-option label="导入" value="IMPORT"></el-option>
                </el-select>
            </section>
            <DateRange :start="fetchParam.time_start" :end="fetchParam.time_end"
                       @changeStart="val => fetchParam.time_start=val"
                       @changeEnd="val => fetchParam.time_end=val" :change="getData">
            </DateRange>

            <el-button type="primary" icon="setting" @click="() => { moreSettingShow = true }">更多设置</el-button>
        </section>
        <el-table
                v-loading="loading"
                border
                @row-click="fullBehaviorChain"
                :data="data">
            <el-table-column
                    prop="user_name"
                    label="管理员"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="company_name"
                    label="企业名称">
            </el-table-column>
            <el-table-column
                    prop="role_name"
                    label="权限级别"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="action"
                    label="行为类型"
                    width="130">
            </el-table-column>
            <el-table-column
                    prop="from"
                    label="触发行为">
            </el-table-column>
            <el-table-column
                    prop="remote_address"
                    label="IP 地址"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="fetchParam.page"
                    :page-sizes="[15, 30, 60, 100]"
                    :page-size="fetchParam.page_size"
                    layout="total, sizes, prev, pager, next"
                    :total="total">
            </el-pagination>
        </div>
        <BehaviorChain ref="behaviorChain"></BehaviorChain>
        <el-dialog title="高级筛选" v-model="moreSettingShow" class="more-setting">
            <el-form>
            <el-tabs type="border-card">
                <el-tab-pane>
                    <span slot="label">高级设置</span>
                        <el-form-item label="选择企业">
                            <CompanySelect v-model="fetchParam.company_id" :change="getData" :list="companyList" @changelist="val=>companyList=val"></CompanySelect>
                        </el-form-item>
                    <el-form-item label="选择门店">
                        <DepSelect v-model="fetchParam.department_id" :change="getData"></DepSelect>
                    </el-form-item>
                    <el-form-item label="权限级别">
                        <el-select placeholder="未选择" v-model="fetchParam.level" :clearable="true" @change="clearAdminAndUser">
                            <el-option label="系统管理员" value="1"></el-option>
                            <el-option label="企业管理员" value="201"></el-option>
                            <el-option label="门店管理员" value="202"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="行为类型">
                        <el-select placeholder="未选择" v-model="fetchParam.action" :clearable="true" @change="getData">
                            <el-option label="创建" value="CREATE"></el-option>
                            <el-option label="更新" value="UPDATE"></el-option>
                            <el-option label="删除" value="DELETE"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="管理人员" v-if="fetchParam.level == 1">
                        <AdminSelect v-model="fetchParam.admin_id" :change="getData"></AdminSelect>
                    </el-form-item>
                    <el-form-item label="企业人员" v-else="">
                        <UserSelect v-model="fetchParam.user_id" :change="getData"></UserSelect>
                    </el-form-item>
                    <el-form-item label="时间范围">
                        <DateRange :start="fetchParam.time_start" :end="fetchParam.time_end"
                                   @changeStart="val=> fetchParam.time_start=val "
                                   @changeEnd="val=> fetchParam.time_end=val" :change="getData">
                        </DateRange>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane>
                    <span slot="label">变更追踪</span>
                    数据变更待上线...
                </el-tab-pane>
            </el-tabs>
            </el-form>
        </el-dialog>
    </article>
</template>

<script>
    import logService from '../../../services/logService'
    import BehaviorChain from './component/BehaviorChain.vue'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import CompanySelect from '../../component/select/IndustryCompany.vue'
    import DepSelect from '../../component/select/Department.vue'
    import AdminSelect from '../../component/select/Admin.vue'
    import UserSelect from '../../component/select/User.vue'

    export default {
        data () {
            return {
                loading: false,
                data: [],
                total: 0,
                fetchParam: {
                    page: void 0,
                    page_size: 15,
                    company_id: void 0, // 连锁
                    department_id: void 0,
                    action: '',
                    time_start: void 0,
                    time_end: void 0,
                    level: '201',
                    user_id: void 0,
                    admin_id: void 0,
                },
                moreSettingShow: false, // 更多设置是否显示
                companyList: []
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.getData()
            },
            handleCurrentChange(val) {
                this.fetchParam.page = val
                this.getData()
            },
            getData() {
                this.loading = true
                return logService.getBehaviorList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            fullBehaviorChain(item) {
                this.$refs.behaviorChain.setRecord(item.id)
                this.$refs.behaviorChain.getData()
            },
            clearAdminAndUser () {
                this.fetchParam.admin_id = void 0
                this.fetchParam.user_id = void 0
                this.getData()
            }
        },
        components: {CompanySelect, DepSelect, BehaviorChain, DateRange, AdminSelect, UserSelect}
    }
</script>
