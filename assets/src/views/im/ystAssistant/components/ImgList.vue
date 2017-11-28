<style lang='scss' rel='stylesheet/scss'>
    #im-yst-assistant-components-imglist {
        .material-title {
            > * {
                display: inline-block;
                vertical-align: top;
                padding: 5px;
            }

            img {
                width: 50px;
                height: 50px;
            }
        }

        .imgSearch {
            display: flex;
            margin-bottom: 10px;
            > * {
                flex: 1;
            }

            .searchImg {
                text-align: right;
                width: 300px;
            }
        }
        .pagin {
            float: right;
            margin: 15px 0;
        }
    }
</style>

<template>
    <article id="im-yst-assistant-components-imglist">
        <div class="imgSearch">
            <UploadFile :url='uploadImgUrl' :on-success="uploadImgSucc" btnTitle='上传' v-if="type == 0"></UploadFile>

            <div class="searchImg">
                <el-input style="width: 200px" @keyup.enter.native="fetchData" v-model="paramImgs.keyword"
                          placeholder="关键字"></el-input>
            </div>
        </div>
        <el-table v-loading="loadingData"
                  :data="imgs"
                  :fit="true"
                  border>
            <el-table-column label="标题">
                <template scope="scope">
                    <article class="material-title">
                        <img :src="scope.row.thumb_url">
                        <section>
                            <div v-text="scope.row.name"></div>
                        </section>
                    </article>
                </template>
            </el-table-column>
            <el-table-column
                    width="170"
                    label="创建时间">
                <template scope="scope">
                    <i>{{scope.row.update_time}}</i>
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    label="操作"
                    fixed="right"
                    align="center">
                <template scope="scope">
                    <el-button @click="editImg(scope.$index, scope.row)" type="text" size="small" v-if="type == 0">
                        <i>编辑</i>
                    </el-button>
                    <el-button @click="delImg(scope.$index, scope.row)" type="text" size="small" v-if="type == 0">
                        <i>删除</i>
                    </el-button>
                    <el-button v-if="type == 1" @click="onSelected(scope.row)" type="text" size="small">
                        <i>选取</i>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination class="pagin"
                       @size-change="val => {paramImgs.page_size = val; fetchData()}"
                       @current-change="val => {paramImgs.page = val; fetchData()}"
                       :current-page="paramImgs.page"
                       :page-size="paramImgs.page_size"
                       :page-sizes="[15, 30, 60, 100]"
                       layout="sizes,total, prev, pager, next"
                       :total="paramImgs.total">
        </el-pagination>

        <el-dialog title="编辑图片信息" v-model="dialogImg.isShow">
            <el-form>
                <el-form-item label="图片名称">
                    <el-input @keyup.enter.native="dialogImg.confirmFn" v-model="dialogImg.model.name"
                              auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogImg.isShow = false">取 消</el-button>
                <el-button type="primary" @click="dialogImg.confirmFn">确 定</el-button>
            </div>
        </el-dialog>
    </article>
</template>

<script>
    import imService from '../../../../services/imService'
    import UploadFile from '../../../component/upload/UploadFiles.vue'
    export default{
        props: {
            type: {
                type: Number, // 0- 查看列表  1-选取数据
                default: 0
            },
            autoFetch: {
                type: Boolean,
                default: false
            },
            onSelected: Function
        },
        data () {
            return {
                loadingData: false,
                imgs: [],
                uploadImgUrl: '',
                paramImgs: { // 图片列表的请求参数
                    keyword: void 0,
                    page_size: 15,
                    page: 1,
                    total: 0
                },
                dialogImg: {
                    isShow: false,
                    confirmFn: {},
                    model: '',
                }
            }
        },
        watch: {
            'paramMaterial.page_size'() {
                this.fetchData()
            },
            'paramMaterial.page'() {
                this.fetchData()
            },
        },
        created () {
        },
        activated () {
            this.uploadImgUrl = imService.getNewsUploadImgUrl()
        },
        methods: {// 编辑图片
            fetchData () {
                this.loadingData = true
                imService.getImgList(this.paramImgs).then((ret) => {
                    this.paramImgs.total = ret.total
                    this.imgs = ret.data
                    this.loadingData = false
                }).catch(err => {
                    console.info(err)
                })
            },
            editImg (index, row) {
                this.dialogImg.isShow = true
                this.dialogImg.model = row
                if (typeof this.dialogImg.confirmFn !== 'function') {
                    this.dialogImg.confirmFn = () => {
                        imService.editImg(this.dialogImg.model)
                        this.dialogImg.isShow = false
                        xmview.showTip('success', '操作成功')
                    }
                }
            },
            // 删除图片
            delImg (index, row) {
                let title = row.name
                xmview.showDialog(`是否确认删除图片 <i style="color:red">${title}</i> 操作不可恢复确认吗?`, () => {
                    this.loadingData = true
                    imService.delImg(row.id).then(() => {
                        xmview.showTip('success', '操作成功!')
                        this.loadingData = false
                        this.imgs.splice(index, 1)
                    })
                })
            },
            // 图片上传完毕之后的逻辑
            uploadImg () {
            },
            // 图片上传完毕
            uploadImgSucc (ret) {
                console.info(ret)
            }
        },
        components: {UploadFile}
    }
</script>
