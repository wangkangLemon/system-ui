<!--企业课程-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #course-manage-industry-container {
        @extend %content-container;

        .manage-container {
            position: absolute;
            right: 0;
            top: -50px;
            > * {
                color: #fff;
                border-radius: 5px;
            }

            // 添加课程
            .add {
                background: rgb(0, 204, 255);
            }

            // 管理栏目
            .catmange {
                background: rgb(153, 102, 204);
            }
        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            margin-top: 15px;
        }
    }
</style>

<template>
    <article id="course-manage-industry-container">
        <el-tabs type="card" @tab-click="tabClick">
            <el-tab-pane label="连锁课程">
                <article class="search">
                    <!-- <section>
                        <i>专辑名称</i>
                        <el-input v-model="fetchParams[0].keyword" @keyup.enter.native="fetchData"></el-input>
                    </section> -->

                    <section>
                        <i>状态</i>
                        <el-select v-model="fetchParams[0].status" placeholder="请选择" @change="fetchData"
                                   :clearable="true">
                            <el-option label="转码中" :value="2"></el-option>
                            <el-option label="下线" :value="1"></el-option>
                            <el-option label="正常" :value="0"></el-option>
                        </el-select>
                    </section>
                    <section>
                        <i>连锁</i>
                        <IndustryCompanySelect :type="2" v-model="fetchParams[0].company_id"
                                               :change="fetchData"></IndustryCompanySelect>
                    </section>

                    <DateRange title="创建时间" :start="fetchParams[0].time_start" :end="fetchParams[0].time_end"
                               @changeStart="val=> fetchParams[0].time_start=val "
                               @changeEnd="val=> fetchParams[0].time_end=val" :change="fetchData">
                    </DateRange>
                </article>
            </el-tab-pane>
            <el-tab-pane label="工业课程">
                <article class="search">
                    <!-- <section>
                        <i>专辑名称</i>
                        <el-input v-model="fetchParams[1].keyword" @keyup.enter.native="fetchData"></el-input>
                    </section> -->

                    <section>
                        <i>状态</i>
                        <el-select v-model="fetchParams[1].status" placeholder="请选择" @change="fetchData"
                                   :clearable="true">
                            <el-option label="转码中" :value="2"></el-option>
                            <el-option label="下线" :value="1"></el-option>
                            <el-option label="正常" :value="0"></el-option>
                        </el-select>
                    </section>

                    <section>
                        <i>工业</i>
                        <IndustryCompanySelect :type="1" v-model="fetchParams[1].company_id"
                                               :change="fetchData"></IndustryCompanySelect>
                    </section>

                    <DateRange title="创建时间" :start="fetchParams[1].time_start" :end="fetchParams[1].time_end"
                               @changeStart="val=> fetchParams[1].time_start=val "
                               @changeEnd="val=> fetchParams[1].time_end=val" :change="fetchData">
                    </DateRange>
                </article>
            </el-tab-pane>
        </el-tabs>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  border>
            <el-table-column
                    min-width="200"
                    prop="name"
                    label="课程">
            </el-table-column>
            <el-table-column
                    min-width="200"
                    prop="company_name"
                    label="企业">
            </el-table-column>
            <!-- <el-table-column width="80" label="题目数">
                <template scope="scope">
                    <el-button style="width: 100%"
                               @click="$router.push({name: 'course-manage-addCourse', params: {courseInfo: scope.row, tab:'second', readonly: true}})"
                               type="text" size="small">{{scope.row.subject_num}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="score"
                    label="总分数">
            </el-table-column>
            <el-table-column
                    width="100"
                    prop="score_pass"
                    label="及格分数">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="limit_time_string"
                    label="限时">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="考试次数">
                <template scope="scope">
                    <i>{{scope.row.limit_repeat > 0 ? scope.row.limit_repeat : '限制'}}</i>
                </template>
            </el-table-column>
            <el-table-column
                    width="120"
                    label="红包">
                <template scope="scope">
                    <i v-if="scope.row.price > 0">¥ {{scope.row.price}} +- {{scope.row.price_float}}</i>
                    <i v-else>未开启</i>
                </template>
            </el-table-column> -->
            <el-table-column
                    width="100"
                    label="状态">
                <template scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>
                    <el-tag v-else-if="scope.row.status == 2" type="primary">转码中</el-tag>
                    <el-tag v-else>已下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="170"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="70"
                    label="操作"
                    fixed="right"
                    align="center">
                <template scope="scope">
                    <!--<el-button @click="preview(scope.$index, scope.row)" type="text" size="small">预览</el-button>-->
                    <el-button @click="offline(scope.$index, scope.row)" type="text" size="small">
                        <i>{{ scope.row.status == 1 ? '上线' : '下线' }}</i>
                    </el-button>
                    <!-- <el-button v-if="scope.row.subject_num > 0"
                               @click="$router.push({name:'course-manage-course-answer-analysis', params:{id:scope.row.id}})"
                               type="text" size="small">
                        <i>答案分析</i>
                    </el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="handlePageSizeChange"
                       @current-change="handlePageChange"
                       :current-page="fetchParams[currTab].page"
                       :page-size="fetchParams[currTab].page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>
    </article>
</template>

<script>
    import courseService from '../../../services/newcourse/courseService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'

    function getFetchParam (course_type) {
        return {
            page: 1,
            page_size: 15,
            time_start: void 0,
            time_end: void 0,
            keyword: void 0,
            status: void 0, // 2- 视屏转码中 1-下线 0-正常
            course_type: course_type, // industry-工业 private- 连锁
        }
    }

    export default{
        data () {
            return {
                data: [],
                loadingData: false,
                total: 0,
                currTab: 0,
                fetchParams: [getFetchParam('private'), getFetchParam('industry')],
            }
        },
        activated () {
            this.fetchData()
            xmview.setContentLoading(false)
        },
        methods: {
            initFetchParam () {
                this.fetchParams = [getFetchParam('private'), getFetchParam('industry')]
            },
            fetchData () {
                this.loadingData = true
                let data = Object.assign({}, this.fetchParams[this.currTab])
                if (data.status === '' || data.status === undefined) {
                    data.status = -1
                }
                return courseService.search(data).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                }).catch(() => {
                    this.loadingData = false
                })
            },
            // 下线 或者上线课程 0为下线，1为上线
            offline (index, row) {
                let txt = row.status == 0 ? '下线' : '上线'
                let finalStatus = row.status == 0 ? 1 : 0
                xmview.showDialog(`你将要${txt}课程 <span style="color:red">${row.name}</span> 确认吗?`, () => {
                    if (finalStatus == 1) {
                        courseService.offline(row.id).then((ret) => {
                            row.status = finalStatus
                        })
                    } else {
                        courseService.online(row.id).then((ret) => {
                            row.status = finalStatus
                        })
                    }
                })
            },
            tabClick (tab) {
                if (tab.index == this.currTab) return
                this.currTab = parseInt(tab.index)
                this.fetchData()
            },
            handlePageSizeChange (val) {
                this.fetchParams[this.currTab].page_size = val
                this.fetchData()
            },
            handlePageChange (val) {
                this.fetchParams[this.currTab].page = val
                this.fetchData()
            }
        },
        components: {DateRange, IndustryCompanySelect}
    }
</script>
