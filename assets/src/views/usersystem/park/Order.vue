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
        <article class="search">
            <section>
                <i>订单号</i>
                <el-input v-model="fetchParam.prodno" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>商品号</i>
                <el-input v-model="fetchParam.prodno" @keyup.enter.native="fetchData"></el-input>
            </section>
            <section>
                <i>商品名</i>
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
                  border>
            <el-table-column
                    min-width="200"
                    prop="name"
                    label="订单号">
            </el-table-column>
            <el-table-column
                    min-width="200"
                    prop="cat_name"
                    label="商品编号">
            </el-table-column>
            <el-table-column
                    min-width="300"
                    prop="score"
                    label="商品名">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="limit_time_string"
                    label="销售渠道">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="limit_time_string"
                    label="领取人">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="limit_time_string"
                    label="联系方式">
            </el-table-column>
            <el-table-column
                    width="150"
                    prop="limit_time_string"
                    label="领取时间">
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
                        <el-button type="text" size="small" @click="()=>{dialogDetail.isShow=true}">完善订单</el-button>
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

        <!--商品详情的弹出框-->
        <el-dialog
                title="商品设置"
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
                    <el-input placeholder="请输入收货人"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="收货地址">
                    <el-input type="textarea" placeholder="请输入收货地址"></el-input>
                </el-form-item>
                <el-form-item label="邮政编码">
                    <el-input placeholder="请输入邮政编码（选填）"></el-input>
                </el-form-item>
                <el-form-item label="物流公司">
                    <el-input placeholder="请输入物流公司"></el-input>
                </el-form-item>
                <el-form-item label="快递单号">
                    <el-input placeholder="请输入快递单号"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button dialogDetail.isShow="false">取消</el-button>
                <el-button type="primary">确定</el-button>
            </span>
        </el-dialog>
    </main>
</template>

<script>
    export default {
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
                dialogDetail: { // 完善订单弹框
                    isShow: false,
                    model: {}
                },
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
        },
        components: {}
    }
</script>
