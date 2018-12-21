<!--答案分析-->
<style lang='scss' rel='stylesheet/scss'>
    @import "../../../utils/mixins/common";

    #course-manage-answer-analysis {
        @extend %content-container;
        .header {
            text-align: left;
            font-size: 25px;
        }
        .subject-container {
            .subject-list {
                margin-top: 10px;
                padding-bottom: 50px;
                border-bottom: 1px solid #f3f3f3;
                .subject-title {
                    .el-tag {
                        margin-right: 15px;
                    }
                    font-size: 16px;
                    color: #333
                }
                .subject-item {
                    margin-top: 10px;
                    line-height: 35px;
                    h2 {
                        font-size: 14px;
                        border-bottom: 2px solid #ededed;
                        font-weight:bold;
                    }
                    p {
                        border-bottom: 1px solid #ededed;
                        &.correct {
                            color: #58B7FF;
                        }
                    }
                    h2, p {
                        > * {
                            display: inline-block;
                        }
                        > i {
                            text-align: center;
                            width: 10%;
                        }
                        > span {
                            width: 70%;
                        }
                        > em {
                            width: 15%;
                        }
                    }
                }
            }
        }
    }
</style>

<template>
    <article id="course-manage-answer-analysis">
        <div class="header">{{courseName}}</div>
        <article class="subject-container">
            <section class="subject-list" v-for="(subject,pIndex) in resultData">
                <h1 class="subject-title"><el-tag type="success">{{category[subject.category]}}</el-tag>{{subject.description}}</h1>
                <div class="subject-item">
                    <h2><i>#</i><span>选项</span><em>比例</em></h2>
                    <p :class="{'correct': item.correct}" v-for="(item, index) in subject.answers">
                        <i>{{index + 1}}</i>
                        <span>{{item.description}}</span>
                        <em>{{item.percent}}%</em>
                    </p>
                </div>
            </section>
        </article>
    </article>
</template>

<script>
    import courseService from '../../../services/courseService'
    export default{
        data () {
            return {
                category: ['判断', '单选', '多选'],
                resultData: [],
                courseName: ''
            }
        },
        computed: {
            courseID () {
                return this.$route.params.id
            }
        },
        activated () {
            this.resultData = []
            courseService.getCourseSubject({id: this.courseID}).then((ret) => {
                this.courseName = ret.course.name
                ret.subjects.forEach((item) => {
                    courseService.getSubjectAnswer({c_id: this.courseID, s_id: item.id}).then((ret) => {
                        item.answers = []
                        ret.answers.map((val) => {
                            let el = val.subject_option_count / ret.subject_count * 100
                            val.percent = isNaN(el) ? 0 : el.toFixed(2)
                            item.answers.push(val)
                        })
                        this.resultData.push(item)
                    })
                })
            }).then(() => {
                xmview.setContentLoading(false)
            })
        }
    }
</script>
