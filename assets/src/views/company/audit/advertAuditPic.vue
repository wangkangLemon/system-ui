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
                    <el-input v-model="fetchParam.keyword" placeholder="请输入素材名称" @keyup.enter.native="fetchPicData"></el-input>
                </el-form-item>
                <el-form-item label="工业名称">
                        <IndustryCompanySelect type="1" v-model="fetchParam.company_id"
                                       v-on:change="val=>fetchParam.company_id=val"
                                       :change="fetchPicData">
                        </IndustryCompanySelect>
                </el-form-item>
                <el-form-item label="当前状态">
                    <el-select v-model="fetchParam.status" @change="fetchPicData" :clearable="true">
                        <el-option label="待审核" :value="0"></el-option>
                        <el-option label="已通过" :value="1"></el-option>
                        <el-option label="已驳回" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <DateRange title="创建时间" 
                    :start="fetchParam.created_start" 
                    :end="fetchParam.created_end"
                    @changeStart="val=> {fetchParam.created_start=val}"
                    @changeEnd="val=> {fetchParam.created_end=val}" 
                    :change="fetchPicData">
                    </DateRange>
                </el-form-item>
                <el-form-item>
                    <DateRange title="更新时间" 
                    :start="fetchParam.updated_start" 
                    :end="fetchParam.updated_end"
                    @changeStart="val=> {fetchParam.updated_start=val}"
                    @changeEnd="val=> {fetchParam.updated_end=val}" 
                    :change="fetchPicData">
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
                        <el-button @click="preview(scope.$index, scope.row)" type="text" size="small">
                            <img src="../../images/picture.png" style="width:20px"/></el-button>
                    </template>  
                </el-table-column>
                <el-table-column
                        width="150"
                        label="上传工业"
                        prop="company">
                </el-table-column>
                <el-table-column
                        width="190"
                        prop="create_time"
                        label="创建时间">
                </el-table-column>
                <el-table-column
                        width="100"
                        label="当前状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.status == 0" type="warning">待审核</el-tag>
                        <el-tag v-if="scope.row.status == 1" type="success">已通过</el-tag>
                        <el-tag v-if="scope.row.status == 2" type="danger">已驳回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                        width="190"
                        prop="update_time"
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
                        @size-change="val=> {fetchParam.page_size=val; fetchPicData()}"
                        @current-change="val=> {fetchParam.page=val; fetchPicData()}"
                        :current-page="fetchParam.page"
                        :page-size="fetchParam.page_size"
                        :page-sizes="[15, 30, 60, 100]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="fetchParam.page_total">
                    </el-pagination>
                </el-col>
            </el-row>
            <ImagePreview v-model="previewDialog.isShow" :url="previewDialog.url"></ImagePreview>
        </div>
    </section>
</template>

<script>
    import DateRange from '../../component/form/DateRangePicker'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import ImagePreview from '../../component/dialog/ImagePreview.vue'
    import TestAdvertPicService from '../../../services/advert/advertAuditPic'
    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                imageUrl: '',
                fetchParam: this.newFetchParam(),
                previewDialog: {
                    isShow: false,
                    url: void 0,
                },
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
                this.fetchPicData()
            },
            fetchPicData () {
                xmview.setContentLoading(true)
                let data = Object.assign({}, this.fetchParam)
                data.status = (!data.status && data.status !== 0) ? '' : data.status
                TestAdvertPicService.search(data).then((ret) => {
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
                })
            },
            handleSizeChange (val) {
                this.fetchParam.page_size = val
                this.fetchPicData()
            },
            handleCurrentChange (val) {
                if (this.fetchParam.page != val) {
                    this.fetchParam.page = val
                    this.fetchPicData()
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
                    return TestAdvertPicService.updateAdvertStatus(row.id, 1).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '状态更新成功!'
                        })
                        this.fetchPicData()
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
                    return TestAdvertPicService.updateAdvertStatus(row.id, 2).then((ret) => {
                        this.$message({
                            type: 'success',
                            message: '状态更新成功!'
                        })
                        this.fetchPicData()
                    })
                })
            },
             // 预览视频
            preview (index, row) {
                this.previewDialog.url = row.source_url
                this.previewDialog.isShow = true
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
            ImagePreview
        }
    }
</script>
