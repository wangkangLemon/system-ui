<!--库存管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
    @import "../../../utils/mixins/topSearch";

    #usersys-integral-stock {
        @extend %content-container;

        .manage-container {
            @extend %right-top-btnContainer;
        }

        .search {
            @extend %top-search-container;
        }

        .data-table {
            .el-button {
                margin-left: 2px;
            }
        }

        .el-dialog {
            top: 18px !important;
        }
    }
</style>

<template>
    <main id="usersys-integral-stock">
        <article class="manage-container">
            <el-button type="success" icon="plus" @click="()=>{dialogReplenishment.isShow=true}">添加</el-button>
            <el-button type="info" @click="()=>{dialogReplenishment.isShow=true}"><i class="iconfont icon-daoru"></i>
                导入 <!--a-->
            </el-button>
        </article>

        <article class="search">
            <section>
                <i>商品编号</i>
                <el-input v-model="fetchParam.number" @keyup.enter.native="fetchData"></el-input>
            </section>
        </article>

        <el-table class="data-table" v-loading="loadingData"
                  :data="data"
                  :fit="true"
                  @select="selectRow"
                  @select-all="selectRow"
                  border>
            <el-table-column type="selection"></el-table-column>
            <el-table-column
                    width="200"
                    prop="product_stock_number"
                    label="商品编号">
            </el-table-column>
            <el-table-column
                    min-width="200"
                    prop="product_name"
                    label="商品">
            </el-table-column>
            <el-table-column
                    width="120"
                    label="兑换状态">
                <template scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="success">未领取</el-tag>
                    <el-tag v-else>已领取</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    width="180"
                    prop="create_time_name"
                    label="添加时间">
            </el-table-column>
            <!--<el-table-column-->
            <!--width="100"-->
            <!--label="状态">-->
            <!--<template scope="scope">-->
            <!--<el-tag v-if="scope.row.status == 0" type="success">正常</el-tag>-->
            <!--<el-tag v-else-if="scope.row.status == 2" type="primary">转码中</el-tag>-->
            <!--<el-tag v-else>已下线</el-tag>-->
            <!--</template>-->
            <!--</el-table-column>-->
            <el-table-column
                    width="130"
                    label="操作">
                <template scope="scope">
                    <div class="tab-oepratebtns">
                        <el-button type="text" size="small"
                                   @click="()=>{dialogDetail.model=scope.row; dialogDetail.isShow=true}">详情 <!--a-->
                        </el-button>
                        <el-button type="text" size="small">删除</el-button>
                    </div>
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

        <!--底部的批量删除和移动两个按钮-->
        <div class="bottom-manage">
            <el-button :disabled='selectedIds.length < 1' @click="delMulti">批量删除</el-button>
        </div>

        <!--商品详情的弹出框-->
        <el-dialog
                title="商品详情"
                :visible.sync="dialogDetail.isShow"
                size="small">
            <el-form label-position="right" label-width="80px">
                <el-form-item label="商品名称">
                    <i>{{dialogDetail.model.product_name}}</i>
                </el-form-item>
                <el-form-item label="商品编号">
                    <i>{{dialogDetail.model.product_stock_number}}</i>
                </el-form-item>
                <el-form-item label="商品封面">
                    <img :src="dialogDetail.model.product_image | fillImgPath" style="width: 120px"/>
                </el-form-item>
                <el-form-item label="商品详情">
                    <pre>{{prod.description}}</pre>
                </el-form-item>
            </el-form>
        </el-dialog>

        <!--补货弹出框-->
        <el-dialog
                title="补货"
                :visible.sync="dialogReplenishment.isShow"
                size="small">
            <el-form label-position="right" label-width="80px">
                <el-form-item label="商品类型">
                    <i>{{prod.name}}</i>
                </el-form-item>
                <el-form-item label="奖品图片">
                    <img :src="prod.image | fillImgPath" style="width: 120px"/>
                </el-form-item>
                <el-form-item label="商品详情">
                    <pre>{{prod.description}}</pre>
                </el-form-item>
                <el-form-item label="库存剩余">
                    <i>100</i>
                </el-form-item>
                <el-form-item label="手机号">
                    <i>18582838596</i>
                </el-form-item>
                <el-form-item label="选择文件">
                    <div>
                        <UploadFile :url='dialogReplenishment.uploadUrl' :on-success="handleImported"
                                    accept=".xls, .xlsx"
                                    btnTitle='点击上传'></UploadFile>
                        <el-button type="text" @click="downloadTmp">*下载模板</el-button>
                        请导入外部商品Excel表格 <!--a-->
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogReplenishment.isShow = false">取 消</el-button>
                        <el-button type="primary" @click="dialogReplenishment.isShow = false">确 定</el-button>
                    </span>
        </el-dialog>
    </main>
</template>

<script>
    import parkService from '../../../services/usersystem/parkService'
    import UploadFile from '../../component/upload/UploadFiles.vue'
    export default{
        data () {
            return {
                selectedIds: [],
                loadingData: false,
                prod: {}, // 商品信息
                data: [], // 表格数据
                total: 0,
                fetchParam: {
                    number: void 0, // 商品编号
                    page: 1,
                    page_size: 15,
                    prodId: void 0,
                },
                dialogDetail: { // 商品详情的弹出框
                    isShow: false,
                    model: {
                        create_time_name: void 0,
                        create_time_unix: void 0,
                        id: void 0,  // 商品库存ID
                        product_id: void 0, // 商品ID
                        product_image: void 0,
                        product_name: void 0, // 商品名称
                        product_stock_number: void 0, // 商品编号
                        status: void 0, // 状态 0 未领取 1 已领取
                    }
                },
                dialogReplenishment: { // 补货弹出框
                    isShow: false,
                    model: {},
                    uploadUrl: void 0
                }
            }
        },
        watch: {
            'fetchParam.page_size'() {
                this.fetchData()
            },
            'fetchParam.page'() {
                this.fetchData()
            },
        },
        activated () {
            this.fetchParam.prodId = this.$route.query.prodId
            // 获取商品信息
            let pProd
            if (!this.$route.params.prod) {
                pProd = parkService.prodDetail({id: this.fetchParam.prodId}).then((ret) => {
                    this.prod = ret
                })
            } else {
                this.prod = this.$route.params.prod
                pProd = Promise.resolve(true)
            }
            this.dialogReplenishment.uploadUrl = parkService.stockImportUrl({prodId: this.fetchParam.prodId}) // 设置上传的url

            this.loadingData = true
            Promise.all([this.fetchData(), pProd]).then(() => {
                xmview.setContentLoading(false)
            })
        },
        methods: {
            fetchData() {
                return parkService.stockSearch(this.fetchParam).then((ret) => {
                    this.data = ret.data
                    this.total = ret.total
                    this.loadingData = false
                })
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            // 批量删除
            delMulti () {
                this.loadingData = true
                parkService.stockDelBatch({prodId: this.fetchParam.prodId, ids: this.selectedIds}).then(() => {
                    this.loadingData = false
                })
            },
            handleImported () {
            },
            // 下载模板
            downloadTmp () {
                window.open(require('./assets/importProdTamplate.xlsx'))
            }
        },
        components: {UploadFile}
    }
</script>
