<!--添加课程-->
<!--公开课管理-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";

    #course-manage-addcourse-container {
        @extend %content-container;

        h2 {
            margin-bottom: 10px;
        }

        .el-tab-pane {
            max-width: 700px;
        }

        // 考试题目设置
        .testing-set {
            .el-form {
                padding-top: 17px;
                &:first-of-type {
                    padding-top: 0;
                }

                hr {
                    position: absolute;
                    width: 100%;
                    border-top: none;
                    border-color: #bbb;
                }
                h5 {
                    font-size: 14px;
                    color: #666;
                }
                .el-input {
                    display: inline-block;
                    width: 60%;
                    vertical-align: middle;
                }

                .multy-choose-item {
                    margin: 5px 0;
                    &:last-of-type {
                        margin-bottom: 0;
                    }
                }
            }

            .bottom-btns{
                .submit{
                    float: right;

                }
            }
        }
    }
</style>

<template>
    <article id="course-manage-addcourse-container">
        <el-tabs v-model="activeTab">
            <el-tab-pane label="课程信息" name="first">
                <el-form label-width="120px">
                    <el-form-item label="所属栏目">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="课程名称">
                        <el-input></el-input>
                    </el-form-item>
                    <el-form-item label="课程封面图">
                        <UploadImg></UploadImg>
                    </el-form-item>
                    <el-form-item label="课程类型">
                        <el-select v-model="fetchParam.courseType" placeholder="请选择" :clearable="true">
                            <el-option label="视频" value="1"></el-option>
                            <el-option label="WORD" value="2"></el-option>
                            <el-option label="PPT" value="3"></el-option>
                            <el-option label="PDF" value="4"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属专辑">
                        <el-select v-model="fetchParam.courseType" placeholder="请选择" :clearable="true">
                            <el-option label="视频" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="课程介绍">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容">
                        </el-input>
                    </el-form-item>

                    <h2>课后考试设置</h2>
                    <el-form-item label="课后考试">
                        <el-radio class="radio" label="1">需要</el-radio>
                        <el-radio class="radio" label="2">不需要</el-radio>
                    </el-form-item>
                    <el-form-item label="考试时间">
                        <el-input placeholder="以分钟为单位"></el-input>
                    </el-form-item>
                    <el-form-item label="及格分数">
                        <el-input></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button type="primary" @click="btnNextClick">下一步</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="考试题目设置" name="second" class="testing-set">
                <el-form label-width="120px">
                    <el-form-item label="">
                        <el-button icon="plus">判断题</el-button>
                        <el-button icon="plus">单选题</el-button>
                        <el-button icon="plus">多选题</el-button>
                    </el-form-item>
                    <el-form-item label="分数">
                        <el-input placeholder="为该题设置分数"></el-input>
                    </el-form-item>
                    <el-form-item label="题目">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="配图">
                        <UploadImg></UploadImg>
                    </el-form-item>

                    <el-form-item label="选项">
                        <el-radio class="radio" label="1">正确</el-radio>
                        <el-radio class="radio" label="2">错误</el-radio>
                    </el-form-item>

                    <el-form-item label="选项">
                        <h5>请在正确答案前面打勾</h5>
                        <div class="multy-choose-item">
                            <el-checkbox></el-checkbox>
                            <el-input placeholder="填写描述"></el-input>
                            <el-button type="text">删除</el-button>
                        </div>
                        <div class="multy-choose-item">
                            <el-checkbox></el-checkbox>
                            <el-input placeholder="填写描述"></el-input>
                            <el-button type="text">删除</el-button>
                        </div>
                        <div class="multy-choose-item">
                            <el-button type="text">添加更多选项</el-button>
                        </div>
                    </el-form-item>

                    <el-form-item label="答案详解">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容">
                        </el-input>
                    </el-form-item>

                    <hr>
                </el-form>

                <el-form label-width="120px">
                    <el-form-item label="">
                        <el-button icon="plus">判断题</el-button>
                        <el-button icon="plus">单选题</el-button>
                        <el-button icon="plus">多选题</el-button>
                    </el-form-item>
                    <el-form-item label="分数">
                        <el-input placeholder="为该题设置分数"></el-input>
                    </el-form-item>
                    <el-form-item label="题目">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="配图">
                        <UploadImg></UploadImg>
                    </el-form-item>

                    <el-form-item label="选项">
                        <el-radio class="radio" label="1">正确</el-radio>
                        <el-radio class="radio" label="2">错误</el-radio>
                    </el-form-item>

                    <el-form-item label="选项">
                        <h5>请在正确答案前面打勾</h5>
                        <div class="multy-choose-item">
                            <el-checkbox></el-checkbox>
                            <el-input placeholder="填写描述"></el-input>
                            <el-button type="text">删除</el-button>
                        </div>
                        <div class="multy-choose-item">
                            <el-checkbox></el-checkbox>
                            <el-input placeholder="填写描述"></el-input>
                            <el-button type="text">删除</el-button>
                        </div>
                        <div class="multy-choose-item">
                            <el-button type="text">添加更多选项</el-button>
                        </div>
                    </el-form-item>

                    <el-form-item label="答案详解">
                        <el-input
                                type="textarea"
                                :autosize="{ minRows: 2, maxRows: 4}"
                                placeholder="请输入内容">
                        </el-input>
                    </el-form-item>
                </el-form>

                <el-form label-width="120px">
                    <el-form-item label="">
                        <el-button icon="plus">判断题</el-button>
                        <el-button icon="plus">单选题</el-button>
                        <el-button icon="plus">多选题</el-button>
                    </el-form-item>
                </el-form>

                <div class="bottom-btns">
                    <el-button @click="btnPreClick">上一步</el-button>
                    <el-button class="submit" type="primary">发布</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>

    </article>
</template>

<script>
    import UploadImg from '../../component/upload/UploadImg.vue'
    export default{
        data () {
            return {
                activeTab: 'first',
                fetchParam: {
                    courseType: void 0,
                }
            }
        },
        activated () {
            xmview.setContentLoading(false)
        },
        methods: {
            // 下一步按钮点击
            btnNextClick () {
                this.activeTab = 'second'
            },
            btnPreClick () {
                this.activeTab = 'first'
            }
        },
        components: {UploadImg}
    }
</script>
