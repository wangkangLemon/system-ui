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
            top: 15px !important;
        }
    }
</style>

<template>
    <main id="usersys-integral-stock">
        <article class="manage-container">
            <el-button type="success" icon="plus">添加</el-button>
            <el-button type="info" @click="()=>{dialogReplenishment.isShow=true}"><i class="iconfont icon-daoru"></i> 导入

            </el-button>
        </article>

        <article class="search">
            <section>
                <i>商品编号</i>
                <el-input v-model="fetchParam.prodno" @keyup.enter.native="fetchData"></el-input>
            </section>

            <section>
                <i>兑换状态</i>
                <el-select v-model="fetchParam.prodno" placeholder="全部" :clearable="true">
                    <el-option label="已兑换" :value="1"></el-option>
                    <el-option label="未兑换" :value="0"></el-option>
                </el-select>
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
                    min-width="300"
                    prop="name"
                    label="商品编号">
            </el-table-column>
            <el-table-column
                    min-width="200"
                    prop="cat_name"
                    label="商品">
            </el-table-column>
            <el-table-column
                    width="120"
                    prop="score"
                    label="兑换状态">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="limit_time_string"
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
                    width="100"
                    label="操作">
                <template scope="scope">
                    <div class="tab-oepratebtns">
                        <el-button type="text" size="small" @click="()=>{dialogDetail.isShow=true}">详情</el-button>
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
                    <i>iPhone7</i>
                </el-form-item>
                <el-form-item label="商品编号">
                    <i>2193819231923</i>
                </el-form-item>
                <el-form-item label="商品封面">
                    <img src="http://upload.vodjk.com/2017/0522/1495422898699.jpg" style="width: 120px"/>
                </el-form-item>
                <el-form-item label="商品详情">
                    <pre>商品编号：2017098793287
                主屏：4.7英寸1334x750
                摄像：1200万像素
                系统：iOS10
                模式：4G网络
                特性：防水防尘 True Tone闪光灯 4K视频摄录
                内存：32G</pre>
                </el-form-item>
                <el-form-item label="收货人">
                    <i>黄慧鑫</i>
                </el-form-item>
                <el-form-item label="手机号">
                    <i>18582838596</i>
                </el-form-item>
                <el-form-item label="收货地址">
                    <i>北京市朝阳区三元桥地铁站附近国门大厦C层320新玛互动传媒科技有限公司</i>
                </el-form-item>
                <el-form-item label="邮政编码">
                    <i>1231313</i>
                </el-form-item>
                <el-form-item label="物流公司">
                    <i>暂无</i>
                </el-form-item>
                <el-form-item label="快递单号">
                    <i>暂无</i>
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
                    <i>iPhone7</i>
                </el-form-item>
                <el-form-item label="奖品图片">
                    <img src="http://upload.vodjk.com/2017/0522/1495422898699.jpg" style="width: 120px"/>
                </el-form-item>
                <el-form-item label="商品详情">
                    <pre>OPPO R9plus 这一刻，照亮你的美！</pre>
                </el-form-item>
                <el-form-item label="库存剩余">
                    <i>100</i>
                </el-form-item>
                <el-form-item label="手机号">
                    <i>18582838596</i>
                </el-form-item>
                <el-form-item label="选择文件">
                   <div>
                       <UploadFile :url='dialogReplenishment.uploadUrl' :on-success="handleImported" accept=".xls, .xlsx"
                                   btnTitle='点击上传'></UploadFile>
                       <el-button type="text">*下载模板</el-button>
                       请导入外部商品Excel表格
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
    import UploadFile from '../../component/upload/UploadFiles.vue'
    export default{
        data () {
            return {
                selectedIds: [],
                loadingData: false,
                data: [{}], // 表格数据
                total: 0,
                fetchParam: {
                    prodno: void 0, // 商品编号
                    page: 1,
                    page_size: 15,
                },
                dialogDetail: { // 商品详情的弹出框
                    isShow: false,
                    model: {}
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
            xmview.setContentLoading(false)
            this.dialogReplenishment.uploadUrl = '' // 设置上传的url
        },
        methods: {
            fetchData() {
            },
            // 单行被选中
            selectRow (selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            delMulti () {
            },
            handleImported () {}
        },
        components: {UploadFile}
    }
</script>
