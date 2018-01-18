<!--文档管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #course-manage-doc-container {
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
        }

        .search {
            @extend %top-search-container;
        }

        // 底部的管理按钮
        .bottom-manage {
            display: inline-block;
            margin-top: 15px;
        }

        // 替换文档
        .doc-update {
          .el-form-item {
            margin-bottom: 0;
          }
        }
         .form {
        margin-top: 20px;
        .bottom-btn {
            float: right;
            margin-bottom: 20px;

         }
    }

    }
</style>

<template>
    <main id="course-manage-doc-container">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="openAddDialog()"><i>新增文档</i></el-button>
        </section>

        <section class="search">
            <section>
                <i>文档名称</i>
                <el-input v-model="fetchParam.keyword" @keyup.enter.native="fetchData"></el-input>
            </section>

            <section>
                <i>类型</i>
                <el-select :clearable="true" v-model="fetchParam.file_type" placeholder="请选择" @change="fetchData">
                    <el-option label="Pdf 文件" value="pdf"></el-option>
                    <el-option label="Word 文档" value="doc"></el-option>
                    <el-option label="PowePoint 幻灯片" value="ppt"></el-option>
                </el-select>
            </section>

            <section>
                <i>所属企业</i>
                <IndustryCompanySelect v-model="fetchParam.company_id" :change="fetchData"></IndustryCompanySelect>
            </section>

            <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       @changeStart="val=> fetchParam.time_start=val "
                       @changeEnd="val=> fetchParam.time_end=val" :change="fetchData">
            </DateRange>
        </section>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  @select="selectRow"
                  @select-all="selectRow"
                  border>
            <el-table-column type="selection"></el-table-column>
            <el-table-column
                    min-width="230"
                    prop="file_name"
                    label="文档名称">
            </el-table-column>
            <el-table-column
                    min-width="200"
                    prop="company_name"
                    label="所属企业">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="file_type"
                    label="类型">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="pages"
                    label="页数">
            </el-table-column>
            <el-table-column
                    width="120"
                    label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 3" type="success">审核成功</el-tag>
                    <el-tag v-else-if="scope.row.status == 4" type="gray">审核失败</el-tag>
                    <template v-else-if="scope.row.status == 1 && scope.row.job_id > 0">
                        <el-tag type="warning">转码中</el-tag>
                        <el-button @click="refresh(scope.$index, scope.row)" type="text" size="small"><i class="fa fa-refresh" title="刷新状态"></i></el-button>
                    </template>
                    <el-tag v-else-if="scope.row.status == 0" type="primary">待审核</el-tag>
                    <template v-else>
                        <el-tag type="danger" :title="scope.row.job_message">转码失败</el-tag>
                        <el-button @click="retry(scope.$index, scope.row)" type="text" size="small"><i class="fa fa-retweet" title="点击重试"></i></el-button>
                    </template>
                </template>
            </el-table-column>
            <el-table-column
                    width="170"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="180"
                    label="操作"
                    fixed="right"
                    header-align="center">
                <template slot-scope="scope">
                    <template v-if="scope.row.status != 1 && scope.row.status != 2">
                        <el-button @click="show(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                        <el-button @click="download(scope.$index, scope.row)" type="text" size="small">下载</el-button>
                        <el-button @click="replace(scope.$index, scope.row)" type="text" size="small">替换</el-button>
                        <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                    </template>
                    <template v-else>
                        <el-button @click="download(scope.$index, scope.row)" type="text" size="small">下载</el-button>
                        <el-button @click="replace(scope.$index, scope.row)" type="text" size="small">替换</el-button>
                        <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="val => fetchParam.page_size = val "
                       @current-change="val => fetchParam.page = val"
                       :current-page="fetchParam.page"
                       :page-size="fetchParam.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="total">
        </el-pagination>

        <div class="bottom-manage">
            <el-button :disabled='selectedIds.length < 1' @click="delMulti" type="danger">批量删除</el-button>
        </div>
            <!-- 查看  -->
        <el-dialog title="查看" :visible.sync="docshow">
            <DocShow ref="docShow" :docurl="docurl" class="docshow"></DocShow>
             <el-form label-width="100px":model="form" class="form" ref="form" >
            <el-form-item label="审核结果" prop='flag' >
                <el-select v-model="form.status" :disabled="disabled">
                <el-option label="审核成功" value="3"></el-option>
                <el-option label="审核失败" value="4"></el-option>
                <el-option label="待审核" value="0"></el-option>
                </el-select>
            </el-form-item>
        <el-form-item label='备注说明' prop="remark">
         <el-input  
            :disabled="disabled"
            type="textarea"
            v-model="form.remark"
            :autosize="{ minRows: 4, maxRows: 6}"
            placeholder="请输入内容">
        </el-input>
        </el-form-item>
            <el-button v-if="!disabled" type='primary' class="bottom-btn" @click="submit()">确定</el-button>
            <el-button v-else type='primary' class="bottom-btn" @click="docshow=false">取消</el-button>
        </el-form>

        </el-dialog>
        <!-- 替换文档 -->
        <el-dialog :title="dialogReplace.title" v-model="dialogReplace.isShow" @close="dialogClose" class="doc-update">
            <el-form label-position="right" label-width="80px" :model="docModel">
                <el-form-item label="文档名称">
                    <span>{{docModel.file_name}}</span>
                </el-form-item>
                <el-form-item label="所属企业">
                    <span>{{docModel.company_name}}</span>
                </el-form-item>
                <el-form-item label="上传文档">
                    <UploadFile :onSuccess="handleReplaceUploadDoc" :url="replaceDocUploadUrl" :accept="accept" ref="uploadFileRef"></UploadFile>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!-- 新增文档 -->
        <el-dialog :title="dialogAdd.title" :visible.sync="dialogAdd.isShow" class="doc-update">
            <el-form label-position="right" label-width="80px" :model="docModel">
                <el-form-item label="上传文档">
                    <UploadFile :onSuccess="handleAddUploadDoc" :url="addDocUploadUrl" :accept="accept" ref="uploadFileAdd"></UploadFile>
                </el-form-item>
            </el-form>
        </el-dialog>

    </main>
</template>

<script>
    import courseService from '../../../services/courseService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import UploadFile from '../../component/upload/UploadFiles.vue'
    import config from '../../../utils/config'
    import DocShow from './DocShow'
    import clone from 'clone'

    function getFetchParam() {
        return {
            file_type: void 0, // 文档类型
            company_id: void 0,
            keyword: void 0,
            page: 1,
            page_size: 15,
            time_start: void 0,
            time_end: void 0
        }
    }

    export default{
        data () {
            return {
                docshow: false,
                loadingData: false,
                total: 0,
                data: [],
                disabled: false,
                form: {
                    id: '',
                    status: '',
                    remark: ''
                },
                selectedIds: [], // 选中的id
                fetchParam: getFetchParam(),
                dialogReplace: {
                    isShow: false,
                    title: '替换文档',
                    open: null,
                },
                dialogAdd: {
                    isShow: false,
                    title: '新增文档',
                    open: null,
                },
                docModel: {},
                replaceDocUploadUrl: '',
                addDocUploadUrl: courseService.getCourseDocUploadUrl(),
                accept: '.doc,.docx,.ppt,pptx,.pdf',
                docurl: '' // docurl 阅览
            }
        },
        watch: {
            'fetchParam.page_size'() {
                this.fetchData()
            },
            'fetchParam.page'() {
                this.fetchData()
            }
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            initFetchParam() {
                this.fetchParam = getFetchParam()
            },
            fetchData () {
                this.loadingData = true
                return courseService.getDocList(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            del (index, row) {
                xmview.showDialog(`你将要删除文档 <span style="color:red">${row.file_name}</span> 操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    courseService.deleteDoc({doc_id: row.id}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.data.splice(index, 1)
                        this.loadingData = false
                    }).catch(() => {
                        this.loadingData = false
                    })
                })
            },
            // 批量删除
            delMulti () {
                xmview.showDialog(`你将要删除选中的课程，操作不可恢复确认吗?`, () => {
                    courseService.deleteDocMulty({doc_id: this.selectedIds}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.dialogTree.isShow = false
                        setTimeout(() => {
                            this.fetchData() // 重新刷新数据
                        }, 300)
                    })
                })
            },
            //  刷新
            refresh (index, row) {
                this.loadingData = true
                courseService.refreshDoc({doc_id: row.id}).then(() => {
                    xmview.showTip('success', '文档转码状态刷新成功')
                    this.loadingData = false
                    this.fetchData()
                }).catch(() => {
                    this.loadingData = false
                })
            },
            // 重试
            retry (index, row) {
                this.loadingData = true
                courseService.retryDoc({doc_id: row.id}).then(() => {
                    xmview.showTip('success', '重新提交文档转码任务成功')
                    this.loadingData = false
                    this.fetchData()
                }).catch(() => {
                    this.loadingData = false
                })
            },
            // 查看
            show (index, row) {
                this.docurl = `${config.apiHost}/sys/course/doc/${row.id}/view`
                this.form = clone(row)
                this.disabled = row.status !== 0
                if (this.form.status === 0) {
                    this.form.status = '待审核'
                } else if (this.form.status === 3) {
                    this.form.status = '审核成功'
                } else if (this.form.status === 4) {
                    this.form.status = '审核失败'
                }
                this.docshow = true
                // window.open(`${window.location.origin}/view/showdoc?url=${config.apiHost}/sys/course/doc/${row.id}/view`)
            },

            // 审核提交
            submit() {
                if (this.form.status === '待审核') {
                    this.form.status = 0
                } else if (this.form.status === '审核成功') {
                    this.form.status = 3
                } else if (this.form.status === '审核失败') {
                    this.form.status = 4
                }
                courseService.auditDoc(this.form).then(() => {
                    xmview.showTip('success', '保存成功')
                    this.docshow = false
                    this.fetchData()
                })
            },
            // 下载
            download (index, row) {
                courseService.downloadDoc({doc_id: row.id, name: row.file_name})
            },
            // 替换文档
            replace (index, row) {
                this.replaceDocUploadUrl = courseService.getReplaceDocUploadUrl({doc_id: row.id})
                this.dialogReplace.isShow = true
                this.docModel = {
                    'id': row.id,
                    'file_name': row.file_name,
                    'company_name': row.company_name,
                }
            },
            // 更新文档， 文档上传完毕
            handleReplaceUploadDoc (rep) {
                xmview.showTip('success', '操作成功')
                this.fetchData()
                this.dialogReplace.isShow = false
            },
            openAddDialog() {
                this.dialogAdd.isShow = true
            },
            handleAddUploadDoc (rep) {
                xmview.showTip('success', '操作成功')
                setTimeout(() => {
                    this.fetchData()
                    this.dialogAdd.isShow = false
                }, 1000)
            },
            dialogClose () {
                this.$nextTick(() => {
                    this.$refs.uploadFileRef.fileList = []
                })
            },
        },
        components: {courseService, DateRange, IndustryCompanySelect, UploadFile, DocShow}
    }
</script>
