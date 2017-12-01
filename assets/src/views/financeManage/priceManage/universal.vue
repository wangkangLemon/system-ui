<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";
   
    #test-special-container {
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
    <section id="test-special-container">
    	<div id="special-content-container">
    		<el-table class="data-table" v-loading="loadingData"
                      :data="data"
                      :fit="true"
                      @select="selectRow"
                      @select-all="selectRow"
                      border>
                <el-table-column
                        min-width="100"
                        prop="desc"
                        label="投放类别">
                </el-table-column>
                <el-table-column
                        width="250"
                        label="平台使用费单价（元/人）"
                        prop="val">
                </el-table-column>
                <el-table-column
                        width="250"
                        prop="updated_at"
                        label="更新时间">
                </el-table-column>
                <el-table-column
                        fixed="right"
                        width="207"
                        label="操作">
                    <template scope="scope">
                       
                        <el-button @click="changeHistory(scope.$index, scope.row)" 
                            type="text" size="small">
                            <i>更改历史</i>
                        </el-button>
                        <el-button @click="changePrice(scope.$index, scope.row)" 
                        type="text" size="small">修改</el-button>
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
            <!-- 修改售价弹层 -->
            <el-dialog :title="editDialog" :visible.sync="dialog.edit">
                <div class="el-form-item">
                    <label for="score" class="el-form-item__label" style="width: 150px;">投放类别：</label>
                    <div class="el-form-item__content" style="margin-left: 80px;">
                        {{priceInfo.desc}}
                    </div>
                </div>
                <el-form :model="newPrice" label-width="150px" :rules="rules" ref="priceForm">
                    <el-form-item label="平台使用费单价：" prop="price">
                        <el-input v-model.number="newPrice.price" placeholder="请输入当前单价">
                            <template slot="append">元/人</template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()">确定</el-button>
                        <el-button @click="dialog.edit = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>

            <!-- 表格弹层 -->
            <el-dialog :title="tableDialog" :visible.sync="dialog.detail">
                <div class="el-form-item">
                    <label for="score" class="el-form-item__label" style="width: 100px;">投放类别：</label>
                    <div class="el-form-item__content" style="margin-left: 80px;">
                        {{priceInfo.desc}}
                    </div>
                </div>
                <el-table class="data-table" v-loading="loadingData"
                          :data="historyData"
                          :fit="true"
                          border>
                    <el-table-column
                            width="295"
                            label="平台使用费单价（元/人）"
                            prop="after">
                    </el-table-column>
                    <el-table-column
                            width="295"
                            prop="created_at"
                            label="更新时间">
                    </el-table-column>
                </el-table>
            </el-dialog>
    	</div>
    </section>
</template>

<script>

    import universalService from '../../../services/finance/universalService'

    export default{
        data () {
            return {
                loadingData: false,
                data: [],
                historyData: [],
                selectedIds: [],
                fetchParam: this.newFetchParam(),
                editDialog: '修改价格模板',
                tableDialog: '更新历史',
                dialog: {
                    edit: false,
                    detail: false
                },
                priceInfo: {},
                newPrice: {
                    price: void 0
                },
                rules: {
                    price: [
                        { required: true, message: '请输入当前售价', }
                    ],
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
            this.fetchData()
        },
        methods: {
            initFetchParam() {
                this.fetchParam = this.newFetchParam()
                this.fetchData()
            },
            fetchData() {
                xmview.setContentLoading(true)
                let data = Object.assign({}, this.fetchParam)
                if (data.status === '' || data.status === undefined) {
                    data.status = -1
                }
                universalService.search(data).then((ret) => {
                    this.data = ret.data
                    this.fetchParam.page_total = ret.total
                    xmview.setContentLoading(false)
                })
            },
            // 查看修改历史
            changeHistory (index, row) {
                this.dialog.detail = true
                this.priceInfo = row
                universalService.searchHistory({key: row.key}).then((ret) => {
                    this.historyData = ret.data
                    xmview.setContentLoading(false)
                })
            },
            // 修改价格
            changePrice (index, row) {
                this.dialog.edit = true
                this.priceInfo = row
            },
            // 修改售价
            submitForm () {
                this.$refs['priceForm'].validate((pass) => {
                    if (!pass) {
                        return
                    }
                    this.newPrice.price = this.newPrice.price.toString()
                    return universalService.update(this.priceInfo.key, this.newPrice).then(() => {
                        this.dialog.edit = false
                        this.fetchData()
                    })
                })
            },
            // 单行被选中
            selectRow(selection) {
                let ret = []
                selection.forEach((item) => {
                    ret.push(item.id)
                })
                this.selectedIds = ret
            },
            selectable (row, index) {
                return row.status === 1
            },
            newFetchParam () {
                return {
                    page: 1,
                    page_size: 15,
                    page_total: 0,
                }
            }
        },
        components: {}
    }
</script>
