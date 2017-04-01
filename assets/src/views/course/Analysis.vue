<!--课程分析-->
<style lang='scss' rel='stylesheet/scss'>
    #course-analysis-container {
        padding: 15px;

        .yestoday-container {
            .yestoday-container-item {
                display: inline-block;
                font-size: 13px;
                > * {
                    display: block;
                }
                h5 {
                    color: #666;
                }

                em {
                    font-size: 22px;
                    color: #333;
                }

                i {
                    color: #bbb;
                    font-size: 12px;

                    span {
                        // 增加
                        &.el-icon-caret-top {
                            color: #13ce66;
                        }
                        // 减少
                        &.el-icon-caret-bottom {
                            color: #fa8072;
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <article id="course-analysis-container">
        <el-card class="yestoday-container">
            <section class="yestoday-container-item">
                <h5>考试次数</h5>
                <em>{{analysis.total}}</em>
                <i>
                    <span class="el-icon-caret-top">{{analysis.percent}}</span>
                    同比上周
                </i>
            </section>

            <section class="yestoday-container-item">
                <h5>考试人数</h5>
                <em>{{analysis.totalUnique}}</em>
                <i>
                    <span class="el-icon-caret-bottom">{{analysis.percentUnique}}</span>
                    同比上周
                </i>
            </section>
            <section class="yestoday-container-item">
                <h5>及格人数</h5>
                <em>{{analysis.passed}}</em>
                <i>
                    <span class="el-icon-caret-top">10%</span>
                    同比上周
                </i>
            </section>
            <section class="yestoday-container-item">
                <h5>公开课考试次数</h5>
                <em>123456</em>
                <i>
                    <span class="el-icon-caret-top">10%</span>
                    同比上周
                </i>
            </section>
            <section class="yestoday-container-item">
                <h5>私有课考试次数</h5>
                <em>123456</em>
                <i>
                    <span class="el-icon-caret-top">10%</span>
                    同比上周
                </i>
            </section>
            <section class="yestoday-container-item">
                <h5>工业课考试次数</h5>
                <em>123456</em>
                <i>
                    <span class="el-icon-caret-top">10%</span>
                    同比上周
                </i>
            </section>
        </el-card>
    </article>
</template>

<script>
    import testingService from '../../services/testingService'
    export default{
        data () {
            return {
                analysis: {}
            }
        },
        created () {
            testingService.getAmount().then((ret) => {
                this.analysis = ret
            })
        }
    }

</script>
