<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/showDetail";

    #test-material-container {
        @extend %content-container;
        border: none;
        .manage-container {
            @extend %right-top-btnContainer;
            > * {
                color: #fff;
                border-radius: 5px;
            }
        }
    }
</style>
<template>
    <section id="test-material-container">
        <div id="material-content-container">
            <el-form :inline="true" :model="fetchParam" class="search">
                <el-form-item label="素材名称">
                    <el-input v-model="fetchParam.keyword" placeholder="请输入素材名称" @keyup.enter.native="fetchData"></el-input>
                </el-form-item>
                <el-form-item label="工业名称">
                        <IndustryCompanySelect type="1" v-model="fetchParam.company_id"
                                       v-on:change="val=>fetchParam.company_id=val"
                                       :change="fetchData">
                        </IndustryCompanySelect>
                </el-form-item>
                <el-form-item label="当前状态">
                    <el-select v-model="fetchParam.status" @change="fetchData" :clearable="true">
                        <el-option label="待审核" :value="1"></el-option>
                        <el-option label="转码中" :value="2"></el-option>
                        <el-option label="转码失败" :value="3"></el-option>
                        <el-option label="已通过" :value="4"></el-option>
                        <el-option label="已驳回" :value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <DateRange title="创建时间" 
                    :start="fetchParam.created_start" 
                    :end="fetchParam.created_end"
                    @changeStart="val=> {fetchParam.created_start=val}"
                    @changeEnd="val=> {fetchParam.created_end=val}" 
                    :change="fetchData">
                    </DateRange>
                </el-form-item>
                <el-form-item>
                    <DateRange title="更新时间" 
                    :start="fetchParam.updated_start" 
                    :end="fetchParam.updated_end"
                    @changeStart="val=> {fetchParam.updated_start=val}"
                    @changeEnd="val=> {fetchParam.updated_end=val}" 
                    :change="fetchData">
                    </DateRange>
                </el-form-item>
            </el-form>
            
             <el-table class="data-table" v-loading="loadingData"
                      :data="data"
                      :fit="true"
                      @select="selectRow"
                      @select-all="selectRow"
                      border>
                <el-table-column
                        min-width="180"
                        prop="name"
                        label="素材名称">
                </el-table-column>
                <el-table-column
                        min-width="100"
                        label="素材预览"
                        align="center">
                    <template slot-scope="scope">
                        <el-button @click="preview(scope.$index, scope.row)" type="text" size="small"
                            v-if=""><img src="../../images/video.png" style="width:20px"/></el-button>
                    </template>  
                </el-table-column>
                <el-table-column
                        width="150"
                        label="上传工业"
                        prop="company">
                </el-table-column>
                <el-table-column
                        width="190"
                        prop="create_time_name"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        width="100"
                        label="当前状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0" type="warning">待审核</el-tag>
                        <el-tag v-if="scope.row.status == 1" type="info">转码中</el-tag>
                        <el-tag v-if="scope.row.status == 2" type="danger">转码失败</el-tag>
                        <el-tag v-if="scope.row.status == 3" type="success">已通过</el-tag>
                        <el-tag v-if="scope.row.status == 4" type="danger">已驳回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="190"
                        prop="update_time_name"
                        label="更新时间">
                </el-table-column>
                <el-table-column
                    fixed="right"
                    width="150"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="agree(scope.$index, scope.row)" type="text" size="small"
                            v-if="scope.row.status == 0">通过</el-button>
                        <el-button @click="refuse(scope.$index, scope.row)" type="text" size="small"
                            v-if="scope.row.status == 0">驳回</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-row :gutter="20" class="utils-top-15">
                <el-col :span="12" :offset="12">
                    <el-pagination
                        style="text-align: right"
                        @size-change="val=> {fetchParam.page_size=val; fetchData()}"
                        @current-change="val=> {fetchParam.page=val; fetchData()}"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="fetchParam.page_total">
                    </el-pagination>
                </el-col>
            </el-row>
            <VideoPreviewOnly :url="videoUrl" ref="VideoPreviewOnly"></VideoPreviewOnly>
        </div>
    </section>
</template>

<script>
    import DateRange from '../../component/form/DateRangePicker'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import VideoPreviewOnly from '../../component/dialog/VideoPreviewOnly.vue'
    import TestAdvertVideoService from '../../../services/advert/advertAuditVideo'
    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                videoUrl: '',
                imageUrl: '',
                fetchParam: this.newFetchParam(),
                isShow: false
            }
        },
        activated () {
            xmview.setContentLoading(false)
            this.initFetchParam()
        },
        created () {
            // this.initFetchParam()
        },
        filters: {
        },
        methods: {
            initFetchParam () {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData () {
                xmview.setContentLoading(true)
                let data = Object.assign({}, this.fetchParam)
                data.status = (!data.status && data.status !== 0) ? '' : data.status
                TestAdvertVideoService.search(data).then((ret) => {
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page != val) {
                    this.fetchParam.page = val
                    this.fetchData()
                }
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            // 通过
            agree (index, row) {
                this.$confirm('您确定通过吗？', '通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return TestAdvertVideoService.updateAdvertStatus(row.id, 3).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '状态更新成功!'
                        })
                        this.fetchData()
                    })
                })
            },
            // 驳回
            refuse (index, row) {
                this.$confirm('您确定驳回吗？', '驳回', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    return TestAdvertVideoService.updateAdvertStatus(row.id, 4).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '状态更新成功!'
                        })
                        this.fetchData()
                    })
                })
            },
             // 预览视频
            preview (index, row) {
                // 拿到播放地址
                TestAdvertVideoService.getVideoPreviewUrl(row.id).then((ret) => {
                    this.videoUrl = ret.video
                    this.$refs.VideoPreviewOnly.show(row.name)
                })
            },
            newFetchParam () {
                return {
                    company_id: void 0,
                    keyword: '',
                    status: '',
                    created_start: '',
                    created_end: '',
                    updated_start: '',
                    updated_end: '',
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            }
        },
        components: {
            DateRange,
            IndustryCompanySelect,
            VideoPreviewOnly
        }
    }
</script>
