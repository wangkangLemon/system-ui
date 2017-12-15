<!--消息推送-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/common";
    @import "../../utils/mixins/topSearch";
    @import "../../utils/mixins/showDetail";

    .client-push-container {
        @extend %content-container;
        .header-button {
            @extend %right-top-btnContainer;
        }
        .search {
            @extend %top-search-container;
        }
        .block {
            text-align: right;
            margin-top: 10px;
        }
        .show-detail {
            .hr {
                border-bottom: 1px solid #ddd;
                margin: 20px 0;
            }
        }
    }
</style>
<template>
    <article class="client-push-container">
        <!--详情-->
        <el-dialog class="show-detail" title="推送详情" v-model="showDetail">
            <div class="info">
                <p><i class="title">标题： </i><span class="value">{{details.title}}</span></p>
                <p><i class="title">内容： </i><span class="value">{{details.content}}</span></p>
                <p><i class="title">类型： </i><span class="value">{{details.ModelName}}</span></p>
                <p v-if="details.model_id == 5"><i class="title">课程名称：</i><span class="value">{{details.Course.name}}</span></p>
                <p v-if="details.model_id == 20"><i class="title">链接：</i><span class="value">{{details.model_value}}</span></p>
                <p v-if="details.model_id == 9"><i class="title">药我说：</i><span class="value">{{details.Speaking.title}}</span></p>
                <div class="hr"></div>
                <p>
                    <i class="title">推送方式：</i>
                    <span class="value">
                        {{details.target_type == 'TAG' ? '条件推送' : '全局推送'}}
                    </span>
                </p>
                <p v-if="details.devices"><i class="title">平台：</i><span class="value">{{details.devices}}</span></p>
                <div v-if="details.Tags != null">
                    <p v-for="item in details.Tags"><i class="title">{{item.Name}}：</i><span class="value">{{item.Value}}</span></p>
                </div>
            </div>
        </el-dialog>
        <section class="header-button">
            <el-button icon="plus" type="primary" @click="createPush">新建推送</el-button>
        </section>
        <section class="search">
            <section>
                <i>推送方式</i>
                <el-select clearable v-model="fetchParam.target" @change="getData">
                    <el-option label="全局推送" value="all"></el-option>
                    <el-option label="条件推送" value="tag"></el-option>
                </el-select>
            </section>
            <section>
                <i>类型</i>
                <el-select clearable v-model="fetchParam.modelid" @change="getData">
                    <el-option label="全部" :value="100"></el-option>
                    <el-option label="文本" :value="0"></el-option>
                    <el-option label="课程" :value="5"></el-option>
                    <el-option label="链接" :value="20"></el-option>
                </el-select>
            </section>
            <section>
                <i>状态</i>
                <el-select clearable v-model="fetchParam.status" @change="getData">
                    <el-option label="待发送" :value="0"></el-option>
                    <el-option label="成功" :value="1"></el-option>
                    <el-option label="失败" :value="2"></el-option>
                </el-select>
            </section>
            <section>
                <i>关键字</i>
                <el-input @keyup.enter.native="getData" class="name" v-model="fetchParam.keyword"/>
            </section>
            <DateRange title="日期查找" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       v-on:changeStart="val=>fetchParam.time_start=val"
                       v-on:changeEnd="val=>fetchParam.time_end=val"
                       :change="getData">
            </DateRange>
        </section>
        <el-table border v-loading="loading" :data="pushData">
            <el-table-column
                    prop="target_type"
                    label="推送方式"
                    width="100">
                <template scope="scope">
                    {{scope.row.target_type == 'TAG' ? '条件推送' : '全局推送'}}
                </template>
            </el-table-column>
            <el-table-column
                    prop="model_name"
                    label="类型"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="标题"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="content"
                    label="内容">
            </el-table-column>
            <el-table-column
                    prop="devices"
                    label="平台"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="send_time"
                    label="发送时间"
                    width="160">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="状态"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="admin"
                    label="管理员"
                    width="100">
            </el-table-column>
            <el-table-column prop="operate" label="操作" width="80" fixed="right" align="center">
                <template scope="scope">
                    <el-button type="text" size="small" @click="checkDetail(scope.$index, scope.row)">
                        详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <section class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[15, 30, 60, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </section>
    </article>
</template>
<script>
    import DateRange from '../component/form/DateRangePicker.vue'
    import pushService from '../../services/pushService'
    export default {
        components: {
            DateRange,
        },
        data () {
            return {
                loading: false,
                // 查看店员详情
                details: {
                    name: '',          // 姓名
                    department: '',       // 门店
                    mobile: '',        // 手机
                    pass: '',          // 密码
                    address: '',       // 地址
                    sex: 0,            // 性别
                    birthday: '',          // 生日
                    create_time_name: ''
                },
                showDetail: false,     // 是否显示详情对话框
                currentPage: 1, // 分页当前显示的页数
                total: 0,
                pageSize: 15,
                fetchParam: clearSearch(),
                pushData: []
            }
        },
        activated () {
            this.getData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam() {
                this.currentPage = 1
                this.fetchParam = clearSearch()
            },
            createPush () {
                this.$router.push({name: 'client-push-create'})
            },
            getData () {
                this.loading = true
                return pushService.getPushList({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    keyword: this.fetchParam.keyword,
                    target: this.fetchParam.target,
                    modelid: this.fetchParam.modelid,
                    status: this.fetchParam.status,
                    time_start: this.fetchParam.time_start,
                    time_end: this.fetchParam.time_end
                }).then((ret) => {
                    this.pushData = ret.data
                    this.total = ret.total
                    this.loading = false
                })
            },
            // 查看店员详情
            checkDetail (index, row) {
                pushService.getPushDetail(row.id).then((ret) => {
                    this.details = ret.data
                    this.details.target_type = row.target_type
                }).then(() => {
                    this.showDetail = true
                })
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            goBack () {
                window.history.back()
            }
        }
    }
    function clearSearch() {
        return { // 搜索的姓名
            keyword: '',
            target: '', // 推送方式
            modelid: '', // 推送内容类型
            status: '', // 状态
            time_start: '',
            time_end: '',
        }
    }
</script>
