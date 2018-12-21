<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #speaking-content-index {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }
    }
</style>

<template>
    <main id="speaking-content-index">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="$router.push({ name:'speaking-content-add'})"><i>添加药我说</i>
            </el-button>
        </section>
        <main class="search">
            <section>
                <i>标题</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>
            <DateRange 
                title="有效日期" 
                :start="fetchParam.time_start" 
                :end="fetchParam.time_end"
                v-on:changeStart="val=> fetchParam.time_start=val"
                v-on:changeEnd="val=> fetchParam.time_end=val"
                :change="fetchData">
            </DateRange>
            <section>
                <i>状态</i>
                <el-select v-model="fetchParam.status" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="上线" value="0"></el-option>
                    <el-option label="草稿" value="1"></el-option>
                    <el-option label="下线" value="2"></el-option>
                </el-select>
            </section>
            <section>
                <i>是否有红包</i>
                <el-select v-model="fetchParam.price_enabled" placeholder="全部" @change="fetchData" :clearable="true">
                    <el-option label="有" value="1"></el-option>
                    <el-option label="无" value="0"></el-option>
                </el-select>
            </section>
        </main>

        <el-table class="data-table" v-loading="loadingData" :data="data" border>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="content" label="内容"></el-table-column>
            <el-table-column width="100" prop="price_enabled" label="有无红包" align="center">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.price_enabled">有</el-tag>
                    <el-tag type="gray" v-else>无</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="80" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">上线</el-tag>
                    <el-tag v-else-if="scope.row.status == 1" type="primary">草稿</el-tag>
                    <el-tag v-else type="danger">下线</el-tag>
                </template>
            </el-table-column>
            <el-table-column width="120" label="发布状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.publish_status == 0" type="success">发布</el-tag>
                    <el-tag v-else-if="scope.row.publish_status == 2" type="warning">撤回</el-tag>
                </template>
            </el-table-column>
            <!--<el-table-column width="100" prop="limit" label="练习次数"></el-table-column>-->
            <el-table-column prop="end_time" label="有效日期" width="170"></el-table-column>
            <el-table-column
                    width="180"
                    label="操作"
                    align="center"
                    fixed="right">
                <template slot-scope="scope">
                    <!--<el-button @click="preview(scope.$index, scope.row)" type="text" size="small">预览</el-button>-->
                    <el-button 
                        @click="edit(scope.$index, scope.row)" 
                        type="text" 
                        size="small">
                        编辑
                    </el-button>
                    <el-button 
                        v-if="scope.row.status != 1" 
                        @click="offline(scope.$index, scope.row)" 
                        type="text"
                        size="small">
                        <i>{{ scope.row.status == 2 ? '上线' : '下线' }}</i>
                    </el-button>
                    <el-button 
                        @click="publish(scope.$index, scope.row)" 
                        type="text"
                        size="small">
                        <i>{{ scope.row.publish_status == 2 ? '发布' : '撤回' }}</i>
                    </el-button>
                    <el-button 
                        @click="del(scope.$index, scope.row)" 
                        type="text" 
                        size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination 
            class="pagin"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="fetchParam.page"
            :page-size="fetchParam.page_size"
            :page-sizes="[15, 30, 60, 100]"
            layout="sizes,total, prev, pager, next"
            :total="total">
        </el-pagination>

    </main>
</template>

<script>
    import speakingContentService from 'services/speaking/contentService'
    import DateRange from 'components/form/DateRangePicker.vue'
    export default {
        components: {
            DateRange
        },
        data() {
            return {
                loadingData: false,
                data: [], // 表格数据
                total: 0,
                dialogVisible: false,
                fetchParam: {
                    price_enabled: void -1,
                    status: void -1,
                    keyword: void '',
                    page: 1,
                    page_size: 15,
                    time_start: void '',
                    time_end: void '',
                    sender_type: 'system'
                }
            }
        },
        activated () {
            this.fetchData()
        },
        methods: {
            initFetchParam () {
                this.fetchParam = {
                    price_enabled: void -1,
                    status: void -1,
                    keyword: void '',
                    page: 1,
                    page_size: 15,
                    time_start: void '',
                    time_end: void '',
                    sender_type: 'system'
                }
            },
            handleCurrentChange (val) {
                this.fetchParam.page = val
                this.fetchData()
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            fetchData (val) {
                this.loadingData = true
                this.fetchParam.status = this.fetchParam.status == '' ? void -1 : this.fetchParam.status
                return speakingContentService.search(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                    xmview.setContentLoading(false)
                })
            },
            // 单条删除
            del (index, row) {
                xmview.showDialog(`你将要删除药我说【${row.title}】操作不可恢复确认吗?`, () => {
                    speakingContentService.deleteSpeaking({speaking_id: row.id}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.data.splice(index, 1)
                    })
                })
            },
            // 下线 或者上线药我说 2为下线，0为上线
            offline (index, row) {
                let tip = row.status == 0 ? '下线' : '上线'
                let finalStatus = row.status == 0 ? 2 : 0
                this.$confirm(`你将要${tip}药我说【${row.title}】确认吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    speakingContentService.offlineSpeaking({speaking_id: row.id, disabled: finalStatus}).then((ret) => {
                        row.status = finalStatus
                    })
                })
            },
            // 发布撤回药我说, 0发布，1撤回，2待发布
            publish (index, row) {
                let tip = row.publish_status === 2 ? '发布' : '撤回'
                let status = row.publish_status == 2 ? 0 : 2
                this.$confirm(`你将要${tip}药我说 【${row.title}】 确认吗?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    speakingContentService.publishSpeaking({ speaking_id: row.id, status }).then(ret => {
                        xmview.showTip('success', ret.message || `${tip}成功`)
                        this.fetchData()
                    })
                })
            },
            // 编辑
            edit (index, row) {
                this.$router.push({name: 'speaking-content-add', query: {id: row.id}})
            },
        }
    }
</script>
