<!--企业签约信息-->
<style lang='scss' rel="stylesheet/scss">
    @import "../../utils/mixins/mixins";
    @import "../../utils/mixins/topSearch";
    @import "../../utils/mixins/showDetail";

    .el-upload {
        width: 100%;
    }
    .table-container {
        .el-dialog {
            .upload-tip {
                padding-top: 10px;
                margin-top: 10px;
                border-top: 1px solid #ededed;
                h2 {
                    font-size: 14px;
                }
            }
        }

        .add {
            background: #f0f3f5;
            padding: 10px 20px;
            .el-icon-upload2 {
                padding-right: 5px;
            }
        }
        .import-container {
            padding: 20px;
        }
        .main-container {
            background: #fff;
            padding: 20px;
            .block {
                text-align: right;
                margin-top: 10px;
            }
        }
        .show-sum-count {
            @extend %justify;
            > div {
                display: inline-block;
                width: 32%;
                background: blanchedalmond;
                .intro {
                    padding: 10px;
                    border-top: 1px solid #000;
                }
            }
        }
        .box-card {
            margin-bottom: 20px;
            .clearfix {
                text-align: right;
            }
            .el-card__header {
                padding: 10px 15px;
                background: #f0f3f5;
                .icon-iconfontexcel {
                    position: relative;
                    top: -2px;
                    margin-right: 5px;
                }
            }
            .search {
                @extend %top-search-container;
            }
        }
        .block {
            text-align: right;
            margin-top: 15px;
        }
    }
</style>
<template>
    <article class="table-container">
        <div class="show-sum-count" v-if="signs">
            <panel :content="signs.companyCount" title="签约连锁" bgColor="#00acac" footer="签约连锁总数"></panel>
            <panel :content="signs.departmentSum" title="签约门店" bgColor="#348fe2" :footer="'已录入'+ signs.departmentCount +'家, 录入率为' + signs.departmentRatio"></panel>
            <panel :content="signs.userSum" title="签约店员" bgColor="#727cb6" :footer="'已录入'+signs.userCount+'家, 录入率为'+signs.userRatio"></panel>
        </div>
        <!--导入弹窗-->
        <el-dialog v-model="isImport" title="导入企业签约信息" size="tiny">
            <UploadFile :beforeUpload="beforeUpload" :url='uploadFileUrl' :on-success="uploadImgSucc" btnTitle='上传文件'></UploadFile>
            <div class="upload-tip">
                <h2>注意事项</h2>
                <p>1. 模板中的字段请对照填写，不能为空</p>
                <p>2. 如果有某些内容为空，导入时将跳过</p>
            </div>
            <div class="block">
                <el-button type="primary" @click="isImport = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--详情-->
        <el-dialog class="showDetail" title="连锁详情" v-model="showDetial">
            <div class="info" v-if="currentItems">
                <h2>{{currentItems.name}}</h2>
                <p><i class="title">门店数量：</i><span class="value">{{currentItems.department_number}}</span></p>
                <p><i class="title">签约店员数量：</i><span class="value">{{currentItems.user_number}}</span></p>
                <p><i class="title">对方联系人：</i><span class="value">{{currentItems.concact}}</span></p>
                <p><i class="title">联系方式：</i><span class="value">{{currentItems.mobile}}</span></p>
                <p><i class="title">签约人：</i><span class="value">{{currentItems.user_name}}</span></p>
                <p><i class="title">签约时间：</i><span class="value">{{currentItems.sign_time_str}}</span></p>
                <p><i class="title">录入系统时间：</i><span class="value">{{currentItems.create_time}}</span></p>
            </div>
        </el-dialog>
        <el-card class="box-card">
            <!--<div slot="header" class="clearfix">-->
                <!--<el-button @click="isImport = true"><i class="el-icon-upload2"></i>导入</el-button>-->
            <!--</div>-->
            <section class="search">
                <section>
                    <label>连锁名称</label>
                    <el-input class="name" @change="getData" v-model="search.name"></el-input>
                </section>
                <section>
                    <label>是否录入门店</label>
                    <el-select clearable @change="getData" v-model="search.isdepartment">
                        <el-option label="已录入" :value="1"></el-option>
                        <el-option label="未录入" :value="2"></el-option>
                    </el-select>
                </section>
                <section>
                    <label>是否录入店员</label>
                    <el-select clearable @change="getData" v-model="search.isuser">
                        <el-option label="已录入" :value="1"></el-option>
                        <el-option label="未录入" :value="2"></el-option>
                    </el-select>
                </section>
                <section>
                    <DateRange title="签约时间" :start="search.createTime" :end="search.endTime"
                               v-on:changeStart="val=> search.createTime=val"
                               v-on:changeEnd="val=> search.endTime=val"
                               :change="getData">
                    </DateRange>
                </section>
                <section>
                    <label>签约人</label>
                    <SignatorySelect :change="getData" v-model="search.signatory"></SignatorySelect>
                </section>
            </section>
            <el-table border :data="signData" v-loading="loading">
                <el-table-column
                        prop="name"
                        label="连锁名称">
                </el-table-column>
                <el-table-column
                        prop="department_number"
                        label="签约门店"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="department_count"
                        label="录入门店"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="user_number"
                        label="签约店员"
                        width="200">
                </el-table-column>
                <el-table-column
                        prop="user_count"
                        label="录入店员"
                        width="200">
                </el-table-column>
                <el-table-column prop="operate" label="查看">
                    <template scope="scope">
                        <el-button type="text" size="small" @click="showFn(scope.row)">
                            连锁信息
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[15, 30, 60, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </el-card>
    </article>
</template>
<script>
    import UploadFile from '../component/upload/UploadFiles.vue'
    import panel from '../component/panel/AmountPanel'
    import DateRange from '../component/form/DateRangePicker.vue'
    import companyService from '../../services/companyService'
    import SignatorySelect from '../component/select/Signatory.vue'
    export default {
        components: {
            panel,
            DateRange,
            SignatorySelect,
            UploadFile
        },
        data () {
            return {
                uploadFileUrl: '',
                signs: null,
                currentItems: null, // 当前预览信息
                loading: false,
                search: {
                    name: '',
                    createTime: '',
                    endTime: '',
                    isdepartment: '', // 是否录入门店
                    isuser: '', // 是否录入店员
                    signatory: '' // 签约人
                },
                constructor: [
                    {
                        id: 1,
                        name: '测试营销员'
                    },
                    {
                        id: 2,
                        name: '管理员'
                    },
                ],
                isImport: false,    // 导入弹窗显示状态
                showDetial: false,     // 是否显示详情对话框
                currentPage: 1, // 分页当前显示的页数
                pageSize: 15,
                total: 0,
                signData: []
            }
        },
        created () {
            Promise.all([this.getData(), companyService.getSignMessage()]).then((ret) => {
                this.signs = ret[1]
            }).then(() => {
                xmview.setContentLoading(false)
                this.uploadFileUrl = companyService.importData()
            })
        },
        methods: {
            beforeUpload (file) {
                const isJPG = file.type === 'application/vnd.ms-excel'
                if (!isJPG) {
                    this.$message.error('只允许上传指定的格式: .xlsx;.xls')
                    return false
                }
            },
            showFn (item) {
                companyService.getSignDetail(item.id).then((ret) => {
                    this.currentItems = ret.data
                }).then(() => {
                    this.showDetial = true
                })
            },
            handleSizeChange (val) {
                this.pageSize = val
                this.getData()
            },
            handleCurrentChange (val) {
                this.currentPage = val
                this.getData()
            },
            getData () {
                this.loading = true
                return companyService.getCompanySignList({
                    page: this.currentPage,
                    page_size: this.pageSize,
                    keyword: this.search.name,
                    isdepartment: this.search.isdepartment,
                    isuser: this.search.isuser,
                    signatory: this.search.signatory,
                    time_start: this.search.createTime,
                    time_end: this.search.endTime,
                }).then((ret) => {
                    this.signData = ret.data
                    this.total = ret.total
                }).then(() => {
                    this.loading = false
                })
            },
            // 图片上传完毕之后的逻辑
            uploadImgSucc (res) {
                xmview.showTip('success', '上传成功')
            }
        }
    }
</script>
