<!--视频管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #course-manage-video-container {
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
            margin-top: 15px;
        }
    }
</style>

<template>
    <article id="course-manage-video-container">
        <section class="manage-container">
            <el-button type="primary" icon="plus" @click="$router.push({name:'course-manage-video-add'})"><i>上传视频</i>
            </el-button>
        </section>
        <article class="search">
            <section>
                <i>视频</i>
                <vInput :enter="fetchData" v-model="fetchParam.keyword"></vInput>
            </section>

            <section>
                <i>状态</i>
                <el-select :clearable="true" v-model="fetchParam.status" placeholder="请选择" @change="fetchData">
                    <el-option label="转码中" :value="2"></el-option>
                    <el-option label="下线" :value="1"></el-option>
                    <el-option label="正常" :value="0"></el-option>
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
                    prop="name"
                    label="视频名称">
            </el-table-column>
            <el-table-column
                    width="200"
                    prop="company"
                    label="所属企业">
            </el-table-column>
            <el-table-column
                    width="80"
                    prop="duration_name"
                    label="时长">
            </el-table-column>
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
                    width="190"
                    prop="create_time_name"
                    label="创建时间">
            </el-table-column>
            <el-table-column
                    width="200"
                    label="操作">
                <template scope="scope">
                    <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--底部的批量删除和移动两个按钮-->
        <div class="bottom-manage">
            <el-button :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
        </div>

        <el-dialog :title="dialogAdd.title" v-model="dialogAdd.isShow">
            <el-form label-position="right" label-width="80px" :model="videoModel">
                <el-form-item label="视频名称">
                    <el-input v-model="videoModel.name"></el-input>
                </el-form-item>
                <el-form-item label="所属企业">
                    <IndustryCompanySelect :placeholder="videoModel.company"
                                           @change="val => videoModel.company_id = val"
                                           v-if="dialogAdd.isShow"></IndustryCompanySelect>
                </el-form-item>
                <el-form-item label="视频封面">
                    <UploadImg :defaultImg="videoModel.cover" :url="uploadImgUrl"
                               :onSuccess="handleOnUploaded"></UploadImg>
                </el-form-item>
                <el-form-item label="视频时长">
                    <el-input v-model="videoModel.duration"></el-input>
                </el-form-item>
                <el-form-item label="视频标签">
                    <vTags v-model="videoModel.tags"></vTags>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAdd.isShow = false">取 消</el-button>
                <el-button type="primary" @click="dialogAdd.confirmFn">确 定</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import vInput from '../../component/form/Input.vue'
    import CourseCategorySelect from '../../component/select/CourseCategory.vue'
    import courseService from '../../../services/courseService'
    import DateRange from '../../component/form/DateRangePicker.vue'
    import IndustryCompanySelect from '../../component/select/IndustryCompany.vue'
    import vTags from '../../component/form/Tags.vue'
    import UploadImg from '../../component/upload/UploadImg.vue'
    import config from '../../../utils/config'

    function getVideoModel () {
        return {
            name: void 0,
            company_id: void 0,
            cover: void 0,
            duration: void 0,
            tags: [],
        }
    }
    export default{
        data () {
            return {
                loadingData: false,
                total: 0,
                data: [],
                selectedIds: [], // 选中的id
                uploadImgUrl: '', // 上传图片的url
                fetchParam: {
                    company_id: void 0,
                    status: void 0,
                    keyword: void 0,
                    page: 1,
                    page_size: 15
                },
                dialogAdd: {
                    isShow: false,
                    title: '添加课程',
                    confirmFn: {}
                },
                videoModel: getVideoModel()
            }
        },
        created () {
            this.uploadImgUrl = courseService.getVideoUploadCoverUrl()
        },
        activated () {
            this.fetchData().then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData () {
                this.loadingData = true
                return courseService.getVideo(this.fetchParam).then((ret) => {
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
            add () {
                this.dialogAdd.isShow = true
                this.videoModel = getVideoModel()
            },
            edit (index, row) {
                this.dialogAdd.isShow = true
                this.videoModel = JSON.parse(JSON.stringify(row))
                this.videoModel.tags = this.videoModel.tags && this.videoModel.tags.split(',')

                this.dialogAdd.confirmFn = () => {
                    courseService.updateVideo(this.videoModel).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData()
                        this.dialogAdd.isShow = false
                    })
                }
            },
            del (index, row) {
                xmview.showDialog(`你将要删除视频 <span style="color:red">${row.name}</span> 操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    courseService.deleteVideo({id: row.id}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.data.splice(index, 1)
                        this.loadingData = false
                    })
                })
            },
            delMulti () {
                xmview.showDialog(`你将要删除选中的课程，操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    courseService.deleteCourseMulty({id: this.selectedIds.join(',')}).then(() => {
                        xmview.showTip('success', '操作成功')
                        this.fetchData() // 重新刷新数据
                    })
                })
            },
            // 处理图片上传完毕
            handleOnUploaded (ret) {
                this.videoModel.cover = config.apiHost + ret.data.url
            },
        },
        components: {
            vInput, CourseCategorySelect, DateRange, IndustryCompanySelect, vTags, UploadImg
        }
    }
</script>
