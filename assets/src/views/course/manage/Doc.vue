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
    }
</style>

<template>
    <article id="course-manage-doc-container">
        <article class="search">
            <section>
                <i>文档名称</i>
                <vInput :enter="fetchData" v-model="fetchParam.keyword"></vInput>
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
                <IndustryCompanySelect v-model="fetchParam.company_id"
                                       :change="fetchData"></IndustryCompanySelect>
            </section>

            <DateRange title="创建时间" :start="fetchParam.time_start" :end="fetchParam.time_end"
                       @changeStart="val=> fetchParam.time_start=val "
                       @changeEnd="val=> fetchParam.time_end=val" :change="fetchData">
            </DateRange>
        </article>

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
                    min-width="230"
                    prop="company_name"
                    label="所属企业">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="file_type"
                    label="类型">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="文件大小">
                <template scope="scope">
                    <i>{{(scope.row.file_size / 1024 / 1024).toFixed(2)}} M</i>
                </template>
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="pages"
                    label="页数">
            </el-table-column>
            <el-table-column
                    width="100"
                    label="状态">
                <template scope="scope">
                    <el-tag v-if="scope.row.pages > 0" type="success">正常</el-tag>
                    <el-tag v-else type="primary">转码中</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="190"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="120"
                    label="操作">
                <template scope="scope">
                    <el-button type="text" @click="show(scope.$index, scope.row)" size="small">查看</el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
            <el-button :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
        </div>

    </article>
</template>

<script>
    import vInput from '../../component/form/Input.vue'
    import courseService from '../../../services/courseService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import config from '../../../utils/config'

    export default{
        data () {
            return {
                loadingData: false,
                total: 0,
                data: [],
                selectedIds: [], // 选中的id
                fetchParam: {
                    file_type: void 0, // 文档类型
                    company_id: void 0,
                    keyword: void 0,
                    page: 1,
                    page_size: 15,
                    time_start: void 0,
                    time_end: void 0
                },
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
                    courseService.deleteDoc({id: row.id}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.data.splice(index, 1)
                        this.loadingData = false
                    })
                })
            },
            // 查看
            show (index, row) {
                window.open(`${window.location.origin}/view/showdoc?url=${config.apiHost}/sys/course/doc/${row.id}/view`)
            },
            // 批量删除
            delMulti () {
                xmview.showDialog(`你将要删除选中的课程，操作不可恢复确认吗?`, () => {
                    courseService.deleteDocMulty({id: this.selectedIds}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.dialogTree.isShow = false
                        setTimeout(() => {
                            this.fetchData() // 重新刷新数据
                        }, 300)
                    })
                })
            },
        },
        components: {vInput, courseService, DateRange, IndustryCompanySelect}
    }
</script>
