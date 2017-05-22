<!--转盘设置-->
<style lang="scss" rel="stylesheet/scss">
    .activity-turntable-container {
        .el-select {
            width: 45% !important;
        }
        .el-card {
            .el-form-item {
                .tip {
                    > i {
                        color: #ff4949;
                        margin-right: 10px;
                    }
                    font-size: 12px;
                    color: #999;
                }
            }
            .el-card__header {
                padding: 15px;
                background: #f0f3f5;
            }
            .el-button {
                display: block;
                margin: 0 auto;
            }
        }
        /*上传图片部分*/
        @at-root {
            .uploadimg {
                > div {
                    display: inline-block;
                }

                .img-container {
                    width: 200px;
                    height: 264px;
                    border: solid 1px #ccd0d4;
                    background: #f8f8f8;

                    &:before {
                        content: "图片";
                        font-size: 14px;
                        height: 264px;
                        line-height: 264px;
                        display: block;
                        text-align: center;
                        color: #999;
                    }

                    img {
                        height: 100%;
                        z-index: 9;
                        position: absolute;
                        width: 198px;
                        top: 0;
                        left: 1px;
                    }
                }

                .img-desc {
                    vertical-align: middle;
                    color: #bbb;
                    margin-left: 12px;
                    > span {
                        font-size: 13px;
                        line-height: 1.4em;
                        display: block;
                        margin-top: 10px;
                    }

                    a {
                        font-size: 13px;
                        color: #337ab7;
                        text-decoration: none;
                        &:hover {
                            text-decoration: underline;
                        }
                    }
                }
            }
        }
    }
</style>
<template>
    <article class="activity-turntable-container">
        <el-card class="box-card">
            <div class="clearfix" slot="header">活动规则</div>
            <el-form :model="form" :rules="rules" ref="form" label-width="100px">
                <el-form-item label="活动标题" prop="title">
                    <el-input v-model="form.title" placeholder="活动标题"></el-input>
                </el-form-item>
                <el-form-item label="限制次数" prop="times">
                    <el-input type="number" placeholder="用户每天最多可参与的次数" v-model="form.percent">
                        <template slot="append">次/每天</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="上传图片" prop="url">
                    <section class="uploadimg">
                        <div class="img-container">
                            <img :src="form.url | fillImgPath" v-show="form.url">
                        </div>
                        <div class="img-desc">
                            <ImagEcropperInput :aspectRatio="1280/1706" :confirmFn="cropperFn"></ImagEcropperInput>
                            <span>图片用于手机客户端转盘页面的背景图更换</span>
                        </div>
                    </section>
                </el-form-item>
                <el-form-item label="奖项配置">
                    <p class="tip"><i>*</i>此活动必须配置8个奖品，其中至少有一个谢谢参与</p>
                    <el-table
                            border
                            :data="awardlist">
                        <el-table-column
                                prop="company"
                                label="排序">
                        </el-table-column>
                        <el-table-column
                                prop="balance"
                                label="图片"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="total"
                                label="奖品">
                        </el-table-column>
                        <el-table-column
                                prop="total"
                                label="中奖概率">
                        </el-table-column>
                        <el-table-column
                                prop="total"
                                label="库存量">
                        </el-table-column>
                        <el-table-column
                                prop="operate"
                                label="操作">
                            <template scope="scope">
                                <el-button type="text" @click="editFn(scope.row)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="抽奖规则" prop="rule">
                    <p class="tip">转盘页面底部的抽奖说明</p>
                    <el-input
                            type="textarea"
                            :rows="5"
                            v-model="form.rule">
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" @click="submit('form')">保存生效</el-button>
        </el-card>
        <!--奖品设置-->
        <el-dialog v-model="addForm" title="奖品设置" size="tiny">
            <el-form :model="form1" :rules="rules1" ref="form1" label-width="100px">
                <el-form-item label="奖品类型" prop="id">
                    <!--如果type_id有值就显示select框-->
                    <el-select v-model="form1.type_id">
                        <el-option label="道具卡" :value="1"></el-option>
                        <el-option label="外部卡券" :value="2"></el-option>
                        <el-option label="实物奖品" :value="3"></el-option>
                        <el-option label="谢谢参与" :value="4"></el-option>
                    </el-select>
                    <!--如果id有值就显示select框-->
                    <el-select v-model="form1.id">
                        <el-option label="太阳伞" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="库存量">
                    100
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="form1.sort"></el-input>
                </el-form-item>
                <el-form-item label="中奖概率" prop="percent">
                    <el-input type="number" v-model="form1.percent">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addForm=false">取消</el-button>
                <el-button type="primary" @click="awardSet('form1')">保存</el-button>
            </div>
        </el-dialog>
    </article>
</template>
<script>
    import ImagEcropperInput from '../../component/upload/ImagEcropperInput.vue'
    export default {
        components: {
            ImagEcropperInput
        },
        data () {
            return {
                addForm: false,
                awardlist: [
                    {
                        sort: 1,
                        img: '',
                        award: '',
                        percent: '',
                        sum: ''
                    }
                ],
                form: {
                    title: '',
                    times: '',
                    url: '',
                    rule: ''
                },
                form1: {
                    type_id: '',
                    id: '',
                    sort: '',
                    percent: ''
                },
                rules: {
                    title: {required: true, message: '必填项', trigger: 'blur'},
                    times: {required: true, message: '必填项', trigger: 'blur'},
                    rule: {required: true, message: '必填项', trigger: 'blur'},
                    url: {required: true, message: '必填项'}
                },
                rules1: {
                    id: {required: true, message: '必填项'},
                    percent: {required: true, message: '必填项'}
                },
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            editFn (row) {
                this.addForm = true
                this.form1 = {
                    type_id: '',
                    id: '',
                    sort: '',
                    percent: ''
                }
                this.$nextTick(() => {
                    this.$refs['form1'].resetFields()
                })
            },
            awardSet (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(valid)
                    } else {
                        return false
                    }
                })
            },
            submit (form) {
                this.$refs[form].validate((valid) => {
                    if (valid) {
                        console.log(valid)
                    } else {
                        return false
                    }
                })
            },
            cropperFn(data) {
                console.log(data)
                this.form.url = data
//                this.uploadingImg = true
//                // 上传图片
//                mobileService.uploadboot({company_id: this.user.company_id, image: data}).then(ret => {
//                    this.form.url = ret.data.url
//                }).then(() => {
//                    xmview.showTip('success', '上传成功')
//                    this.uploadingImg = false
//                }).catch((ret) => {
//                    xmview.showTip('error', ret.message)
//                    this.uploadingImg = false
//                })
            },
        }
    }
</script>
